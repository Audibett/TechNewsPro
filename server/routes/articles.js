const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const Category = require('../models/Category');
const { articles: mockArticles } = require('../mockData');
const { auth } = require('../middleware/auth');

// Get all articles with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;

    let query = { published: true };

    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) query.category = cat._id;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .populate('author', 'name avatar')
      .populate('category', 'name slug icon')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    res.json({
      articles,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    // If DB is unavailable, return mock paginated results
    if (err && /buffering timed out|timeout/.test(err.message)) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const start = (page - 1) * limit;
      const slice = mockArticles.slice(start, start + limit);
      return res.json({ articles: slice, total: mockArticles.length, pages: Math.ceil(mockArticles.length/limit), currentPage: page });
    }
    res.status(500).json({ message: err.message });
  }
});

// Get featured articles
router.get('/featured', async (req, res) => {
  try {
    const articles = await Article.find({ published: true, featured: true })
      .populate('author', 'name avatar')
      .populate('category', 'name slug icon')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json(articles);
  } catch (err) {
    if (err && /buffering timed out|timeout/.test(err.message)) {
      return res.json(mockArticles.filter(a => a.featured));
    }
    res.status(500).json({ message: err.message });
  }
});

// Get single article
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug })
      .populate('author', 'name avatar bio')
      .populate('category', 'name slug icon')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name avatar' }
      });

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Increment views
    article.views += 1;
    await article.save();

    res.json(article);
  } catch (err) {
    if (err && /buffering timed out|timeout/.test(err.message)) {
      const found = mockArticles.find(a => a.slug === req.params.slug);
      if (found) return res.json(found);
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(500).json({ message: err.message });
  }
});

// Create article (authenticated)
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, excerpt, category, thumbnail, tags } = req.body;

    const article = new Article({
      title,
      content,
      excerpt,
      category,
      thumbnail,
      tags: tags || [],
      author: req.userId
    });

    const savedArticle = await article.save();
    await savedArticle.populate('author category');

    res.status(201).json(savedArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update article (authenticated)
router.put('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    if (article.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(article, req.body);
    const updatedArticle = await article.save();

    res.json(updatedArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Like article
router.post('/:id/like', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const likeIndex = article.likedBy.indexOf(req.userId);

    if (likeIndex === -1) {
      article.likedBy.push(req.userId);
      article.likes += 1;
    } else {
      article.likedBy.splice(likeIndex, 1);
      article.likes -= 1;
    }

    await article.save();
    res.json({ likes: article.likes, liked: likeIndex === -1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
