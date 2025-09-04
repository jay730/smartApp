// src/components/task-list.ts
interface Task {
  id: number;
  title: string;
  description?: string;
  category: string;
  priority: string;
  assignedTo?: number;
  residentId?: number;
  dueDate?: string;
  status: string;
  tags?: string[];
  notes?: string;
}

class TaskList extends HTMLElement {
  private static readonly API = "http://localhost:5000/tasks";
  private tasks: Task[] = [];
  private editingId: number | null = null;

  connectedCallback(): void {
    this.innerHTML = `
      <div>
        <button id="refresh">Refresh</button>
      </div>
      <div id="status" style="margin:8px 0;"></div>
      <ul id="list"></ul>
    `;

    this.querySelector("#refresh")?.addEventListener("click", () =>
      this.load()
    );
    document.addEventListener("taskCreated", () => this.load());
    this.load();
  }

  private async load(): Promise<void> {
    const status = this.querySelector("#status") as HTMLDivElement | null;
    const list = this.querySelector("#list") as HTMLUListElement | null;
    if (!status || !list) return;

    status.textContent = "Loading...";
    list.innerHTML = "";

    try {
      const res = await fetch(TaskList.API);
      const data = await res.json();
      console.log("Tasks from API:", data); // <- debug log
      this.tasks = Array.isArray(data) ? data : data.tasks || [];
      this.renderList();
    } catch (err) {
      console.error("Failed to load tasks:", err);
      status.textContent = "Failed to load tasks";
    }
  }

  private renderList(): void {
    const list = this.querySelector("#list") as HTMLUListElement | null;
    const status = this.querySelector("#status") as HTMLDivElement | null;
    if (!list || !status) return;

    status.textContent = this.tasks.length ? "" : "No tasks";

    list.innerHTML = this.tasks
      .map((task) => {
        if (this.editingId === task.id) {
          // EDIT MODE
          return `
            <li data-id="${task.id}">
              <div>
                <label>Title</label>
                <input name="title" value="${this.escape(task.title)}" />
              </div>
              <div>
                <label>Category</label>
                <select name="category">
                  <option value="medical" ${
                    task.category === "medical" ? "selected" : ""
                  }>Medical</option>
                  <option value="personal_care" ${
                    task.category === "personal_care" ? "selected" : ""
                  }>Personal Care</option>
                  <option value="housekeeping" ${
                    task.category === "housekeeping" ? "selected" : ""
                  }>Housekeeping</option>
                  <option value="maintenance" ${
                    task.category === "maintenance" ? "selected" : ""
                  }>Maintenance</option>
                  <option value="social" ${
                    task.category === "social" ? "selected" : ""
                  }>Social</option>
                  <option value="other" ${
                    task.category === "other" ? "selected" : ""
                  }>Other</option>
                </select>
              </div>
              <div>
                <label>Priority</label>
                <select name="priority">
                  <option value="low" ${
                    task.priority === "low" ? "selected" : ""
                  }>Low</option>
                  <option value="medium" ${
                    task.priority === "medium" ? "selected" : ""
                  }>Medium</option>
                  <option value="high" ${
                    task.priority === "high" ? "selected" : ""
                  }>High</option>
                  <option value="urgent" ${
                    task.priority === "urgent" ? "selected" : ""
                  }>Urgent</option>
                </select>
              </div>
              <div>
                <label>Due Date</label>
                <input type="date" name="dueDate" value="${
                  task.dueDate ? task.dueDate.split("T")[0] : ""
                }" />
              </div>
              <div>
                <label>Status</label>
                <select name="status">
                  <option value="pending" ${
                    task.status === "pending" ? "selected" : ""
                  }>Pending</option>
                  <option value="in_progress" ${
                    task.status === "in_progress" ? "selected" : ""
                  }>In Progress</option>
                  <option value="completed" ${
                    task.status === "completed" ? "selected" : ""
                  }>Completed</option>
                  <option value="cancelled" ${
                    task.status === "cancelled" ? "selected" : ""
                  }>Cancelled</option>
                </select>
              </div>
              <button data-save="${task.id}">Save</button>
              <button data-cancel="${task.id}">Cancel</button>
            </li>
          `;
        }

        // VIEW MODE
        return `
          <li data-id="${task.id}">
            <strong>${this.escape(task.title)}</strong> — ${task.category} — ${
          task.priority
        } — Status: ${task.status}
            <button data-edit="${task.id}">Edit</button>
            <button data-del="${task.id}">Delete</button>
            ${
              task.status !== "completed"
                ? `<button data-complete="${task.id}">Complete</button>`
                : ""
            }
          </li>
        `;
      })
      .join("");

    this.attachItemHandlers();
  }

  private attachItemHandlers(): void {
    const list = this.querySelector("#list") as HTMLUListElement | null;
    if (!list) return;

    list.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idAttr = (btn as HTMLElement).getAttribute("data-edit");
        if (!idAttr) return;
        this.editingId = Number(idAttr);
        this.renderList();
      });
    });

    list.querySelectorAll("[data-cancel]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.editingId = null;
        this.renderList();
      });
    });

    list.querySelectorAll("[data-save]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const idAttr = (btn as HTMLElement).getAttribute("data-save");
        if (!idAttr) return;
        await this.saveTask(Number(idAttr));
      });
    });

    list.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const idAttr = (btn as HTMLElement).getAttribute("data-del");
        if (!idAttr) return;
        await this.deleteTask(Number(idAttr));
      });
    });

    list.querySelectorAll("[data-complete]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const idAttr = (btn as HTMLElement).getAttribute("data-complete");
        if (!idAttr) return;
        await this.completeTask(Number(idAttr));
      });
    });
  }

  private async saveTask(id: number): Promise<void> {
    const li = this.querySelector(
      `li[data-id="${id}"]`
    ) as HTMLLIElement | null;
    if (!li) return;

    const payload = {
      title:
        (li.querySelector('input[name="title"]') as HTMLInputElement)?.value ||
        "",
      category:
        (li.querySelector('select[name="category"]') as HTMLSelectElement)
          ?.value || "",
      priority:
        (li.querySelector('select[name="priority"]') as HTMLSelectElement)
          ?.value || "medium",
      dueDate:
        (li.querySelector('input[name="dueDate"]') as HTMLInputElement)
          ?.value || null,
      status:
        (li.querySelector('select[name="status"]') as HTMLSelectElement)
          ?.value || "pending",
    };

    try {
      const res = await fetch(`${TaskList.API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      this.editingId = null;
      await this.load();
    } catch (err) {
      console.error("Task update error", err);
      alert("Update failed");
    }
  }

  private async deleteTask(id: number): Promise<void> {
    if (!confirm("Delete this task?")) return;
    try {
      const res = await fetch(`${TaskList.API}/${id}`, { method: "DELETE" });
      if (res.ok) this.load();
      else alert("Delete failed");
    } catch (err) {
      console.error("Task delete error", err);
      alert("Delete failed");
    }
  }

  private async completeTask(id: number): Promise<void> {
    try {
      const res = await fetch(`${TaskList.API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      if (!res.ok) throw new Error("Complete failed");
      await this.load();
    } catch (err) {
      console.error("Task complete error", err);
      alert("Complete failed");
    }
  }

  private escape(s: string | undefined | null): string {
    const d = document.createElement("div");
    d.textContent = s ?? "";
    return d.innerHTML;
  }
}

customElements.define("task-list", TaskList);
