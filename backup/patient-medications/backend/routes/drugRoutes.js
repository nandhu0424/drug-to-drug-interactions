const express = require('express');
const router = express.Router();
const Drug = require('../models/Drug');

// Get all drugs
router.get('/', async (req, res) => {
  try {
    const drugs = await Drug.find().sort({ name: 1 });
    res.json({ success: true, count: drugs.length, data: drugs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Search drugs by name or category
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, data: [] });

    const drugs = await Drug.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { genericName: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    }).limit(20);

    res.json({ success: true, data: drugs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get drug by ID
router.get('/:id', async (req, res) => {
  try {
    const drug = await Drug.findById(req.params.id);
    if (!drug) return res.status(404).json({ success: false, error: 'Drug not found' });
    res.json({ success: true, data: drug });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
