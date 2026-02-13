const express = require('express');
const authMiddleware = require('../middleware/auth');
const supabase = require('../config/supabaseClient');
const router = express.Router();

// Get chatbot messages (protected) - Must be before /stats route
router.get('/chatbot/all', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('chatbot_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching chatbot messages:', error);
    res.status(500).json({ error: 'Failed to fetch chatbot messages' });
  }
});

// Save chatbot message (public)
router.post('/chatbot/save', async (req, res) => {
  try {
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

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error saving chatbot message:', error);
    res.status(500).json({ error: 'Failed to save chatbot message' });
  }
});

// Get all messages (protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get statistics (protected) - Must be before /:id route
router.get('/stats', authMiddleware, async (req, res) => {
  try {
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

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get message by ID (protected)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

// Create new message (public)
router.post('/', async (req, res) => {
  try {
    const { email, message, name, phone } = req.body;

    if (!email || !message) {
      return res.status(400).json({ error: 'Email and message required' });
    }

    // Create or update user with proper error handling
    const { data: userData, error: userError } = await supabase
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

    if (userError) {
      console.error('Error upserting user:', userError);
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

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// Update message status (protected)
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'read', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await supabase
      .from('messages')
      .update({ status, updated_at: new Date() })
      .eq('id', req.params.id)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(data[0]);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Delete message (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .delete()
      .eq('id', req.params.id)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(data[0]);
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;
