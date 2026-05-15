"""
RAG Engine — Gadget Solution AI Consultant.

Triple-source retrieval architecture:
  1. Product Embeddings (pgvector) — product catalog from NestJS database
  2. Document Chunks (pgvector) — store policies, FAQ, guides, glossary
  3. Internet Search (DuckDuckGo) — real-time specs, reviews, comparisons

The system prompt is loaded from SYSTEM_PROMPT_GADGET_ADVISOR.md.
Context is formatted using [CONTEXT]...[/CONTEXT] and [USER QUERY] tags.
"""

import os
import logging
from typing import List, Dict, Tuple
from functools import lru_cache

from langchain_core.documents import Document
from langchain_core.messages import SystemMessage, HumanMessage

from app.database import SessionLocal
from app.models import ProductEmbedding, DocumentChunk
from app.services.vectorizer import embed_text
from app.services.llm_client import get_llm
from app.services.internet_search_agent import search_and_extract

logger = logging.getLogger(__name__)

# Path to the system prompt file
SYSTEM_PROMPT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "docs",
    "SYSTEM_PROMPT_GADGET_ADVISOR.md"
)


# ─────────────────────────────────────────────
# System Prompt Loader
# ─────────────────────────────────────────────

@lru_cache()
def load_system_prompt() -> str:
    """Load the Gadget Advisor system prompt from the markdown file.
    Strips metadata comments and developer notes (Section 8),
    keeping only operational instruction content for the LLM."""
    try:
        with open(SYSTEM_PROMPT_PATH, "r", encoding="utf-8") as f:
            content = f.read()

        lines = content.split("\n")
        clean_lines = []
        skip_dev_notes = False

        for line in lines:
            # Skip metadata comments at top of file
            if line.strip().startswith("*This file is"):
                continue
            if line.strip().startswith("*Do NOT embed"):
                continue

            # Skip SECTION 8 (Developer Notes) — not for the LLM
            if "SECTION 8" in line and "DEVELOPER NOTES" in line.upper():
                skip_dev_notes = True
            if skip_dev_notes:
                continue

            clean_lines.append(line)

        prompt = "\n".join(clean_lines).strip()
        logger.info(f"System prompt loaded ({len(prompt)} chars)")
        return prompt

    except FileNotFoundError:
        logger.error(f"System prompt file not found: {SYSTEM_PROMPT_PATH}")
        return (
            "You are Gadget Advisor, the official shopping assistant for Gadget Solution store. "
            "Always respond in Bahasa Indonesia. Only assist with product information and store policies."
        )


# ─────────────────────────────────────────────
# Source 1: Product Embeddings (pgvector)
# ─────────────────────────────────────────────

async def retrieve_product_context(query: str, k: int = 5) -> List[Document]:
    """Retrieve relevant products from product_embeddings via pgvector cosine distance."""
    query_embedding = await embed_text(query)

    db = SessionLocal()
    try:
        results = db.query(ProductEmbedding).order_by(
            ProductEmbedding.embedding.cosine_distance(query_embedding)
        ).limit(k).all()

        return [
            Document(
                page_content=(
                    f"Product: {r.product_name}\n"
                    f"Description: {r.product_description}\n"
                    f"Specifications: {r.tech_specs_summary}"
                ),
                metadata={"product_id": r.product_id, "name": r.product_name, "type": "product"}
            )
            for r in results
        ]
    finally:
        db.close()


# ─────────────────────────────────────────────
# Source 2: Document Chunks (pgvector)
# ─────────────────────────────────────────────

async def retrieve_document_context(query: str, k: int = 5) -> List[Document]:
    """Retrieve relevant knowledge chunks from document_chunks via pgvector cosine distance."""
    query_embedding = await embed_text(query)

    db = SessionLocal()
    try:
        results = db.query(DocumentChunk).order_by(
            DocumentChunk.embedding.cosine_distance(query_embedding)
        ).limit(k).all()

        return [
            Document(
                page_content=r.chunk_content,
                metadata={
                    "chunk_id": r.chunk_id,
                    "doc_type": r.doc_type,
                    "title": r.chunk_title,
                    "type": "knowledge"
                }
            )
            for r in results
        ]
    finally:
        db.close()


# ─────────────────────────────────────────────
# Source 3: Internet Search (DuckDuckGo)
# ─────────────────────────────────────────────

def detect_product_names(product_docs: List[Document]) -> List[str]:
    """Extract product names from retrieved product documents for search query building."""
    names = []
    for doc in product_docs:
        name = doc.metadata.get("name")
        if name:
            names.append(name)
    return names


def is_product_query(user_query: str, product_docs: List[Document]) -> bool:
    """Heuristic to determine if a query would benefit from internet search.
    
    Returns True for queries about:
    - Product specifications, reviews, comparisons
    - Specific product recommendations
    - Technical details not likely in local knowledge base
    
    Returns False for:
    - Store policy questions (shipping, returns, warranty)
    - Generic greetings or off-topic queries
    """
    query_lower = user_query.lower()

    # Keywords that indicate store policy / non-product queries
    policy_keywords = [
        "kebijakan", "retur", "garansi", "pengiriman", "kirim",
        "bayar", "pembayaran", "cicilan", "installment", "warranty",
        "return", "shipping", "policy", "halo", "hai", "terima kasih",
    ]
    for kw in policy_keywords:
        if kw in query_lower:
            return False

    # Keywords that strongly indicate product/spec queries
    product_keywords = [
        "spesifikasi", "spek", "spec", "benchmark", "review",
        "perbandingan", "banding", "vs", "versus", "compare",
        "rekomendasi", "recommend", "laptop", "phone", "hp",
        "mouse", "keyboard", "headset", "monitor", "gpu", "cpu",
        "processor", "gaming", "ram", "vram", "ssd", "kamera",
        "baterai", "battery", "layar", "display", "harga", "budget",
        "beli", "cari", "butuh", "cocok", "bagus", "terbaik", "best",
    ]
    for kw in product_keywords:
        if kw in query_lower:
            return True

    # If we retrieved products from the database, it's likely product-related
    if product_docs and len(product_docs) > 0:
        return True

    return False


# ─────────────────────────────────────────────
# Context Builder
# ─────────────────────────────────────────────

def build_context_block(
    product_docs: List[Document],
    knowledge_docs: List[Document],
    internet_content: str = ""
) -> str:
    """Build the [CONTEXT] block combining all three retrieval sources.
    
    Structure:
    - Store Knowledge (policies, FAQ, guides)
    - Product Catalog (from database)
    - Internet Research (specs, reviews from the web)
    """
    parts = []

    # Knowledge documents (policies, FAQ, guides, warnings, etc.)
    if knowledge_docs:
        parts.append("=== Pengetahuan Toko (Kebijakan, FAQ, Panduan) ===")
        for doc in knowledge_docs:
            title = doc.metadata.get("title", "")
            parts.append(f"\n--- {title} ---\n{doc.page_content}")

    # Product catalog context from database
    if product_docs:
        parts.append("\n\n=== Katalog Produk Toko ===")
        for doc in product_docs:
            name = doc.metadata.get("name", "")
            parts.append(f"\n--- {name} ---\n{doc.page_content}")

    # Internet search results (specs, reviews, comparisons)
    if internet_content:
        parts.append("\n\n=== Informasi Tambahan dari Internet (Spesifikasi & Review) ===")
        parts.append(internet_content)

    if not parts:
        return "Tidak ada konteks relevan yang ditemukan di knowledge base."

    return "\n".join(parts)


# ─────────────────────────────────────────────
# Main RAG Pipeline
# ─────────────────────────────────────────────

async def answer_consultant_query(user_query: str) -> Tuple[str, List[Dict[str, str]]]:
    """
    Main RAG workflow with triple-source retrieval:
    
    1. Retrieve from product_embeddings (pgvector) — always
    2. Retrieve from document_chunks (pgvector) — always  
    3. Search internet via DuckDuckGo — only for product-related queries
    4. Combine all sources into [CONTEXT] block
    5. Send system prompt + context + user query to LLM
    6. Return response with product source citations
    """

    # Step 1 & 2: Retrieve from both pgvector stores
    product_docs = await retrieve_product_context(user_query, k=3)
    knowledge_docs = await retrieve_document_context(user_query, k=5)

    # Collect product sources for the response
    sources = []
    seen_ids = set()
    for doc in product_docs:
        p_id = doc.metadata.get("product_id")
        p_name = doc.metadata.get("name")
        if p_id and p_id not in seen_ids:
            seen_ids.add(p_id)
            sources.append({"product_id": p_id, "name": p_name})

    # Step 3: Internet search (only for product-related queries)
    internet_content = ""
    if is_product_query(user_query, product_docs):
        try:
            product_names = detect_product_names(product_docs)
            internet_content = await search_and_extract(
                user_query=user_query,
                product_names=product_names,
                max_search_results=5,
                max_pages_to_fetch=2,
                max_chars_per_page=3000,
            )
        except Exception as e:
            logger.warning(f"Internet search failed (non-fatal): {e}")
            internet_content = ""

    # Step 4: Build context block
    context_block = build_context_block(product_docs, knowledge_docs, internet_content)

    # Step 5: Format user message per system prompt specification
    user_message = (
        f"[CONTEXT]\n"
        f"{context_block}\n"
        f"[/CONTEXT]\n\n"
        f"[USER QUERY]\n"
        f"{user_query}"
    )

    # Load system prompt from file and invoke LLM
    system_prompt = load_system_prompt()
    llm = get_llm()

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_message)
    ]

    ai_msg = await llm.ainvoke(messages)
    return ai_msg.content, sources
