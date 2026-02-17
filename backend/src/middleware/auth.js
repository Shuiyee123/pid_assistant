const jwt = require('jsonwebtoken');
const User = require('../modules/user/models/user');

// JWT认证中间件
exports.authenticate = async (req, res, next) => {
  try {
    // 从请求头获取token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '未提供认证令牌' });
    }

    const token = authHeader.split(' ')[1];

    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here');

    // 查找用户
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: '用户不存在' });
    }

    // 将用户信息添加到请求对象
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: '认证令牌已过期' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: '无效的认证令牌' });
    }
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 可选认证中间件（用于获取用户信息但不强制要求登录）
exports.optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here');
    const user = await User.findById(decoded.id).select('-password');

    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    // 忽略认证错误，继续处理请求
    next();
  }
};