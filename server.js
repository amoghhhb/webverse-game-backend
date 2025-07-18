   // server.js
   const express = require('express');
   const cors = require('cors');
   const app = express();
   const PORT = process.env.PORT || 5000;

   app.use(cors());
   app.use(express.json());

   // Simple API endpoint example
   app.get('/api/games', (req, res) => {
       res.json({ message: "Welcome to the game API!" });
   });

   app.listen(PORT, () => {
       console.log(`Server is running on http://localhost:${PORT}`);
   });
   