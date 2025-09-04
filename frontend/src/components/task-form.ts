// src/components/task-form.ts
class TaskForm extends HTMLElement {
  private static readonly API = "http://localhost:5000/tasks";

  connectedCallback(): void {
    this.innerHTML = `
      <form id="taskForm">
        <div>
          <label>Title</label>
          <input id="title" required />
        </div>
        <div>
          <label>Description</label>
          <textarea id="description"></textarea>
        </div>
        <div>
          <label>Category</label>
          <select id="category" required>
            <option value="">Select</option>
            <option value="medical">Medical</option>
            <option value="personal_care">Personal Care</option>
            <option value="housekeeping">Housekeeping</option>
            <option value="maintenance">Maintenance</option>
            <option value="social">Social</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label>Priority</label>
          <select id="priority" required>
            <option value="">Select</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div>
          <label>Assigned Staff ID (optional)</label>
          <input id="assignedTo" placeholder="Staff #..." type="number" />
        </div>
        <div>
          <label>Resident ID (optional)</label>
          <input id="residentId" placeholder="Resident #..." type="number" />
        </div>
        <div>
          <label>Due Date (optional)</label>
          <input id="dueDate" type="date" />
        </div>
        <div>
          <label>Tags (comma-separated)</label>
          <input id="tags" placeholder="e.g. urgent,follow-up" />
        </div>
        <div>
          <label>Notes</label>
          <textarea id="notes"></textarea>
        </div>
        <button type="submit">Add Task</button>
        <div id="msg" style="margin-top:8px;"></div>
      </form>
    `;

    const form = this.querySelector("#taskForm") as HTMLFormElement | null;
    const msg = this.querySelector("#msg") as HTMLDivElement | null;
    if (!form || !msg) return;

    form.addEventListener("submit", async (e: Event) => {
      e.preventDefault();
      msg.textContent = "Saving...";

      const payload = {
        title: (this.querySelector("#title") as HTMLInputElement).value.trim(),
        description: (
          this.querySelector("#description") as HTMLTextAreaElement
        ).value.trim(),
        category: (this.querySelector("#category") as HTMLSelectElement).value,
        priority: (this.querySelector("#priority") as HTMLSelectElement).value,
        assignedTo:
          parseInt(
            (this.querySelector("#assignedTo") as HTMLInputElement).value
          ) || null,
        residentId:
          parseInt(
            (this.querySelector("#residentId") as HTMLInputElement).value
          ) || null,
        dueDate:
          (this.querySelector("#dueDate") as HTMLInputElement).value || null,
        tags: (this.querySelector("#tags") as HTMLInputElement).value
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        notes: (
          this.querySelector("#notes") as HTMLTextAreaElement
        ).value.trim(),
      };

      try {
        const res = await fetch(TaskForm.API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Create failed: ${res.status}`);
        msg.textContent = "Task added";
        form.reset();
        document.dispatchEvent(new CustomEvent("taskCreated"));
        setTimeout(() => (msg.textContent = ""), 1200);
      } catch (err) {
        console.error("[TaskForm] create error", err);
        msg.textContent = "Failed to add task";
      }
    });
  }
}

customElements.define("task-form", TaskForm);
