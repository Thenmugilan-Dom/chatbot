# Supabase Setup Guide

## Step 1: Access Supabase Console

1. Go to your Supabase project: [https://wrpgexrclimttoodjhvk.supabase.co](https://wrpgexrclimttoodjhvk.supabase.co)
2. Log in with your credentials
3. Go to **SQL Editor** in the left sidebar

## Step 2: Create Database Tables

1. Click **New Query** button
2. Copy and paste the entire SQL schema from below
3. Click **Run** or press **Cmd/Ctrl + Enter**

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

## Step 3: Insert Sample Q&A Data

1. Create a new query in SQL Editor
2. Run this query to add initial FAQ data:

```sql
INSERT INTO faqs (question, answer) VALUES
('What programs do you offer?', 'We offer a variety of undergraduate and postgraduate programs across Management, Commerce, Computing Science, and Fashion. Check our website for the complete list.'),
('How do I apply for admission?', 'You can apply for admission through our online portal. Visit our admissions page for more information and the application link.'),
('What is the college location?', 'Our college is located at Avinashi Road, Arasur, Coimbatore, Tamil Nadu, India.'),
('What are the contact details?', 'Email: info@kprcas.ac.in, Phone: 0422 2635678, 8870700678');
```

## Step 4: Configure Backend

The `.env` file in `backend/` has already been configured with:
- ✅ Supabase URL
- ✅ Supabase Key
- ✅ Admin credentials

**Backend is ready to go!**

## Step 5: Test the Connection

1. Start the backend server:
   ```bash
   cd backend
   npm start
   # or for development with auto-reload
   npm run dev
   ```

2. You should see:
   ```
   Server running on http://localhost:5000
   ```

## Step 6: Verify Tables in Supabase

1. Go to **Table Editor** in Supabase
2. You should see these tables:
   - ✅ messages
   - ✅ users
   - ✅ faqs
   - ✅ admin_users

## API Endpoints Available

### Messages (Chat)
- `POST /api/messages` - Create new message (public)
- `GET /api/messages` - Get all messages (protected)
- `GET /api/messages/stats` - Get message statistics (protected)
- `PATCH /api/messages/:id/status` - Update message status (protected)
- `DELETE /api/messages/:id` - Delete message (protected)

### Users
- `GET /api/users` - Get all users (protected)
- `POST /api/users` - Create/update user (public)
- `DELETE /api/users/:id` - Delete user (protected)

### Q&A (FAQs)
- `GET /api/qa` - Get all Q&A pairs (public)
- `POST /api/qa` - Create new Q&A (protected)
- `PUT /api/qa/:id` - Update Q&A (protected)
- `DELETE /api/qa/:id` - Delete Q&A (protected)

## Troubleshooting

### "Failed to fetch messages" Error
- Check if Supabase URL and KEY are correct in `.env`
- Verify tables are created in Supabase
- Check browser console for detailed error message

### "Row Level Security" Issues
- Go to Supabase Dashboard → Authentication → Policies
- Create policies to allow public read access if needed
- For this project, RLS should be disabled for now (during development)

To disable RLS temporarily:
```sql
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE faqs DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
```

## Security Note ⚠️

The Supabase credentials in `.env` are for development only. For production:
1. Generate new keys
2. Use environment-specific configuration
3. Implement proper Row Level Security policies
4. Never commit `.env` to version control
