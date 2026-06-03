import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiEye } from 'react-icons/fi';
import '../styles/article-card.css';


function ArticleCard({ article }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Link to={`/article/${article.slug}`} className="article-card">
      <div className="article-image">
        <img
          src={article.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80'}
          alt={article.title}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"><rect width="100%" height="100%" fill="%23eef2ff"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%234f46e5" font-family="Arial, Helvetica, sans-serif" font-size="32">TechNews Pro</text></svg>'; }}
        />
        <span className="category-badge">{article.category?.name}</span>
      </div>
      <div className="article-content">
        <h3 className="article-title">{article.title}</h3>
        <p className="article-excerpt">{article.excerpt}</p>
        <div className="article-meta">
          <span className="meta-item" style={{display:'flex',alignItems:'center',gap:8}}>
            <img src={article.author?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80'} alt={article.author?.name || 'A'} style={{width:20,height:20,borderRadius:999,objectFit:'cover'}} />
            <span>{article.author?.name || 'Anonymous'}</span>
          </span>
          <span className="meta-item">
            <FiCalendar size={16} />
            {formatDate(article.createdAt)}
          </span>
          <span className="meta-item">
            <FiEye size={16} />
            {article.views} views
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ArticleCard;
