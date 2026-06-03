import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { categoryService, articleService } from '../services/api';
import { categories as mockCategories, articles as mockArticles } from '../data/mockData';
import '../styles/category-page.css';

function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, artRes] = await Promise.all([
          categoryService.getBySlug(slug),
          articleService.getAll(1, 20, slug)
        ]);
        setCategory(catRes.data);
        setArticles(artRes.data.articles);
      } catch (err) {
        console.error('Error fetching data:', err);
        const categoryData = mockCategories.find((item) => item.slug === slug);
        setCategory(categoryData || null);
        setArticles(mockArticles.filter((article) => article.category.slug === slug));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return <div className="loading">Loading category...</div>;
  }

  if (!category) {
    return <div className="error">Category not found</div>;
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <div className="category-icon">{category.icon}</div>
        <h1>{category.name}</h1>
        <p>{category.description}</p>
      </div>

      <div className="category-controls">
        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="latest">Latest</option>
            <option value="popular">Most Popular</option>
            <option value="trending">Trending</option>
          </select>
        </div>
      </div>

      <div className="articles-grid">
        {articles.map(article => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>

      {articles.length === 0 && (
        <div className="no-articles">
          <p>No articles found in this category</p>
        </div>
      )}
    </div>
  );
}

export default CategoryPage;
