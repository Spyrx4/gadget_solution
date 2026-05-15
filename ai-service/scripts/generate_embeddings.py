import asyncio
import httpx
import re
import logging
import sys
import os
import glob
import hashlib

# Add parent directory to Python path so app modules can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, init_db
from app.models import ProductEmbedding, DocumentChunk
from app.services.vectorizer import embed_text
from config import get_settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

# Path to RAG documents directory
RAG_DOCS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs")


# ─────────────────────────────────────────────
# PART 1: Product Embeddings (from NestJS API)
# ─────────────────────────────────────────────

def summarize_specs(tech_specs: dict) -> str:
    """Create a readable plain-text summary of JSON tech specs."""
    if not tech_specs:
        return "No specific technical specifications listed."
    parts = []
    for k, v in tech_specs.items():
        parts.append(f"{k.capitalize()}: {v}")
    return "; ".join(parts)


async def generate_product_embeddings():
    """Fetch products from the NestJS REST API and generate pgvector embeddings."""
    logger.info(f"Fetching products from backend API: {settings.BACKEND_URL}/api/products?limit=100")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{settings.BACKEND_URL}/api/products?limit=100", timeout=30.0)
            response.raise_for_status()
            payload = response.json()
            products = payload.get("data", [])
        except Exception as e:
            logger.error(f"Failed to fetch products from backend REST API: {str(e)}")
            return

    if not products:
        logger.warning("No products found returned from backend API catalog.")
        return

    logger.info(f"Fetched {len(products)} products. Generating product embeddings...")

    db = SessionLocal()
    try:
        for p in products:
            p_id = p.get("id")
            p_name = p.get("name")
            p_desc = p.get("description", "")
            p_specs = p.get("techSpecs", {})

            existing = db.query(ProductEmbedding).filter(ProductEmbedding.product_id == p_id).first()
            if existing:
                logger.info(f"  [skip] Product [{p_name}] already embedded.")
                continue

            specs_summary = summarize_specs(p_specs)
            document_text = f"Product: {p_name}. Category: {p.get('category', '')}. Description: {p_desc}. Specifications: {specs_summary}."

            logger.info(f"  [embed] {p_name}...")
            try:
                embedding_vector = await embed_text(document_text)
            except Exception as emb_err:
                logger.error(f"  [error] Embedding failed for [{p_name}]: {str(emb_err)}")
                continue

            record = ProductEmbedding(
                id=f"emb_{p_id}",
                product_id=p_id,
                product_name=p_name,
                product_description=p_desc,
                embedding=embedding_vector,
                tech_specs_summary=specs_summary
            )
            db.add(record)

        db.commit()
        logger.info("✅ Product embeddings complete.")
    except Exception as db_err:
        logger.error(f"Database error (products): {str(db_err)}")
        db.rollback()
    finally:
        db.close()


# ─────────────────────────────────────────────
# PART 2: Document Chunk Embeddings (RAG docs)
# ─────────────────────────────────────────────

def parse_frontmatter(content: str) -> tuple[dict, str]:
    """Extract YAML-like frontmatter and return (metadata_dict, body_text)."""
    fm_match = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
    if not fm_match:
        return {}, content

    fm_text = fm_match.group(1)
    body = content[fm_match.end():]

    metadata = {}
    for line in fm_text.strip().split("\n"):
        if ":" in line:
            key, val = line.split(":", 1)
            metadata[key.strip()] = val.strip()

    return metadata, body


def chunk_by_sections(body: str) -> list[dict]:
    """Split markdown body into chunks by ## headings. Each chunk gets an ID from [SECTION-ID] if present."""
    chunks = []
    # Split on ## headings (keep the heading with its content)
    sections = re.split(r"\n(?=## )", body.strip())

    for section in sections:
        section = section.strip()
        if not section or len(section) < 30:
            continue

        # Extract heading
        heading_match = re.match(r"^##\s+(.+)", section)
        heading = heading_match.group(1).strip() if heading_match else "Untitled Section"

        # Try to extract section ID like [POLICY-001], [FAQ-002], etc.
        id_match = re.search(r"\[([A-Z]+-\d+)\]", heading)
        section_id = id_match.group(1) if id_match else None

        chunks.append({
            "heading": heading,
            "section_id": section_id,
            "content": section
        })

    return chunks


async def generate_document_embeddings():
    """Read all rag_*.md files, chunk by section, and embed into pgvector."""
    rag_files = sorted(glob.glob(os.path.join(RAG_DOCS_DIR, "rag_*.md")))

    if not rag_files:
        logger.warning(f"No rag_*.md files found in {RAG_DOCS_DIR}")
        return

    logger.info(f"Found {len(rag_files)} RAG documents to process.")

    db = SessionLocal()
    total_chunks = 0

    try:
        for filepath in rag_files:
            filename = os.path.basename(filepath)
            logger.info(f"\n📄 Processing: {filename}")

            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()

            metadata, body = parse_frontmatter(content)
            doc_type = metadata.get("doc_type", filename.replace("rag_", "").replace(".md", ""))
            tags = metadata.get("tags", "")

            chunks = chunk_by_sections(body)
            logger.info(f"   Chunked into {len(chunks)} sections.")

            for idx, chunk in enumerate(chunks):
                # Build a stable unique ID
                section_id = chunk["section_id"] or f"SEC-{idx:03d}"
                chunk_unique_id = f"{doc_type}_{section_id}"
                record_id = hashlib.md5(chunk_unique_id.encode()).hexdigest()[:16]

                # Skip if already embedded
                existing = db.query(DocumentChunk).filter(
                    DocumentChunk.chunk_id == chunk_unique_id
                ).first()
                if existing:
                    logger.info(f"   [skip] {chunk_unique_id} already embedded.")
                    continue

                logger.info(f"   [embed] {chunk_unique_id}: {chunk['heading'][:60]}...")
                try:
                    embedding_vector = await embed_text(chunk["content"])
                except Exception as emb_err:
                    logger.error(f"   [error] Embedding failed for {chunk_unique_id}: {str(emb_err)}")
                    continue

                record = DocumentChunk(
                    id=record_id,
                    doc_source=filename,
                    doc_type=doc_type,
                    chunk_id=chunk_unique_id,
                    chunk_title=chunk["heading"],
                    chunk_content=chunk["content"],
                    tags=tags,
                    embedding=embedding_vector,
                )
                db.add(record)
                total_chunks += 1

        db.commit()
        logger.info(f"\n✅ Document embeddings complete. {total_chunks} new chunks stored.")
    except Exception as db_err:
        logger.error(f"Database error (documents): {str(db_err)}")
        db.rollback()
    finally:
        db.close()


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────

async def main():
    logger.info("=" * 60)
    logger.info("🚀 Gadget Solution — Embedding Generation Pipeline")
    logger.info("=" * 60)

    logger.info("\nInitializing database tables/extensions...")
    init_db()

    logger.info("\n--- PHASE 1: Product Embeddings ---")
    await generate_product_embeddings()

    logger.info("\n--- PHASE 2: RAG Document Embeddings ---")
    await generate_document_embeddings()

    logger.info("\n" + "=" * 60)
    logger.info("🎉 All embeddings generated successfully!")
    logger.info("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
