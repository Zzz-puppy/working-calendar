/**
 * Working Calendar 前端逻辑（纯 HTML + 原生 JavaScript）
 * 功能点：
 * - 月视图日历，可点击选择日期并展示当日任务。
 * - 任务的新增、编辑、删除。
 * - 进度条拖拽/点击更新，实时显示百分比。
 * - 数据持久化：使用 LocalStorage 存储任务数组。
 * 数据结构：
 * {
 *   id: string,
 *   date: string,      // YYYY-MM-DD
 *   title: string,
 *   progress: number,  // 0-100
 *   createTime: string // ISO 字符串
 * }
 */

// LocalStorage 键名
const STORAGE_KEY = 'working-calendar-tasks';

// 页面状态：当前月份、选中日期、任务列表
const state = {
  current: new Date(),
  selectedDate: formatDate(new Date()),
  tasks: loadTasks(),
};

// DOM 引用
const calendarEl = document.getElementById('calendar');
const monthLabelEl = document.getElementById('month-label');
const selectedDateLabelEl = document.getElementById('selected-date-label');
const taskListEl = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');

// 工具函数：日期格式化 YYYY-MM-DD
function formatDate(dateObj) {
  const y = dateObj.getFullYear();
  const m = `${dateObj.getMonth() + 1}`.padStart(2, '0');
  const d = `${dateObj.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 生成唯一 ID（优先使用浏览器原生 randomUUID）
function uid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// 从 LocalStorage 读取任务数据
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('读取任务失败，回退为空数组', err);
    return [];
  }
}

// 将任务写入 LocalStorage
function persistTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// 渲染顶部月份文字
function renderMonthLabel() {
  const year = state.current.getFullYear();
  const month = state.current.getMonth() + 1;
  monthLabelEl.textContent = `${year}年 ${month.toString().padStart(2, '0')}月`;
}

// 渲染日历网格（不包含跨月补位，保持简洁）
function renderCalendar() {
  renderMonthLabel();
  calendarEl.innerHTML = '';

  const year = state.current.getFullYear();
  const month = state.current.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0-6，周日为 0
  const lastDate = new Date(year, month + 1, 0).getDate();

  // 头部展示星期
  const weekNames = ['日', '一', '二', '三', '四', '五', '六'];
  weekNames.forEach((name) => {
    const head = document.createElement('div');
    head.className = 'day-header';
    head.textContent = name;
    head.style.textAlign = 'center';
    head.style.fontWeight = '700';
    calendarEl.appendChild(head);
  });

  // 填充开头空白
  for (let i = 0; i < firstDay; i += 1) {
    const empty = document.createElement('div');
    calendarEl.appendChild(empty);
  }

  for (let date = 1; date <= lastDate; date += 1) {
    const cell = document.createElement('div');
    cell.className = 'day';

    const dayDate = new Date(year, month, date);
    const dateStr = formatDate(dayDate);
    const isToday = dateStr === formatDate(new Date());
    const isSelected = dateStr === state.selectedDate;
    if (isToday) cell.classList.add('today');
    if (isSelected) cell.classList.add('selected');

    // 计算当天任务数量
    const count = state.tasks.filter((t) => t.date === dateStr).length;

    const header = document.createElement('div');
    header.className = 'day-header';
    header.innerHTML = `<span>${date}</span>${count ? `<span class="task-count">${count}项</span>` : ''}`;
    cell.appendChild(header);

    if (count > 0) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      cell.appendChild(dot);
    }

    cell.addEventListener('click', () => {
      state.selectedDate = dateStr;
      render();
    });

    calendarEl.appendChild(cell);
  }
}

// 渲染右侧任务列表
function renderTasks() {
  selectedDateLabelEl.textContent = `当前日期：${state.selectedDate}`;
  taskListEl.innerHTML = '';

  const list = state.tasks.filter((t) => t.date === state.selectedDate);
  if (list.length === 0) {
    taskListEl.innerHTML = '<p class="subtitle">暂无任务，添加一个试试吧～</p>';
    return;
  }

  list.forEach((task) => {
    const item = document.createElement('div');
    item.className = 'task-item';

    const titleRow = document.createElement('div');
    titleRow.className = 'task-title';
    titleRow.innerHTML = `<span>${task.title}</span><span class="task-meta">${task.progress}%</span>`;

    const meta = document.createElement('div');
    meta.className = 'task-meta';
    meta.textContent = `创建：${new Date(task.createTime).toLocaleString()}`;

    const progressRow = document.createElement('div');
    progressRow.className = 'progress-row';
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 100;
    slider.value = task.progress;
    const percent = document.createElement('span');
    percent.textContent = `${task.progress}%`;

    // 拖动或点击更新进度
    slider.addEventListener('input', (e) => {
      const value = Number(e.target.value);
      percent.textContent = `${value}%`;
    });
    slider.addEventListener('change', (e) => {
      updateTask(task.id, { progress: Number(e.target.value) });
    });

    progressRow.appendChild(slider);
    progressRow.appendChild(percent);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.textContent = '编辑';
    editBtn.addEventListener('click', () => {
      const next = prompt('更新任务标题', task.title);
      if (next && next.trim()) {
        updateTask(task.id, { title: next.trim() });
      }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '删除';
    deleteBtn.className = 'danger';
    deleteBtn.addEventListener('click', () => {
      const ok = confirm('确认删除该任务？');
      if (ok) removeTask(task.id);
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    item.appendChild(titleRow);
    item.appendChild(meta);
    item.appendChild(progressRow);
    item.appendChild(actions);

    taskListEl.appendChild(item);
  });
}

// 添加任务
function addTask(title) {
  const task = {
    id: uid(),
    date: state.selectedDate,
    title,
    progress: 0,
    createTime: new Date().toISOString(),
  };
  state.tasks.unshift(task);
  persistTasks(state.tasks);
  render();
}

// 更新任务（局部字段）
function updateTask(id, updates) {
  state.tasks = state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
  persistTasks(state.tasks);
  renderTasks(); // 只需刷新列表，避免重绘日历
  renderCalendar(); // 进度可能不影响日历但保持一致性
}

// 删除任务
function removeTask(id) {
  state.tasks = state.tasks.filter((t) => t.id !== id);
  persistTasks(state.tasks);
  render();
}

// 渲染整体
function render() {
  renderCalendar();
  renderTasks();
}

// 事件绑定：月份切换
document.getElementById('prev-month').addEventListener('click', () => {
  state.current = new Date(state.current.getFullYear(), state.current.getMonth() - 1, 1);
  render();
});

document.getElementById('next-month').addEventListener('click', () => {
  state.current = new Date(state.current.getFullYear(), state.current.getMonth() + 1, 1);
  render();
});

// 跳转到今天
document.getElementById('add-today').addEventListener('click', () => {
  const today = new Date();
  state.current = new Date(today.getFullYear(), today.getMonth(), 1);
  state.selectedDate = formatDate(today);
  render();
});

// 表单提交：添加任务
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = taskTitleInput.value.trim();
  if (!title) return;
  addTask(title);
  taskTitleInput.value = '';
});

// 初始化渲染
render();


