/**
 * JWT 工具：生成用户访问令牌。
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-working-calendar-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * 生成包含用户基础信息的 JWT。
 * @param {{ id: string, email: string, name: string }} userPayload
 */
function signUserToken(userPayload) {
  return jwt.sign(userPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

module.exports = { signUserToken };


