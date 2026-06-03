import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiHeart, FiShare2, FiEye, FiMessageCircle } from 'react-icons/fi';
import { articleService } from '../services/api';
import CommentSection from '../components/CommentSection';
import { articles as mockArticles } from '../data/mockData';
import '../styles/article-page.css';

function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await articleService.getBySlug(slug);
        setArticle(res.data);
      } catch (err) {
        console.error('Error fetching article:', err);
        const fallbackArticle = mockArticles.find((item) => item.slug === slug);
        setArticle(fallbackArticle || null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const handleLike = async () => {
    try {
      const res = await articleService.like(article._id);
      setLiked(res.data.liked);
      setArticle(prev => ({
        ...prev,
        likes: res.data.likes
      }));
    } catch (err) {
      console.error('Error liking article:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading article...</div>;
  }

  if (!article) {
    return <div className="error">Article not found</div>;
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="article-page">
      <article className="article-container">
        <div className="article-header">
          <h1>{article.title}</h1>
          <div className="article-info">
            <img 
              src={article.author?.avatar} 
              alt={article.author?.name}
              className="author-avatar"
            />
            <div>
              <p className="author-name">{article.author?.name}</p>
              <p className="article-date">{formatDate(article.createdAt)}</p>
            </div>
          </div>
        </div>

        <img src={article.thumbnail} alt={article.title} className="article-thumbnail" />

        <div className="article-meta-bar">
          <div className="meta-left">
            <span className="meta-item">
              <FiEye /> {article.views} views
            </span>
            <span className="meta-item">
              <FiMessageCircle /> {article.comments?.length || 0} comments
            </span>
          </div>
          <div className="meta-right">
            <button 
              className={`action-btn like-btn ${liked ? 'active' : ''}`}
              onClick={handleLike}
            >
              <FiHeart size={20} />
              <span>{article.likes}</span>
            </button>
            <button className="action-btn share-btn">
              <FiShare2 size={20} />
            </button>
          </div>
        </div>

        <div className="article-body">
          {article.content}
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="article-tags">
            {article.tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}

        {/* Author Bio */}
        <div className="author-bio">
          <img src={article.author?.avatar} alt={article.author?.name} />
          <div>
            <h3>{article.author?.name}</h3>
            <p>{article.author?.bio || 'Tech journalist and enthusiast'}</p>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection articleId={article._id} />
      </article>
    </div>
  );
}

export default ArticlePage;
