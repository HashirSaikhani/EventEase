const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const verifyToken = require("../middleware/auth"); // To protect the route

// @route   POST /api/events/add
// @desc    Create a new event
// @access  Private
router.post("/add", verifyToken, async (req, res) => {
  const { title, description, date, time, location } = req.body;

  if (!title || !date || !time || !location) {
    return res.status(400).json({ msg: "Please fill all required fields" });
  }

  try {
    const existingEvent = await Event.findOne({ title, user: req.userId });
    if (existingEvent) {
      return res.status(400).json({ msg: "Event with this title already exists" });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      time,
      location,
      user: req.userId,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

// @route   GET /api/events
// @desc    Get all events for the logged-in user
// @access  Private
router.get("/", verifyToken, async (req, res) => {
  try {

    const events = await Event.find({ user: req.userId }).sort({ date: 1 });

    if (!events || events.length === 0) {
      return res.status(404).json({ msg: "No events found for this user" });
    }

    res.status(200).json({
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
});


// @route   GET /api/events/:id
// @desc    Get a single event by ID
// @access  Private
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, user: req.userId });
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

// @route   PUT /api/events/:id
// @desc    Update an event by ID (except title)
// @access  Private
router.put("/:id", verifyToken, async (req, res) => {
  const { title, description, date, time, location } = req.body;

  // Disallow title updates
  if (title) {
    return res.status(400).json({ msg: "Title cannot be updated" });
  }

  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { description, date, time, location },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ msg: "Event not found or not authorized" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});


// @route   DELETE /api/events/:id
// @desc    Delete an event by ID
// @access  Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, user: req.userId });

    if (!event) {
      return res.status(404).json({ msg: "Event not found or not authorized" });
    }

    res.json({ msg: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

module.exports = router;
