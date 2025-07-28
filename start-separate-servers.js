const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Separate Frontend and Backend Servers');
console.log('================================================');
console.log('');

// Start backend server (port 3000)
console.log('🔧 Starting Backend Server (Port 3000)...');
const backend = spawn('node', ['server.js'], {
    stdio: 'inherit',
    cwd: __dirname
});

// Wait a moment for backend to start
setTimeout(() => {
    console.log('');
    console.log('🎨 Starting Frontend Server (Port 3001)...');
    const frontend = spawn('node', ['frontend-server.js'], {
        stdio: 'inherit',
        cwd: __dirname
    });
    
    // Handle frontend process
    frontend.on('close', (code) => {
        console.log(`\n🛑 Frontend server stopped with code ${code}`);
        backend.kill();
    });
    
    frontend.on('error', (err) => {
        console.error('❌ Frontend server error:', err);
        backend.kill();
    });
}, 2000);

// Handle backend process
backend.on('close', (code) => {
    console.log(`\n🛑 Backend server stopped with code ${code}`);
    process.exit(code);
});

backend.on('error', (err) => {
    console.error('❌ Backend server error:', err);
    process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down both servers...');
    backend.kill();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down both servers...');
    backend.kill();
    process.exit(0);
}); 