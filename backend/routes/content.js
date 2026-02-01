
const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// In-memory content store (replace with database in production)
let contentSections = [
  {
    id: 1,
    title: 'About Our College',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    additionalText: 'Our college offers excellent academic programs and student support services to help you succeed.'
  },
  {
    id: 2,
    title: 'Academic Programs',
    description: 'We offer a wide range of undergraduate and postgraduate programs designed to meet the needs of today\'s students.',
    additionalText: 'Each program is carefully crafted to provide hands-on learning experiences and industry-relevant skills.'
  },
  {
    id: 3,
    title: 'Student Support',
    description: 'Our dedicated team is committed to supporting your academic journey and personal growth outside the class.',
    additionalText: 'We provide tutoring, guidance, and mentoring programs to help you achieve your goals.'
  }
];

let contentIdCounter = 4;

// Get all content sections (protected)
router.get('/', authMiddleware, (req, res) => {
  res.json(contentSections);
});

// Get content by ID (protected)
router.get('/:id', authMiddleware, (req, res) => {
  const content = contentSections.find(c => c.id === parseInt(req.params.id));
  
  if (!content) {
    return res.status(404).json({ error: 'Content not found' });
  }

  res.json(content);
});

// Create new content section (protected)
router.post('/', authMiddleware, (req, res) => {
  try {
    const { title, description, additionalText } = req.body;

    if (!title || !description || !additionalText) {
      return res.status(400).json({ error: 'Title, description, and additionalText required' });
    }

    const newContent = {
      id: contentIdCounter++,
      title,
      description,
      additionalText
    };

    contentSections.push(newContent);
    res.status(201).json(newContent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create content' });
  }
});

// Update content section (protected)
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { title, description, additionalText } = req.body;
    const content = contentSections.find(c => c.id === parseInt(req.params.id));

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    if (title) content.title = title;
    if (description) content.description = description;
    if (additionalText) content.additionalText = additionalText;

    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Delete content section (protected)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const index = contentSections.findIndex(c => c.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ error: 'Content not found' });
    }

    const deletedContent = contentSections.splice(index, 1);
    res.json(deletedContent[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

module.exports = router;
