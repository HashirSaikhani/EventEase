const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');
const Participant = require('../models/Participant');
const Event = require('../models/Event');
const verifyToken = require('../middleware/auth');

// Utility: Generate QR Code base64
const generateQRCode = async (text) => {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    throw new Error('QR Code generation failed');
  }
};

// Utility: Send Email with QR Code attachment
const sendEmailWithQR = async (participant, event, qrCodeBase64) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: participant.email,
    subject: `You're Invited: ${event.title}`,
    text: `Hello ${participant.name},

You're registered for "${event.title}" on ${event.date} at ${event.time}.

Please find your QR code attached.`,
    attachments: [
      {
        filename: 'event-qr.png',
        content: qrCodeBase64.split("base64,")[1],
        encoding: 'base64',
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

router.post('/send/:eventId', verifyToken, async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findOne({ _id: eventId, user: req.userId });
    if (!event) {
      return res.status(404).json({ msg: 'Event not found or not authorized' });
    }

    const participants = await Participant.find({ event: eventId });

    if (participants.length === 0) {
      return res.status(400).json({ msg: 'No participants to email' });
    }

    for (const participant of participants) {
      const qrData = `Name: ${participant.name}\nEmail: ${participant.email}\nEvent: ${event.title}`;
      const qrCode = await generateQRCode(qrData);
      await sendEmailWithQR(participant, event, qrCode);
    }

    res.status(200).json({ msg: `Emails sent to ${participants.length} participants` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to send emails', error });
  }
});

module.exports = router;
