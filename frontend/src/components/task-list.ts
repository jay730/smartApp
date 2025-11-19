// Professional Care Task Management
class TaskList extends HTMLElement {
  connectedCallback() {
    this.loadTasks();
    
    window.addEventListener('taskAdded', () => {
      this.loadTasks();
    });
  }
  
  async loadTasks() {
    try {
      const response = await fetch('http://localhost:5000/tasks');
      const tasks = await response.json();
      
          this.innerHTML = `
            <div style="background: white; border: 1px solid #ccc; padding: 20px; margin: 10px;">
              <h3>Tasks (${tasks.length})</h3>
              ${tasks.length === 0 ? `
                <p>No tasks yet. Add one above.</p>
              ` : `
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="background: #f0f0f0;">
                    <th style="border: 1px solid #ccc; padding: 8px;">Task</th>
                    <th style="border: 1px solid #ccc; padding: 8px;">Category</th>
                    <th style="border: 1px solid #ccc; padding: 8px;">Priority</th>
                    <th style="border: 1px solid #ccc; padding: 8px;">Status</th>
                  </tr>
                  ${tasks.map((task: any) => `
                    <tr>
                      <td style="border: 1px solid #ccc; padding: 8px;">${task.title}</td>
                      <td style="border: 1px solid #ccc; padding: 8px;">${this.formatCategory(task.category)}</td>
                      <td style="border: 1px solid #ccc; padding: 8px;">${this.formatPriority(task.priority)}</td>
                      <td style="border: 1px solid #ccc; padding: 8px;">${this.formatStatus(task.status)}</td>
                    </tr>
                  `).join('')}
                </table>
              `}
            </div>
          `;
    } catch (error) {
      this.innerHTML = `
        <div style="background: white; border: 1px solid #ccc; padding: 20px; margin: 10px;">
          <h3>Tasks</h3>
          <p style="color: red;">Error: Cannot load tasks. Check connection.</p>
        </div>
      `;
    }
  }
  
  formatCategory(category: string): string {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  formatPriority(priority: string): string {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  }
  
  formatStatus(status: string): string {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'urgent': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#2563eb';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  }
  
  getPriorityBackground(priority: string): string {
    switch (priority) {
      case 'urgent': return '#fef2f2';
      case 'high': return '#fff7ed';
      case 'medium': return '#eff6ff';
      case 'low': return '#f0fdf4';
      default: return '#f9fafb';
    }
  }
  
  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return '#16a34a';
      case 'in_progress': return '#2563eb';
      case 'pending': return '#ea580c';
      case 'cancelled': return '#6b7280';
      default: return '#6b7280';
    }
  }
  
  getStatusBackground(status: string): string {
    switch (status) {
      case 'completed': return '#f0fdf4';
      case 'in_progress': return '#eff6ff';
      case 'pending': return '#fff7ed';
      case 'cancelled': return '#f9fafb';
      default: return '#f9fafb';
    }
  }
}

customElements.define('task-list', TaskList);