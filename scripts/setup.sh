#!/bin/bash
# setup.sh - Initial development environment setup helper script.

echo "⚙️  Initializing Gadget Solution Monorepo Environment Setup..."

# Copy env examples to actual env files
echo "📝 Copying environment variables..."
cp -n .env.example .env 2>/dev/null || echo "Root .env already exists."
cp -n backend/.env.example backend/.env 2>/dev/null || echo "Backend .env already exists."
cp -n frontend/.env.example frontend/.env 2>/dev/null || echo "Frontend .env already exists."
cp -n ai-service/.env.example ai-service/.env 2>/dev/null || echo "AI Service .env already exists."

echo "✅ Monorepo environment templates verified."
echo "🚀 Run 'docker-compose up -d' to boot infrastructure!"
