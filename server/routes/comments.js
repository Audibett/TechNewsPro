const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Article = require('../models/Article');
const { auth } = require('../middleware/auth');

// Get comments for article
router.get('/article/:articleId', async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.articleId })
      .populate('author', 'name avatar')
      .populate('replies')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create comment
router.post('/', auth, async (req, res) => {
  try {
    const { content, article, parentComment } = req.body;

    const comment = new Comment({
      content,
      article,
      author: req.userId,
      parentComment: parentComment || null
    });

    const savedComment = await comment.save();
    await savedComment.populate('author', 'name avatar');

    // Add to article
    const articleDoc = await Article.findById(article);
    if (articleDoc) {
      articleDoc.comments.push(savedComment._id);
      await articleDoc.save();
    }

    // Add to parent comment if reply
    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (parent) {
        parent.replies.push(savedComment._id);
        await parent.save();
      }
    }

    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Like comment
router.post('/:id/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const likeIndex = comment.likedBy.indexOf(req.userId);

    if (likeIndex === -1) {
      comment.likedBy.push(req.userId);
      comment.likes += 1;
    } else {
      comment.likedBy.splice(likeIndex, 1);
      comment.likes -= 1;
    }

    await comment.save();
    res.json({ likes: comment.likes, liked: likeIndex === -1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Comment.deleteOne({ _id: req.params.id });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
