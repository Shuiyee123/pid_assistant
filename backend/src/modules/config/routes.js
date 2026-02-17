const express = require('express');
const router = express.Router();
const configController = require('./controllers/configController');
const { authenticate } = require('../../middleware/auth');

// 获取用户配置路由
router.get('/', authenticate, configController.getUserConfig);

// 更新用户配置路由
router.put('/', authenticate, configController.updateUserConfig);

module.exports = router;