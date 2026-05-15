from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime


class SourceProduct(BaseModel):
    product_id: str
    name: str


class ChatRequest(BaseModel):
    message: str = Field(..., description="User query message to the AI Consultant")


class ChatResponse(BaseModel):
    message: str = Field(..., description="AI response message")
    sources: List[SourceProduct] = Field(default=[], description="List of source products referenced in the response")
    timestamp: datetime = Field(default_factory=datetime.now, description="Response timestamp")
