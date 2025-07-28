// Configuration for the chatbot application
const config = {
    // Backend API configuration
    backend: {
        url: process.env.BACKEND_URL || 'http://localhost:3000',
        port: process.env.BACKEND_PORT || 3000
    },
    
    // Frontend configuration
    frontend: {
        port: process.env.FRONTEND_PORT || 3001
    },
    
    // OpenAI configuration
    openai: {
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        maxTokens: process.env.OPENAI_MAX_TOKENS || 500,
        temperature: process.env.OPENAI_TEMPERATURE || 0.7
    },
    
    // Conversation configuration
    conversation: {
        maxMessages: process.env.MAX_MESSAGES || 15,
        cleanupInterval: process.env.CLEANUP_INTERVAL || 60 * 60 * 1000, // 1 hour
        maxAge: process.env.MAX_AGE || 24 * 60 * 60 * 1000 // 24 hours
    }
};

module.exports = config; 