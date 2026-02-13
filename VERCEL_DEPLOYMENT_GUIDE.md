# Hosting KPRCAS Chatbot on Vercel - Complete Guide

## 🎯 Overview

This guide provides step-by-step instructions to deploy both your React frontend and Node.js/Express backend to Vercel as a unified application.

## ✅ Prerequisites

- ✅ Vercel account (free at https://vercel.com)
- ✅ GitHub account (code pushed to repository)
- ✅ Node.js installed locally
- ✅ Supabase project configured with credentials
- ✅ All API endpoints converted to Vercel Serverless Functions

---

## 📋 Project Structure After Setup

```
CB/
├── api/                       ← Vercel Serverless Functions
│   ├── auth.js               ← Authentication endpoints
│   ├── messages.js           ← Message endpoints
│   ├── chatbot.js            ← Chatbot message endpoints
│   ├── users.js              ← User management
│   ├── qa.js                 ← FAQ management
│   └── data.js               ← College data endpoint
├── src/                       ← React Frontend
│   ├── pages/
│   ├── components/
│   ├── utils/
│   ├── config/
│   │   └── api.js            ← API configuration
│   ├── App.jsx
│   └── main.jsx
├── public/                    ← Static files
├── backend/                   ← Original backend (keep for reference)
├── vercel.json               ← Vercel configuration
├── vite.config.js
├── package.json
└── index.html
```

---

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Environment Variables

1. Go to Vercel Dashboard
2. Create a new project or select existing
3. Go to **Settings → Environment Variables**
4. Add these variables:

```
SUPABASE_URL=https://wrpgexrclimttoodjhvk.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ANON_KEY=i5ffgMrgNWNwnD4+GpA5tsOzQ+sdFKFjrBexXc+KJuTLc17TMDV6cuCIo1EADRt...
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAIL=admin@kprcas.com
ADMIN_PASSWORD=admin123
VITE_API_URL=/api
```

### Step 2: Install Dependencies

```bash
cd D:\final_year_projects\CB

# Install frontend dependencies
npm install

# Install API dependencies
npm install @supabase/supabase-js
```

### Step 3: Verify File Structure

Ensure you have:
- ✅ `api/` folder with all endpoint files
- ✅ `vercel.json` configuration
- ✅ `src/config/api.js` with API configuration
- ✅ `src/` folder with React components

### Step 4: Test Locally (Optional)

```bash
# Install Vercel CLI
npm install -g vercel

# Test locally
vercel dev
```

### Step 5: Deploy to Vercel

**Option A: Using Vercel Dashboard**

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select root directory: `.`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click "Deploy"

**Option B: Using Vercel CLI**

```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

---

## 🔧 Configuration Files Explained

### vercel.json

Controls how Vercel builds and routes your application:

- **buildCommand**: Runs `npm run build` to build your React app
- **outputDirectory**: `dist` (where Vite outputs the built app)
- **routes**: Maps API calls to serverless functions
- **headers**: Enables CORS for API calls
- **functions**: Configures serverless function settings

### API Endpoints Structure

Each file in `/api` folder is automatically converted to a serverless function:

```
api/auth.js        → /api/auth
api/messages.js    → /api/messages
api/chatbot.js     → /api/chatbot
api/users.js       → /api/users
api/qa.js          → /api/qa
api/data.js        → /api/data
```

---

## 📡 How Requests Work on Vercel

### Frontend Requests Flow

```
React Component
        ↓
API Configuration (src/config/api.js)
        ↓
Vercel Edge Network
        ↓
Serverless Function (api/*.js)
        ↓
Supabase Database
        ↓
Response back to Frontend
```

### Example Request

**Frontend Code:**
```javascript
fetch('/api/messages/chatbot/save', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_email: 'user@example.com',
    message: 'I want to study CS'
  })
})
```

**On Vercel, this automatically routes to:** `api/chatbot.js`

---

## 🌐 Custom Domain Setup (Optional)

1. Go to Vercel Project Settings
2. Click **Domains**
3. Add your custom domain
4. Follow DNS setup instructions
5. Vercel auto-generates SSL certificate

---

## 📊 Monitoring & Logs

### View Deployment Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click **Deployments**
4. Click deployment → view logs

### Monitor Function Performance

1. Go to **Analytics** tab
2. Check function execution times
3. Monitor API response times
4. View error rates

---

## 🔐 Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env` files
- ✅ Store secrets in Vercel dashboard
- ✅ Use different keys for dev/prod

### 2. API Keys
- ✅ Rotate Supabase keys regularly
- ✅ Use service key only for backend
- ✅ Use anon key for frontend

### 3. CORS Configuration
```json
"headers": [
  {
    "source": "/api/(.*)",
    "headers": [
      {
        "key": "Access-Control-Allow-Origin",
        "value": "https://yourdomain.com"
      }
    ]
  }
]
```

---

## 🐛 Troubleshooting

### Issue: 404 errors on API calls

**Solution:**
1. Check API configuration in `vercel.json`
2. Verify function names match API files
3. Clear browser cache
4. Redeploy project

### Issue: Environment variables not found

**Solution:**
1. Go to Vercel dashboard
2. Verify all variables are added
3. Redeploy to apply changes
4. Check function logs for details

### Issue: CORS errors

**Solution:**
1. Update CORS headers in `vercel.json`
2. Add your domain to allowed origins
3. Ensure `/api/` routes are configured
4. Test with curl first

### Issue: Supabase connection fails

**Solution:**
1. Verify Supabase credentials in Vercel
2. Check Supabase project is active
3. Verify table RLS policies allow access
4. Check database connection string

---

## 📈 Performance Optimization

### 1. Function Caching
```json
"functions": {
  "api/data.js": {
    "maxDuration": 10
  }
}
```

### 2. Code Splitting
Vite automatically code-splits your React app for better performance.

### 3. Image Optimization
Vercel automatically optimizes images.

### 4. Edge Caching
Set cache headers for API responses:
```javascript
res.setHeader('Cache-Control', 'public, s-maxage=60');
```

---

## 🔄 Continuous Deployment

### Auto-Deploy on Push

1. Connect GitHub repository to Vercel
2. Set branch to deploy (main)
3. Every push to main automatically deploys
4. Vercel shows deployment status on GitHub

### Preview Deployments

- Every pull request gets a preview URL
- Test changes before merging
- Share preview with team

---

## 📱 Testing on Deployed Site

### Test Chat Functionality
1. Go to your Vercel domain
2. Click floating chat button
3. Provide name, phone, email
4. Ask about courses
5. Verify message saves (check admin dashboard)

### Test Admin Dashboard
1. Go to `/admin/login`
2. Login with credentials
3. Check Chatbot Conversations
4. Verify messages display correctly

### Test API Endpoints
```bash
# Test data endpoint
curl https://yourdomain.com/api/data

# Test messages endpoint
curl https://yourdomain.com/api/messages \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Serverless Functions**: https://vercel.com/docs/serverless-functions/introduction
- **Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables
- **Supabase Docs**: https://supabase.com/docs

---

## ✅ Deployment Checklist

- [ ] All environment variables added to Vercel
- [ ] `vercel.json` configured correctly
- [ ] All API files created in `/api` folder
- [ ] `src/config/api.js` created
- [ ] `package.json` updated with dependencies
- [ ] Frontend builds successfully locally
- [ ] GitHub repository pushed with all changes
- [ ] Vercel project created and configured
- [ ] Deployment successful
- [ ] Chat functionality works on deployed site
- [ ] Admin dashboard accessible
- [ ] Messages saving to database
- [ ] All API endpoints responding correctly

---

## 🎉 Success Indicators

When everything is working:

✅ Chat loads on homepage
✅ User can provide contact info
✅ Messages save to database
✅ Admin can view conversations
✅ No 404 or CORS errors
✅ API endpoints responding
✅ Supabase connection working
✅ Custom domain (if configured) working

---

## 📞 Support

For issues:
1. Check Vercel deployment logs
2. Check function error messages
3. Verify environment variables
4. Test API locally first
5. Check Supabase status
6. Review this guide again

---

**Last Updated**: February 13, 2026
**Status**: ✅ Ready for Deployment
**Estimated Time**: 15-20 minutes

