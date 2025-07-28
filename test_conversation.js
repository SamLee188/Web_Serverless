const fetch = require('node-fetch');

async function testConversationHistory() {
    const baseUrl = 'http://localhost:3000';
    
    console.log('🧪 Testing Conversation History Dictionary\n');
    
    try {
        // Test 1: Check initial state
        console.log('1️⃣ Checking initial state...');
        const healthResponse = await fetch(`${baseUrl}/api/health`);
        const healthData = await healthResponse.json();
        console.log('📊 Initial Stats:', healthData.stats);
        
        // Test 2: Send a message
        console.log('\n2️⃣ Sending a test message...');
        const chatResponse = await fetch(`${baseUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Hello! This is a test message.' })
        });
        const chatData = await chatResponse.json();
        console.log('🤖 Bot Response:', chatData.response);
        console.log('📝 Session Info:', chatData.sessionInfo);
        
        // Test 3: Check conversations
        console.log('\n3️⃣ Checking conversation history...');
        const conversationsResponse = await fetch(`${baseUrl}/api/conversations`);
        const conversationsData = await conversationsResponse.json();
        console.log('💬 Active Conversations:', conversationsData.sessions.length);
        
        if (conversationsData.sessions.length > 0) {
            const sessionId = conversationsData.sessions[0].sessionId;
            console.log('🆔 Session ID:', sessionId);
            
            // Test 4: Get specific conversation
            console.log('\n4️⃣ Getting specific conversation...');
            const specificResponse = await fetch(`${baseUrl}/api/conversations/${sessionId}`);
            const specificData = await specificResponse.json();
            console.log('📋 Conversation Details:');
            console.log('   - Created:', specificData.createdAt);
            console.log('   - Last Activity:', specificData.lastActivity);
            console.log('   - Message Count:', specificData.messageCount);
            console.log('   - Messages:', specificData.messages.length);
            
            // Show message content
            specificData.messages.forEach((msg, index) => {
                const role = msg.role === 'user' ? '👤 User' : '🤖 Bot';
                console.log(`   ${index + 1}. ${role}: ${msg.content.substring(0, 50)}...`);
            });
        }
        
        // Test 5: Send another message to same session
        console.log('\n5️⃣ Sending another message to same session...');
        const chatResponse2 = await fetch(`${baseUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'How are you doing today?' })
        });
        const chatData2 = await chatResponse2.json();
        console.log('🤖 Bot Response:', chatData2.response);
        console.log('📝 Updated Session Info:', chatData2.sessionInfo);
        
        // Test 6: Final stats
        console.log('\n6️⃣ Final statistics...');
        const finalHealthResponse = await fetch(`${baseUrl}/api/health`);
        const finalHealthData = await finalHealthResponse.json();
        console.log('📊 Final Stats:', finalHealthData.stats);
        
        console.log('\n✅ Conversation history dictionary test completed successfully!');
        console.log('\n📚 Dictionary Structure:');
        console.log('   conversationHistory = {');
        console.log('     "sessionId": {');
        console.log('       messages: [');
        console.log('         { role: "user", content: "...", timestamp: "..." },');
        console.log('         { role: "assistant", content: "...", timestamp: "..." }');
        console.log('       ],');
        console.log('       createdAt: "...",');
        console.log('       lastActivity: "...",');
        console.log('       messageCount: 2');
        console.log('     }');
        console.log('   }');
        
    } catch (error) {
        console.error('❌ Error testing conversation history:', error.message);
    }
}

// Wait a moment for server to start, then run test
setTimeout(testConversationHistory, 2000); 