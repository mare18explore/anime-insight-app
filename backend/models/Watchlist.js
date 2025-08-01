const mongoose = require('mongoose');
// each episode has season, ep number, and watched status
const EpisodeProgressSchema = new mongoose.Schema({
  season: Number,
  episode: Number,
  watched: Boolean
}, { _id: false });
const WatchlistSchema = new mongoose.Schema({
	// firebase id, each watchlist item tied to user using this id 
  userId: { type: String, required: true },

  // Store full anime object under 'anime'
  anime: { type: Object, required: true },
  // user episode progress (array)
  progress: [EpisodeProgressSchema],

  // watching | completed
  status: { type: String, default: 'watching' }
}, { timestamps: true });


module.exports = mongoose.model('Watchlist', WatchlistSchema);