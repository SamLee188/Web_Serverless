# 🚀 Server Separation Guide

## 📋 Overview

The chatbot application has been separated into two independent servers:

- **Backend API Server** (Port 3000) - Handles all API requests and OpenAI integration
- **Frontend Server** (Port 3001) - Serves static files and HTML pages

## 🏗️ Architecture

```
┌─────────────────┐    HTTP Requests    ┌─────────────────┐
│   Frontend      │ ──────────────────► │   Backend       │
│   Server        │                     │   API Server    │
│   Port 3001     │                     │   Port 3000     │
│                 │                     │                 │
│ • index.html    │                     │ • /api/chat     │
│ • admin.html    │                     │ • /api/health   │
│ • styles.css    │                     │ • /api/conversations │
│ • script.js     │                     │ • OpenAI API    │
└─────────────────┘                     └─────────────────┘
```

## 🚀 Quick Start

### Option 1: Run Both Servers Together (Recommended)
```bash
npm run dev-both
```

### Option 2: Use Startup Script
```bash
npm run start-both
```

### Option 3: Run Separately
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend  
npm run frontend-dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Admin Panel**: http://localhost:3001/admin

## 🔧 Configuration

### Environment Variables
```bash
# Backend
BACKEND_URL=http://localhost:3000
BACKEND_PORT=3000

# Frontend
FRONTEND_PORT=3001

# OpenAI
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-3.5-turbo
```

### Frontend Configuration
The frontend automatically connects to the backend API. You can configure the backend URL by setting the `BACKEND_URL` environment variable or modifying the JavaScript files.

## 📁 File Structure

```
├── server.js           # Backend API server
├── frontend-server.js  # Frontend server
├── config.js           # Configuration
├── start-servers.sh    # Startup script
├── index.html          # Main interface
├── admin.html          # Admin panel
├── script.js           # Frontend JavaScript
└── styles.css          # Styling
```

## 🔄 API Communication

### Frontend → Backend
- All API calls from frontend go to `http://localhost:3000`
- CORS is configured to allow frontend requests
- Error handling for network issues

### Backend → OpenAI
- Backend handles all OpenAI API communication
- Conversation history maintained in memory
- Automatic cleanup of old conversations

## 🛠️ Development

### Backend Development
```bash
npm run dev  # Backend only
```

### Frontend Development
```bash
npm run frontend-dev  # Frontend only
```

### Both Servers
```bash
npm run dev-both  # Both with auto-restart
```

## 🔍 Testing

### Test Backend API
```bash
curl http://localhost:3000/api/health
```

### Test Frontend
```bash
curl http://localhost:3001/
```

### Test Admin Panel
```bash
curl http://localhost:3001/admin
```

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### CORS Issues
- Backend CORS is configured for `http://localhost:3001`
- Check that frontend is running on port 3001
- Verify backend is running on port 3000

### Connection Issues
- Ensure both servers are running
- Check firewall settings
- Verify environment variables

## 📊 Benefits of Separation

✅ **Scalability**: Can scale frontend and backend independently  
✅ **Development**: Easier to develop and debug each component  
✅ **Deployment**: Can deploy to different servers/environments  
✅ **Maintenance**: Clear separation of concerns  
✅ **Testing**: Can test API and frontend separately  

## 🔄 Migration from Single Server

The application has been migrated from a single server to two separate servers:

1. **Backend**: Removed static file serving, added CORS configuration
2. **Frontend**: Created new server, updated API endpoints
3. **Configuration**: Added configurable backend URL
4. **Scripts**: Added scripts to run both servers together

All existing functionality is preserved with improved architecture! 