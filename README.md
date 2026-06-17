# Working Calendar - Task Management Calendar Application

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js Badge" />
  <img src="https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express Badge" />
  <img src="https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Badge" />
  <img src="https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript Badge" />
  <img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" alt="License Badge" />
</p>

> **A full-stack calendar-based task management application with JWT authentication, progress tracking, and data analytics**

Working Calendar is a modern task management tool that combines a beautiful monthly calendar view with powerful backend APIs. Create tasks on specific dates, track progress with draggable sliders, and visualize your productivity through built-in statistics.

## 📅 About

Working Calendar is a full-stack web application designed to help you organize your daily work efficiently. It features an intuitive monthly calendar interface where you can click any date to view and manage tasks for that day.

### Vision

We believe that a great task management tool should feel as natural as flipping through a calendar. Working Calendar bridges the gap between traditional calendar views and modern productivity tools — making task management visual, intuitive, and delightful.

## ✨ Features

### 🎯 Core Features
- **📆 Monthly Calendar View** - Beautiful month-by-month calendar with date selection and navigation
- **✅ Task CRUD** - Create, read, update, and delete tasks on any selected date
- **📊 Progress Tracking** - Drag-and-click progress sliders (0-100%) with real-time updates
- **🏷️ Categories & Priority** - Organize tasks by category and priority level (Low/Medium/High)
- **📈 Statistics Dashboard** - Monthly analytics with daily completion rates and average progress
- **💾 Local Storage Persistence** - Frontend data survives browser refresh (LocalStorage)
- **🔐 User Authentication** - Secure JWT-based registration and login system
- **👤 User Data Isolation** - Each user's tasks are fully isolated and private

### 🔐 Backend API Features
- **RESTful API Design** - Clean REST endpoints for all operations
- **JWT Authentication** - JSON Web Token based auth with bcrypt password hashing
- **Input Validation** - Express-validator for robust request validation
- **MongoDB Integration** - Mongoose ODM with optimized indexes for fast queries
- **CORS Support** - Cross-origin resource sharing enabled for frontend-backend separation
- **Request Logging** - Morgan middleware for HTTP request logging
- **Global Error Handling** - Structured error responses across all routes

### 🎨 Frontend Experience
- **Pure HTML/CSS/JS** - No framework dependencies, lightweight and fast-loading
- **Responsive Layout** - Clean two-column layout (calendar + task panel)
- **Custom SVG Logo** - Scroll & quill pen logo design
- **Visual Feedback** - Today highlighting, selection states, task count indicators
- **Smooth Interactions** - Month navigation, instant task list updates
- **Dark-friendly Theme** - Soft color palette that's easy on the eyes

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js 18+ |
| **Backend Framework** | Express 5.2 |
| **Database** | MongoDB 7.x (Mongoose ODM) |
| **Authentication** | JWT (jsonwebtoken) + bcryptjs |
| **Validation** | express-validator |
| **Frontend** | Vanilla HTML5 + CSS3 + ES6+ JavaScript |
| **Logging** | morgan |
| **CORS** | cors |
| **Config** | dotenv |
| **Dev Tools** | nodemon (hot reload) |
| **Deployment** | Docker / DevBox ready |

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- MongoDB instance (local or remote)

### Installation

```bash
# Clone the repository
git clone https://github.com/Zzz-puppy/working-calendar.git
cd working-calendar

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Server port (default: 3000)
PORT=3000

# MongoDB connection URI
MONGODB_URI=mongodb://localhost:27017/working-calendar
```

### Development

```bash
# Start development server with hot-reload
npm run dev

# Open http://localhost:3000
```

### Production

```bash
# Build and start production server
npm start

# Or using the entrypoint script
bash entrypoint.sh production
```

## 📁 Project Structure

```
working-calendar/
├── app.js                  # Frontend logic (calendar rendering, task CRUD, LocalStorage)
├── server.js               # Express app entry point (middleware, routes, DB connection)
├── index.html              # Main HTML page (calendar UI, task panel)
├── style.css               # Custom styles (layout, calendar grid, components)
├── auth.js                 # Auth routes (register, login, me, logout)
├── tasks.js                # Task routes (CRUD, progress, range queries)
├── stats.js                # Stats routes (monthly stats, daily completion rates)
├── Task.js                 # Mongoose model (Task schema, indexes, hooks)
├── User.js                 # Mongoose model (User schema)
├── jwt.js                  # JWT utilities (token signing/verification)
├── entrypoint.sh           # Docker/DevBox entry script (dev/prod modes)
├── package.json            # Dependencies and scripts
└── sonar-project.properties # SonarQube configuration
```

## 📡 API Reference

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login and get JWT | No |
| GET | `/api/auth/me` | Get current user info | Yes |
| POST | `/api/auth/logout` | Logout (discard token) | Yes |

### Tasks (`/api/tasks`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | List all tasks (filterable by date) | Yes |
| GET | `/api/tasks/range` | Get tasks in date range | Yes |
| POST | `/api/tasks` | Create a new task | Yes |
| PUT | `/api/tasks/:id` | Update a task | Yes |
| DELETE | `/api/tasks/:id` | Delete a task | Yes |
| PUT | `/api/tasks/:id/progress` | Update task progress only | Yes |

### Statistics (`/api/stats`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/stats/monthly` | Get monthly statistics | Yes |
| GET | `/api/stats/daily-completion` | Get daily completion rates | Yes |

### Data Models

#### Task Schema
```javascript
{
  userId: ObjectId,        // Linked user (data isolation)
  date: String,             // YYYY-MM-DD format
  title: String,            // Task title (required)
  progress: Number,         // 0-100 percentage (default: 0)
  category: String,         // Category tag (default: 'general')
  priority: Number,         // 1=Low, 2=Medium, 3=High (default: 1)
  createTime: Date,
  updateTime: Date          // Auto-updated on every change
}
```

#### User Schema
```javascript
{
  name: String,             // Display name (required)
  email: String,            // Unique login email (required, lowercase)
  passwordHash: String,     // bcrypt hashed password (required)
  createdAt: Date           // Registration timestamp
}
```

## ⚙️ Key Implementation Details

### Frontend Architecture
- **State Management**: Centralized state object with render-on-change pattern
- **Date Handling**: Custom YYYY-MM-DD formatter, locale-aware display
- **ID Generation**: Uses `crypto.randomUUID()` with fallback
- **Persistence**: LocalStorage for offline-first experience
- **Calendar Rendering**: Dynamic DOM generation with week headers and empty padding

### Backend Architecture
- **Authentication Flow**: Register/Login → bcrypt hash → JWT sign → Token in response
- **Middleware Chain**: CORS → JSON Parser → Morgan Logger → Routes → Error Handler
- **Data Isolation**: All queries filtered by `req.user.id`
- **Index Optimization**: Compound index on `{ userId: 1, date: 1 }` for fast per-day lookups
- **Timestamp Hooks**: Pre-save and pre-findOneAndUpdate hooks auto-update `updateTime`

### Security Measures
- Password hashing with bcrypt (salt rounds: 10)
- JWT token-based stateless authentication
- Express-validator input sanitization on all endpoints
- User-scoped data access (no cross-user data leakage)
- Global error handler prevents stack trace exposure

## 🎮 Usage Guide

### Basic Workflow

1. **Register / Login** - Create an account or log in with email and password
2. **Navigate Calendar** - Use arrow buttons or click "Jump to Today"
3. **Select a Date** - Click any day cell to view/add tasks for that date
4. **Add Tasks** - Type a task name and click "Add"
5. **Track Progress** - Drag the slider or click to set completion percentage
6. **Edit / Delete** - Use action buttons to modify or remove tasks
7. **View Statistics** - Access the stats endpoint for productivity insights

### Keyboard Shortcuts & Tips
- Today's date is automatically highlighted
- Dates with tasks show a dot indicator and task count
- Selected date has a distinct border style
- Progress changes are saved immediately (no save button needed)
- Data persists across browser sessions via LocalStorage

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Notes

- Follow the existing code style and comment conventions
- Ensure all new API endpoints include proper validation
- Test both frontend (LocalStorage) and backend (API) paths
- Keep the frontend lightweight (no framework dependencies)

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](./LICENSE) file for details.

## 📞 Contact

- **Author**: Zzz-puppy
- **Email**: 2482559491@qq.com

---

<p align="center">
  <strong>Built with focus on simplicity and productivity</strong>
  <br />
  <sub>Calendar View · Task Management · Progress Tracking · Data Analytics</sub>
</p>