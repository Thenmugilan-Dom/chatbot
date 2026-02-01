const express = require('express');
const authMiddleware = require('../middleware/auth');
const supabase = require('../config/supabaseClient');
const router = express.Router();

// Get all users (protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Get unique users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (usersError) {
      return res.status(500).json({ error: usersError.message });
    }

    // Get messages for each user
    const usersWithMessages = await Promise.all(
      users.map(async (user) => {
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('email', user.email);

        return {
          ...user,
          messages: messages || []
        };
      })
    );

    res.json(usersWithMessages);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID (protected)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get messages for this user
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('email', data.email);

    const userWithMessages = {
      ...data,
      messages: messages || []
    };

    res.json(userWithMessages);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create or update user (public)
router.post('/', async (req, res) => {
  try {
    const { email, name, phone } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const { data, error } = await supabase
      .from('users')
      .upsert(
        { email, name: name || 'Guest', phone: phone || 'N/A' },
        { onConflict: 'email' }
      )
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Delete user (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', req.params.id)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(data[0]);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get user statistics (protected)
router.get('/stats/overview', authMiddleware, async (req, res) => {
  try {
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id');

    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('id');

    const stats = {
      total_users: users?.length || 0,
      total_messages: messages?.length || 0
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
