const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Root route
app.get('/', (req, res) => {
  res.send('✅ Backend is running on Railway!');
});

// Example API route
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
