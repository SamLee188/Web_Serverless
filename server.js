const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const supabaseService = require('./supabase-service');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3001', 
        'http://127.0.0.1:3001',
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'https://web-serverless-liart.vercel.app',
        'https://*.vercel.app',
        'https://*.netlify.app',
        'https://*.herokuapp.com',
        'https://*.railway.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Store conversation history in memory (for session management)
const conversationHistory = {};
const conversationStats = {
    totalConversations: 0,
    totalMessages: 0,
    activeSessions: 0
};

// Test Supabase connection on startup
supabaseService.testConnection().then(success => {
    if (success) {
        console.log('✅ Supabase connection established');
    } else {
        console.log('⚠️  Supabase connection failed - using local storage only');
    }
});

// API Routes only - Frontend is served separately
app.get('/', (req, res) => {
    res.json({ 
        message: 'Backend API Server',
        endpoints: {
            chat: '/api/chat',
            health: '/api/health',
            conversations: '/api/conversations'
        },
        frontendUrl: 'http://localhost:3001'
    });
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

        // Save conversation to Supabase
        try {
            if (session.conversationId) {
                // Update existing conversation
                await supabaseService.updateConversation(session.conversationId, session.messages);
            } else {
                // Create new conversation
                const result = await supabaseService.saveConversation(sessionId, session.messages);
                session.conversationId = result.conversationId;
            }
        } catch (error) {
            console.error('⚠️  Failed to save to Supabase, using local storage only:', error.message);
        }

        // Send response back to client
        res.json({ 
            response: botResponse,
            sessionInfo: {
                messageCount: session.messageCount,
                sessionId: sessionId,
                conversationId: session.conversationId
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
app.get('/api/health', async (req, res) => {
    try {
        // Get stats from Supabase if available
        let stats = conversationStats;
        try {
            const supabaseStats = await supabaseService.getConversationStats();
            stats = {
                ...conversationStats,
                ...supabaseStats,
                storage: 'supabase'
            };
        } catch (error) {
            console.error('⚠️  Using local stats due to Supabase error:', error.message);
            stats = {
                ...conversationStats,
                storage: 'local'
            };
        }

        res.json({ 
            status: 'OK', 
            timestamp: new Date().toISOString(),
            stats: stats
        });
    } catch (error) {
        console.error('Error in health endpoint:', error);
        res.status(500).json({ 
            status: 'ERROR', 
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
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

// Supabase-specific endpoints

// Get all conversations from Supabase
app.get('/api/supabase/conversations', async (req, res) => {
    try {
        const conversations = await supabaseService.getAllConversations();
        res.json({
            conversations,
            count: conversations.length
        });
    } catch (error) {
        console.error('Error fetching conversations from Supabase:', error);
        res.status(500).json({ 
            error: 'Failed to fetch conversations from database' 
        });
    }
});

// Get a specific conversation from Supabase
app.get('/api/supabase/conversations/:conversationId', async (req, res) => {
    try {
        const { conversationId } = req.params;
        const conversation = await supabaseService.getConversation(conversationId);
        
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        
        res.json(conversation);
    } catch (error) {
        console.error('Error fetching conversation from Supabase:', error);
        res.status(500).json({ 
            error: 'Failed to fetch conversation from database' 
        });
    }
});

// Delete a conversation from Supabase
app.delete('/api/supabase/conversations/:conversationId', async (req, res) => {
    try {
        const { conversationId } = req.params;
        await supabaseService.deleteConversation(conversationId);
        res.json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        console.error('Error deleting conversation from Supabase:', error);
        res.status(500).json({ 
            error: 'Failed to delete conversation from database' 
        });
    }
});

// Test Supabase connection
app.get('/api/supabase/test', async (req, res) => {
    try {
        const isConnected = await supabaseService.testConnection();
        res.json({ 
            connected: isConnected,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error testing Supabase connection:', error);
        res.status(500).json({ 
            connected: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
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
    console.log(`🚀 Backend API server running on http://localhost:${PORT}`);
    console.log(`📝 Make sure to set your OPENAI_API_KEY in the .env file`);
    console.log(`💾 Conversation history is being saved to memory`);
    console.log(`🔗 Frontend should connect to http://localhost:3001`);
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