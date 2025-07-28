# 🔧 Troubleshooting Guide

## 🚨 Connection Refused Error

If you see this error:
```
localhost:3000/api/chat:1 Failed to load resource: net::ERR_CONNECTION_REFUSED
```

It means the backend server is not running. Here's how to fix it:

## ✅ Quick Fix Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create .env File
```bash
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

### Step 3: Start Both Servers
```bash
# Option 1: Use the test script (recommended for testing)
npm run test-servers

# Option 2: Use concurrently
npm run dev-both

# Option 3: Start manually in separate terminals
# Terminal 1:
npm run dev

# Terminal 2:
npm run frontend-dev
```

## 🔍 Verify Servers Are Running

### Check Backend (Port 3000)
```bash
curl http://localhost:3000/api/health
```
Should return: `{"status":"Backend OK",...}`

### Check Frontend (Port 3001)
```bash
curl http://localhost:3001/
```
Should return the HTML content

## 🚨 Common Issues

### Issue 1: Port Already in Use
```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Issue 2: Missing Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: Missing .env File
```bash
# Create .env file
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

### Issue 4: CORS Issues (Live Server)
If you're using Live Server (port 5500) or similar development servers:

**Solution 1: Use Backend-Only Mode**
```bash
# Start only the backend server
npm run backend-only

# Then use Live Server for frontend (right-click index.html → Open with Live Server)
```

**Solution 2: Use the Updated CORS Configuration**
The backend now supports multiple origins including Live Server ports.

**Solution 3: Check CORS Configuration**
Make sure:
- Backend is running on port 3000
- CORS is properly configured in server.js
- Your frontend origin is in the allowed list

## 🧪 Test Connection

Use the test script to verify everything works:
```bash
npm run test-servers
```

This will start both servers and show you if they're working correctly.

## 📱 Browser Testing

### Option 1: Using Built-in Frontend Server
1. Open http://localhost:3001 in your browser
2. Try sending a message
3. Check browser console for errors
4. Verify the message appears in the chat

### Option 2: Using Live Server (VS Code)
1. Start backend: `npm run backend-only`
2. Right-click `index.html` → "Open with Live Server"
3. Try sending a message
4. Check browser console for errors
5. Verify the message appears in the chat

## 🔄 Reset Everything

If nothing works, try a complete reset:
```bash
# Kill all node processes
pkill -f node

# Clear ports
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Start fresh
npm run test-servers
```

## 📞 Still Having Issues?

1. Check if you have Node.js installed: `node --version`
2. Check if npm is working: `npm --version`
3. Make sure no other applications are using ports 3000 or 3001
4. Try using different ports by setting environment variables:
   ```bash
   BACKEND_PORT=3002 FRONTEND_PORT=3003 npm run test-servers
   ``` 