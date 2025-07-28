#!/bin/bash

echo "🧪 Testing Conversation History Dictionary"
echo "=========================================="

BASE_URL="http://localhost:3000"

# Test 1: Check initial state
echo -e "\n1️⃣ Checking initial state..."
curl -s "$BASE_URL/api/health" | python3 -c "
import json, sys
data = json.load(sys.stdin)
print('📊 Initial Stats:')
print(f'   Total Conversations: {data[\"stats\"][\"totalConversations\"]}')
print(f'   Total Messages: {data[\"stats\"][\"totalMessages\"]}')
print(f'   Active Sessions: {data[\"stats\"][\"activeSessions\"]}')
"

# Test 2: Send first message
echo -e "\n2️⃣ Sending first test message..."
RESPONSE1=$(curl -s -X POST "$BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello! This is a test message."}')

echo "🤖 Bot Response: $(echo $RESPONSE1 | python3 -c "import json, sys; print(json.load(sys.stdin)['response'][:50])...")"
echo "📝 Session Info: $(echo $RESPONSE1 | python3 -c "import json, sys; data=json.load(sys.stdin); print(f'Session: {data[\"sessionInfo\"][\"sessionId\"]}, Messages: {data[\"sessionInfo\"][\"messageCount\"]}')")"

# Test 3: Check conversations
echo -e "\n3️⃣ Checking conversation history..."
CONVERSATIONS=$(curl -s "$BASE_URL/api/conversations")
echo "💬 Active Conversations: $(echo $CONVERSATIONS | python3 -c "import json, sys; print(len(json.load(sys.stdin)['sessions']))")"

# Test 4: Send second message
echo -e "\n4️⃣ Sending second test message..."
RESPONSE2=$(curl -s -X POST "$BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "How are you doing today?"}')

echo "🤖 Bot Response: $(echo $RESPONSE2 | python3 -c "import json, sys; print(json.load(sys.stdin)['response'][:50])...")"
echo "📝 Updated Session Info: $(echo $RESPONSE2 | python3 -c "import json, sys; data=json.load(sys.stdin); print(f'Session: {data[\"sessionInfo\"][\"sessionId\"]}, Messages: {data[\"sessionInfo\"][\"messageCount\"]}')")"

# Test 5: Get specific conversation
echo -e "\n5️⃣ Getting specific conversation..."
SESSION_ID=$(echo $RESPONSE1 | python3 -c "import json, sys; print(json.load(sys.stdin)['sessionInfo']['sessionId'])")
SPECIFIC_CONV=$(curl -s "$BASE_URL/api/conversations/$SESSION_ID")

echo "📋 Conversation Details:"
echo "   - Created: $(echo $SPECIFIC_CONV | python3 -c "import json, sys; print(json.load(sys.stdin)['createdAt'][:19])")"
echo "   - Last Activity: $(echo $SPECIFIC_CONV | python3 -c "import json, sys; print(json.load(sys.stdin)['lastActivity'][:19])")"
echo "   - Message Count: $(echo $SPECIFIC_CONV | python3 -c "import json, sys; print(json.load(sys.stdin)['messageCount'])"))"
echo "   - Total Messages: $(echo $SPECIFIC_CONV | python3 -c "import json, sys; print(len(json.load(sys.stdin)['messages']))")"

# Test 6: Final stats
echo -e "\n6️⃣ Final statistics..."
curl -s "$BASE_URL/api/health" | python3 -c "
import json, sys
data = json.load(sys.stdin)
print('📊 Final Stats:')
print(f'   Total Conversations: {data[\"stats\"][\"totalConversations\"]}')
print(f'   Total Messages: {data[\"stats\"][\"totalMessages\"]}')
print(f'   Active Sessions: {data[\"stats\"][\"activeSessions\"]}')
"

echo -e "\n✅ Conversation history dictionary test completed!"
echo -e "\n📚 Dictionary Structure:"
echo "   conversationHistory = {"
echo "     \"$SESSION_ID\": {"
echo "       messages: ["
echo "         { role: \"user\", content: \"Hello! This is a test message.\", timestamp: \"...\" },"
echo "         { role: \"assistant\", content: \"...\", timestamp: \"...\" },"
echo "         { role: \"user\", content: \"How are you doing today?\", timestamp: \"...\" },"
echo "         { role: \"assistant\", content: \"...\", timestamp: \"...\" }"
echo "       ],"
echo "       createdAt: \"...\","
echo "       lastActivity: \"...\","
echo "       messageCount: 4"
echo "     }"
echo "   }" 