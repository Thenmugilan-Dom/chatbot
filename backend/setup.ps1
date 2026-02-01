Write-Host "🚀 KPRCAS Backend Setup Script" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (!(Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created" -ForegroundColor Green
} else {
    Write-Host "✅ .env file exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "📦 Checking dependencies..." -ForegroundColor Cyan
$packages = npm list @supabase/supabase-js 2>&1
if ($packages -match "supabase-js") {
    Write-Host "✅ Supabase package installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Installing Supabase package..." -ForegroundColor Yellow
    npm install @supabase/supabase-js
}

Write-Host ""
Write-Host "📋 Supabase Setup Instructions:" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to Supabase Console: https://wrpgexrclimttoodjhvk.supabase.co" -ForegroundColor White
Write-Host "2. Click 'SQL Editor' in the left sidebar" -ForegroundColor White
Write-Host "3. Click 'New Query'" -ForegroundColor White
Write-Host "4. Copy the SQL schema from: config/schema.sql" -ForegroundColor White
Write-Host "5. Paste and execute the query" -ForegroundColor White
Write-Host ""
Write-Host "To insert sample Q&A data, run:" -ForegroundColor Yellow
Write-Host "INSERT INTO faqs (question, answer) VALUES" -ForegroundColor Gray
Write-Host "  ('What programs do you offer?', 'We offer various programs...')," -ForegroundColor Gray
Write-Host "  ('How do I apply for admission?', 'Apply through our online portal.')," -ForegroundColor Gray
Write-Host "  ('What is the college location?', 'Avinashi Road, Arasur, Coimbatore...');" -ForegroundColor Gray
Write-Host ""
Write-Host "6. Start the backend with: npm start" -ForegroundColor White
Write-Host ""
Write-Host "✨ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next: Run 'npm start' to start the backend server" -ForegroundColor Cyan
