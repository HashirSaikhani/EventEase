const express = require('express');
const Feedback = require('../models/Feedback');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/feedback
// @desc    Add new feedback
// @access  Private
router.post('/add', verifyToken, async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ msg: 'Description is required' });
  }

  try {
    const feedback = new Feedback({
      user: req.userId,
      description
    });

    await feedback.save();
    res.status(201).json({ msg: 'Feedback submitted', feedback });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
});

// @route   GET /api/feedback
// @desc    Get all feedback by the logged-in user
// @access  Private
router.get('/', verifyToken, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
});

module.exports = router;
