const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UserConfig = require('../../config/models/userConfig');

// 用户注册
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 验证请求参数
    if (!username || !email || !password) {
      return res.status(400).json({ error: '用户名、邮箱和密码不能为空' });
    }

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.username === username 
          ? '用户名已存在' 
          : '邮箱已被注册'
      });
    }

    // 创建新用户
    const user = new User({ username, email, password });
    await user.save();

    // 创建用户默认配置
    const defaultConfig = new UserConfig({
      userId: user._id,
      apiKey: '',
      modelName: 'gpt-3.5-turbo'
    });
    await defaultConfig.save();

    // 生成JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key-here',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: '注册成功',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 验证请求参数
    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' });
    }

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    // 生成JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key-here',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(200).json({
      success: true,
      message: '登录成功',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 获取当前用户信息
exports.getCurrentUser = async (req, res) => {
  try {
    // 从请求对象中获取用户信息（由认证中间件添加）
    if (!req.user) {
      return res.status(401).json({ error: '用户未认证' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};