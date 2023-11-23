const mongoose = require('mongoose');

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost/quiz', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a reference to the connection
const db = mongoose.connection;

// Handle connection events
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
