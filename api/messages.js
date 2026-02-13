const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Middleware to enable CORS
function setCors(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
}

// Verify JWT Token
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
    // Route to get all messages
    if (req.method === 'GET' && !req.url.includes('stats') && !req.url.includes('chatbot')) {
      const token = verifyToken(req);
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    }

    // Route to create message
    if (req.method === 'POST' && !req.url.includes('chatbot')) {
      const { email, message, name, phone } = req.body;

      if (!email || !message) {
        return res.status(400).json({ error: 'Email and message required' });
      }

      // Upsert user
      const { error: userError } = await supabase
        .from('users')
        .upsert(
          {
            email,
            name: name || 'Guest',
            phone: phone || 'N/A',
            updated_at: new Date().toISOString()
          },
          { onConflict: 'email' }
        );

      if (userError) {
        return res.status(400).json({ error: 'Failed to save user data' });
      }

      // Create message
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            email,
            name: name || 'Guest',
            phone: phone || 'N/A',
            message,
            status: 'new'
          }
        ])
        .select();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(data[0]);
    }

    // Route to get stats
    if (req.method === 'GET' && req.url.includes('stats')) {
      const token = verifyToken(req);
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { data, error } = await supabase
        .from('messages')
        .select('status');

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const stats = {
        total: data.length,
        new: data.filter(m => m.status === 'new').length,
        read: data.filter(m => m.status === 'read').length,
        resolved: data.filter(m => m.status === 'resolved').length
      };

      return res.status(200).json(stats);
    }

    // Route to update message status
    if (req.method === 'PATCH' && req.url.includes('status')) {
      const token = verifyToken(req);
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { status } = req.body;
      const messageId = req.url.split('/')[2];

      if (!['new', 'read', 'resolved'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const { data, error } = await supabase
        .from('messages')
        .update({ status, updated_at: new Date() })
        .eq('id', messageId)
        .select();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Message not found' });
      }

      return res.status(200).json(data[0]);
    }

    // Route to delete message
    if (req.method === 'DELETE') {
      const token = verifyToken(req);
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const messageId = req.url.split('/')[2];

      const { data, error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .select();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Message not found' });
      }

      return res.status(200).json(data[0]);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

