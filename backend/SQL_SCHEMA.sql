# 📋 Complete SQL for Supabase Setup

Copy and paste this entire SQL into your Supabase SQL Editor.

## Instructions:
1. Go to: https://wrpgexrclimttoodjhvk.supabase.co
2. Click **SQL Editor** in left sidebar
3. Click **New Query**
4. Copy all SQL below
5. Paste it into the editor
6. Click **RUN** button

---

```sql
-- ============================================
-- KPRCAS COLLEGE DATABASE SCHEMA
-- ============================================

-- ============================================
-- 1. CREATE MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- 2. CREATE USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- 3. CREATE FAQS TABLE (Q&A PAIRS)
-- ============================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- 4. CREATE ADMIN_USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_messages_email ON messages(email);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_faqs_id ON faqs(id);

-- ============================================
-- 6. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. INSERT SAMPLE Q&A DATA
-- ============================================
INSERT INTO faqs (question, answer) VALUES
('What programs do you offer?', 'We offer a variety of undergraduate and postgraduate programs across Management, Commerce, Computing Science, and Fashion. Check our website for the complete list.'),
('How do I apply for admission?', 'You can apply for admission through our online portal. Visit our admissions page for more information and the application link.'),
('What is the college location?', 'Our college is located at Avinashi Road, Arasur, Coimbatore, Tamil Nadu, India.'),
('What are the contact details?', 'Email: info@kprcas.ac.in, Phone: 0422 2635678, 8870700678'),
('What is the college established year?', 'KPR College was established in 2019 and is affiliated with Bharathiar University, Coimbatore.'),
('What degrees do you offer?', 'We offer Bachelor (B.Sc, B.Com, BBA, BCA) and Master (M.Com, M.Sc) degree programs.'),
('Are there any scholarships available?', 'Please contact our admissions office for information about available scholarships and financial aid programs.'),
('What are the hostels facilities?', 'Information about hostel facilities can be obtained from our admissions office or website.');

-- ============================================
-- DONE! Tables are ready to use
-- ============================================
```

---

## ✅ What This SQL Creates:

### Tables:
1. **messages** - Stores chat messages from users
2. **users** - Stores unique user information
3. **faqs** - Stores Q&A pairs for the chatbot
4. **admin_users** - Stores admin credentials

### Indexes:
- Quick lookups by email and status

### Security:
- Row Level Security enabled on all tables

### Sample Data:
- 8 initial Q&A pairs for the chatbot

---

## 🔒 Important: Disable RLS for Development (If Needed)

If you get permission errors, run this to disable RLS temporarily:

```sql
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE faqs DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
```

---

## ✨ After Running the SQL:

1. ✅ Go to **Table Editor** in Supabase
2. ✅ Verify all 4 tables exist
3. ✅ See 8 Q&A pairs in the faqs table
4. ✅ Start your backend: `npm start`
5. ✅ Test the connection!

---

## Need Help?

1. Check [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed instructions
2. Check [QUICK_START.md](QUICK_START.md) for a quick overview
3. Supabase Docs: https://supabase.com/docs
