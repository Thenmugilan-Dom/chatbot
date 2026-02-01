const express = require('express');
const authMiddleware = require('../middleware/auth');
const supabase = require('../config/supabaseClient');
const router = express.Router();

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

    // Create or update user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert(
        { email, name: name || 'Guest', phone: phone || 'N/A' },
        { onConflict: 'email' }
      )
      .select();

    if (userError) {
      console.error('Error upserting user:', userError);
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
