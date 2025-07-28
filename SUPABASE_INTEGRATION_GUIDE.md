# 🗄️ Supabase Integration Guide

## 📋 Overview

Your chatbot now integrates with **Supabase** to store conversation history in a PostgreSQL database. This provides:

- **Persistent Storage**: Conversations survive server restarts
- **Scalability**: Handle thousands of conversations
- **Real-time Data**: Access conversations from anywhere
- **Backup & Recovery**: Automatic database backups
- **Analytics**: Query conversation data for insights

## 🏗️ Database Schema

Your Supabase table `Conver_Serverless` has the following structure:

```sql
CREATE TABLE "Conver_Serverless" (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    conversation_id TEXT UNIQUE NOT NULL,
    messages JSONB NOT NULL
);
```

### Column Details:
- **id**: Auto-incrementing primary key
- **created_at**: Timestamp when conversation was created
- **conversation_id**: Unique identifier for each conversation
- **messages**: JSONB array containing all messages in the conversation

## 🚀 Setup Instructions

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Run the setup script to configure your environment:
```bash
npm run setup
```

This will prompt you for:
- **OpenAI API Key**: Your OpenAI API key
- **Supabase URL**: Your Supabase project URL (e.g., `https://your-project.supabase.co`)
- **Supabase Anon Key**: Your Supabase anonymous key

### Step 3: Manual .env Configuration (Alternative)
If you prefer to manually configure, create a `.env` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
PORT=3000
NODE_ENV=development
```

## 🔧 How It Works

### Conversation Flow:
1. **User sends message** → Frontend (Port 3001)
2. **Frontend forwards to Backend** → Backend (Port 3000)
3. **Backend processes with OpenAI** → OpenAI API
4. **Backend saves to Supabase** → PostgreSQL Database
5. **Backend returns response** → Frontend displays

### Storage Strategy:
- **New Conversation**: Creates new record in Supabase
- **Existing Conversation**: Updates existing record with new messages
- **Fallback**: If Supabase fails, uses local memory storage
- **Session Management**: Maintains conversation context across requests

## 📊 API Endpoints

### Core Chat Endpoint
```
POST /api/chat
```
- Saves conversation to Supabase automatically
- Returns conversation ID for tracking

### Supabase-Specific Endpoints

#### Get All Conversations
```
GET /api/supabase/conversations
```
Returns all conversations from database

#### Get Specific Conversation
```
GET /api/supabase/conversations/:conversationId
```
Returns a specific conversation by ID

#### Delete Conversation
```
DELETE /api/supabase/conversations/:conversationId
```
Deletes a conversation from database

#### Test Connection
```
GET /api/supabase/test
```
Tests Supabase connection status

### Health Check
```
GET /api/health
```
Returns statistics including database storage type

## 🧪 Testing

### Test Supabase Integration
```bash
node test-supabase.js
```

This will test:
- ✅ Database connection
- ✅ Conversation creation
- ✅ Conversation retrieval
- ✅ Conversation updates
- ✅ Conversation deletion
- ✅ Statistics calculation

### Test from Admin Panel
1. Start the servers: `npm run separate`
2. Open: http://localhost:3001/admin
3. Click "🔗 Test Connection" to verify Supabase
4. Click "🔄 Refresh Database" to load conversations

## 📈 Admin Panel Features

### Local Conversations
- Shows active conversations in server memory
- Real-time updates every 30 seconds
- View and clear individual conversations

### Database Conversations
- Shows all conversations stored in Supabase
- Manual refresh button
- View full conversation history
- Delete conversations from database
- Connection status indicator

## 🔍 Monitoring & Debugging

### Console Logs
The server provides detailed logging:
```
✅ Supabase connection established
✅ Conversation saved to Supabase: conv_1234567890_abc123
✅ Conversation updated in Supabase: conv_1234567890_abc123
⚠️  Failed to save to Supabase, using local storage only: Network error
```

### Error Handling
- **Connection Failures**: Falls back to local storage
- **Database Errors**: Logs errors and continues operation
- **Invalid Data**: Validates before saving to database

## 🛠️ Troubleshooting

### Issue 1: Supabase Connection Failed
**Symptoms**: Console shows "Supabase connection failed"
**Solutions**:
1. Check your `.env` file has correct URL and key
2. Verify your Supabase project is active
3. Check network connectivity
4. Verify table `Conver_Serverless` exists

### Issue 2: Table Not Found
**Symptoms**: "relation 'Conver_Serverless' does not exist"
**Solutions**:
1. Create the table in Supabase SQL editor:
```sql
CREATE TABLE "Conver_Serverless" (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    conversation_id TEXT UNIQUE NOT NULL,
    messages JSONB NOT NULL
);
```

### Issue 3: Permission Denied
**Symptoms**: "permission denied for table"
**Solutions**:
1. Check Row Level Security (RLS) policies
2. Ensure your anon key has proper permissions
3. Add RLS policy if needed:
```sql
CREATE POLICY "Enable read access for all users" ON "Conver_Serverless"
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON "Conver_Serverless"
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON "Conver_Serverless"
FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON "Conver_Serverless"
FOR DELETE USING (true);
```

### Issue 4: Environment Variables Not Loaded
**Symptoms**: "Supabase URL and Anon Key are required"
**Solutions**:
1. Restart the server after updating `.env`
2. Check `.env` file is in project root
3. Verify no extra spaces in variable values

## 📊 Performance Considerations

### Message Limits
- **Context Length**: Keeps last 15 messages per conversation
- **Database Storage**: No limit on total conversations
- **Memory Usage**: Local cache for active sessions only

### Optimization Tips
- **Indexing**: Add index on `conversation_id` for faster lookups
- **Cleanup**: Old conversations are automatically cleaned from memory
- **Connection Pooling**: Supabase handles connection management

## 🔐 Security

### Data Protection
- **API Keys**: Stored securely in `.env` file
- **Database Access**: Uses Supabase's secure connection
- **Input Validation**: All messages validated before storage
- **Error Handling**: No sensitive data exposed in error messages

### Best Practices
- Never commit `.env` file to version control
- Use environment-specific API keys
- Regularly rotate your Supabase keys
- Monitor database access logs

## 🚀 Deployment

### Environment Variables for Production
```env
OPENAI_API_KEY=your_production_openai_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_production_supabase_key
PORT=3000
NODE_ENV=production
```

### Database Migration
When deploying to production:
1. Ensure the `Conver_Serverless` table exists
2. Set up proper RLS policies
3. Configure backup schedules
4. Monitor database performance

## 📝 Example Usage

### Starting the Application
```bash
# Install dependencies
npm install

# Setup environment (first time only)
npm run setup

# Start both servers
npm run separate

# Access the application
# Frontend: http://localhost:3001
# Admin Panel: http://localhost:3001/admin
```

### Testing the Integration
```bash
# Test Supabase connection
curl http://localhost:3000/api/supabase/test

# Get all conversations
curl http://localhost:3000/api/supabase/conversations

# Get health stats
curl http://localhost:3000/api/health
```

The Supabase integration is now complete and ready to use! Your conversations will be automatically saved to the database and can be managed through the admin panel. 