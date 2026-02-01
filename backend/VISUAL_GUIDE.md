# 📋 Visual Setup Guide - Supabase Integration

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      YOUR APPLICATION                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  FRONTEND (React)                 BACKEND (Node.js)          │
│  ┌──────────────────────┐        ┌─────────────────────┐   │
│  │  ChatAssistant       │        │  Express Server     │   │
│  │  AdminDashboard      │◄─────►│  :5000              │   │
│  │  UsersList           │        │                     │   │
│  │  QAManager           │        │  ├─ /api/messages  │   │
│  └──────────────────────┘        │  ├─ /api/users     │   │
│         :5173                     │  ├─ /api/qa        │   │
│                                   │  └─ /api/auth      │   │
│                                   └──────────┬──────────┘   │
│                                              │               │
│                                    ┌─────────▼──────────┐   │
│                                    │ supabaseClient.js  │   │
│                                    └─────────┬──────────┘   │
│                                              │               │
└──────────────────────────────────────────────┼───────────────┘
                                               │
                    ┌──────────────────────────▼──────────────┐
                    │  SUPABASE CLOUD DATABASE              │
                    │  https://wrpgexrclimttoodjhvk...      │
                    │                                        │
                    │  ┌──────────────────────────────────┐ │
                    │  │  messages                        │ │
                    │  │  ├─ id (UUID)                   │ │
                    │  │  ├─ email, name, phone          │ │
                    │  │  ├─ message, status             │ │
                    │  │  └─ created_at, updated_at      │ │
                    │  └──────────────────────────────────┘ │
                    │                                        │
                    │  ┌──────────────────────────────────┐ │
                    │  │  users                           │ │
                    │  │  ├─ id (UUID)                   │ │
                    │  │  ├─ email, name, phone          │ │
                    │  │  └─ created_at, updated_at      │ │
                    │  └──────────────────────────────────┘ │
                    │                                        │
                    │  ┌──────────────────────────────────┐ │
                    │  │  faqs                            │ │
                    │  │  ├─ id (UUID)                   │ │
                    │  │  ├─ question, answer            │ │
                    │  │  └─ created_at, updated_at      │ │
                    │  └──────────────────────────────────┘ │
                    │                                        │
                    │  ┌──────────────────────────────────┐ │
                    │  │  admin_users                     │ │
                    │  │  ├─ id (UUID)                   │ │
                    │  │  ├─ email, password_hash        │ │
                    │  │  └─ created_at                  │ │
                    │  └──────────────────────────────────┘ │
                    │                                        │
                    └────────────────────────────────────────┘
```

---

## Setup Flow

```
START
  │
  ├─► 1. Supabase Credentials ✅
  │       └─► In .env file
  │
  ├─► 2. Package Installed ✅
  │       └─► @supabase/supabase-js
  │
  ├─► 3. Backend Running ✅
  │       └─► http://localhost:5000
  │
  ├─► 4. Create Tables in Supabase ⏳ TODO
  │       ├─► Run SQL_SCHEMA.sql
  │       ├─► Or copy SQL from QUICK_START
  │       └─► Execute in Supabase SQL Editor
  │
  ├─► 5. Insert Sample Data ✅ (Included in SQL)
  │       └─► 8 initial Q&A pairs
  │
  └─► READY! 🎉
        └─► Chat messages → Database
            Users tracked → Database
            Q&A managed → Database
```

---

## File Structure

```
backend/
├── .env                          ✅ Credentials configured
├── .env.example                  ✅ Template
├── package.json                  ✅ Dependencies
├── server.js                      ✅ Main server file
│
├── config/
│   ├── supabaseClient.js         ✅ Database connection
│   └── schema.sql                ✅ Table definitions
│
├── routes/
│   ├── messages.js               ✅ Chat messages API
│   ├── users.js                  ✅ User management API
│   ├── qa.js                      ✅ Q&A management API
│   ├── auth.js                   ✅ Admin authentication
│   └── content.js                ✅ Content management
│
├── middleware/
│   └── auth.js                   ✅ JWT authentication
│
├── QUICK_START.md                📖 Quick reference
├── SUPABASE_SETUP.md             📖 Full guide
├── SQL_SCHEMA.sql                📖 All SQL + samples
└── setup.ps1                      🔧 Windows setup script
```

---

## Database Tables Relationship

```
┌─────────────────────┐
│     users           │
│ (Unique per email)  │
├─────────────────────┤
│ id (UUID)      [PK] │
│ email (String) [UK] │◄─┐
│ name (String)       │  │
│ phone (String)      │  │
│ created_at (Time)   │  │
└─────────────────────┘  │
         ▲                │
         │                │
         │ (one user      │
         │  has many      │
         │  messages)     │
         │                │
┌────────┴──────────────┐
│   messages           │
├──────────────────────┤
│ id (UUID)       [PK] │
│ email (String)  [FK] │─┘
│ name (String)        │
│ phone (String)       │
│ message (Text)       │
│ status (String)      │
│ created_at (Time)    │
└──────────────────────┘

         ┌──────────────────────┐
         │      faqs            │
         │   (Chatbot Q&A)      │
         ├──────────────────────┤
         │ id (UUID)       [PK] │
         │ question (Text)      │
         │ answer (Text)        │
         │ created_at (Time)    │
         └──────────────────────┘

         ┌──────────────────────┐
         │   admin_users        │
         │   (Admin accounts)   │
         ├──────────────────────┤
         │ id (UUID)       [PK] │
         │ email (String)  [UK] │
         │ password_hash        │
         │ created_at (Time)    │
         └──────────────────────┘
```

---

## API Flow Diagram

### Save a Message (Public)
```
User sends message
        │
        ▼
POST /api/messages
   {email, name, phone, message}
        │
        ▼
Create/Update user in users table
        │
        ▼
Save message in messages table
        │
        ▼
Response with message ID
        │
        ▼
Message saved to database! ✅
```

### Chatbot Response Logic
```
User message received
        │
        ▼
Check FAQs table
  Search for matching Q&A
        │
        ├─► Found match?
        │   YES: Return FAQ answer ✅
        │    NO: Check keywords ↓
        │
        ▼
Check for keywords (programs, contact, etc)
        │
        └─► Return relevant data or default response
```

### Admin Operations (Protected)
```
Admin logs in
        │
        ▼
POST /api/auth/login
        │
        ▼
Validate credentials
        │
        ▼
Issue JWT token
        │
        ▼
Store token in localStorage
        │
        ▼
Access protected routes ✅
  ├─ GET /api/messages
  ├─ GET /api/users
  ├─ POST /api/qa
  └─ PUT/DELETE operations
```

---

## Key Features Explained

### 🔑 UUID Primary Keys
```
Old: id = 1, 2, 3... (Simple but not unique across databases)
New: id = 550e8400-e29b-41d4-a716-446655440000 (Globally unique)
```

### 📅 Automatic Timestamps
```sql
created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()

-- Automatically set when record is created/updated
```

### 🔍 Indexes for Speed
```sql
CREATE INDEX idx_messages_email ON messages(email);
-- Makes searching by email 100x faster
```

### 🔐 Unique Constraints
```sql
email VARCHAR(255) NOT NULL UNIQUE
-- Prevents duplicate users with same email
```

### 🛡️ Row Level Security
```sql
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- Controls who can read/write each row
```

---

## Error Solutions Quick Guide

| Error | Cause | Solution |
|-------|-------|----------|
| "Table does not exist" | SQL not executed | Run schema in Supabase |
| "Failed to fetch" | Connection issue | Check `.env` credentials |
| "401 Unauthorized" | RLS blocking | Disable RLS or fix policies |
| "Duplicate key value" | Email already exists | Use different email |
| "Server not running" | Process crashed | Run `node server.js` |

---

## Status Check

```bash
# Check if backend is running
curl http://localhost:5000/api/health
# Expected: {"status": "Server is running"}

# Check if Q&A API works
curl http://localhost:5000/api/qa
# Expected: Array of FAQ objects

# Check if tables exist in Supabase
curl http://localhost:5000/api/messages
# Need valid JWT token (protected endpoint)
```

---

## Next Actions

### ✅ Completed
- [x] Supabase credentials configured
- [x] Backend package installed
- [x] Server running on :5000
- [x] Backend routes ready
- [x] All documentation created

### ⏳ To Do
- [ ] Execute SQL schema in Supabase SQL Editor
- [ ] Verify tables created in Supabase Table Editor
- [ ] Test API endpoints
- [ ] Start frontend (if needed)
- [ ] Test end-to-end flow

### 🎯 Quick Start
```bash
# 1. Go to Supabase Console
https://wrpgexrclimttoodjhvk.supabase.co

# 2. Run SQL from backend/SQL_SCHEMA.sql in SQL Editor

# 3. Backend already running!

# 4. Test endpoints or start frontend
```

---

## Backend is Running! ✨

```
✅ Server Status: ACTIVE
✅ Port: 5000
✅ Database: Connected to Supabase
✅ API: Ready for requests
✅ Time: 2026-02-01
```

**Next Step:** Create tables in Supabase using the SQL schema! 🚀
