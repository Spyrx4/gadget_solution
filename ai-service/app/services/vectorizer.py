from langchain_openai import OpenAIEmbeddings
from config import get_settings
from typing import List

settings = get_settings()

# Initialize OpenAI Embeddings client
embeddings_client = OpenAIEmbeddings(
    model=settings.EMBEDDING_MODEL,
    openai_api_key=settings.OPENAI_API_KEY,
    dimensions=settings.EMBEDDING_DIMENSIONS
)


async def embed_text(text: str) -> List[float]:
    """Generate vector embedding for a given text string asynchronously."""
    # Using async embed query from LangChain OpenAI Embeddings
    return await embeddings_client.aembed_query(text)
