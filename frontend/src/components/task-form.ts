import { TaskService } from "../services/task-service";
import { StaffService } from "../services/staff-service";
import { ResidentService } from "../services/resident-service";

export class TaskForm extends HTMLElement {
  private staffService: StaffService;
  private residentService: ResidentService;
  private taskService: TaskService;
  private editMode: boolean = false;
  private editTaskId: number | null = null;

  constructor() {
    super();
    this.staffService = new StaffService();
    this.residentService = new ResidentService();
    this.taskService = new TaskService();
  }

  connectedCallback() {
    this.render();
    this.loadStaffAndResidents();
    this.attachEventListeners();
  }

  private render() {
    this.innerHTML = `
      <div class="task-form">
        <h3>${this.editMode ? 'Edit Task' : 'Add New Task'}</h3>
        <form id="taskForm">
          <div class="form-group">
            <label for="title">Title *</label>
            <input type="text" id="title" name="title" required>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" rows="3"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="category">Category *</label>
              <select id="category" name="category" required>
                <option value="">Select Category</option>
                <option value="medical">Medical</option>
                <option value="personal_care">Personal Care</option>
                <option value="housekeeping">Housekeeping</option>
                <option value="maintenance">Maintenance</option>
                <option value="social">Social</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label for="priority">Priority</label>
              <select id="priority" name="priority">
                <option value="low">Low</option>
                <option value="medium" selected>Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="assignedTo">Assign To</label>
              <select id="assignedTo" name="assignedTo">
                <option value="">Select Staff Member</option>
              </select>
            </div>

            <div class="form-group">
              <label for="residentId">Related Resident</label>
              <select id="residentId" name="residentId">
                <option value="">Select Resident</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="dueDate">Due Date</label>
            <input type="date" id="dueDate" name="dueDate">
          </div>

          <div class="form-group">
            <label for="tags">Tags (comma-separated)</label>
            <input type="text" id="tags" name="tags" placeholder="urgent, follow-up, weekly">
          </div>

          <div class="form-group">
            <label for="notes">Notes</label>
            <textarea id="notes" name="notes" rows="2"></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary">
              ${this.editMode ? 'Update Task' : 'Create Task'}
            </button>
            ${this.editMode ? '<button type="button" class="btn-secondary" id="cancelEdit">Cancel</button>' : ''}
          </div>
        </form>
      </div>
    `;
  }

  private async loadStaffAndResidents() {
    try {
      const [staff, residents] = await Promise.all([
        this.staffService.getAllStaff(),
        this.residentService.getAllResidents()
      ]);

      this.populateSelect('assignedTo', staff, 'id', 'name');
      this.populateSelect('residentId', residents, 'id', 'name');
    } catch (error) {
      console.error('Error loading staff and residents:', error);
    }
  }

  private populateSelect(selectId: string, items: any[], valueKey: string, textKey: string) {
    const select = this.querySelector(`#${selectId}`) as HTMLSelectElement;
    if (!select) return;

    items.forEach(item => {
      const option = document.createElement('option');
      option.value = item[valueKey];
      option.textContent = item[textKey];
      select.appendChild(option);
    });
  }

  private attachEventListeners() {
    const form = this.querySelector('#taskForm') as HTMLFormElement;
    if (form) {
      form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    const cancelBtn = this.querySelector('#cancelEdit');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', this.resetForm.bind(this));
    }
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();
    
    const formData = new FormData(event.target as HTMLFormElement);
    const taskData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      priority: formData.get('priority') as string,
      assignedTo: formData.get('assignedTo') ? Number(formData.get('assignedTo')) : undefined,
      residentId: formData.get('residentId') ? Number(formData.get('residentId')) : undefined,
      dueDate: formData.get('dueDate') as string,
      tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(t => t.trim()) : [],
      notes: formData.get('notes') as string
    };

    try {
      if (this.editMode && this.editTaskId) {
        await this.taskService.updateTask(this.editTaskId, taskData);
        this.dispatchEvent(new CustomEvent('taskUpdated', { detail: { taskId: this.editTaskId } }));
      } else {
        await this.taskService.createTask(taskData);
        this.dispatchEvent(new CustomEvent('taskCreated'));
      }
      
      this.resetForm();
      this.showMessage('Task saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving task:', error);
      this.showMessage('Error saving task. Please try again.', 'error');
    }
  }

  public setEditMode(task: any) {
    this.editMode = true;
    this.editTaskId = task.id;
    this.render();
    this.loadStaffAndResidents();
    this.populateForm(task);
    this.attachEventListeners();
  }

  private populateForm(task: any) {
    const form = this.querySelector('#taskForm') as HTMLFormElement;
    if (!form) return;

    (form.querySelector('#title') as HTMLInputElement).value = task.title || '';
    (form.querySelector('#description') as HTMLTextAreaElement).value = task.description || '';
    (form.querySelector('#category') as HTMLSelectElement).value = task.category || '';
    (form.querySelector('#priority') as HTMLSelectElement).value = task.priority || 'medium';
    (form.querySelector('#assignedTo') as HTMLSelectElement).value = task.assignedTo || '';
    (form.querySelector('#residentId') as HTMLSelectElement).value = task.residentId || '';
    (form.querySelector('#dueDate') as HTMLInputElement).value = task.dueDate ? task.dueDate.split('T')[0] : '';
    (form.querySelector('#tags') as HTMLInputElement).value = Array.isArray(task.tags) ? task.tags.join(', ') : '';
    (form.querySelector('#notes') as HTMLTextAreaElement).value = task.notes || '';
  }

  private resetForm() {
    this.editMode = false;
    this.editTaskId = null;
    this.render();
    this.loadStaffAndResidents();
    this.attachEventListeners();
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
}

customElements.define('task-form', TaskForm);
