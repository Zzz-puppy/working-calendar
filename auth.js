/**
 * 认证路由：注册、登录、获取用户信息、登出。
 * 说明：
 * - 注册与登录成功后返回 JWT，前端可存储于 localStorage 或 Cookie。
 * - 登出在无会话存储的场景下返回成功即可，令牌失效交由前端丢弃。
 */
const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { signUserToken } = require('../utils/jwt');

const router = express.Router();

// 工具：统一处理校验错误
function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: '参数校验失败', errors: errors.array() });
  }
  return null;
}

/**
 * 注册
 */
router.post(
  '/register',
  [
    body('name').isString().trim().notEmpty().withMessage('姓名必填'),
    body('email').isEmail().withMessage('邮箱格式不正确'),
    body('password').isLength({ min: 6 }).withMessage('密码至少 6 位'),
  ],
  async (req, res) => {
    if (handleValidation(req, res)) return;
    const { name, email, password } = req.body;

    try {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(409).json({ message: '邮箱已被注册' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, passwordHash });
      const token = signUserToken({ id: user.id, email: user.email, name: user.name });

      return res.status(201).json({
        token,
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (err) {
      return res.status(500).json({ message: '注册失败', details: err.message });
    }
  }
);

/**
 * 登录
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('邮箱格式不正确'),
    body('password').isLength({ min: 6 }).withMessage('密码至少 6 位'),
  ],
  async (req, res) => {
    if (handleValidation(req, res)) return;
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ message: '邮箱或密码错误' });
      }

      const matched = await bcrypt.compare(password, user.passwordHash);
      if (!matched) {
        return res.status(401).json({ message: '邮箱或密码错误' });
      }

      const token = signUserToken({ id: user.id, email: user.email, name: user.name });
      return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
      return res.status(500).json({ message: '登录失败', details: err.message });
    }
  }
);

/**
 * 获取当前用户信息
 */
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email createdAt');
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: '获取用户信息失败', details: err.message });
  }
});

/**
 * 登出（无状态，前端丢弃令牌即可）
 */
router.post('/logout', auth, (req, res) => {
  return res.json({ message: '已登出' });
});

module.exports = router;


