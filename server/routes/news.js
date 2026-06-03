const express = require('express');
const router = express.Router();
const axios = require('axios');

const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const NEWSAPI_BASE = process.env.NEWSAPI_BASE_URL || 'https://newsapi.org/v2';

// Cache for news to reduce API calls
let newsCache = { data: [], timestamp: 0, ttl: 3600000 }; // 1 hour TTL

// Get trending articles from real news API
router.get('/trending', async (req, res) => {
  try {
    const now = Date.now();
    if (newsCache.data.length && (now - newsCache.timestamp) < newsCache.ttl) {
      return res.json({ articles: newsCache.data, cached: true });
    }

    const response = await axios.get(`${NEWSAPI_BASE}/top-headlines`, {
      params: {
        country: 'us',
        category: 'technology',
        pageSize: 50,
        apiKey: NEWSAPI_KEY,
        sortBy: 'popularity'
      },
      timeout: 2000
    });

    const articles = response.data.articles.map((article, idx) => ({
      _id: `news_${idx}`,
      title: article.title,
      slug: article.url.split('/').pop().slice(0, 50),
      excerpt: article.description || article.content?.slice(0, 150) || 'Read more for details.',
      content: article.content || article.description || 'Full article content.',
      author: { _id: 'real_author', name: article.author || 'News Correspondent', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80' },
      category: { _id: 'tech', name: 'Technology', slug: 'technology', icon: '📰', color: '#7c3aed' },
      thumbnail: article.urlToImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
      featured: idx < 3,
      views: Math.floor(Math.random() * 3000) + 500,
      likes: Math.floor(Math.random() * 400) + 50,
      comments: Math.floor(Math.random() * 50) + 5,
      tags: ['Technology', 'News', 'Latest'],
      createdAt: new Date(article.publishedAt || Date.now()).toISOString(),
      source: article.source?.name || 'News Source'
    }));

    newsCache.data = articles;
    newsCache.timestamp = now;

    res.json({ articles, cached: false, total: articles.length });
  } catch (err) {
    console.error('NewsAPI error:', err.message);
    // Fallback to mock data if API fails
    const { articles: mockArticles } = require('../mockData');
    res.json({ articles: mockArticles, cached: false, error: 'News API unavailable, showing cached results' });
  }
});

// Search news by query
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1 } = req.query;
    if (!q) return res.status(400).json({ message: 'Search query required' });

    const response = await axios.get(`${NEWSAPI_BASE}/everything`, {
      params: {
        q: q,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 20,
        page: page,
        apiKey: NEWSAPI_KEY
      },
      timeout: 2000
    });

    const articles = response.data.articles.map((article, idx) => ({
      _id: `search_${page}_${idx}`,
      title: article.title,
      slug: article.url.split('/').pop().slice(0, 50),
      excerpt: article.description || 'Read more.',
      content: article.content || article.description,
      author: { _id: 'author', name: article.author || 'Correspondent', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80' },
      category: { _id: 'tech', name: 'Technology', slug: 'technology' },
      thumbnail: article.urlToImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
      featured: false,
      views: Math.floor(Math.random() * 2000) + 300,
      likes: Math.floor(Math.random() * 300) + 20,
      tags: [q, 'Technology', 'Trending'],
      createdAt: article.publishedAt,
      source: article.source?.name
    }));

    res.json({
      articles,
      total: response.data.totalResults,
      page: page,
      pageSize: 20,
      pages: Math.ceil(response.data.totalResults / 20)
    });
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ message: 'Search unavailable', error: err.message });
  }
});

module.exports = router;
