import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../services/api';
import { authors as mockAuthors } from '../data/mockData';
import '../styles/profile.css';

function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await userService.getProfile(id);
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user:', err);
        // Fallback to mock authors if backend unavailable
        const found = mockAuthors.find(a => a._id === id || a.name === id);
        if (found) {
          setUser({...found, articles: []});
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="error">User not found</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src={user.avatar} alt={user.name} className="profile-avatar" />
        <h1>{user.name}</h1>
        <p className="role">{user.role}</p>
        <p className="bio">{user.bio}</p>
        <div className="profile-stats">
          <div>
            <span className="stat-number">{user.articles?.length || 0}</span>
            <span>Articles</span>
          </div>
          <div>
            <span className="stat-number">{user.followers?.length || 0}</span>
            <span>Followers</span>
          </div>
          <div>
            <span className="stat-number">{user.following?.length || 0}</span>
            <span>Following</span>
          </div>
        </div>
      </div>

      {user.articles && user.articles.length > 0 && (
        <div className="profile-articles">
          <h2>Recent Articles</h2>
          <div className="articles-list">
            {user.articles.map(article => (
              <div key={article._id} className="article-item">
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
