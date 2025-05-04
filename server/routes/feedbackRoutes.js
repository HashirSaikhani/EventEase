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
// GET /api/feedbacks/all - Admin gets all feedbacks
router.get('/', verifyToken, async (req, res) => {
  try {

    // Fetch all feedbacks, populating user details
    const feedbacks = await Feedback.find({})
      .populate('user', 'name email')  // Populating user details: name and email
      .sort({ createdAt: -1 });        // Sorting by newest first (createdAt)

    // Return all feedbacks
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
});

module.exports = router;
