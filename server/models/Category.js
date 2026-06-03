const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: '📰'
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  articles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
