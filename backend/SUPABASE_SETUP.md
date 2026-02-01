# 📚 Complete Supabase Setup Guide for KPRCAS Backend

## Quick Summary

Your backend is configured with **Supabase** as the database. Everything is ready - just need to create the tables!

## ✅ What's Already Done

- ✅ `.env` file configured with Supabase credentials
- ✅ `@supabase/supabase-js` package installed
- ✅ Backend routes updated to use Supabase
- ✅ Database schema file created

## 🔧 Setup Steps

### Step 1: Get Your Supabase Credentials ✓
Already in your `.env` file:
```
SUPABASE_URL=https://wrpgexrclimttoodjhvk.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 2: Create Database Tables (IMPORTANT!)

**Option A: Using Supabase Dashboard (Recommended)**

1. Open: https://wrpgexrclimttoodjhvk.supabase.co
2. Go to **SQL Editor** → Click **New Query**
3. Copy ALL the SQL from [backend/config/schema.sql](backend/config/schema.sql)
4. Paste into the SQL editor
5. Click **RUN** button

**Option B: Copy-Paste the SQL**

```sql
-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create faqs table (Q&A pairs)
CREATE TABLE faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create admin_users table
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_messages_email ON messages(email);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_faqs_id ON faqs(id);

-- Enable RLS (Row Level Security)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
```

### Step 3: Add Initial Q&A Data

Run this query in Supabase SQL Editor:

```sql
INSERT INTO faqs (question, answer) VALUES
('What programs do you offer?', 'We offer a variety of undergraduate and postgraduate programs across Management, Commerce, Computing Science, and Fashion. Check our website for the complete list.'),
('How do I apply for admission?', 'You can apply for admission through our online portal. Visit our admissions page for more information and the application link.'),
('What is the college location?', 'Our college is located at Avinashi Road, Arasur, Coimbatore, Tamil Nadu, India.'),
('What are the contact details?', 'Email: info@kprcas.ac.in, Phone: 0422 2635678, 8870700678'),
('What is the college established year?', 'KPR College was established in 2019 and is affiliated with Bharathiar University, Coimbatore.');
```

### Step 4: Start Your Backend

```bash
cd backend
npm start
```

You should see:
```
Server running on http://localhost:5000
```

### Step 5: Verify Everything Works

Test the connection:
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{"status": "Server is running"}
```

## 📊 Database Schema Overview

### **messages table**
Stores all chat messages from users
```
id (UUID) - Primary Key
email - User email
name - User name
phone - User phone
message - Chat message
status - 'new', 'read', 'resolved'
created_at - Timestamp
updated_at - Timestamp
```

### **users table**
Stores unique user information
```
id (UUID) - Primary Key
email - User email (UNIQUE)
name - User name
phone - User phone
created_at - Timestamp
updated_at - Timestamp
```

### **faqs table**
Stores Q&A pairs for the chatbot
```
id (UUID) - Primary Key
question - FAQ question
answer - FAQ answer
created_at - Timestamp
updated_at - Timestamp
```

### **admin_users table**
Stores admin credentials
```
id (UUID) - Primary Key
email - Admin email (UNIQUE)
password_hash - Hashed password
created_at - Timestamp
```

## 🛑 Disable Row Level Security (If Needed)

During development, you might want to disable RLS:

```sql
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE faqs DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
```

## ✨ Features Enabled by Supabase

✅ Real-time message updates  
✅ Automatic timestamps  
✅ UUID primary keys  
✅ Unique email constraints  
✅ Indexed queries for performance  
✅ Row-level security policies  
✅ Built-in authentication  

## 🔗 Useful Links

- Supabase Dashboard: https://wrpgexrclimttoodjhvk.supabase.co
- Supabase Docs: https://supabase.com/docs
- Your Project URL: `https://wrpgexrclimttoodjhvk.supabase.co`

## 🐛 Troubleshooting

### Issue: "Table 'messages' does not exist"
**Solution:** Make sure you ran the SQL schema in Supabase SQL Editor

### Issue: "Failed to fetch from Supabase"
**Solution:** 
1. Check `.env` file has correct credentials
2. Verify Supabase URL and KEY
3. Ensure tables are created in Supabase

### Issue: "401 Unauthorized"
**Solution:** 
1. Check if Supabase KEY is correct
2. Verify RLS policies allow your requests
3. Try disabling RLS temporarily

## 📝 Environment Variables

Your `.env` file contains:
```
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://wrpgexrclimttoodjhvk.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_EMAIL=admin@kprcas.com
ADMIN_PASSWORD=admin123
```

**⚠️ SECURITY NOTE:** Never commit `.env` to version control!

## ✅ Checklist

- [ ] SQL schema executed in Supabase
- [ ] Initial Q&A data inserted
- [ ] Backend started (`npm start`)
- [ ] Health check endpoint works
- [ ] Tables visible in Supabase Dashboard
- [ ] Chat messages being saved to database
- [ ] Users being tracked in users table

## 🚀 You're Ready!

Your backend is now fully connected to Supabase. Start building! 🎉
