const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.FRONTEND_PORT || 3001;

// Middleware
app.use(express.static('.')); // Serve static files from current directory

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'Frontend Server OK', 
        timestamp: new Date().toISOString(),
        backendUrl: 'http://localhost:3000'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🎨 Frontend server running on http://localhost:${PORT}`);
    console.log(`🔗 Backend API available at http://localhost:3000`);
    console.log(`📊 Admin panel available at http://localhost:${PORT}/admin`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down frontend server...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down frontend server...');
    process.exit(0);
}); 