const express = require('express');
const cors = require('cors');
const path = require('path');

// Create a simple test backend server
const backendApp = express();
const backendPort = 3000;

// Backend middleware
backendApp.use(cors({
    origin: [
        'http://localhost:3001', 
        'http://127.0.0.1:3001',
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:8080',
        'http://127.0.0.1:8080'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
backendApp.use(express.json());

// Test endpoint
backendApp.get('/api/health', (req, res) => {
    res.json({ 
        status: 'Backend OK', 
        timestamp: new Date().toISOString(),
        message: 'Backend server is running correctly'
    });
});

// Test chat endpoint
backendApp.post('/api/chat', (req, res) => {
    const { message } = req.body;
    res.json({ 
        response: `Test response: You said "${message}"`,
        sessionInfo: {
            messageCount: 1,
            sessionId: 'test-session'
        }
    });
});

// Start backend
backendApp.listen(backendPort, () => {
    console.log(`🚀 Backend test server running on http://localhost:${backendPort}`);
});

// Create a simple test frontend server
const frontendApp = express();
const frontendPort = 3001;

// Frontend middleware
frontendApp.use(express.static('.'));

// Frontend routes
frontendApp.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

frontendApp.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start frontend
frontendApp.listen(frontendPort, () => {
    console.log(`🎨 Frontend test server running on http://localhost:${frontendPort}`);
    console.log(`🔗 Backend API available at http://localhost:${backendPort}`);
    console.log(`📊 Admin panel available at http://localhost:${frontendPort}/admin`);
    console.log('');
    console.log('✅ Both servers are now running!');
    console.log('🌐 Open http://localhost:3001 in your browser');
    console.log('🔧 Test the connection by sending a message');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down test servers...');
    process.exit(0);
}); 