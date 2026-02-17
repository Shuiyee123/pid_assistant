const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pidRecordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PidRecord',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 索引优化
feedbackSchema.index({ userId: 1, pidRecordId: 1 }, { unique: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;