const crypto = require('crypto');

function setCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
}

function generateToken(payload) {
  // Simple JWT-like token generation
  // In production, use jsonwebtoken library
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'your_secret_key')
    .update(`${header}.${body}`)
    .digest('base64');

  return `${header}.${body}.${signature}`;
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Admin login endpoint
    if (req.method === 'POST' && req.url.includes('/login')) {
      const { email, password } = req.body;

      // Verify credentials
      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = generateToken({
          email,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        });

        return res.status(200).json({
          token,
          email,
          message: 'Login successful'
        });
      } else {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    // Verify token endpoint
    if (req.method === 'POST' && req.url.includes('/verify')) {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.slice(7);

      // Verify token (basic validation)
      try {
        const parts = token.split('.');
        if (parts.length !== 3) {
          return res.status(401).json({ error: 'Invalid token' });
        }

        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

        if (payload.exp < Math.floor(Date.now() / 1000)) {
          return res.status(401).json({ error: 'Token expired' });
        }

        return res.status(200).json({ valid: true, email: payload.email });
      } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Auth API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

