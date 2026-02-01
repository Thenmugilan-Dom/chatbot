const express = require('express');
const authMiddleware = require('../middleware/auth');
const supabase = require('../config/supabaseClient');
const router = express.Router();

// Get all Q&A pairs (public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Error reading Q&A pairs:', error);
    res.status(500).json({ error: 'Failed to load Q&A pairs' });
  }
});

// Get single Q&A pair by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Q&A pair not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error reading Q&A pair:', error);
    res.status(500).json({ error: 'Failed to load Q&A pair' });
  }
});

// Create new Q&A pair (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer required' });
    }

    const { data, error } = await supabase
      .from('faqs')
      .insert([{ question, answer }])
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating Q&A pair:', error);
    res.status(500).json({ error: 'Failed to create Q&A pair' });
  }
});

// Update Q&A pair (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer required' });
    }

    const { data, error } = await supabase
      .from('faqs')
      .update({ question, answer, updated_at: new Date() })
      .eq('id', req.params.id)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Q&A pair not found' });
    }

    res.json(data[0]);
  } catch (error) {
    console.error('Error updating Q&A pair:', error);
    res.status(500).json({ error: 'Failed to update Q&A pair' });
  }
});

// Delete Q&A pair (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', req.params.id)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Q&A pair not found' });
    }

    res.json(data[0]);
  } catch (error) {
    console.error('Error deleting Q&A pair:', error);
    res.status(500).json({ error: 'Failed to delete Q&A pair' });
  }
});

module.exports = router;
