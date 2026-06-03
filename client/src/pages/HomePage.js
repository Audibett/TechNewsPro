import React, { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard';
import { newsService, predictionsService } from '../services/api';
import '../styles/home.css';
import { useLocation } from 'react-router-dom';

function HomePage() {
  const [trending, setTrending] = useState([]);
  const [articles, setArticles] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchParam = params.get('search') || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const timeout = (ms, promise) => {
          return Promise.race([
            promise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
          ]);
        };

        if (searchParam) {
          // Search mode
          try {
            const searchRes = await timeout(5000, newsService.search(searchParam, page));
            setArticles(searchRes.data?.articles || []);
            setTotalPages(searchRes.data?.pages || 1);
            setTrending([]);
          } catch (err) {
            setError('Search unavailable. Showing local results.');
            setArticles([]);
          }
        } else {
          // Trending mode - fetch real articles and predictions
          try {
            const [newsRes, predictRes] = await Promise.all([
              timeout(4000, newsService.getTrending()),
              timeout(3000, predictionsService.getAll())
            ]);

            setTrending(newsRes.data?.articles?.slice(0, 3) || []);
            setArticles(newsRes.data?.articles?.slice(3, 15) || []);
            setTotalPages(Math.ceil((newsRes.data?.total || 12) / 12));
            setPredictions(predictRes.data?.predictions || []);
          } catch (err) {
            setError('News service temporarily unavailable.');
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Unable to load content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, searchParam]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const pageNumbers = [];
  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, page + 2);
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (loading && page === 1) {
    return <div className="loading">⏳ Loading latest news and insights...</div>;
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-label">Real-time Tech Intelligence</div>
          <h1>Breaking news. AI predictions. Expert insights.</h1>
          <p>Stay ahead with real-time technology news, advanced AI-powered predictions, and curated insights for developers, founders, and tech leaders.</p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => window.scrollTo(0, window.innerHeight)}>Read Latest</button>
            <button className="btn btn-secondary">Subscribe</button>
          </div>
        </div>
        <div className="hero-preview">
          <div className="hero-card hero-card-large">
            <div className="hero-card-tag">🚀 AI Predictions</div>
            <h3>ML models predicting next quarter's trends with 87% accuracy.</h3>
            <p>Advanced forecasting reveals emerging technologies and market shifts before they happen.</p>
          </div>
          <div className="hero-card-group">
            <div className="hero-card hero-card-small">
              <div className="hero-card-tag">📊 Live Data</div>
              <p>Real-time news feed updated every 5 minutes.</p>
            </div>
            <div className="hero-card hero-card-small">
              <div className="hero-card-tag">🔮 Future</div>
              <p>Predictive analytics for tech investments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="category-pill-section">
        <div className="section-heading">
          <h2>Explore Topics</h2>
          <p>Navigate by technology category or search for specific topics.</p>
        </div>
        <div className="category-pill-row">
          {mockCategories.map((category) => (
            <div key={category.slug} className="category-pill" style={{ borderColor: category.color }}>
              <span className="category-icon">{category.icon}</span>
              <div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Predictions Section */}
      {predictions.length > 0 && !searchParam && (
        <section className="predictions-section">
          <div className="section-heading">
            <h2>🔮 AI-Powered Predictions</h2>
            <p>Machine learning models forecast emerging technologies and market trends.</p>
          </div>
          <div className="predictions-grid">
            {predictions.slice(0, 3).map((pred, idx) => (
              <div key={idx} className="prediction-card">
                <div className="prediction-header">
                  <h3>{pred.title}</h3>
                  <div className="confidence-badge" style={{ opacity: pred.confidence / 100 }}>
                    {pred.confidence}% Confident
                  </div>
                </div>
                <p className="prediction-desc">{pred.description}</p>
                <div className="prediction-meta">
                  <span>🎯 {pred.horizon}</span>
                  <span>💪 Momentum: {pred.trendStrength}</span>
                </div>
                <div className="prediction-signals">
                  {pred.signals?.slice(0, 2).map((signal, i) => (
                    <span key={i} className="signal-tag">{signal}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {error && (
        <div style={{maxWidth:1200,margin:'8px auto 24px',padding:'12px 16px',borderRadius:12,background:'rgba(255,200,200,0.9)',color:'#8b0000',textAlign:'center',fontSize:14}}>
          ⚠️ {error}
        </div>
      )}

      {/* Trending Stories */}
      {trending.length > 0 && !searchParam && (
        <section className="featured-section">
          <div className="section-heading">
            <h2>🔥 Trending Now</h2>
            <p>Most viewed stories this hour.</p>
          </div>
          <div className="featured-grid">
            {trending.map(article => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Articles */}
      <section className="articles-section">
        <div className="section-heading">
          <h2>{searchParam ? '🔍 Search Results' : '📰 Latest News'}</h2>
          <p>{searchParam ? `Showing results for "${searchParam}"` : 'Fresh coverage from the world of technology, updated every 5 minutes.'}</p>
        </div>
        {articles.length > 0 ? (
          <>
            <div className="articles-grid">
              {articles.map(article => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>

            {/* Numbered Pagination */}
            <div className="pagination">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="btn btn-secondary btn-icon-left"
              >
                ← Previous
              </button>

              <div className="page-numbers">
                {page > 3 && (
                  <>
                    <button onClick={() => handlePageChange(1)} className="page-btn">1</button>
                    <span className="page-ellipsis">...</span>
                  </>
                )}
                {pageNumbers.map(num => (
                  <button
                    key={num}
                    onClick={() => handlePageChange(num)}
                    className={`page-btn ${num === page ? 'active' : ''}`}
                  >
                    {num}
                  </button>
                ))}
                {page < totalPages - 2 && (
                  <>
                    <span className="page-ellipsis">...</span>
                    <button onClick={() => handlePageChange(totalPages)} className="page-btn">{totalPages}</button>
                  </>
                )}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="btn btn-secondary btn-icon-right"
              >
                Next →
              </button>
            </div>

            <div className="page-info-center">
              Page {page} of {totalPages}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--subtext)' }}>
            No articles found. Try a different search.
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
