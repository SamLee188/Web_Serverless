#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🤖 AI Chatbot Setup\n');

// Check if .env file already exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists!');
    rl.question('Do you want to overwrite it? (y/N): ', (answer) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            createEnvFile();
        } else {
            console.log('Setup cancelled.');
            rl.close();
        }
    });
} else {
    createEnvFile();
}

function createEnvFile() {
    console.log('\n📝 Setting up your environment variables...\n');
    
    rl.question('Enter your OpenAI API Key: ', (apiKey) => {
        if (!apiKey.trim()) {
            console.log('❌ API key is required!');
            rl.close();
            return;
        }
        
        rl.question('Enter your Supabase URL: ', (supabaseUrl) => {
            if (!supabaseUrl.trim()) {
                console.log('❌ Supabase URL is required!');
                rl.close();
                return;
            }
            
            rl.question('Enter your Supabase Anon Key: ', (supabaseKey) => {
                if (!supabaseKey.trim()) {
                    console.log('❌ Supabase Anon Key is required!');
                    rl.close();
                    return;
                }
                
                const envContent = `OPENAI_API_KEY=${apiKey.trim()}
SUPABASE_URL=${supabaseUrl.trim()}
SUPABASE_ANON_KEY=${supabaseKey.trim()}
PORT=3000
NODE_ENV=development`;
                
                try {
                    fs.writeFileSync(envPath, envContent);
                    console.log('✅ .env file created successfully!');
                    console.log('\n🎉 Setup complete! You can now start the server:');
                    console.log('   npm run dev');
                    console.log('\n🌐 Then open http://localhost:3000 in your browser');
                } catch (error) {
                    console.error('❌ Error creating .env file:', error.message);
                }
                
                rl.close();
            });
        });
    });
}

rl.on('close', () => {
    console.log('\n👋 Happy chatting!');
    process.exit(0);
}); 