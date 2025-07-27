const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // load variables from .env file

// create express app
const app = express();

// apply middleware
// allows frontend to connect
app.use(cors());
app.use(express.json()); 

// connect to MongoDB using MONGO_URI from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// load watchlist routes
app.use('/api/watchlist', require('./routes/watchlist'));

// start server 
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});