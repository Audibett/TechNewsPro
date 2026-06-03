import axios from 'axios';
import { articles as mockArticles } from '../data/mockData';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const articleService = {
  getAll: (page = 1, limit = 10, category = null, search = null) => {
    let url = `articles?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    if (search) url += `&search=${search}`;
    return api.get(url);
  },
  getFeatured: () => api.get('articles/featured'),
  getBySlug: (slug) => api.get(`articles/${slug}`),
  create: (data) => api.post('articles', data),
  update: (id, data) => api.put(`articles/${id}`, data),
  like: (id) => api.post(`articles/${id}/like`),
};

export const userService = {
  register: (data) => api.post('users/register', data),
  login: (data) => api.post('users/login', data),
  getMe: () => api.get('users/me'),
  getProfile: (id) => api.get(`users/${id}`),
  follow: (id) => api.post(`users/${id}/follow`),
};

export const commentService = {
  getByArticle: (articleId) => api.get(`comments/article/${articleId}`),
  create: (data) => api.post('comments', data),
  like: (id) => api.post(`comments/${id}/like`),
  delete: (id) => api.delete(`comments/${id}`),
};

export const categoryService = {
  getAll: () => api.get('categories'),
  getBySlug: (slug) => api.get(`categories/${slug}`),
};

export const newsService = {
  getTrending: () => api.get('news/trending'),
  search: (query, page = 1) => api.get(`news/search?q=${encodeURIComponent(query)}&page=${page}`)
};

export const predictionsService = {
  getAll: () => api.get('predictions'),
  getByCategory: (category) => api.get(`predictions/category/${category}`)
};

// Lightweight client-side search helpers with safe timeouts and local fallbacks

const timeout = (ms, promise) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
  ]);
};

export const searchService = {
  localSearch: (q) => {
    const ql = (q || '').toLowerCase();
    const results = mockArticles.filter(a => (
      a.title.toLowerCase().includes(ql) ||
      a.excerpt.toLowerCase().includes(ql) ||
      (a.tags || []).join(' ').toLowerCase().includes(ql)
    ));
    return Promise.resolve({ data: { articles: results } });
  },
  // Stubbed AI search: returns boosted mock results after a short delay
  aiSearch: async (q, opts = {}) => {
    try {
      await new Promise(r => setTimeout(r, 700));
      const res = await exports.searchService.localSearch(q);
      // pretend AI re-ranks results by views
      res.data.articles.sort((a,b) => (b.views||0) - (a.views||0));
      return res;
    } catch (e) {
      return { data: { articles: [] } };
    }
  },
  // Stubbed Web search: simulates an external aggregator with slightly longer latency
  webSearch: async (q, opts = {}) => {
    try {
      await new Promise(r => setTimeout(r, 1400));
      const res = await exports.searchService.localSearch(q);
      // pretend web adds more recent items first
      res.data.articles.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res;
    } catch (e) {
      return { data: { articles: [] } };
    }
  },
  // Quick combined search that races AI/Web/backend and falls back to local
  combinedSearch: async (q, { useAI=false, useWeb=false } = {}) => {
    const calls = [];
    if (useAI) calls.push(timeout(2200, exports.searchService.aiSearch(q)));
    if (useWeb) calls.push(timeout(2600, exports.searchService.webSearch(q)));
    // always include backend search as a candidate
    calls.push(timeout(3000, api.get(`articles?page=1&limit=24&search=${encodeURIComponent(q)}`)));

    try {
      const results = await Promise.any(calls.map(p => p.catch(() => null)));
      if (!results) return exports.searchService.localSearch(q);
      // normalize shape
      if (results.data?.articles) return results;
      if (results.data) return { data: { articles: results.data } };
      return exports.searchService.localSearch(q);
    } catch (e) {
      return exports.searchService.localSearch(q);
    }
  }
};
