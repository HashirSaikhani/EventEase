// routes/participantRoutes.js
const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');
const Event = require('../models/Event');
const Participant = require('../models/Participant');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Configure multer for CSV upload
const upload = multer({ dest: 'uploads/' });

// POST /api/participants/upload/:eventId
router.post('/upload/:eventId', verifyToken, upload.single('file'), async (req, res) => {
  const filePath = path.join(__dirname, '..', req.file.path);
  const eventId = req.params.eventId;

  const participants = [];
  const seenEmails = new Set(); // to track duplicates in CSV itself

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      if (row.name && row.email) {
        const emailLower = row.email.toLowerCase();
        if (!seenEmails.has(emailLower)) {
          participants.push({ name: row.name, email: emailLower, event: eventId });
          seenEmails.add(emailLower);
        }
      }
    })
    .on('end', async () => {
      try {
        
        
        // Check if the event exists and belongs to the current user
        const event = await Event.findOne({ _id: eventId, user: req.userId });
        if (!event) {
        return res.status(404).json({ msg: 'Event not found or not authorized' });
        }
          
        // Fetch existing emails for this event from DB
        const existingParticipants = await Participant.find({ 
          event: eventId, 
          email: { $in: participants.map(p => p.email) }
        });

        const existingEmails = new Set(existingParticipants.map(p => p.email));

        // Filter out emails that already exist in DB
        const newParticipants = participants.filter(p => !existingEmails.has(p.email));

        if (newParticipants.length > 0) {
          await Participant.insertMany(newParticipants);
        }

        fs.unlinkSync(filePath); // Clean up uploaded file

        res.status(201).json({ 
          msg: `${newParticipants.length} participants added`, 
          skipped: participants.length - newParticipants.length 
        });
      } catch (error) {
        res.status(500).json({ msg: 'Error saving participants', error });
      }
    })
    .on('error', (err) => {
      res.status(500).json({ msg: 'Error reading CSV file', err });
    });
});

// GET /api/participants/:eventId
// @desc Get all participants for a specific event, with validation
// @access Private
router.get('/:eventId', verifyToken, async (req, res) => {
  const { eventId } = req.params;

  // Check if eventId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ msg: 'Invalid event ID' });
  }

  try {
    // Check if the event exists and belongs to the current user
    const event = await Event.findOne({ _id: eventId, user: req.userId });
    if (!event) {
      return res.status(404).json({ msg: 'Event not found or not authorized' });
    }

    // Fetch participants for the event
    const participants = await Participant.find({ event: eventId }).sort({ name: 1 });
    res.json(participants);
  } catch (error) {
    res.status(500).json({ msg: 'Server error while fetching participants', error });
  }
});

router.delete('/delete/:eventId/:participantId', verifyToken, async (req, res) => {
  const { eventId, participantId } = req.params;

  try {
    // 1. Check if event exists and belongs to the logged-in user
    const event = await Event.findOne({ _id: eventId, user: req.userId });
    if (!event) {
      return res.status(404).json({ msg: 'Event not found or not authorized' });
    }

    // 2. Find and delete the participant under that event
    const deletedParticipant = await Participant.findOneAndDelete({
      _id: participantId,
      event: eventId
    });

    if (!deletedParticipant) {
      return res.status(404).json({ msg: 'Participant not found for this event' });
    }

    res.status(200).json({ msg: 'Participant deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
});


module.exports = router;
