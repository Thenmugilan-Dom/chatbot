# KPRCAS College Website - Quick Start Guide

## Project Overview

This is a full-stack web application with:
- **Frontend**: React.js + Vite (port 5173)
- **Backend**: Node.js + Express (port 5000)
- **Admin Panel**: Full management dashboard
- **Chat System**: Integrated messaging system

---

## Initial Setup

### 1. Frontend Setup

Navigate to project root and install dependencies:
```bash
npm install
npm install react-router-dom
```

### 2. Backend Setup

Navigate to backend folder and install dependencies:
```bash
cd backend
npm install
```

The `.env` file is already configured with:
- Port: 5000
- Admin Email: admin@kprcas.com
- Admin Password: admin123

---

## Running the Application

### Option 1: Run Both Servers (Recommended)

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Access at: http://localhost:5173

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
Access at: http://localhost:5000

### Option 2: Run Only Frontend
```bash
npm run dev
```
(Chat will still work but messages won't be saved to admin)

### Option 3: Run Only Backend
```bash
cd backend
npm run dev
```
(For API testing with Postman/curl)

---

## Admin Dashboard Access

### Login
- **URL**: http://localhost:5173/admin/login
- **Email**: admin@kprcas.com
- **Password**: admin123

### Features

**Messages Dashboard**
- View all customer inquiries
- Filter by status: New, Read, Resolved
- Change message status
- Delete messages
- View statistics

**Content Manager**
- View all content sections
- Add new sections
- Edit existing sections
- Delete sections

---

## API Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/verify
```

### Messages (All Require JWT Token)
```
GET    /api/messages              # Get all messages
GET    /api/messages/:id          # Get single message
POST   /api/messages              # Create message (public)
PATCH  /api/messages/:id/status   # Update message status
DELETE /api/messages/:id          # Delete message
GET    /api/messages/stats        # Get statistics
```

### Content (All Require JWT Token)
```
GET    /api/content               # Get all content
GET    /api/content/:id           # Get single content
POST   /api/content               # Create content
PUT    /api/content/:id           # Update content
DELETE /api/content/:id           # Delete content
```

---

## Project Structure

```
project/
├── src/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── AdminLogin.jsx
│   │   └── AdminDashboard.jsx
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── ContentSection.jsx
│   │   ├── ChatAssistant.jsx
│   │   ├── FloatingChatButton.jsx
│   │   └── admin/
│   │       ├── Sidebar.jsx
│   │       ├── MessagesList.jsx
│   │       └── ContentManager.jsx
│   ├── App.jsx
│   └── main.jsx
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── messages.js
│   │   └── content.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
└── package.json
```

---

## Key Features

### Frontend
✓ Responsive design (mobile, tablet, desktop)
✓ Floating chat button
✓ Modern UI with animations
✓ React Router for navigation
✓ Email collection in chat

### Backend
✓ JWT authentication
✓ RESTful API design
✓ CORS enabled
✓ In-memory data storage (for demo)
✓ Message management system
✓ Content management system

### Admin Panel
✓ Secure login
✓ Message dashboard with filters
✓ Content management (CRUD)
✓ Statistics display
✓ Responsive sidebar
✓ Logout functionality

---

## Testing the Application

### 1. Test Public Chat
1. Open http://localhost:5173
2. Click purple button in bottom-right
3. Enter email and message
4. Message saves to backend

### 2. Test Admin Dashboard
1. Go to http://localhost:5173/admin/login
2. Login with demo credentials
3. View messages sent via public chat
4. Manage content sections
5. Change message status

### 3. Test Backend API (Using Curl)

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kprcas.com","password":"admin123"}'
```

**Create Message:**
```bash
curl -X POST http://localhost:5000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","message":"Hello from API"}'
```

**Get Messages (requires token):**
```bash
curl -X GET http://localhost:5000/api/messages \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Troubleshooting

### Port Already in Use
If port 5173 or 5000 is in use:

**Kill process on Windows:**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### CORS Errors
- Ensure backend is running on port 5000
- Check CORS configuration in backend/server.js

### Admin Login Fails
- Ensure backend is running
- Check credentials: admin@kprcas.com / admin123
- Check .env file in backend folder

### No Messages Appearing
- Verify backend is running
- Check browser console for errors
- Ensure message is sent from public chat

---

## Production Deployment

### Frontend Build
```bash
npm run build
# Deploy 'dist' folder to static hosting (Vercel, Netlify, etc.)
```

### Backend Deployment
1. Update .env with production values
2. Add database (MongoDB, PostgreSQL)
3. Deploy to server (Heroku, AWS, DigitalOcean, etc.)

---

## Next Steps

- [ ] Connect to real database (MongoDB/PostgreSQL)
- [ ] Add email notifications
- [ ] Implement user registration
- [ ] Add file upload
- [ ] Setup analytics
- [ ] Enable dark mode
- [ ] Add multi-language support

---

## Support

For more details, see:
- [README.md](README.md) - Full project documentation
- [backend/README.md](backend/README.md) - Backend API documentation

---

**Happy Coding! 🚀**
