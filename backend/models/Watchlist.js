const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
	// firebase id, each watchlist item tied to user using this id 
  userId: { type: String, required: true },

  // Store full anime object under 'anime'
  anime: { type: Object, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Watchlist', WatchlistSchema);