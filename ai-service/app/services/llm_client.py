from langchain_openai import ChatOpenAI
from config import get_settings
from functools import lru_cache

settings = get_settings()


@lru_cache()
def get_llm() -> ChatOpenAI:
    """Initialize and return the LangChain ChatOpenAI client instance."""
    return ChatOpenAI(
        model=settings.CHAT_MODEL,
        openai_api_key=settings.OPENAI_API_KEY,
        temperature=0.7,
        max_tokens=1000
    )
