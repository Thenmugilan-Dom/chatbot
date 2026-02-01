require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const authRoutes = require('./routes/auth');
const messagesRoutes = require('./routes/messages');
const contentRoutes = require('./routes/content');
const qaRoutes = require('./routes/qa');
const usersRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/users', usersRoutes);

// Endpoint to fetch college data
app.get('/data', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data.json');
    const collegeData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    res.json(collegeData);
  } catch (error) {
    console.error('Error reading data.json:', error);
    res.status(500).json({ error: 'Failed to load college data' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
