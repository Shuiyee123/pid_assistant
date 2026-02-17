const mongoose = require('mongoose');

const pidRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pidType: {
    type: String,
    required: true,
    enum: ['standard', 'parallel', 'integral-separated', 'anti-windup', 'other']
  },
  currentKp: {
    type: Number,
    required: true
  },
  currentKi: {
    type: Number,
    required: true
  },
  currentKd: {
    type: Number,
    required: true
  },
  errorValue: {
    type: Number,
    required: true
  },
  targetValue: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  optimizedKp: {
    type: Number,
    required: true
  },
  optimizedKi: {
    type: Number,
    required: true
  },
  optimizedKd: {
    type: Number,
    required: true
  },
  thoughtProcess: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 索引优化
pidRecordSchema.index({ userId: 1, createdAt: -1 });

const PidRecord = mongoose.model('PidRecord', pidRecordSchema);

module.exports = PidRecord;