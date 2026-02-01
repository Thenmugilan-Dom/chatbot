#!/bin/bash

echo "🚀 KPRCAS Backend Setup Script"
echo "==============================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env created"
else
    echo "✅ .env file exists"
fi

echo ""
echo "📦 Checking dependencies..."
npm list @supabase/supabase-js > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Supabase package installed"
else
    echo "⚠️  Installing Supabase package..."
    npm install @supabase/supabase-js
fi

echo ""
echo "📋 Supabase Setup Instructions:"
echo "================================"
echo ""
echo "1. Go to Supabase Console: https://wrpgexrclimttoodjhvk.supabase.co"
echo "2. Click 'SQL Editor' in the left sidebar"
echo "3. Click 'New Query'"
echo "4. Copy the SQL schema from: config/schema.sql"
echo "5. Paste and execute the query"
echo ""
echo "To insert sample Q&A data, run:"
echo "INSERT INTO faqs (question, answer) VALUES"
echo "  ('What programs do you offer?', 'We offer various programs across Management, Commerce, Computing Science, and Fashion.'),"
echo "  ('How do I apply for admission?', 'Apply through our online portal.'),"
echo "  ('What is the college location?', 'Avinashi Road, Arasur, Coimbatore, Tamil Nadu, India.');"
echo ""
echo "6. Start the backend with: npm start"
echo ""
echo "✨ Setup complete!"
