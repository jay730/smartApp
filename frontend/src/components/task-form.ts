// Professional Care Task Assignment Form
class TaskForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div style="background: white; border: 1px solid #ccc; padding: 20px; margin: 10px;">
        <h3>Add Task</h3>
        <form id="taskForm">
          <div style="margin: 10px 0;">
            <label>Task:</label><br>
            <input type="text" id="title" required style="width: 300px; padding: 5px;">
          </div>
          <div style="margin: 10px 0;">
            <label>Category:</label><br>
            <select id="category" required style="width: 200px; padding: 5px;">
              <option value="">Select Category</option>
              <option value="medical">Medical</option>
              <option value="personal">Personal Care</option>
              <option value="housekeeping">Housekeeping</option>
              <option value="maintenance">Maintenance</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div style="margin: 10px 0;">
            <label>Priority:</label><br>
            <select id="priority" style="width: 200px; padding: 5px;">
              <option value="low">Low</option>
              <option value="medium" selected>Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button type="submit" style="background: #2c5aa0; color: white; padding: 10px 20px; border: none;">
            Add Task
          </button>
          <div id="message" style="margin-top: 10px; color: green;"></div>
        </form>
      </div>
    `;

    const form = this.querySelector('#taskForm') as HTMLFormElement;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const title = (this.querySelector('#title') as HTMLInputElement).value;
      const description = (this.querySelector('#description') as HTMLTextAreaElement).value;
      const priority = (this.querySelector('#priority') as HTMLSelectElement).value;
      const category = (this.querySelector('#category') as HTMLSelectElement).value;
      
      const message = this.querySelector('#message') as HTMLDivElement;
      message.textContent = 'Saving...';
      
      try {
        const response = await fetch('http://localhost:5000/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title,
            description: description,
            priority: priority,
            category: category
          })
        });
        
        if (response.ok) {
          message.textContent = 'Task added successfully!';
          form.reset();
          window.dispatchEvent(new CustomEvent('taskAdded'));
        } else {
          message.textContent = 'Error: Could not add task';
        }
      } catch (error) {
        message.textContent = 'Error: Could not connect to server';
      }
    });
  }
}

customElements.define('task-form', TaskForm);