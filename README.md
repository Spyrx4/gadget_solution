# 🎮 Gadget Solution E-Commerce Platform

A high-end B2C gadget marketplace built on a microservices architecture with AI-powered consultant recommendations.

## 🏛️ Architecture Overview
This project uses a monorepo structure containing three primary microservices:
1.  **Frontend (`/frontend`)**: A Next.js 14+ application providing a dynamic user storefront and conversational AI consultance widget.
2.  **Backend (`/backend`)**: A NestJS 10+ application serving a robust REST API, authenticating clients via JWT, and utilizing Prisma ORM.
3.  **AI Microservice (`/ai-service`)**: A Python FastAPI application driving a RAG (Retrieval-Augmented Generation) engine, connecting with pgvector and OpenAI/Anthropic APIs for smart product assistance.

---

## 🚀 Local Development Quickstart

### Prerequisites
- Docker & Docker Compose
- Node.js (v20+)
- Python (v3.10+)

### 1. Start Infrastructure
Ensure Docker is running and start the shared database (PostgreSQL with `pgvector` extension):
```bash
docker-compose up -d
```
*Note: Host DB port is mapped to `5433` to prevent conflict with standard PostgreSQL instances.*

### 2. Environment Setup
Copy `.env.example` configurations in each folder to `.env`:
```bash
# Root
cp .env.example .env

# Backend
cp backend/.env.example backend/.env

# AI Service
cp ai-service/.env.example ai-service/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### 3. Run Microservices
Detailed installation and initialization guides for each service can be found in the [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md).

---

## 📂 Directory Structure
- `/backend` - NestJS REST API & Prisma DB definitions.
- `/frontend` - Next.js App Router storefront.
- `/ai-service` - Python AI, Embedding pipeline & RAG agent.
- `/docs` - Design specifications, technical architectural layouts, and logs.
- `/scripts` - Utility scaffolding and seeder tools.
