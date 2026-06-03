// Server-side mock data fallback when MongoDB is unavailable
const categories = [
  { _id: '1', name: 'AI', slug: 'ai', description: 'Artificial intelligence news, models, and innovation updates.', icon: '🤖', color: '#7c3aed' },
  { _id: '2', name: 'Web', slug: 'web', description: 'Web development and frontend engineering.', icon: '🌐', color: '#2563eb' },
  { _id: '3', name: 'Mobile', slug: 'mobile', description: 'Mobile apps and device launches.', icon: '📱', color: '#f97316' }
];

const authors = [
  { _id: 'u1', name: 'Amina Okoro', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80' },
  { _id: 'u2', name: 'Samuel Njoroge', avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=160&q=80' }
];

const articles = [
  {
    _id: 'a1',
    title: 'AI-powered search is reshaping how developers work',
    slug: 'ai-powered-search-reshaping-developer-work',
    excerpt: 'A new wave of generative search tools is making web development faster.',
    content: 'Mock content',
    author: authors[0],
    category: categories[0],
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    featured: true,
    views: 1842,
    likes: 194,
    comments: 24,
    tags: ['AI','Search'],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'a2',
    title: 'Why progressive web apps are back in the spotlight',
    slug: 'why-progressive-web-apps-are-back',
    excerpt: 'Modern PWAs offer fast installable experiences that work across platforms.',
    content: 'Mock content',
    author: authors[1],
    category: categories[1],
    thumbnail: 'https://images.unsplash.com/photo-1523475496153-3d6cc6dbe8d8?auto=format&fit=crop&w=900&q=80',
    featured: true,
    views: 2560,
    likes: 215,
    comments: 30,
    tags: ['PWA','Web'],
    createdAt: new Date(Date.now()-86400000).toISOString()
  }
];

module.exports = { categories, authors, articles };
