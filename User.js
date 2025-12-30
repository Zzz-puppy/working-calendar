/**
 * 用户模型定义
 * 字段含义：
 * - name: 显示名称。
 * - email: 登录邮箱，唯一。
 * - passwordHash: bcrypt 加密后的密码。
 * - createdAt: 注册时间。
 */
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);


