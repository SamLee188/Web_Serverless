// Frontend Configuration
// Update this file with your deployed backend URL

const frontendConfig = {
    // Backend API URL - Update this with your deployed backend URL
    backendUrl: (() => {
        const hostname = window.location.hostname;
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
        
        if (isLocalhost) {
            // Local development
            return 'http://localhost:3000';
        } else {
            // Deployed frontend - Update this URL with your deployed backend
            return 'https://your-backend-url.vercel.app';
            // Examples:
            // return 'https://chatbot-backend-abc123.vercel.app';
            // return 'https://your-app.railway.app';
            // return 'https://your-app.herokuapp.com';
        }
    })(),
    
    // Other configuration options
    maxMessageLength: 500,
    typingIndicatorDelay: 1000,
    autoScrollDelay: 100
};

// Make config available globally
window.FRONTEND_CONFIG = frontendConfig;

console.log('🌐 Frontend Config Loaded:', {
    backendUrl: frontendConfig.backendUrl,
    hostname: window.location.hostname,
    isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
}); 