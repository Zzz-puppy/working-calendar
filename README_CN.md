# Working Calendar - 工作日历任务管理应用

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" alt="License" />
</p>

> **一款基于日历的全栈任务管理应用，集成 JWT 认证、进度追踪与数据统计分析功能**

Working Calendar 是一款现代化的任务管理工具，将美观的月视图日历与强大的后端 API 相结合。在任意日期上创建任务，通过可拖拽的进度条追踪完成度，并通过内置的统计面板可视化你的工作效率。

## 📅 关于项目

Working Calendar 是一款全栈 Web 应用程序，旨在帮助你高效地组织日常工作。它拥有直观的月视图日历界面，你可以点击任意日期来查看和管理当天的任务。

### 设计理念

我们相信，优秀的任务管理工具应该像翻阅日历一样自然。Working Calendar 弥合了传统日历视图与现代生产力工具之间的差距——让任务管理变得可视化、直观且令人愉悦。

## ✨ 功能特性

### 🎯 核心功能
- **📆 月视图日历** - 美观的月度日历，支持日期选择与月份导航
- **✅ 任务增删改查** - 在选中的日期上创建、查看、编辑和删除任务
- **📊 进度追踪** - 可拖拽/点击的进度滑块（0-100%），实时更新
- **🏷️ 分类与优先级** - 按类别和优先级（低/中/高）组织任务
- **📈 统计仪表盘** - 月度数据分析，包含每日完成率与平均进度
- **💾 本地持久化** - 前端数据存储于 LocalStorage，刷新不丢失
- **🔐 用户认证** - 基于 JWT 的安全注册与登录系统
- **👤 数据隔离** - 每个用户的任务完全隔离、私密安全

### 🔐 后端 API 特性
- **RESTful API 设计** - 清晰的 REST 风格接口
- **JWT 认证** - 基于 JSON Web Token 的认证 + bcrypt 密码加密
- **输入校验** - 使用 express-validator 进行健壮的请求验证
- **MongoDB 集成** - Mongoose ODM，优化索引实现快速查询
- **CORS 跨域** - 支持前后端分离开发
- **请求日志** - Morgan 中间件记录 HTTP 请求日志
- **全局错误处理** - 所有路由统一返回结构化错误信息

### 🎨 前端体验
- **纯 HTML/CSS/JS** - 无框架依赖，轻量快速加载
- **响应式布局** - 干净的双栏布局（日历 + 任务面板）
- **自定义 SVG Logo** - 卷轴 + 羽毛笔创意 Logo 设计
- **视觉反馈** - 当天高亮、选中状态、任务数量指示器
- **流畅交互** - 月份切换导航、即时任务列表更新
- **护眼主题** - 柔和配色方案，长时间使用舒适

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| **运行环境** | Node.js 18+ |
| **后端框架** | Express 5.2 |
| **数据库** | MongoDB 7.x (Mongoose ODM) |
| **认证方案** | JWT (jsonwebtoken) + bcryptjs |
| **参数校验** | express-validator |
| **前端技术** | 原生 HTML5 + CSS3 + ES6+ JavaScript |
| **日志记录** | morgan |
| **跨域支持** | cors |
| **配置管理** | dotenv |
| **开发工具** | nodemon（热重载）|
| **部署方式** | Docker / DevBox 就绪 |

## 🚀 快速开始

### 环境要求

- Node.js 18 或更高版本
- npm 或 yarn
- MongoDB 实例（本地或远程）

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/Zzz-puppy/working-calendar.git
cd working-calendar

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
```

### 环境配置

在项目根目录创建 `.env` 文件：

```env
# 服务器端口（默认 3000）
PORT=3000

# MongoDB 连接地址
MONGODB_URI=mongodb://localhost:27017/working-calendar
```

### 开发模式

```bash
# 启动开发服务器（支持热重载）
npm run dev

# 打开 http://localhost:3000
```

### 生产模式

```bash
# 构建并启动生产服务器
npm start

# 或使用入口脚本
bash entrypoint.sh production
```

## 📁 项目结构

```
working-calendar/
├── app.js                  # 前端逻辑（日历渲染、任务 CRUD、LocalStorage）
├── server.js               # Express 应用入口（中间件、路由、数据库连接）
├── index.html              # 主页面（日历 UI、任务面板）
├── style.css               # 自定义样式（布局、日历网格、组件）
├── auth.js                 # 认证路由（注册、登录、获取用户信息、登出）
├── tasks.js                # 任务路由（CRUD、进度更新、范围查询）
├── stats.js                # 统计路由（月度统计、每日完成率）
├── Task.js                 # Mongoose 模型（Task 数据模型、索引、钩子）
├── User.js                 # Mongoose 模型（User 数据模型）
├── jwt.js                  # JWT 工具函数（令牌签发与验证）
├── entrypoint.sh           # Docker/DevBox 入口脚本（开发/生产模式）
├── package.json            # 依赖包与脚本配置
└── sonar-project.properties # SonarQube 配置文件
```

## 📡 API 接口文档

### 认证接口 (`/api/auth`)

| 方法 | 端点 | 描述 | 需要认证 |
|------|------|------|----------|
| POST | `/api/auth/register` | 注册新用户 | 否 |
| POST | `/api/auth/login` | 登录获取 JWT | 否 |
| GET | `/api/auth/me` | 获取当前用户信息 | 是 |
| POST | `/api/auth/logout` | 登出（丢弃令牌） | 是 |

### 任务接口 (`/api/tasks`)

| 方法 | 端点 | 描述 | 需要认证 |
|------|------|------|----------|
| GET | `/api/tasks` | 获取任务列表（可按日期筛选） | 是 |
| GET | `/api/tasks/range` | 获取日期范围内的任务 | 是 |
| POST | `/api/tasks` | 创建新任务 | 是 |
| PUT | `/api/tasks/:id` | 更新任务 | 是 |
| DELETE | `/api/tasks/:id` | 删除任务 | 是 |
| PUT | `/api/tasks/:id/progress` | 仅更新任务进度 | 是 |

### 统计接口 (`/api/stats`)

| 方法 | 端点 | 描述 | 需要认证 |
|------|------|------|----------|
| GET | `/api/stats/monthly` | 获取月度统计数据 | 是 |
| GET | `/api/stats/daily-completion` | 获取每日完成率统计 | 是 |

### 数据模型

#### Task（任务）Schema
```javascript
{
  userId: ObjectId,        // 关联用户（数据隔离）
  date: String,             // YYYY-MM-DD 格式
  title: String,            // 任务标题（必填）
  progress: Number,         // 0-100 百分比（默认：0）
  category: String,         // 分类标签（默认：'general'）
  priority: Number,         // 1=低, 2=中, 3=高（默认：1）
  createTime: Date,
  updateTime: Date          // 每次修改自动更新
}
```

#### User（用户）Schema
```javascript
{
  name: String,             // 显示名称（必填）
  email: String,            // 唯一登录邮箱（必填，自动转小写）
  passwordHash: String,     // bcrypt 加密后的密码（必填）
  createdAt: Date           // 注册时间戳
}
```

## ⚙️ 核心实现细节

### 前端架构
- **状态管理**: 集中式状态对象，采用「变更即渲染」模式
- **日期处理**: 自定义 YYYY-MM-DD 格式化函数，本地化显示
- **ID 生成**: 优先使用 `crypto.randomUUID()`，带降级方案
- **数据持久化**: LocalStorage 实现离线优先体验
- **日历渲染**: 动态 DOM 生成，含星期表头与空白填充

### 后端架构
- **认证流程**: 注册/登录 → bcrypt 加密哈希 → JWT 签发 → 返回令牌
- **中间件链**: CORS → JSON 解析 → Morgan 日志 → 路由 → 错误处理器
- **数据隔离**: 所有查询均以 `req.user.id` 过滤
- **索引优化`: `{ userId: 1, date: 1 }` 复合索引加速按日查询
- **时间戳钩子**: pre-save 与 pre-findOneAndUpdate 钩子自动更新 `updateTime`

### 安全措施
- 使用 bcrypt 进行密码哈希（盐值轮数：10）
- 基于 JWT 的无状态认证机制
- 所有接口均使用 express-validator 输入清洗
- 用户级数据访问控制（杜绝跨用户数据泄露）
- 全局错误处理器防止堆栈信息暴露

## 🎮 使用指南

### 基本操作流程

1. **注册 / 登录** - 使用邮箱和密码创建账户或登录
2. **浏览日历** - 使用左右箭头按钮或点击「跳转到今天」
3. **选择日期** - 点击任意日期单元格查看/添加该日的任务
4. **添加任务** - 输入任务名称后点击「添加」按钮
5. **追踪进度** - 拖动滑块或点击设置完成百分比
6. **编辑 / 删除** - 使用操作按钮修改或移除任务
7. **查看统计** - 通过统计接口获取生产力洞察

### 操作提示
- 当天日期会自动高亮显示
- 有任务的日期会显示圆点指示器和任务数量
- 选中的日期有独特的边框样式
- 进度更改会立即保存（无需额外保存按钮）
- 数据通过 LocalStorage 跨浏览器会话持久保存

## 🤝 参与贡献

欢迎贡献代码！以下是参与方式：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的改动 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 开发注意事项

- 遵循现有代码风格与注释规范
- 确保所有新增 API 接口包含完整的参数校验
- 同时测试前端（LocalStorage）和后端（API）路径
- 保持前端轻量化（无框架依赖）

## 📄 许可证

本项目基于 ISC 许可证开源 - 详情请参阅 [LICENSE](./LICENSE) 文件。

## 📞 联系方式

- **作者**: Zzz-puppy
- **邮箱**: 2482559491@qq.com

---

<p align="center">
  <strong>专注于简洁与高效的生产力工具</strong>
  <br />
  <sub>日历视图 · 任务管理 · 进度追踪 · 数据分析</sub>
</p>