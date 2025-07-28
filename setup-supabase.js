#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🗄️  Supabase Setup\n');
console.log('This will help you configure your .env file with Supabase credentials.\n');

const envPath = path.join(__dirname, '.env');

// Check if .env exists and read current content
let currentEnv = '';
if (fs.existsSync(envPath)) {
    currentEnv = fs.readFileSync(envPath, 'utf8');
    console.log('📝 Current .env file found. Will update with Supabase credentials.\n');
} else {
    console.log('📝 No .env file found. Will create a new one.\n');
}

// Extract existing values
const getEnvValue = (key) => {
    const match = currentEnv.match(new RegExp(`^${key}=(.+)$`, 'm'));
    return match ? match[1] : '';
};

const openaiKey = getEnvValue('OPENAI_API_KEY');
const port = getEnvValue('PORT') || '3000';
const nodeEnv = getEnvValue('NODE_ENV') || 'development';

console.log('Please provide your Supabase credentials:\n');

rl.question('Enter your Supabase URL (e.g., https://your-project.supabase.co): ', (supabaseUrl) => {
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

        // Build the .env content
        let envContent = '';
        
        // Add OpenAI key if it exists
        if (openaiKey) {
            envContent += `OPENAI_API_KEY=${openaiKey}\n`;
        } else {
            console.log('⚠️  No OpenAI API key found. You may need to add it manually.');
            envContent += `OPENAI_API_KEY=your_openai_api_key_here\n`;
        }
        
        // Add Supabase credentials
        envContent += `SUPABASE_URL=${supabaseUrl.trim()}\n`;
        envContent += `SUPABASE_ANON_KEY=${supabaseKey.trim()}\n`;
        
        // Add other settings
        envContent += `PORT=${port}\n`;
        envContent += `NODE_ENV=${nodeEnv}\n`;

        try {
            fs.writeFileSync(envPath, envContent);
            console.log('\n✅ .env file updated successfully!');
            console.log('\n📋 Your .env file now contains:');
            console.log('   - OpenAI API Key: ' + (openaiKey ? '✅ Set' : '❌ Not set'));
            console.log('   - Supabase URL: ✅ Set');
            console.log('   - Supabase Anon Key: ✅ Set');
            console.log('   - Port: ' + port);
            console.log('   - Node Environment: ' + nodeEnv);
            
            console.log('\n🚀 You can now start your application:');
            console.log('   npm run separate');
            console.log('\n🧪 Test Supabase connection:');
            console.log('   node test-supabase.js');
            
        } catch (error) {
            console.error('❌ Error creating .env file:', error.message);
        }

        rl.close();
    });
});

rl.on('close', () => {
    console.log('\n👋 Setup complete!');
    process.exit(0);
}); 