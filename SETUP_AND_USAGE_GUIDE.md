# Setup and Usage Guide - KPRCAS Chatbot

## Quick Start

### 1. Initial Setup

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### 2. Environment Configuration

The `.env` file is already configured with your Supabase credentials:
- **Supabase URL:** https://wrpgexrclimttoodjhvk.supabase.co
- **All necessary API keys are in place**

### 3. Database Setup

Execute the SQL schema in your Supabase SQL Editor:

```bash
# Copy the entire content from backend/config/schema.sql
# Paste it into Supabase SQL Editor
# Execute all statements
```

This creates:
- `messages` - Contact form messages
- `users` - Registered users
- `faqs` - Q&A pairs
- `admin_users` - Admin credentials
- `chatbot_messages` - Chatbot conversation history
- All required indexes and RLS policies

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Application runs on http://localhost:5173
```

## User Features

### Home Page
1. **Floating Chat Button** - Click to open chat interface
2. **Chat Assistant** - Collects user information in 3 steps:
   - Name
   - Phone number
   - Email address
3. **Smart Bot** - Responds to queries using:
   - FAQ database
   - College information
   - Academic programs
   - Admissions details

### Chat Features
- Real-time message updates
- Bot responses with 500ms delay
- Message history display
- Keyboard support (Enter to send)
- Emoji indicators (👤 for user, 🤖 for bot)

## Admin Dashboard

### Access Admin Panel
- **URL:** http://localhost:5173/admin/login
- **Email:** admin@kprcas.com
- **Password:** admin123

### Admin Features

#### 1. Messages Tab
- View all contact form submissions
- See message statistics:
  - Total messages
  - New messages
  - Read messages
  - Resolved messages
- Update message status
- Delete messages

#### 2. Chatbot Conversations Tab
- View all chatbot interactions
- **Filters:**
  - All conversations
  - Registered users only
  - Guest users only
- **For each user see:**
  - Name, email, phone
  - Message count
  - Last interaction date
  - Full conversation history
- **Message details:**
  - Distinguish user vs bot messages
  - Timestamp for each message
  - Message content

#### 3. Users Tab
- List all registered users
- Filter by status
- Edit user information
- Delete users

#### 4. Q&A Manager
- View all FAQ entries
- Add new Q&A pairs
- Edit existing questions/answers
- Delete Q&A entries

#### 5. Content Manager
- Manage college content
- Edit pages
- Update information

## API Reference

### Authentication
All protected endpoints require:
```
Headers: {
  'Authorization': 'Bearer <adminToken>'
}
```

### Chatbot Message Endpoints

#### Get All Chatbot Messages (Protected)
```
GET /api/messages/chatbot/all
Response: Array of chatbot messages
```

#### Save Chatbot Message (Public)
```
POST /api/messages/chatbot/save
Body: {
  user_email: string (required),
  user_name: string (optional),
  user_phone: string (optional),
  message: string (required),
  message_type: 'user' | 'bot'
}
Response: Saved message object
```

### Contact Message Endpoints

#### Get All Messages (Protected)
```
GET /api/messages/
Response: Array of contact messages
```

#### Get Statistics (Protected)
```
GET /api/messages/stats
Response: {
  total: number,
  new: number,
  read: number,
  resolved: number
}
```

#### Create Message (Public)
```
POST /api/messages/
Body: {
  email: string (required),
  name: string (optional),
  phone: string (optional),
  message: string (required)
}
```

#### Update Message Status (Protected)
```
PATCH /api/messages/:id/status
Body: {
  status: 'new' | 'read' | 'resolved'
}
```

#### Delete Message (Protected)
```
DELETE /api/messages/:id
```

## Database Schema

### chatbot_messages Table
```
id           UUID (Primary Key)
user_email   VARCHAR(255) - Email of user who started chat
user_name    VARCHAR(255) - Name provided by user
user_phone   VARCHAR(20)  - Phone number provided by user
message      TEXT         - Chat message content
message_type VARCHAR(50)  - 'user' or 'bot'
created_at   TIMESTAMP    - When message was sent
updated_at   TIMESTAMP    - Last update time
```

### Indexes
- `idx_chatbot_messages_email` - Fast lookups by email
- `idx_chatbot_messages_created` - Fast sorting by date

## Troubleshooting

### Chat not saving messages
1. Check if backend is running on port 5000
2. Verify `.env` file has Supabase credentials
3. Check browser console for API errors
4. Ensure `chatbot_messages` table exists in Supabase

### Admin dashboard showing no messages
1. Login again to refresh token
2. Check if user has admin role
3. Verify API endpoint returns data in browser DevTools
4. Check Supabase table for data

### Messages appearing but not user info
- Ensure all 3 steps (name, phone, email) are completed
- Check if data is properly submitted in network tab

### Supabase Connection Issues
1. Verify URL is correct: https://wrpgexrclimttoodjhvk.supabase.co
2. Check API keys in `.env` file
3. Ensure row-level security allows access
4. Check Supabase project status

## File Structure

```
CB/
├── src/
│   ├── pages/
│   │   ├── Home.jsx              # Main chat interface
│   │   ├── AdminDashboard.jsx    # Admin panel
│   │   └── AdminLogin.jsx        # Admin login
│   ├── components/
│   │   ├── ChatAssistant.jsx     # Chat interface
│   │   ├── Header.jsx
│   │   ├── ContentSection.jsx
│   │   ├── FloatingChatButton.jsx
│   │   └── admin/
│   │       ├── ChatbotMessagesList.jsx  # Chatbot conversations viewer
│   │       ├── MessagesList.jsx
│   │       ├── UsersList.jsx
│   │       ├── QAManager.jsx
│   │       ├── ContentManager.jsx
│   │       └── Sidebar.jsx
│   └── assets/
├── backend/
│   ├── routes/
│   │   ├── messages.js           # Chatbot message routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── qa.js
│   │   └── content.js
│   ├── middleware/
│   │   └── auth.js               # JWT authentication
│   ├── config/
│   │   ├── schema.sql            # Database schema
│   │   └── supabaseClient.js     # Supabase config
│   ├── server.js                 # Express server
│   └── .env                      # Environment variables
└── README.md
```

## Key Features Summary

✅ **User-Friendly Chat Interface**
- Multi-step information collection
- Real-time responses
- Message history
- Emoji indicators

✅ **Smart Bot**
- FAQ-based responses
- College information integration
- Fallback responses for unknown queries

✅ **Admin Dashboard**
- View all conversations
- Filter by user type
- Real-time statistics
- Manage messages and users

✅ **Database Integration**
- Supabase integration
- Automatic timestamps
- Performance indexes
- Row-level security

✅ **Security**
- JWT authentication for admin
- Protected API endpoints
- Row-level security policies
- Secure credential storage

## Next Steps

1. ✅ Configure Supabase credentials (DONE)
2. ✅ Create database tables (SQL schema ready)
3. Run the application locally
4. Test chat functionality
5. Verify messages appear in admin dashboard
6. Deploy to production

## Support

For issues or questions:
1. Check the IMPLEMENTATION_SUMMARY.md for detailed info
2. Review error messages in browser console
3. Check server logs in terminal
4. Verify Supabase connection and data

---
**Last Updated:** February 13, 2026  
**Version:** 1.0

