import React from 'react';
import { FiTwitter, FiFacebook, FiInstagram, FiLinkedin, FiMail } from 'react-icons/fi';
import '../styles/footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About TechNews Pro</h3>
          <p>
            Your source for the latest technology news, trends, and insights.
            Stay informed about AI, web development, mobile apps, security, and startups.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/category/ai">AI News</a></li>
            <li><a href="/category/web">Web Development</a></li>
            <li><a href="/category/mobile">Mobile</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter"><FiTwitter size={24} /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook"><FiFacebook size={24} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram"><FiInstagram size={24} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn"><FiLinkedin size={24} /></a>
            <a href="mailto:info@technewspro.com" title="Email"><FiMail size={24} /></a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Newsletter</h3>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} TechNews Pro. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
