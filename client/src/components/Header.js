import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMoon, FiSun, FiLogOut, FiUser, FiMenu, FiX } from 'react-icons/fi';
import '../styles/header.css';

function Header({ darkMode, setDarkMode, user, setUser }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [useAI, setUseAI] = useState(false);
  const [useWeb, setUseWeb] = useState(false);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('search', searchQuery.trim());
      if (useAI) params.set('ai', '1');
      if (useWeb) params.set('web', '1');
      navigate(`/?${params.toString()}`);
      setSearchQuery('');
      setSuggestions([]);
    }
  };

  // Suggestion debounce: local quick suggestions using mockData via client-side filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    setLoadingSuggest(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // local quick filter
      import('../data/mockData').then(mod => {
        const q = searchQuery.toLowerCase();
        const res = mod.articles.filter(a => a.title.toLowerCase().includes(q)).slice(0,5);
        setSuggestions(res);
        setLoadingSuggest(false);
      });
    }, 260);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">📰</span>
          <span className="logo-text">TechNews Pro</span>
        </Link>

        <nav className={`nav ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/category/ai" className="nav-item">AI</Link>
          <Link to="/category/web" className="nav-item">Web</Link>
          <Link to="/category/mobile" className="nav-item">Mobile</Link>
          <Link to="/category/security" className="nav-item">Security</Link>
          <Link to="/category/startups" className="nav-item">Startups</Link>
        </nav>

        <div className="header-actions">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <FiSearch size={20} />
            </button>
          </form>
          <div style={{position:'relative'}}>
            {suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map(s => (
                  <div key={s._id} className="suggestion-item" onClick={() => { setSearchQuery(''); navigate(`/?search=${s.title}`); setSuggestions([]); }}>
                    <strong>{s.title}</strong>
                    <div style={{fontSize:12,color:'var(--subtext)'}}>{s.excerpt.slice(0,90)}...</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{display:'flex',alignItems:'center',gap:8,marginLeft:8}}>
            <label style={{fontSize:12,color:'var(--subtext)'}}><input type="checkbox" checked={useAI} onChange={(e)=>setUseAI(e.target.checked)} /> AI</label>
            <label style={{fontSize:12,color:'var(--subtext)'}}><input type="checkbox" checked={useWeb} onChange={(e)=>setUseWeb(e.target.checked)} /> Web</label>
          </div>

          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {user ? (
            <div className="user-menu">
              <Link to={`/profile/${user.id}`} className="user-btn">
                <FiUser size={20} />
                <span>{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                <FiLogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">Login</Link>
          )}

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
