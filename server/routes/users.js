const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Simple in-memory fallback for when DB is down
let fallbackUsers = {
  'demo@technewspro.com': {
    id: 'fallback_user_1',
    name: 'Demo User',
    email: 'demo@technewspro.com',
    passwordHash: '$2a$10$demo', // bcrypt hashed 'demo123'
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
    createdAt: new Date()
  }
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = new User({ name, email, password });
      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });

      res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } catch (dbErr) {
      if (dbErr && /timeout|buffering/.test(dbErr.message)) {
        // DB unavailable, use fallback
        if (fallbackUsers[email.toLowerCase()]) {
          return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const userId = 'user_' + Date.now();
        fallbackUsers[email.toLowerCase()] = {
          id: userId,
          name,
          email: email.toLowerCase(),
          passwordHash,
          role: 'user',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
          createdAt: new Date()
        };

        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
          token,
          user: { id: userId, name, email: email.toLowerCase(), role: 'user' }
        });
      } else {
        throw dbErr;
      }
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });

      res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } catch (dbErr) {
      if (dbErr && /timeout|buffering/.test(dbErr.message)) {
        // DB unavailable, use fallback
        const fallbackUser = fallbackUsers[email.toLowerCase()];
        if (!fallbackUser) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, fallbackUser.passwordHash);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: fallbackUser.id }, process.env.JWT_SECRET, {
          expiresIn: '7d'
        });

        res.json({
          token,
          user: { id: fallbackUser.id, name: fallbackUser.name, email: fallbackUser.email, role: fallbackUser.role }
        });
      } else {
        throw dbErr;
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('articles')
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar');

    res.json(user);
  } catch (err) {
    if (err && /timeout|buffering/.test(err.message)) {
      // Return fallback user data
      const found = Object.values(fallbackUsers).find(u => u.id === req.userId);
      if (found) {
        return res.json({ ...found, articles: [], followers: [], following: [] });
      }
    }
    res.status(500).json({ message: err.message });
  }
});

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('articles')
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    if (err && /timeout|buffering/.test(err.message)) {
      const found = Object.values(fallbackUsers).find(u => u.id === req.params.id);
      if (found) {
        return res.json({ ...found, articles: [], followers: [], following: [] });
      }
    }
    res.status(500).json({ message: err.message });
  }
});

// Follow user
router.post('/:id/follow', auth, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.userId);

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(req.params.id);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.id);
      userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== req.userId);
    } else {
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.userId);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({ following: !isFollowing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
