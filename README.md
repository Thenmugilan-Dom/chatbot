# KPRCAS College Website - React + Vite Frontend

A modern, responsive college website built with React.js and Vite, featuring an interactive chat assistant and admin dashboard.

## Project Structure

```
project/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Main website page
│   │   │   ├── AdminLogin.jsx        # Admin login page
│   │   │   └── AdminDashboard.jsx    # Admin dashboard
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── ContentSection.jsx
│   │   │   ├── ChatAssistant.jsx
│   │   │   ├── FloatingChatButton.jsx
│   │   │   └── admin/
│   │   │       ├── Sidebar.jsx
│   │   │       ├── MessagesList.jsx
│   │   │       └── ContentManager.jsx
│   │   ├── App.jsx                   # Main app with routing
│   │   └── main.jsx
│   └── package.json
│
└── backend/
    ├── routes/
    │   ├── auth.js
    │   ├── messages.js
    │   └── content.js
    ├── middleware/
    │   └── auth.js
    ├── server.js
    ├── package.json
    └── .env
```

## Features

### Frontend
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Interactive Chat Assistant**: Collects user information via floating chat button
- **Modern UI**: Clean, professional design with animations
- **Admin Dashboard**: Full-featured admin panel for managing content and messages

### Backend
- **JWT Authentication**: Secure admin authentication
- **RESTful API**: Complete API for messages and content management
- **Message Management**: Track, read, and resolve customer inquiries
- **Content Management**: Edit college content sections
- **CORS Enabled**: Secure cross-origin requests

## Getting Started

### Prerequisites
- Node.js v14 or higher
- npm or yarn

### Frontend Setup

1. Install frontend dependencies:
```bash
npm install
```

2. Start frontend development server:
```bash
npm run dev
```

3. Frontend runs on `http://localhost:5173`

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start backend development server:
```bash
npm run dev
```

4. Backend runs on `http://localhost:5000`

### Running Both Servers

Open two terminals:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend && npm run dev
```

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start with nodemon (hot reload)
- `npm start` - Start production server

## Admin Access

### Login to Admin Dashboard

1. Open `http://localhost:5173/admin/login`
2. Enter credentials:
   - **Email**: admin@kprcas.com
   - **Password**: admin123

### Admin Features

- **Messages Dashboard**
  - View all customer inquiries
  - Filter by status (New, Read, Resolved)
  - Update message status
  - Delete messages
  - View statistics

- **Content Manager**
  - View all content sections
  - Create new sections
  - Edit existing sections
  - Delete sections

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify` - Verify token

### Messages
- `GET /api/messages` - Get all messages (protected)
- `POST /api/messages` - Create message (public)
- `PATCH /api/messages/:id/status` - Update status (protected)
- `DELETE /api/messages/:id` - Delete message (protected)
- `GET /api/messages/stats` - Get statistics (protected)

### Content
- `GET /api/content` - Get all content (protected)
- `POST /api/content` - Create content (protected)
- `PUT /api/content/:id` - Update content (protected)
- `DELETE /api/content/:id` - Delete content (protected)

See [backend/README.md](backend/README.md) for detailed API documentation.

## Components

### Frontend Components

**Header**
- College welcome message and tagline
- Purple gradient background

**ContentSection**
- Reusable cards for college information
- Hover effects and animations

**ChatAssistant**
- Interactive messaging interface
- Email collection form
- Message history display

**FloatingChatButton**
- Fixed position button in bottom-right corner
- Toggle chat on/off
- Animated transitions

### Admin Components

**Sidebar**
- Navigation between sections
- Logout button
- Visual indicators

**MessagesList**
- Table view of all messages
- Status filtering
- Inline status updates
- Delete functionality

**ContentManager**
- Grid view of content
- Add/Edit/Delete sections
- Form validation

## Customization

### Colors
- Primary: `#5B6FD8` (Purple/Blue)
- Secondary: `#2a2a2a` (Dark)
- Success: `#4caf50` (Green)
- Warning: `#ff9800` (Orange)
- Danger: `#e53935` (Red)

### Fonts
Font Family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif

### Content
Update content in `src/pages/Home.jsx` or via admin dashboard.

## Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Production Deployment

### Frontend
```bash
npm run build
# Deploy dist/ folder to static hosting
```

### Backend
1. Update `.env` with production values
2. Replace in-memory storage with database
3. Deploy to server (Heroku, AWS, DigitalOcean, etc.)

## Security Notes

- Change `JWT_SECRET` in `.env` for production
- Use environment variables for sensitive data
- Implement rate limiting
- Add input validation
- Use HTTPS in production
- Store passwords securely (bcryptjs used)

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Email notifications
- [ ] User registration system
- [ ] Advanced analytics
- [ ] File upload support
- [ ] Multi-language support
- [ ] Dark mode toggle

## License

This project is open source and available under the MIT License.
