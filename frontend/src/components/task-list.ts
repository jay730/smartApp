import { TaskService } from "../services/task-service.js";

export class TaskList extends HTMLElement {
  private taskService: TaskService;
  private tasks: any[] = [];
  private currentFilter: string = 'all';
  private currentSort: string = 'created_at';

  constructor() {
    super();
    this.taskService = new TaskService();
  }

  connectedCallback() {
    this.render();
    this.loadTasks();
    this.attachEventListeners();
  }

  private render() {
    this.innerHTML = `
      <div class="task-list">
        <div class="task-controls">
          <div class="filter-controls">
            <label for="statusFilter">Filter by Status:</label>
            <select id="statusFilter">
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <label for="priorityFilter">Filter by Priority:</label>
            <select id="priorityFilter">
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <label for="categoryFilter">Filter by Category:</label>
            <select id="categoryFilter">
              <option value="all">All Categories</option>
              <option value="medical">Medical</option>
              <option value="personal_care">Personal Care</option>
              <option value="housekeeping">Housekeeping</option>
              <option value="maintenance">Maintenance</option>
              <option value="social">Social</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="sort-controls">
            <label for="sortBy">Sort by:</label>
            <select id="sortBy">
              <option value="created_at">Created Date</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        <div class="task-stats">
          <span class="stat">
            <strong>Total:</strong> <span id="totalCount">0</span>
          </span>
          <span class="stat">
            <strong>Pending:</strong> <span id="pendingCount">0</span>
          </span>
          <span class="stat">
            <strong>In Progress:</strong> <span id="inProgressCount">0</span>
          </span>
          <span class="stat">
            <strong>Completed:</strong> <span id="completedCount">0</span>
          </span>
          <span class="stat">
            <strong>Overdue:</strong> <span id="overdueCount">0</span>
          </span>
        </div>

        <div class="tasks-container" id="tasksContainer">
          <div class="loading">Loading tasks...</div>
        </div>
      </div>
    `;
  }

  private async loadTasks() {
    try {
      this.tasks = await this.taskService.getAllTasks();
      this.updateDisplay();
      this.updateStats();
    } catch (error) {
      console.error('Error loading tasks:', error);
      this.showError('Error loading tasks. Please try again.');
    }
  }

  private updateDisplay() {
    const container = this.querySelector('#tasksContainer') as HTMLElement;
    if (!container) return;

    const filteredTasks = this.filterTasks();
    const sortedTasks = this.sortTasks(filteredTasks);

    if (sortedTasks.length === 0) {
      container.innerHTML = '<div class="no-tasks">No tasks found.</div>';
      return;
    }

    container.innerHTML = sortedTasks.map(task => this.renderTaskCard(task)).join('');
  }

  private filterTasks() {
    let filtered = [...this.tasks];

    const statusFilter = (this.querySelector('#statusFilter') as HTMLSelectElement)?.value;
    const priorityFilter = (this.querySelector('#priorityFilter') as HTMLSelectElement)?.value;
    const categoryFilter = (this.querySelector('#categoryFilter') as HTMLSelectElement)?.value;

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (priorityFilter && priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(task => task.category === categoryFilter);
    }

    return filtered;
  }

  private sortTasks(tasks: any[]) {
    const sortBy = (this.querySelector('#sortBy') as HTMLSelectElement)?.value || 'created_at';
    
    return [...tasks].sort((a, b) => {
      switch (sortBy) {
        case 'created_at':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder: { [key: string]: number } = { urgent: 4, high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }

  private renderTaskCard(task: any) {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && 
                     !['completed', 'cancelled'].includes(task.status);
    
    const priorityClass = `priority-${task.priority}`;
    const statusClass = `status-${task.status}`;
    const overdueClass = isOverdue ? 'overdue' : '';

    return `
      <div class="task-card ${priorityClass} ${statusClass} ${overdueClass}" data-task-id="${task.id}">
        <div class="task-header">
          <h4 class="task-title">${this.escapeHtml(task.title)}</h4>
          <div class="task-badges">
            <span class="badge priority-badge ${priorityClass}">${task.priority}</span>
            <span class="badge status-badge ${statusClass}">${task.status.replace('_', ' ')}</span>
            <span class="badge category-badge">${task.category.replace('_', ' ')}</span>
            ${isOverdue ? '<span class="badge overdue-badge">OVERDUE</span>' : ''}
          </div>
        </div>

        ${task.description ? `<p class="task-description">${this.escapeHtml(task.description)}</p>` : ''}
        
        <div class="task-details">
          ${task.assignedTo ? `<div class="detail"><strong>Assigned to:</strong> Staff #${task.assignedTo}</div>` : ''}
          ${task.residentId ? `<div class="detail"><strong>Resident:</strong> Resident #${task.residentId}</div>` : ''}
          ${task.dueDate ? `<div class="detail"><strong>Due:</strong> ${new Date(task.dueDate).toLocaleDateString()}</div>` : ''}
          ${task.tags && task.tags.length > 0 ? `<div class="detail"><strong>Tags:</strong> ${task.tags.map((t: string) => `<span class="tag">${this.escapeHtml(t)}</span>`).join('')}</div>` : ''}
          ${task.notes ? `<div class="detail"><strong>Notes:</strong> ${this.escapeHtml(task.notes)}</div>` : ''}
        </div>

        <div class="task-actions">
          <button class="btn-edit" onclick="this.closest('.task-list').editTask(${task.id})">
            Edit
          </button>
          <button class="btn-delete" onclick="this.closest('.task-list').deleteTask(${task.id})">
            Delete
          </button>
          ${task.status !== 'completed' ? `<button class="btn-complete" onclick="this.closest('.task-list').completeTask(${task.id})">Complete</button>` : ''}
        </div>
      </div>
    `;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private updateStats() {
    const total = this.tasks.length;
    const pending = this.tasks.filter(t => t.status === 'pending').length;
    const inProgress = this.tasks.filter(t => t.status === 'in_progress').length;
    const completed = this.tasks.filter(t => t.status === 'completed').length;
    const overdue = this.tasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < new Date() && 
      !['completed', 'cancelled'].includes(t.status)
    ).length;

    const totalEl = this.querySelector('#totalCount');
    const pendingEl = this.querySelector('#pendingCount');
    const inProgressEl = this.querySelector('#inProgressCount');
    const completedEl = this.querySelector('#completedCount');
    const overdueEl = this.querySelector('#overdueCount');

    if (totalEl) totalEl.textContent = total.toString();
    if (pendingEl) pendingEl.textContent = pending.toString();
    if (inProgressEl) inProgressEl.textContent = inProgress.toString();
    if (completedEl) completedEl.textContent = completed.toString();
    if (overdueEl) overdueEl.textContent = overdue.toString();
  }

  private attachEventListeners() {
    const statusFilter = this.querySelector('#statusFilter');
    const priorityFilter = this.querySelector('#priorityFilter');
    const categoryFilter = this.querySelector('#categoryFilter');
    const sortBy = this.querySelector('#sortBy');

    [statusFilter, priorityFilter, categoryFilter, sortBy].forEach(filter => {
      if (filter) {
        filter.addEventListener('change', () => {
          this.updateDisplay();
        });
      }
    });
  }

  public async editTask(taskId: number) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      this.dispatchEvent(new CustomEvent('editTask', { detail: { task } }));
    }
  }

  public async deleteTask(taskId: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await this.taskService.deleteTask(taskId);
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.updateDisplay();
        this.updateStats();
        this.showMessage('Task deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting task:', error);
        this.showError('Error deleting task. Please try again.');
      }
    }
  }

  public async completeTask(taskId: number) {
    try {
      await this.taskService.updateTask(taskId, { status: 'completed' });
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        task.status = 'completed';
        task.completedAt = new Date().toISOString();
      }
      this.updateDisplay();
      this.updateStats();
      this.showMessage('Task marked as completed!', 'success');
    } catch (error) {
      console.error('Error completing task:', error);
      this.showError('Error completing task. Please try again.');
    }
  }

  public refreshTasks() {
    this.loadTasks();
  }

  private showMessage(message: string, type: 'success' | 'error') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    this.appendChild(messageDiv);
    
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }

  private showError(message: string) {
    this.showMessage(message, 'error');
  }
}

customElements.define('task-list', TaskList);
