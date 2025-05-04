const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is working ✅');
});

const eventRoutes = require("./routes/eventRoutes");
app.use("/api/events", eventRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const participantsRoutes = require('./routes/participantRoutes');
app.use('/api/participants', participantsRoutes);

const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/api/feedback', feedbackRoutes);

const emailRoutes = require('./routes/emailRoutes');
app.use('/api/email', emailRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});
