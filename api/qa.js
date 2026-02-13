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
    // Get all FAQs (public)
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    }

    // Create FAQ (protected)
    if (req.method === 'POST') {
      const token = verifyToken(req);
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { question, answer } = req.body;

      if (!question || !answer) {
        return res.status(400).json({ error: 'Question and answer are required' });
      }

      const { data, error } = await supabase
        .from('faqs')
        .insert([
          {
            question,
            answer
          }
        ])
        .select();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(data[0]);
    }

    // Update FAQ (protected)
    if (req.method === 'PATCH') {
      const token = verifyToken(req);
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { question, answer } = req.body;
      const faqId = req.url.split('/')[2];

      const { data, error } = await supabase
        .from('faqs')
        .update({
          question,
          answer,
          updated_at: new Date().toISOString()
        })
        .eq('id', faqId)
        .select();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'FAQ not found' });
      }

      return res.status(200).json(data[0]);
    }

    // Delete FAQ (protected)
    if (req.method === 'DELETE') {
      const token = verifyToken(req);
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const faqId = req.url.split('/')[2];

      const { data, error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', faqId)
        .select();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'FAQ not found' });
      }

      return res.status(200).json(data[0]);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('QA API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

