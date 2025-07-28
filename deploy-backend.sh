#!/bin/bash

echo "🚀 Backend Deployment Script"
echo "============================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed."
    echo "Please install it with: npm i -g vercel"
    exit 1
fi

echo "✅ Vercel CLI is installed"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file with your OPENAI_API_KEY"
    exit 1
fi

echo "✅ .env file found"

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo "❌ vercel.json not found!"
    echo "Creating vercel.json..."
    cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
EOF
fi

echo "✅ vercel.json configured"

echo ""
echo "🔧 Deploying to Vercel..."
echo "This will open a browser window for authentication"
echo ""

# Deploy to Vercel
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo "📝 Don't forget to:"
echo "   1. Set OPENAI_API_KEY in Vercel dashboard"
echo "   2. Update frontend backend URL"
echo "   3. Test the connection" 