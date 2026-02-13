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
-- 6. CREATE CHATBOT_MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS chatbot_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255),
  user_phone VARCHAR(20),
  message TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for chatbot messages
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_email ON chatbot_messages(user_email);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_created_at ON chatbot_messages(created_at);

-- ============================================
-- 7. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 8. INSERT SAMPLE Q&A DATA
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
