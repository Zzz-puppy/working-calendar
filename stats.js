/**
 * 统计路由：提供月度与每日完成率统计。
 */
const express = require('express');
const { query, validationResult } = require('express-validator');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// 校验工具
function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: '参数校验失败', errors: errors.array() });
  }
  return null;
}

// 统一使用认证
router.use(auth);

/**
 * GET /api/stats/monthly?year=YYYY&month=MM
 * 返回月度任务统计：总任务数、平均进度、按日聚合。
 */
router.get(
  '/monthly',
  [
    query('year').isInt({ min: 1970 }).withMessage('year 必须有效'),
    query('month').isInt({ min: 1, max: 12 }).withMessage('month 应为 1-12'),
  ],
  async (req, res) => {
    if (handleValidation(req, res)) return;
    const year = Number(req.query.year);
    const month = Number(req.query.month);

    // 生成当月的起止日期字符串（YYYY-MM-DD），方便字符串比较
    const lastDay = new Date(year, month, 0).getDate();
    const pad = (n) => n.toString().padStart(2, '0');
    const start = `${year}-${pad(month)}-01`;
    const end = `${year}-${pad(month)}-${pad(lastDay)}`;

    try {
      const tasks = await Task.find({
        userId: req.user.id,
        date: { $gte: start, $lte: end },
      });

      const total = tasks.length;
      const averageProgress =
        total === 0 ? 0 : Math.round(tasks.reduce((sum, t) => sum + (t.progress || 0), 0) / total);

      // 按日聚合
      const daily = {};
      tasks.forEach((task) => {
        if (!daily[task.date]) {
          daily[task.date] = { count: 0, sumProgress: 0 };
        }
        daily[task.date].count += 1;
        daily[task.date].sumProgress += task.progress || 0;
      });

      const dailyStats = Object.entries(daily).map(([date, { count, sumProgress }]) => ({
        date,
        count,
        averageProgress: Math.round(sumProgress / count),
      }));

      return res.json({ total, averageProgress, daily: dailyStats });
    } catch (err) {
      return res.status(500).json({ message: '获取月度统计失败', details: err.message });
    }
  }
);

/**
 * GET /api/stats/daily-completion
 * 返回所有日期的平均完成率。
 */
router.get('/daily-completion', async (req, res) => {
  try {
    // 使用聚合管道按日期聚合平均 progress
    const stats = await Task.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: '$date',
          averageProgress: { $avg: '$progress' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted = stats.map((item) => ({
      date: item._id,
      averageProgress: Math.round(item.averageProgress),
      count: item.count,
    }));

    return res.json({ dailyCompletion: formatted });
  } catch (err) {
    return res.status(500).json({ message: '获取每日完成率失败', details: err.message });
  }
});

module.exports = router;


