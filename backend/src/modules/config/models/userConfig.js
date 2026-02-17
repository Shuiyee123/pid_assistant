const mongoose = require('mongoose');

const userConfigSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  apiKey: {
    type: String,
    required: true
  },
  modelName: {
    type: String,
    required: true,
    default: 'gpt-3.5-turbo'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 更新时间中间件
userConfigSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const UserConfig = mongoose.model('UserConfig', userConfigSchema);

module.exports = UserConfig;