"""
Internet Search Service for Gadget Solution AI — Async Edition.

Uses DuckDuckGo (free, no API key needed) for web search and
Trafilatura for clean text extraction from web pages.

Designed to enrich the RAG pipeline with real-world product specifications,
reviews, and comparisons that may not exist in the local knowledge base.
"""

import asyncio
import logging
from typing import List, Dict, Optional
from concurrent.futures import ThreadPoolExecutor

from ddgs import DDGS
import trafilatura
import httpx

logger = logging.getLogger(__name__)

# Thread pool for running sync DuckDuckGo calls in async context
_executor = ThreadPoolExecutor(max_workers=3)

# Trusted gadget review sites to prioritize in search results
TRUSTED_DOMAINS = [
    "gsmarena.com", "notebookcheck.net", "rtings.com",
    "techpowerup.com", "tomshardware.com", "anandtech.com",
    "tokopedia.com", "shopee.co.id", "jagatreview.com",
    "pricebook.co.id", "gadgetren.com", "gizmologi.id",
]


def _sync_web_search(query: str, max_results: int = 5) -> List[Dict]:
    """Synchronous DuckDuckGo search (will be run in thread pool)."""
    results = []
    try:
        with DDGS() as ddgs:
            for r in ddgs.text(query, max_results=max_results):
                results.append({
                    "title": r.get("title", ""),
                    "url": r.get("href", ""),
                    "snippet": r.get("body", ""),
                })
    except Exception as e:
        logger.warning(f"DuckDuckGo search failed: {e}")
    return results


def _sync_fetch_page(url: str, max_chars: int = 5000) -> Optional[str]:
    """Synchronous page fetch + content extraction (will be run in thread pool)."""
    try:
        resp = httpx.Client(timeout=10.0, follow_redirects=True).get(
            url,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        )
        resp.raise_for_status()

        text = trafilatura.extract(
            resp.text,
            include_comments=False,
            include_tables=True,   # Tables often contain spec sheets
            include_links=False,
            favor_recall=True,     # Extract more content for completeness
        )

        if not text or len(text.strip()) < 50:
            return None

        return text.strip()[:max_chars]

    except Exception as e:
        logger.debug(f"Failed to fetch {url}: {e}")
        return None


async def web_search(query: str, max_results: int = 5) -> List[Dict]:
    """Async wrapper for DuckDuckGo web search."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(_executor, _sync_web_search, query, max_results)


async def fetch_page_content(url: str, max_chars: int = 5000) -> Optional[str]:
    """Async wrapper for page content extraction."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(_executor, _sync_fetch_page, url, max_chars)


def build_product_search_query(user_query: str, product_names: List[str]) -> str:
    """Build an optimized search query targeting gadget specifications.
    
    Combines the user's intent with detected product names to create
    a query that returns spec sheets, reviews, and comparisons.
    """
    if product_names:
        # Focus search on the most relevant product
        primary_product = product_names[0]
        return f"{primary_product} spesifikasi lengkap review harga Indonesia 2025"
    
    # Generic gadget search based on user intent
    return f"{user_query} spesifikasi review rekomendasi gadget 2025"


def rank_search_results(results: List[Dict]) -> List[Dict]:
    """Rank search results by relevance, prioritizing trusted domains."""
    def score(result: Dict) -> int:
        url = result.get("url", "").lower()
        s = 0
        for domain in TRUSTED_DOMAINS:
            if domain in url:
                s += 10
                break
        # Penalize very short snippets
        snippet = result.get("snippet", "")
        if len(snippet) > 100:
            s += 3
        return s

    return sorted(results, key=score, reverse=True)


async def search_and_extract(
    user_query: str,
    product_names: List[str] = None,
    max_search_results: int = 5,
    max_pages_to_fetch: int = 2,
    max_chars_per_page: int = 3000,
) -> str:
    """
    Main entry point: search the internet and extract relevant content.
    
    Flow:
    1. Build optimized search query from user intent + detected product names
    2. Search DuckDuckGo
    3. Rank results, prioritizing trusted gadget sites
    4. Fetch top N pages and extract clean text
    5. Return combined content as a formatted string for the RAG context
    
    Returns an empty string if no useful content was found.
    """
    if product_names is None:
        product_names = []

    # Step 1: Build smart query
    search_query = build_product_search_query(user_query, product_names)
    logger.info(f"🔍 Internet search: \"{search_query}\"")

    # Step 2: Search
    raw_results = await web_search(search_query, max_results=max_search_results)
    if not raw_results:
        logger.info("   No search results found.")
        return ""

    # Step 3: Rank
    ranked_results = rank_search_results(raw_results)
    logger.info(f"   Found {len(ranked_results)} results, fetching top {max_pages_to_fetch} pages...")

    # Step 4: Fetch top pages concurrently
    top_urls = [r["url"] for r in ranked_results[:max_pages_to_fetch]]
    fetch_tasks = [fetch_page_content(url, max_chars_per_page) for url in top_urls]
    page_contents = await asyncio.gather(*fetch_tasks)

    # Step 5: Build formatted output
    parts = []
    for result, content in zip(ranked_results[:max_pages_to_fetch], page_contents):
        title = result.get("title", "")
        url = result.get("url", "")
        snippet = result.get("snippet", "")

        if content:
            parts.append(
                f"--- {title} ---\n"
                f"Source: {url}\n"
                f"{content}"
            )
        elif snippet:
            # Fallback to snippet if page fetch failed
            parts.append(
                f"--- {title} ---\n"
                f"Source: {url}\n"
                f"{snippet}"
            )

    if not parts:
        logger.info("   No page content could be extracted.")
        return ""

    combined = "\n\n".join(parts)
    logger.info(f"   ✅ Extracted {len(combined)} chars from {len(parts)} pages.")
    return combined