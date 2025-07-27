const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
	// firebase id, each watchlist item tied to user using this id 
  userId: { type: String, required: true }, 
	// aniList anime id
  animeId: { type: Number, required: true },
	// nested object for aniem
  title: {
    romaji: String,
    english: String,
  },
  coverImage: {
    large: String
  }
}, 
// track when added 
{ timestamps: true });

module.exports = mongoose.model('Watchlist', WatchlistSchema);