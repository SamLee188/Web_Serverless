#!/bin/bash

echo "🚀 Quick Start - Chatbot Application"
echo "===================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Kill any existing processes on ports 3000 and 3001
echo "🧹 Cleaning up ports..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
    echo "⚠️  Please update the OPENAI_API_KEY in .env file with your actual API key"
else
    echo "✅ .env file exists"
fi

echo ""
echo "🎯 Starting servers..."
echo "🌐 Frontend will be available at: http://localhost:3001"
echo "🔗 Backend API will be available at: http://localhost:3000"
echo "📊 Admin panel will be available at: http://localhost:3001/admin"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start the test servers
node fix-connection.js 