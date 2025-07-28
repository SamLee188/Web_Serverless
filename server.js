const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Store conversation history in a dictionary/object
const conversationHistory = {};
const conversationStats = {
    totalConversations: 0,
    totalMessages: 0,
    activeSessions: 0
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ 
                error: 'Message is required and must be a string' 
            });
        }

        // Get or create conversation history for this session
        const sessionId = req.ip || 'default';
        if (!conversationHistory[sessionId]) {
            conversationHistory[sessionId] = {
                messages: [],
                createdAt: new Date().toISOString(),
                lastActivity: new Date().toISOString(),
                messageCount: 0
            };
            conversationStats.totalConversations++;
            conversationStats.activeSessions++;
        }
        
        const session = conversationHistory[sessionId];
        session.lastActivity = new Date().toISOString();
        session.messageCount++;

        // Add user message to history
        session.messages.push({ 
            role: 'user', 
            content: message,
            timestamp: new Date().toISOString()
        });

        // Keep only last 15 messages to manage context length
        if (session.messages.length > 15) {
            session.messages = session.messages.slice(-15);
        }

        // Create system message for context
        const systemMessage = {
            role: 'system',
            content: 'You are a helpful AI assistant. Provide clear, concise, and accurate responses. Be friendly and engaging in your communication.'
        };

        // Prepare messages for OpenAI
        const messages = [systemMessage, ...session.messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }))];

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: 500,
            temperature: 0.7,
        });

        const botResponse = completion.choices[0].message.content;

        // Add bot response to history
        session.messages.push({ 
            role: 'assistant', 
            content: botResponse,
            timestamp: new Date().toISOString()
        });

        conversationStats.totalMessages += 2; // Count both user and bot messages

        // Send response back to client
        res.json({ 
            response: botResponse,
            sessionInfo: {
                messageCount: session.messageCount,
                sessionId: sessionId
            }
        });

    } catch (error) {
        console.error('Error in chat endpoint:', error);
        
        // Handle specific OpenAI errors
        if (error.code === 'insufficient_quota') {
            return res.status(503).json({ 
                error: 'Service temporarily unavailable due to API quota limits' 
            });
        }
        
        if (error.code === 'invalid_api_key') {
            return res.status(500).json({ 
                error: 'Server configuration error' 
            });
        }

        res.status(500).json({ 
            error: 'An error occurred while processing your request' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        stats: conversationStats
    });
});

// Get conversation history for a session
app.get('/api/conversations/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const session = conversationHistory[sessionId];
    
    if (!session) {
        return res.status(404).json({ error: 'Conversation not found' });
    }
    
    res.json({
        sessionId,
        messages: session.messages,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity,
        messageCount: session.messageCount
    });
});

// Get all active conversations (for admin purposes)
app.get('/api/conversations', (req, res) => {
    const sessions = Object.keys(conversationHistory).map(sessionId => ({
        sessionId,
        messageCount: conversationHistory[sessionId].messageCount,
        createdAt: conversationHistory[sessionId].createdAt,
        lastActivity: conversationHistory[sessionId].lastActivity
    }));
    
    res.json({
        sessions,
        stats: conversationStats
    });
});

// Clear conversation history for a session
app.delete('/api/conversations/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    
    if (conversationHistory[sessionId]) {
        delete conversationHistory[sessionId];
        conversationStats.activeSessions--;
        res.json({ message: 'Conversation cleared successfully' });
    } else {
        res.status(404).json({ error: 'Conversation not found' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        error: 'Internal server error' 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Endpoint not found' 
    });
});

// Cleanup old conversations (older than 24 hours)
function cleanupOldConversations() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    Object.keys(conversationHistory).forEach(sessionId => {
        const session = conversationHistory[sessionId];
        const lastActivity = new Date(session.lastActivity);
        
        if (lastActivity < oneDayAgo) {
            delete conversationHistory[sessionId];
            conversationStats.activeSessions--;
            console.log(`🧹 Cleaned up old conversation: ${sessionId}`);
        }
    });
}

// Run cleanup every hour
setInterval(cleanupOldConversations, 60 * 60 * 1000);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Make sure to set your OPENAI_API_KEY in the .env file`);
    console.log(`💾 Conversation history is being saved to memory`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    process.exit(0);
}); 