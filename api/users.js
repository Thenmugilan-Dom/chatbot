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
    // Get all users (protected)
    if (req.method === 'GET') {
      const token = verifyToken(req);
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    }

    // Create/upsert user (public)
    if (req.method === 'POST') {
      const { email, name, phone } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const { data, error } = await supabase
        .from('users')
        .upsert(
          {
            email,
            name: name || 'Guest',
            phone: phone || 'N/A',
            updated_at: new Date().toISOString()
          },
          { onConflict: 'email' }
        )
        .select();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(data[0]);
    }

    // Update user (protected)
    if (req.method === 'PATCH') {
      const token = verifyToken(req);
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { email, name, phone } = req.body;
      const userId = req.url.split('/')[2];

      const { data, error } = await supabase
        .from('users')
        .update({
          name: name || 'Guest',
          phone: phone || 'N/A',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(data[0]);
    }

    // Delete user (protected)
    if (req.method === 'DELETE') {
      const token = verifyToken(req);
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userId = req.url.split('/')[2];

      const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)
        .select();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(data[0]);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Users API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

