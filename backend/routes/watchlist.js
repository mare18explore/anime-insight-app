const express = require('express');
const router = express.Router();
const Watchlist = require('../models/Watchlist');

// Fetch all anime in a user's watchlist, sorted by most recent
router.get('/:userId', async (req, res) => {
  try {
    // Find all items for this user and sort by newest first
    const list = await Watchlist.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

// Check if a specific anime is already in the user's watchlist
router.get('/check/:userId/:animeId', async (req, res) => {
  try {
    const { userId, animeId } = req.params;

    const exists = await Watchlist.findOne({ userId, 'anime.id': Number(animeId) });
    res.json({ exists: !!exists }); // return true or false
  } catch (err) {
    res.status(500).json({ error: 'Check failed' });
  }
});

// Add a new anime to the user's watchlist
router.post('/', async (req, res) => {
  try {
    const { userId, anime } = req.body;

    // Prevent duplicates — only one of each anime per user
     const exists = await Watchlist.findOne({ userId, 'anime.id': anime.id });
     // If the anime already exists in this user's watchlist, return a 409 Conflict
    if (exists) return res.status(409).json({ message: 'Anime already in watchlist' });

    // Create and save a new watchlist entry
    const newEntry = new Watchlist({
      userId,
      anime // store full object
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
});
// Toggle watched/unwatched for an episode
router.post('/progress/:userId/:animeId', async (req, res) => {
  const { season, episode, watched } = req.body;

  try {
    const item = await Watchlist.findOne({
      userId: req.params.userId,
      // anime.id is a number
      'anime.id': parseInt(req.params.animeId) 
    });

    if (!item) return res.status(404).json({ error: 'Watchlist item not found' });

    // Check if this episode already has progress recorded
    const existing = item.progress.find(p => p.season === season && p.episode === episode);

    if (existing) {
      existing.watched = watched;
    } else {
      item.progress.push({ season, episode, watched });
    }
    // Save updated progress back to database
    await item.save();
    res.json({ message: 'Progress updated', progress: item.progress });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});


// Remove a specific anime from a user's watchlist
router.delete('/:userId/:animeId', async (req, res) => {
  try {
    const { userId, animeId } = req.params;

    await Watchlist.deleteOne({ userId, 'anime.id': Number(animeId) });
    res.json({ message: 'Removed from watchlist' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
});
// Set the anime's status to "completed" for this user
router.post('/complete/:userId/:animeId', async (req, res) => {
  try {
    const { userId, animeId } = req.params;

    const item = await Watchlist.findOne({
      userId,
      'anime.id': Number(animeId)
    });

    if (!item) return res.status(404).json({ error: 'Watchlist item not found' });

    item.status = 'completed';
    await item.save();

    res.json({ message: 'Marked as completed' });
  } catch (err) {
    console.error('Error marking completed:', err);
    res.status(500).json({ error: 'Failed to mark completed' });
  }
});

module.exports = router;