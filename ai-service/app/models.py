from sqlalchemy import Column, String, Text
from pgvector.sqlalchemy import Vector
from app.database import Base


class ProductEmbedding(Base):
    __tablename__ = "product_embeddings"

    id = Column(String, primary_key=True)
    product_id = Column(String, unique=True, index=True)
    product_name = Column(String)
    product_description = Column(String)
    embedding = Column(Vector(1536))  # For OpenAI embeddings
    tech_specs_summary = Column(String)


class DocumentChunk(Base):
    """Stores embedded chunks from RAG knowledge documents (policies, FAQ, guides, etc.)."""
    __tablename__ = "document_chunks"

    id = Column(String, primary_key=True)
    doc_source = Column(String, index=True)       # e.g. "rag_store_policy.md"
    doc_type = Column(String, index=True)          # e.g. "store_policy", "faq_dynamic"
    chunk_id = Column(String, unique=True, index=True)  # e.g. "POLICY-001"
    chunk_title = Column(String)                   # Section heading
    chunk_content = Column(Text)                   # Full text of the chunk
    tags = Column(String)                          # Comma-separated tags from frontmatter
    embedding = Column(Vector(1536))
