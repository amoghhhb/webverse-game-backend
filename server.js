const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webverse-game', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Player schema
const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  timeTaken: { type: Number, required: true }, // in seconds
  score: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Player = mongoose.model('Player', playerSchema);

// Submit score endpoint
app.post('/api/leaderboard', async (req, res) => {
  try {
    const { name, department, timeTaken, score } = req.body;
    
    if (!name || !department || !timeTaken || !score) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newPlayer = new Player({
      name,
      department,
      timeTaken,
      score,
    });

    await newPlayer.save();
    res.status(201).json({ message: 'Score submitted successfully' });
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get leaderboard endpoint
app.get('/api/leaderboard', async (req, res) => {
  try {
    // Get all players sorted by timeTaken (ascending) and then by createdAt (ascending)
    const players = await Player.find()
      .sort({ timeTaken: 1, createdAt: 1 })
      .limit(100); // Limit to top 100 players

    // Add rank and formatted time to each player
    const leaderboard = players.map((player, index) => ({
      rank: index + 1,
      name: player.name,
      department: player.department,
      timeTaken: player.timeTaken,
      timeFormatted: formatTime(player.timeTaken),
      score: player.score,
      createdAt: player.createdAt,
    }));

    res.json({ leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to format time
function formatTime(seconds) {
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});