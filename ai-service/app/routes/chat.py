from fastapi import APIRouter, HTTPException
from app.services.rag_engine import answer_consultant_query
from app.schemas.chat import ChatRequest, ChatResponse
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest) -> ChatResponse:
    """Handle user chat queries to the AI Consultant using the RAG workflow."""
    try:
        response_text, sources = await answer_consultant_query(request.message)
        return ChatResponse(
            message=response_text,
            sources=sources
        )
    except Exception as e:
        logger.error(f"Error processing chat query: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="An error occurred while processing your request with the AI Consultant.")
