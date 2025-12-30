/**
 * 应用入口：初始化 Express 服务、连接 MongoDB，并挂载 API 与前端静态资源。
 * 说明：
 * - 使用 morgan 记录请求日志。
 * - 使用 CORS 允许跨源请求，便于本地前端调试。
 * - 使用 JWT 认证保护任务与统计接口。
 * - 提供 /public 下的前端 Working Calendar 静态页面。
 */
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

// 路由与中间件
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const statsRoutes = require('./routes/stats');

const app = express();

// 基础中间件：日志、跨域、JSON 解析
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// 挂载 API 路由
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/stats', statsRoutes);

// 提供静态前端资源
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// 兜底路由：未知路径返回 404 JSON
app.use((req, res) => {
  res.status(404).json({ message: '资源未找到' });
});

// 全局错误处理：捕获抛出的错误并返回结构化信息
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('全局错误捕获:', err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || '服务器内部错误',
    details: err.details || null,
  });
});

// Mongo 连接与服务启动
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://root:wdxb864m@test-db-mongodb.ns-lr6kzt58.svc:27017';

const startServer = async () => {
  try {
    // 连接 MongoDB，使用现代解析器与拓扑引擎
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB 连接成功');

    app.listen(PORT, () => {
      console.log(`🚀 服务器已启动，端口: ${PORT}`);
      console.log(`前端访问: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ MongoDB 连接失败', error);
    process.exit(1);
  }
};

startServer();


