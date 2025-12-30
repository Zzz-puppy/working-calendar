/**
 * 任务模型定义
 * 字段含义：
 * - userId: 关联用户，用于隔离数据。
 * - date: 任务所属日期，字符串格式 YYYY-MM-DD。
 * - title: 任务标题。
 * - progress: 进度百分比，限制在 0-100。
 * - category: 任务类别，默认 general。
 * - priority: 优先级 1-低, 2-中, 3-高。
 * - createTime / updateTime: 创建与更新时间戳。
 */
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  title: { type: String, required: true, trim: true },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  category: { type: String, default: 'general', trim: true },
  priority: { type: Number, default: 1, min: 1, max: 3 },
  createTime: { type: Date, default: Date.now },
  updateTime: { type: Date, default: Date.now },
});

// 每次保存前更新 updateTime，保持修改时间准确
TaskSchema.pre('save', function updateTimestamp(next) {
  this.updateTime = new Date();
  next();
});

// findOneAndUpdate 不会触发 save 钩子，单独处理更新时间
TaskSchema.pre('findOneAndUpdate', function setUpdateTime(next) {
  this.set({ updateTime: new Date() });
  next();
});

// 按用户 + 日期建立索引，提升按天查询性能
TaskSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('Task', TaskSchema);


