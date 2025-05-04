const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true }); // Automatically includes createdAt and updatedAt

module.exports = mongoose.model('Feedback', feedbackSchema);
