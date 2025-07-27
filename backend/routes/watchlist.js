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

    const exists = await Watchlist.findOne({ userId, animeId });
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
    const exists = await Watchlist.findOne({ userId, animeId: anime.id });
    if (exists) return res.status(409).json({ message: 'Anime already in watchlist' });

    // Create and save a new watchlist entry
    const newEntry = new Watchlist({
      userId,
      animeId: anime.id,
      title: anime.title,
      coverImage: anime.coverImage
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
});

// Remove a specific anime from a user's watchlist
router.delete('/:userId/:animeId', async (req, res) => {
  try {
    const { userId, animeId } = req.params;

    await Watchlist.deleteOne({ userId, animeId });
    res.json({ message: 'Removed from watchlist' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
});

module.exports = router;