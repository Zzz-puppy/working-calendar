/**
 * 任务路由：增删改查与进度更新。
 * 所有接口均需要认证，使用 req.user.id 过滤数据，确保用户隔离。
 */
const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// 统一校验错误处理
function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: '参数校验失败', errors: errors.array() });
  }
  return null;
}

// 所有任务接口均要求登录
router.use(auth);

/**
 * GET /api/tasks?date=YYYY-MM-DD
 * 获取指定日期任务列表；若未提供日期，则返回当前用户的全部任务。
 */
router.get(
  '/',
  [query('date').optional().isString().withMessage('date 应为字符串')],
  async (req, res) => {
    if (handleValidation(req, res)) return;
    const { date } = req.query;

    const filter = { userId: req.user.id };
    if (date) filter.date = date;

    try {
      const tasks = await Task.find(filter).sort({ date: 1, createTime: 1 });
      return res.json({ tasks });
    } catch (err) {
      return res.status(500).json({ message: '获取任务失败', details: err.message });
    }
  }
);

/**
 * GET /api/tasks/range?start=YYYY-MM-DD&end=YYYY-MM-DD
 * 获取日期范围内任务。
 */
router.get(
  '/range',
  [
    query('start').isString().withMessage('start 必填'),
    query('end').isString().withMessage('end 必填'),
  ],
  async (req, res) => {
    if (handleValidation(req, res)) return;
    const { start, end } = req.query;

    try {
      const tasks = await Task.find({
        userId: req.user.id,
        date: { $gte: start, $lte: end },
      }).sort({ date: 1, createTime: 1 });
      return res.json({ tasks });
    } catch (err) {
      return res.status(500).json({ message: '获取范围任务失败', details: err.message });
    }
  }
);

/**
 * POST /api/tasks
 * 创建新任务。
 */
router.post(
  '/',
  [
    body('date').isString().withMessage('date 必填'),
    body('title').isString().notEmpty().withMessage('title 必填'),
    body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('progress 应为 0-100'),
    body('category').optional().isString(),
    body('priority').optional().isInt({ min: 1, max: 3 }),
  ],
  async (req, res) => {
    if (handleValidation(req, res)) return;
    const { date, title, progress = 0, category = 'general', priority = 1 } = req.body;

    try {
      const task = await Task.create({
        userId: req.user.id,
        date,
        title,
        progress,
        category,
        priority,
      });
      return res.status(201).json({ task });
    } catch (err) {
      return res.status(500).json({ message: '创建任务失败', details: err.message });
    }
  }
);

/**
 * PUT /api/tasks/:id
 * 更新任务基础字段。
 */
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('id 不合法'),
    body('date').optional().isString(),
    body('title').optional().isString(),
    body('progress').optional().isInt({ min: 0, max: 100 }),
    body('category').optional().isString(),
    body('priority').optional().isInt({ min: 1, max: 3 }),
  ],
  async (req, res) => {
    if (handleValidation(req, res)) return;
    const { id } = req.params;
    const updates = { ...req.body };

    try {
      const task = await Task.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        updates,
        { new: true }
      );
      if (!task) {
        return res.status(404).json({ message: '任务不存在' });
      }
      return res.json({ task });
    } catch (err) {
      return res.status(500).json({ message: '更新任务失败', details: err.message });
    }
  }
);

/**
 * DELETE /api/tasks/:id
 * 删除任务。
 */
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('id 不合法')],
  async (req, res) => {
    if (handleValidation(req, res)) return;
    const { id } = req.params;

    try {
      const result = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
      if (!result) {
        return res.status(404).json({ message: '任务不存在' });
      }
      return res.json({ message: '删除成功' });
    } catch (err) {
      return res.status(500).json({ message: '删除任务失败', details: err.message });
    }
  }
);

/**
 * PUT /api/tasks/:id/progress
 * 仅更新任务进度。
 */
router.put(
  '/:id/progress',
  [
    param('id').isMongoId().withMessage('id 不合法'),
    body('progress').isInt({ min: 0, max: 100 }).withMessage('progress 必须在 0-100'),
  ],
  async (req, res) => {
    if (handleValidation(req, res)) return;
    const { id } = req.params;
    const { progress } = req.body;

    try {
      const task = await Task.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        { progress },
        { new: true }
      );
      if (!task) {
        return res.status(404).json({ message: '任务不存在' });
      }
      return res.json({ task });
    } catch (err) {
      return res.status(500).json({ message: '更新进度失败', details: err.message });
    }
  }
);

module.exports = router;


