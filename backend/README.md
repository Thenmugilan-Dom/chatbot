# KPRCAS Backend API

Express.js backend API for KPRCAS College website with admin authentication and messaging system.

## Installation

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables by updating `.env` file (already created):
```
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_this_in_production
ADMIN_EMAIL=admin@kprcas.com
ADMIN_PASSWORD=admin123
```

## Running the Server

Start development server with hot reload:
```bash
npm run dev
```

Start production server:
```bash
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/login
Login with admin credentials
```json
{
  "email": "admin@kprcas.com",
  "password": "admin123"
}
```
Returns: `{ token, email }`

#### POST /api/auth/verify
Verify JWT token (protected)
Headers: `Authorization: Bearer <token>`
Returns: `{ valid: true, email }`

### Messages Endpoints

#### GET /api/messages
Get all messages (protected)
Headers: `Authorization: Bearer <token>`
Returns: Array of messages

#### GET /api/messages/:id
Get specific message by ID (protected)
Headers: `Authorization: Bearer <token>`
Returns: Single message object

#### POST /api/messages
Create new message (public)
```json
{
  "email": "user@example.com",
  "message": "Your message here"
}
```
Returns: Created message object

#### PATCH /api/messages/:id/status
Update message status (protected)
Headers: `Authorization: Bearer <token>`
```json
{
  "status": "new|read|resolved"
}
```
Returns: Updated message object

#### DELETE /api/messages/:id
Delete message (protected)
Headers: `Authorization: Bearer <token>`
Returns: Deleted message object

#### GET /api/messages/stats
Get message statistics (protected)
Headers: `Authorization: Bearer <token>`
Returns: `{ total, new, read, resolved }`

### Content Endpoints

#### GET /api/content
Get all content sections (protected)
Headers: `Authorization: Bearer <token>`
Returns: Array of content objects

#### GET /api/content/:id
Get specific content by ID (protected)
Headers: `Authorization: Bearer <token>`
Returns: Single content object

#### POST /api/content
Create new content section (protected)
Headers: `Authorization: Bearer <token>`
```json
{
  "title": "Section Title",
  "description": "Description text",
  "additionalText": "Additional text"
}
```
Returns: Created content object

#### PUT /api/content/:id
Update content section (protected)
Headers: `Authorization: Bearer <token>`
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "additionalText": "Updated additional text"
}
```
Returns: Updated content object

#### DELETE /api/content/:id
Delete content section (protected)
Headers: `Authorization: Bearer <token>`
Returns: Deleted content object

## Project Structure

```
backend/
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── messages.js      # Messages CRUD routes
│   └── content.js       # Content management routes
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── data/                # In-memory data storage
├── server.js            # Express server setup
├── package.json         # Dependencies
└── .env                 # Environment variables
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected endpoints require:
```
Authorization: Bearer <token>
```

Token expires in 24 hours.

## Data Storage

Currently uses in-memory storage (replaces on server restart). For production:
- Replace with MongoDB, PostgreSQL, or other database
- Implement proper data persistence
- Add data validation

## CORS Configuration

Frontend CORS origin: `http://localhost:5173`
Modify in `server.js` if frontend runs on different port.

## Testing

Use tools like Postman or curl to test endpoints:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kprcas.com","password":"admin123"}'

# Create message
curl -X POST http://localhost:5000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","message":"Hello"}'

# Get messages with token
curl -X GET http://localhost:5000/api/messages \
  -H "Authorization: Bearer <your_token>"
```

## Next Steps

1. Replace in-memory storage with real database
2. Add input validation and error handling
3. Implement rate limiting
4. Add logging system
5. Setup production deployment
