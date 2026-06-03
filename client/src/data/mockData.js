const categories = [
  {
    _id: '1',
    name: 'AI',
    slug: 'ai',
    description: 'Artificial intelligence news, models, and innovation updates.',
    icon: '🤖',
    color: '#7c3aed'
  },
  {
    _id: '2',
    name: 'Web',
    slug: 'web',
    description: 'Web development, design systems, and frontend engineering.',
    icon: '🌐',
    color: '#2563eb'
  },
  {
    _id: '3',
    name: 'Mobile',
    slug: 'mobile',
    description: 'Mobile apps, device launches, and next-gen experiences.',
    icon: '📱',
    color: '#f97316'
  },
  {
    _id: '4',
    name: 'Security',
    slug: 'security',
    description: 'Cybersecurity alerts, privacy news, and protection trends.',
    icon: '🛡️',
    color: '#0f766e'
  },
  {
    _id: '5',
    name: 'Startups',
    slug: 'startups',
    description: 'Startup launches, funding rounds, and founder stories.',
    icon: '🚀',
    color: '#ec4899'
  }
];

const authors = [
  {
    _id: 'u1',
    name: 'Amina Okoro',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
    bio: 'Technology journalist covering AI, startups, and emerging platforms.'
  },
  {
    _id: 'u2',
    name: 'Samuel Njoroge',
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=160&q=80',
    bio: 'Product strategist writing on mobile growth and UX innovation.'
  },
  {
    _id: 'u3',
    name: 'Lina Mwende',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80',
    bio: 'Cybersecurity analyst delivering clear insight on digital risk.'
  }
];

const articles = [
  {
    _id: 'a1',
    title: 'AI-powered search is reshaping how developers work',
    slug: 'ai-powered-search-reshaping-developer-work',
    excerpt: 'A new wave of generative search tools is making web development faster while raising new questions about accuracy and trust.',
    content: `The next generation of developer tools is built on AI, helping teams search codebases and documentations more intelligently.

As more companies adopt these assistants, software teams are experimenting with hybrid workflows that combine human review and machine recommendations.

Key trends:
- AI suggestions that understand code context
- Real-time, collaborative assistant experiences
- Trust models for code generation`
    ,
    author: authors[0],
    category: categories[0],
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    featured: true,
    views: 1842,
    likes: 194,
    comments: 24,
    tags: ['AI', 'Search', 'Developers'],
    createdAt: '2026-06-03T08:00:00.000Z'
  },
  {
    _id: 'a2',
    title: 'Why progressive web apps are back in the spotlight',
    slug: 'why-progressive-web-apps-are-back',
    excerpt: 'Modern PWAs offer fast installable experiences that work across platforms, making them a smart choice for many digital products.',
    content: `Progressive web apps blend the best of mobile and web by offering offline support, push notifications, and native-like performance.

Companies are building PWAs for e-commerce, media, and enterprise workflows to reach users without app store friction.

What to watch:
- Battery-friendly app shells
- Improved page transitions
- Seamless sign-in across devices`
    ,
    author: authors[1],
    category: categories[1],
    thumbnail: 'https://images.unsplash.com/photo-1523475496153-3d6cc6dbe8d8?auto=format&fit=crop&w=900&q=80',
    featured: true,
    views: 2560,
    likes: 215,
    comments: 30,
    tags: ['PWA', 'Web', 'Experience'],
    createdAt: '2026-06-02T16:20:00.000Z'
  },
  {
    _id: 'a3',
    title: '5 breakthrough mobile features launching this year',
    slug: '5-breakthrough-mobile-features-launching-this-year',
    excerpt: 'From adaptive battery tech to on-device AI, mobile platforms are racing to deliver smarter experiences.',
    content: `The mobile ecosystem is evolving quickly. Vendors are integrating AI and health monitoring into everyday devices.

This year’s updates focus on personalization, stronger privacy, and deeper hardware/software integration.

Highlights include:
- on-device intelligence
- intelligent battery management
- improved accessibility features`
    ,
    author: authors[1],
    category: categories[2],
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
    featured: false,
    views: 1320,
    likes: 130,
    comments: 12,
    tags: ['Mobile', 'AI', 'Features'],
    createdAt: '2026-06-01T14:05:00.000Z'
  },
  {
    _id: 'a4',
    title: 'How startups are building trust in digital finance',
    slug: 'how-startups-are-building-trust-in-digital-finance',
    excerpt: 'New fintech startups are emphasizing transparency, security and community engagement to win customer loyalty.',
    content: `Investors are backing teams that can prove secure, compliant operations while offering fast user experiences.

A trust-first approach includes better onboarding, real-time alerts, and clear data policies.

Best practices:
- transparent transaction histories
- proactive fraud monitoring
- customer-first support`
    ,
    author: authors[0],
    category: categories[4],
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
    featured: false,
    views: 980,
    likes: 112,
    comments: 8,
    tags: ['Startups', 'Fintech', 'Trust'],
    createdAt: '2026-05-29T11:10:00.000Z'
  },
  {
    _id: 'a5',
    title: 'The rising cost of data breaches and how teams should respond',
    slug: 'rising-cost-of-data-breaches-and-team-response',
    excerpt: 'A stronger security posture starts with clear incident response, employee training and modern detection tools.',
    content: `Breaches are becoming more expensive and more common. Security leaders are shifting from prevention-only to detection-first strategies.

Successful organizations combine human expertise with automation and streamline communication across teams.

Key recommendations:
- run tabletop drills
- centralize security alerts
- audit third-party access`
    ,
    author: authors[2],
    category: categories[3],
    thumbnail: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=900&q=80',
    featured: false,
    views: 1505,
    likes: 164,
    comments: 22,
    tags: ['Security', 'Breaches', 'Response'],
    createdAt: '2026-05-28T09:30:00.000Z'
  }
];

export { categories, authors, articles };
export default { categories, authors, articles };
