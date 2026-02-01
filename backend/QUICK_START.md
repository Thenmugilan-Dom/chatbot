# 🚀 QUICK START - Supabase Connection

## 3-Minute Setup

### 1️⃣ Go to Supabase Dashboard
```
https://wrpgexrclimttoodjhvk.supabase.co
```

### 2️⃣ Create Tables
- Click **SQL Editor** → **New Query**
- Copy [schema.sql](config/schema.sql)
- Paste & Run

### 3️⃣ Add Sample Data
Run this in SQL Editor:
```sql
INSERT INTO faqs (question, answer) VALUES
('What programs do you offer?', 'We offer various programs across Management, Commerce, Computing Science, and Fashion.'),
('How do I apply for admission?', 'Apply through our online portal.');
```

### 4️⃣ Start Backend
```bash
npm start
```

### 5️⃣ Test
```bash
curl http://localhost:5000/api/health
```

---

## Files Overview

| File | Purpose |
|------|---------|
| `.env` | Supabase credentials ✅ |
| `config/supabaseClient.js` | Database connection ✅ |
| `config/schema.sql` | Table definitions ✅ |
| `routes/messages.js` | Chat messages API ✅ |
| `routes/users.js` | User tracking API ✅ |
| `routes/qa.js` | Q&A management API ✅ |

---

## Supabase Credentials

```
URL: https://wrpgexrclimttoodjhvk.supabase.co
Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Already configured in `.env`** ✅

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `messages` | Chat messages |
| `users` | User information |
| `faqs` | Q&A pairs |
| `admin_users` | Admin accounts |

---

## API Endpoints

```
POST   /api/messages         → Save message
GET    /api/messages         → Get all messages
GET    /api/messages/stats   → Get statistics
GET    /api/users            → Get all users
POST   /api/users            → Create user
GET    /api/qa               → Get all Q&A
POST   /api/qa               → Create Q&A
```

---

## Status ✨

- ✅ Package installed
- ✅ `.env` configured
- ✅ Backend routes ready
- ⏳ **TODO: Create tables in Supabase**
- ⏳ **TODO: Start backend**

---

## Next Steps

1. Execute SQL schema in Supabase
2. Run `npm start`
3. Test endpoints
4. Deploy! 🎉

---

For full details, see `SUPABASE_SETUP.md`
