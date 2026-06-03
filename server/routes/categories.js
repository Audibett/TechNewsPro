const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { categories: mockCategories } = require('../mockData');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('articles', 'title slug thumbnail');

    res.json(categories);
  } catch (err) {
    if (err && /buffering timed out|timeout/.test(err.message)) {
      return res.json(mockCategories);
    }
    res.status(500).json({ message: err.message });
  }
});

// Get single category
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate('articles');

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (err) {
    if (err && /buffering timed out|timeout/.test(err.message)) {
      const found = mockCategories.find(c => c.slug === req.params.slug);
      if (found) return res.json(found);
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
