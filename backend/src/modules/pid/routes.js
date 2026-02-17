const express = require('express');
const router = express.Router();
const pidController = require('./controllers/pidController');
const { authenticate } = require('../../middleware/auth');

// PID参数调优路由
router.post('/tune', authenticate, pidController.tuneParameters);

// 获取单个调优记录详情路由
router.get('/record/:id', authenticate, pidController.getRecordDetail);

module.exports = router;