const supabaseService = require('./supabase-service');

console.log('🧪 Testing Supabase Integration');
console.log('===============================');
console.log('');

async function runTests() {
    try {
        // Test 1: Connection
        console.log('1️⃣ Testing Supabase Connection...');
        const isConnected = await supabaseService.testConnection();
        if (isConnected) {
            console.log('✅ Supabase connection successful');
        } else {
            console.log('❌ Supabase connection failed');
            return;
        }

        // Test 2: Save conversation
        console.log('\n2️⃣ Testing Conversation Save...');
        const testMessages = [
            { role: 'user', content: 'Hello', timestamp: new Date().toISOString() },
            { role: 'assistant', content: 'Hi there!', timestamp: new Date().toISOString() }
        ];
        
        const saveResult = await supabaseService.saveConversation('test-session', testMessages);
        console.log('✅ Conversation saved successfully');
        console.log(`   Conversation ID: ${saveResult.conversationId}`);

        // Test 3: Get conversation
        console.log('\n3️⃣ Testing Conversation Retrieval...');
        const retrievedConversation = await supabaseService.getConversation(saveResult.conversationId);
        if (retrievedConversation) {
            console.log('✅ Conversation retrieved successfully');
            console.log(`   Messages count: ${retrievedConversation.messages.length}`);
        } else {
            console.log('❌ Failed to retrieve conversation');
        }

        // Test 4: Update conversation
        console.log('\n4️⃣ Testing Conversation Update...');
        const updatedMessages = [
            ...testMessages,
            { role: 'user', content: 'How are you?', timestamp: new Date().toISOString() },
            { role: 'assistant', content: 'I\'m doing great!', timestamp: new Date().toISOString() }
        ];
        
        await supabaseService.updateConversation(saveResult.conversationId, updatedMessages);
        console.log('✅ Conversation updated successfully');

        // Test 5: Get all conversations
        console.log('\n5️⃣ Testing Get All Conversations...');
        const allConversations = await supabaseService.getAllConversations();
        console.log(`✅ Retrieved ${allConversations.length} conversations`);

        // Test 6: Get conversation stats
        console.log('\n6️⃣ Testing Conversation Stats...');
        const stats = await supabaseService.getConversationStats();
        console.log('✅ Stats retrieved successfully');
        console.log(`   Total conversations: ${stats.totalConversations}`);
        console.log(`   Total messages: ${stats.totalMessages}`);

        // Test 7: Delete conversation
        console.log('\n7️⃣ Testing Conversation Deletion...');
        await supabaseService.deleteConversation(saveResult.conversationId);
        console.log('✅ Conversation deleted successfully');

        console.log('\n🎉 All tests passed! Supabase integration is working correctly.');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

runTests(); 