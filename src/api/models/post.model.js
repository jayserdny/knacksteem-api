const mongoose = require('mongoose');

/**
 * Post Schema
 * @author Jayser Mendez
 * @private
 */
const postSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  permlink: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  moderation: {
    moderated: {
      type: Boolean,
      default: false,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    moderatedBy: {
      type: String,
      default: null,
    },
    moderatedAt: {
      type: Date,
      default: null,
    },
  },
}, {
  timestamps: true,
});

// Declare index for createdAt property
postSchema.index({ createdAt: -1 });

/**
 * @typedef Post
 */
module.exports = mongoose.model('Post', postSchema);
