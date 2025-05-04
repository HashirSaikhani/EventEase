const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: String,
    required: true,
    match: /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
  },
  time: {
    type: String,
    required: true,
    match: /^\d{2}:\d{2} (AM|PM)$/, // e.g., 09:15 AM
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Event", eventSchema);
