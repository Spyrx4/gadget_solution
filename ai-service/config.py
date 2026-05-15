from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application configuration loaded from .env file."""

    # Server
    PORT: int = 8000
    NODE_ENV: str = "development"

    # Database
    DATABASE_URL: str = "postgresql://gadgetadmin:gadgetpass123@localhost:5433/gadget_solution"

    # OpenAI
    OPENAI_API_KEY: str = ""
    LLM_PROVIDER: str = "openai"

    # Embedding
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    EMBEDDING_DIMENSIONS: int = 1536

    # Chat
    CHAT_MODEL: str = "gpt-4o-mini"

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    # Backend
    BACKEND_URL: str = "http://localhost:3001"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
