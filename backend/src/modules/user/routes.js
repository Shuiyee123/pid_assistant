const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const { authenticate } = require('../../middleware/auth');

// 注册路由
router.post('/register', userController.register);

// 登录路由
router.post('/login', userController.login);

// 获取当前用户信息路由（需要认证）
router.get('/me', authenticate, userController.getCurrentUser);

module.exports = router;