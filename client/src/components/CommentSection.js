import React, { useState, useEffect } from 'react';
import { FiHeart, FiArrowRight } from 'react-icons/fi';
import { commentService } from '../services/api';
import '../styles/comments.css';

function CommentSection({ articleId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await commentService.getByArticle(articleId);
        setComments(res.data);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchComments();
  }, [articleId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to comment');
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    try {
      setLoading(true);
      const res = await commentService.create({
        content: newComment,
        article: articleId
      });

      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comments-section">
      <h3>Comments ({comments.length})</h3>

      {user ? (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows="4"
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p className="login-prompt">
          <a href="/login">Login</a> to comment
        </p>
      )}

      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment._id} className="comment">
            <img 
              src={comment.author?.avatar} 
              alt={comment.author?.name}
              className="comment-avatar"
            />
            <div className="comment-content">
              <p className="comment-author">{comment.author?.name}</p>
              <p className="comment-text">{comment.content}</p>
              <div className="comment-actions">
                <button className="action-btn">
                  <FiHeart size={16} /> {comment.likes} Likes
                </button>
                <button className="action-btn">
                  <FiArrowRight size={16} /> Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;
