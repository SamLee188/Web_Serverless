# 🚀 Quick Supabase Setup

## ❌ Error: "Supabase URL and Anon Key are required in .env file"

This error occurs because your `.env` file is missing the Supabase credentials. Here's how to fix it:

## 🔧 Solution 1: Automatic Setup (Recommended)

Run the Supabase setup script:
```bash
npm run setup-supabase
```

This will prompt you for:
- **Supabase URL**: Your project URL (e.g., `https://your-project.supabase.co`)
- **Supabase Anon Key**: Your anonymous key from Supabase dashboard

## 🔧 Solution 2: Manual Setup

Create or edit your `.env` file in the project root:

```env
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
PORT=3000
NODE_ENV=development
```

## 📍 Where to Find Your Supabase Credentials

### 1. Go to your Supabase Dashboard
- Visit: https://supabase.com/dashboard
- Select your project

### 2. Get the URL
- Go to **Settings** → **API**
- Copy the **Project URL** (looks like: `https://your-project.supabase.co`)

### 3. Get the Anon Key
- In the same **Settings** → **API** section
- Copy the **anon public** key (starts with `eyJ...`)

## 🧪 Test the Setup

After adding the credentials:

1. **Test Supabase connection:**
   ```bash
   node test-supabase.js
   ```

2. **Start the application:**
   ```bash
   npm run separate
   ```

3. **Check admin panel:**
   - Open: http://localhost:3001/admin
   - Click "🔗 Test Connection"

## 🚨 Common Issues

### Issue 1: "Invalid API key"
- Make sure you're using the **anon public** key, not the service role key
- Check for extra spaces or characters

### Issue 2: "Connection failed"
- Verify your Supabase project is active
- Check your internet connection
- Ensure the URL format is correct

### Issue 3: "Table not found"
- Create the table in Supabase SQL editor:
```sql
CREATE TABLE "Conver_Serverless" (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    conversation_id TEXT UNIQUE NOT NULL,
    messages JSONB NOT NULL
);
```

## ✅ Success Indicators

When setup is correct, you should see:
- ✅ "Supabase connection established" in console
- ✅ "Connected: true" when testing connection
- ✅ Conversations being saved to database
- ✅ Admin panel showing database conversations

## 🆘 Still Having Issues?

1. **Check your `.env` file exists** in the project root
2. **Restart the server** after updating `.env`
3. **Verify credentials** in Supabase dashboard
4. **Check console logs** for specific error messages

The setup script will guide you through the process step by step! 