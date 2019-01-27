const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp-date-unix');

/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  roles: {
    type: Array,
    default: ['contributor'],
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  bannedUntil: {
    type: Number,
    default: null,
  },
  banReason: {
    type: String,
    default: null,
  },
  bannedBy: {
    type: String,
    default: null,
  },
  tokens: {
    type: Number,
    default: 0,
  },
});

// Declare index in user schema for faster query.
userSchema.index({
  isBanned: 1,
  bannedBy: 1,
  roles: 1,
}, { name: 'user_index' });

// Convert date to timestamps
userSchema.plugin(timestamps);

/**
 * @typedef User
 */
module.exports = mongoose.model('User', userSchema);
