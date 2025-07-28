# 🚀 Separate Servers Guide

## 📋 Overview

The application is configured with **two separate servers**:

- **Backend Server** (Port 3000) - Handles API requests and OpenAI integration
- **Frontend Server** (Port 3001) - Serves HTML, CSS, and JavaScript files

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

## 🚀 How to Start

### Option 1: Automatic Startup (Recommended)
```bash
npm run separate
```

### Option 2: Manual Startup (Two Terminals)

**Terminal 1 - Backend Server:**
```bash
npm run dev
# or
node server.js
```

**Terminal 2 - Frontend Server:**
```bash
npm run frontend-dev
# or
node frontend-server.js
```

### Option 3: Using Concurrently
```bash
npm run dev-both
```

## 🌐 Access Points

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Admin Panel**: http://localhost:3001/admin

## 📁 File Structure

```
Web_Serverless/
├── server.js              # Backend API server (port 3000)
├── frontend-server.js     # Frontend server (port 3001)
├── index.html             # Main HTML file
├── admin.html             # Admin panel
├── script.js              # Frontend JavaScript
├── styles.css             # CSS styling
├── frontend-config.js     # Frontend configuration
└── package.json           # Dependencies and scripts
```

## 🔄 Communication Flow

1. **User visits** http://localhost:3001
2. **Frontend server** serves index.html
3. **User types message** in the chat interface
4. **Frontend JavaScript** sends request to http://localhost:3000/api/chat
5. **Backend server** processes request with OpenAI API
6. **Backend server** returns response to frontend
7. **Frontend** displays the response

## 🔧 Configuration

### Backend Configuration (server.js)
- Port: 3000
- CORS: Configured for frontend origins
- OpenAI API: Integrated
- Conversation History: In-memory storage

### Frontend Configuration (frontend-server.js)
- Port: 3001
- Static Files: Served from current directory
- Routes: / (main), /admin (admin panel)

### Frontend JavaScript Configuration (script.js)
- Backend URL: http://localhost:3000
- Automatic detection for different environments
- Error handling for connection issues

## 🧪 Testing

### Test Backend API
```bash
curl http://localhost:3000/api/health
```

### Test Frontend
```bash
curl http://localhost:3001/
```

### Test Chat Functionality
1. Open http://localhost:3001 in browser
2. Type a message
3. Check browser console for any errors
4. Verify response appears in chat

## 🚨 Troubleshooting

### Issue 1: Port Already in Use
```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Issue 2: Backend Not Starting
- Check if .env file exists with OPENAI_API_KEY
- Verify all dependencies are installed: `npm install`
- Check console for error messages

### Issue 3: Frontend Can't Connect to Backend
- Ensure backend is running on port 3000
- Check CORS configuration in server.js
- Verify frontend is running on port 3001

### Issue 4: CORS Errors
- Backend CORS is configured for multiple origins
- Check that frontend origin is in allowed list
- Restart backend after CORS changes

## 📊 Benefits of Separation

✅ **Scalability**: Can scale frontend and backend independently  
✅ **Development**: Easier to develop and debug each component  
✅ **Deployment**: Can deploy to different servers/environments  
✅ **Maintenance**: Clear separation of concerns  
✅ **Testing**: Can test API and frontend separately  
✅ **Performance**: Better resource allocation  

## 🔄 Development Workflow

1. **Start both servers**: `npm run separate`
2. **Edit frontend files**: HTML, CSS, JS changes auto-reload
3. **Edit backend files**: API changes require server restart
4. **Test changes**: Refresh browser to see frontend changes
5. **Monitor logs**: Both servers show console output

## 🛑 Stopping Servers

### Automatic Mode
Press `Ctrl+C` in the terminal running `npm run separate`

### Manual Mode
Press `Ctrl+C` in each terminal running the servers

### Force Stop
```bash
pkill -f "node server.js"
pkill -f "node frontend-server.js"
```

The separation is complete and working! Both servers can run independently and communicate via HTTP requests. 