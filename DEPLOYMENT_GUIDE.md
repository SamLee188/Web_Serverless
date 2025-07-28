# 🚀 Deployment Guide

## 📋 Overview

Your frontend is deployed on Vercel, but the backend needs to be deployed as well for the chatbot to work. Here are the deployment options:

## 🎯 Quick Solutions

### Option 1: Deploy Backend to Vercel (Recommended)

1. **Create a new Vercel project for the backend:**
   ```bash
   # Create a new directory for backend
   mkdir chatbot-backend
   cd chatbot-backend
   
   # Copy backend files
   cp ../Web_Serverless/server.js .
   cp ../Web_Serverless/package.json .
   cp ../Web_Serverless/.env .
   ```

2. **Create vercel.json for backend:**
   ```json
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
   ```

3. **Deploy to Vercel:**
   ```bash
   vercel
   ```

4. **Update frontend backend URL:**
   ```javascript
   // In script.js, update the backend URL
   this.backendUrl = 'https://your-backend-url.vercel.app';
   ```

### Option 2: Deploy Backend to Railway

1. **Create Railway account and project**
2. **Connect your GitHub repository**
3. **Set environment variables:**
   - `OPENAI_API_KEY`: Your OpenAI API key
4. **Deploy and get the URL**
5. **Update frontend backend URL**

### Option 3: Deploy Backend to Heroku

1. **Create Heroku app:**
   ```bash
   heroku create your-chatbot-backend
   ```

2. **Set environment variables:**
   ```bash
   heroku config:set OPENAI_API_KEY=your_openai_api_key
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

4. **Update frontend backend URL**

## 🔧 Backend Deployment Files

### vercel.json (for Vercel deployment)
```json
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
  ],
  "env": {
    "OPENAI_API_KEY": "@openai_api_key"
  }
}
```

### Procfile (for Heroku deployment)
```
web: node server.js
```

### package.json (backend only)
```json
{
  "name": "chatbot-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "openai": "^4.20.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
```

## 🌐 Update Frontend for Deployed Backend

### Option 1: Hardcode Backend URL
```javascript
// In script.js, replace the detectBackendUrl method
detectBackendUrl() {
    // Replace with your deployed backend URL
    return 'https://your-backend-url.vercel.app';
}
```

### Option 2: Environment Variable
```javascript
// In script.js
detectBackendUrl() {
    const currentHost = window.location.hostname;
    const isLocalhost = currentHost === 'localhost' || currentHost === '127.0.0.1';
    
    if (isLocalhost) {
        return 'http://localhost:3000';
    } else {
        // Replace with your deployed backend URL
        return 'https://your-backend-url.vercel.app';
    }
}
```

### Option 3: Dynamic Configuration
Create a `config.js` file in your frontend:
```javascript
const config = {
    backendUrl: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000' 
        : 'https://your-backend-url.vercel.app'
};

window.BACKEND_CONFIG = config;
```

Then in `script.js`:
```javascript
this.backendUrl = window.BACKEND_CONFIG?.backendUrl || 'http://localhost:3000';
```

## 🔒 Environment Variables

### Required for Backend Deployment:
- `OPENAI_API_KEY`: Your OpenAI API key

### Optional:
- `PORT`: Server port (usually auto-detected)
- `NODE_ENV`: Set to 'production' for deployment

## 📊 Deployment Checklist

### Backend Deployment:
- [ ] Create backend project
- [ ] Copy server.js and package.json
- [ ] Set up vercel.json or Procfile
- [ ] Set environment variables
- [ ] Deploy to platform
- [ ] Test API endpoints
- [ ] Get deployment URL

### Frontend Update:
- [ ] Update backend URL in script.js
- [ ] Update backend URL in admin.html
- [ ] Test connection
- [ ] Redeploy frontend if needed

## 🧪 Testing Deployment

### Test Backend API:
```bash
curl https://your-backend-url.vercel.app/api/health
```

### Test Frontend Connection:
1. Open your deployed frontend
2. Try sending a message
3. Check browser console for errors
4. Verify response from backend

## 🚨 Common Deployment Issues

### Issue 1: CORS Errors
- Make sure backend CORS includes your frontend domain
- Check that backend is deployed and accessible

### Issue 2: Environment Variables
- Verify OPENAI_API_KEY is set in deployment platform
- Check that variables are accessible in the deployed app

### Issue 3: Build Errors
- Ensure all dependencies are in package.json
- Check that Node.js version is compatible

### Issue 4: API Timeouts
- Consider using a paid plan for longer request times
- Implement request timeout handling

## 💡 Recommended Deployment Stack

**Frontend**: Vercel (already deployed)
**Backend**: Vercel or Railway
**Database**: None (in-memory storage)
**Environment Variables**: Platform-specific management

## 🔄 Quick Fix for Current Issue

If you want to test locally while your frontend is deployed:

1. **Start local backend:**
   ```bash
   npm run backend-only
   ```

2. **Use browser extension to bypass CORS** (for testing only)

3. **Or temporarily update frontend to use localhost** (not recommended for production)

The best solution is to deploy the backend to a platform like Vercel and update the frontend to use the deployed backend URL. 