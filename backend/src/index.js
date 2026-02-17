const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 导入路由
const authRoutes = require('./modules/user/routes');
const pidRoutes = require('./modules/pid/routes');
const historyRoutes = require('./modules/history/routes');
const feedbackRoutes = require('./modules/feedback/routes');
const configRoutes = require('./modules/config/routes');

// 创建Express应用
const app = express();

// 配置中间件
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 配置API限流
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP限制100个请求
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// 连接数据库
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pid-assistant', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('数据库连接成功');
})
.catch((error) => {
  console.error('数据库连接失败:', error);
  // 注释掉退出代码，让服务继续运行
  // process.exit(1);
  console.log('服务将在没有数据库的情况下继续运行，部分功能可能不可用');
});

// 配置路由
app.use('/api/auth', authRoutes);
app.use('/api/pid', pidRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/config', configRoutes);

// 根路径
app.get('/', (req, res) => {
  res.json({ message: 'PID参数智能调优系统后端服务' });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('错误:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

module.exports = app;