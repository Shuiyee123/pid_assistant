const express = require('express');
const router = express.Router();
const feedbackController = require('./controllers/feedbackController');
const { authenticate } = require('../../middleware/auth');

// 提交反馈记录路由
router.post('/', authenticate, feedbackController.submitFeedback);

// 获取指定调优记录的反馈路由
router.get('/:pidRecordId', authenticate, feedbackController.getFeedback);

// 获取用户的所有反馈记录路由
router.get('/', authenticate, feedbackController.getUserFeedback);

module.exports = router;