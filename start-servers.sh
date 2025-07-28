#!/bin/bash

echo "🚀 Starting Chatbot Servers..."
echo "================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please run 'npm run setup' first to configure your OpenAI API key."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🔧 Starting Backend API Server (Port 3000)..."
echo "🎨 Starting Frontend Server (Port 3001)..."
echo ""
echo "🌐 Frontend: http://localhost:3001"
echo "🔗 Backend API: http://localhost:3000"
echo "📊 Admin Panel: http://localhost:3001/admin"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start both servers using concurrently
npx concurrently \
    --names "backend,frontend" \
    --prefix-colors "blue,green" \
    "npm run dev" \
    "npm run frontend-dev" 