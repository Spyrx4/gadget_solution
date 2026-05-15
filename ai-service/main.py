from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat
from app.database import init_db
from config import get_settings
import contextlib
import logging

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()


@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing database and pgvector extension...")
    init_db()
    logger.info("AI Microservice initialized successfully.")
    yield
    logger.info("Shutting down AI Microservice.")


app = FastAPI(
    title="Gadget Solution AI Microservice",
    description="RAG-powered AI Consultant Service for Gadget Solution e-commerce platform",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS middleware
origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(chat.router)


@app.get("/", tags=["health"])
async def root_health_check():
    """Root health check endpoint."""
    return {
        "status": "online",
        "service": "Gadget Solution AI Microservice",
        "provider": settings.LLM_PROVIDER,
        "embedding_model": settings.EMBEDDING_MODEL
    }
