# AI Chatbot Website

A modern, responsive chatbot website built with HTML, CSS, JavaScript frontend and Node.js backend that integrates with OpenAI's GPT API.

## Features

- 🤖 **AI-Powered Responses**: Uses OpenAI's GPT-3.5-turbo model for intelligent conversations
- 💬 **Real-time Chat**: Instant messaging with typing indicators
- 🎨 **Modern UI**: Beautiful yellow gradient design with smooth animations and icons
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- ⚡ **Fast & Lightweight**: Optimized for performance
- 🔒 **Secure**: API key stored in environment variables
- 📝 **Conversation History**: Saves conversations to memory with timestamps and session management
- 🌟 **Enhanced UX**: Hover effects, animations, and visual feedback
- 🧹 **Auto Cleanup**: Automatically removes old conversations after 24 hours

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- OpenAI API key

## Setup Instructions

### 1. Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd Web_Serverless

# Or simply download and extract the files
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

**To get an OpenAI API key:**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it in your `.env` file

### 4. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 5. Open Your Browser

Navigate to `http://localhost:3000` to start chatting!

**Admin Panel**: Visit `http://localhost:3000/admin` to view conversation statistics and manage conversations.

## Project Structure

```
Web_Serverless/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # Frontend JavaScript
├── server.js           # Node.js backend server
├── admin.html          # Admin panel for conversation management
├── package.json        # Dependencies and scripts
├── setup.js            # Interactive setup script
├── .env               # Environment variables (create this)
├── .gitignore         # Git ignore file
└── README.md          # This file
```

## API Endpoints

- `GET /` - Serves the main HTML page
- `POST /api/chat` - Handles chat messages
- `GET /api/health` - Health check endpoint with conversation stats
- `GET /api/conversations` - Get all active conversations
- `GET /api/conversations/:sessionId` - Get specific conversation history
- `DELETE /api/conversations/:sessionId` - Clear specific conversation

## Customization

### Changing the AI Model

In `server.js`, you can modify the OpenAI model:

```javascript
const completion = await openai.chat.completions.create({
    model: 'gpt-4', // Change to gpt-4 for better responses
    messages: messages,
    max_tokens: 500,
    temperature: 0.7,
});
```

### Styling

Modify `styles.css` to customize the appearance:
- Change colors in the gradient backgrounds
- Adjust font sizes and spacing
- Modify animations and transitions

### System Prompt

Edit the system message in `server.js` to change the AI's behavior:

```javascript
const systemMessage = {
    role: 'system',
    content: 'Your custom system prompt here...'
};
```

## Troubleshooting

### Common Issues

1. **"Server configuration error"**
   - Check if your `.env` file exists and contains the correct API key
   - Verify the API key is valid and has sufficient credits

2. **"Service temporarily unavailable"**
   - Your OpenAI API quota may be exceeded
   - Check your OpenAI account billing and usage

3. **Port already in use**
   - Change the port in `server.js` or kill the process using the port
   - Use `lsof -ti:3000 | xargs kill -9` to kill process on port 3000

4. **CORS errors**
   - The server includes CORS middleware, but if you're accessing from a different domain, you may need to configure it

### Debug Mode

To see detailed error logs, you can add more console.log statements or use a debugging tool like `debug` package.

## Security Considerations

- Never commit your `.env` file to version control
- The `.gitignore` file is configured to exclude sensitive files
- Consider implementing rate limiting for production use
- Use HTTPS in production environments

## Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment
1. Set `NODE_ENV=production` in your environment
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name chatbot
   ```

### Cloud Deployment
This application can be deployed to:
- Heroku
- Vercel
- Railway
- DigitalOcean App Platform
- AWS Elastic Beanstalk

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please check the troubleshooting section above or create an issue in the repository. 