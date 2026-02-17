const express = require('express');
const router = express.Router();
const historyController = require('./controllers/historyController');
const { authenticate } = require('../../middleware/auth');

// 获取历史调优记录路由
router.get('/', authenticate, historyController.getHistory);

// 获取单个调优记录详情路由
router.get('/:id', authenticate, historyController.getRecordDetail);

module.exports = router;