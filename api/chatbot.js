const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function setCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
}

function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Get all chatbot messages (protected)
    if (req.method === 'GET' && req.url.includes('/all')) {
      const token = verifyToken(req);
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { data, error } = await supabase
        .from('chatbot_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    }

    // Save chatbot message (public)
    if (req.method === 'POST' && req.url.includes('/save')) {
      const { user_email, user_name, user_phone, message, message_type } = req.body;

      if (!user_email || !message) {
        return res.status(400).json({ error: 'Email and message required' });
      }

      const { data, error } = await supabase
        .from('chatbot_messages')
        .insert([
          {
            user_email,
            user_name: user_name || 'Guest',
            user_phone: user_phone || 'N/A',
            message,
            message_type: message_type || 'user'
          }
        ])
        .select();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(data[0]);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Chatbot API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

