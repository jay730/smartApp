interface Resident {
  id: number;
  name: string;
  roomNumber: string;
  dateOfBirth: string | null;
  fileRefs?: string[];
}

class ResidentList extends HTMLElement {
  private shadow: ShadowRoot;
  private residents: Resident[] = [];
  private loading = true;
  private error: string | null = null;
  private editingId: number | null = null;
  private editData = { name: "", roomNumber: "", dateOfBirth: "" };
  private message: string | null = null;
  private messageType: "success" | "error" | null = null;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.fetchResidents();
  }

  private async fetchResidents() {
    try {
      const res = await fetch("http://localhost:5000/residents");
      if (!res.ok) throw new Error("Failed to load");
      this.residents = await res.json();
      this.loading = false;
    } catch (err) {
      this.error = "Failed to load residents";
      this.loading = false;
      console.error(err);
    }
    this.render();
  }

  private async handleDelete(id: number) {
    try {
      const res = await fetch(`http://localhost:5000/residents/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      this.residents = this.residents.filter((r) => r.id !== id);
      this.message = "Resident deleted successfully";
      this.messageType = "success";
    } catch (err) {
      console.error(err);
      this.message = "Failed to delete resident";
      this.messageType = "error";
    }
    this.render();
  }

  private async handleUpdate(id: number) {
    try {
      const payload = {
        ...this.editData,
        dateOfBirth:
          this.editData.dateOfBirth === "" ? null : this.editData.dateOfBirth,
      };

      const res = await fetch(`http://localhost:5000/residents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();

      this.residents = this.residents.map((r) => (r.id === id ? updated : r));
      this.editingId = null;
      this.message = "Resident updated successfully";
      this.messageType = "success";
    } catch (err) {
      console.error(err);
      this.message = "Failed to update resident";
      this.messageType = "error";
    }
    this.render();
  }

  private render() {
    if (!this.shadow) return;

    if (this.loading) {
      this.shadow.innerHTML = `<p>Loading residents...</p>`;
      return;
    }
    if (this.error) {
      this.shadow.innerHTML = `<p>${this.error}</p>`;
      return;
    }

    this.shadow.innerHTML = `
      <style>
        .message { padding: 0.5rem; margin-bottom: 1rem; }
        .success { background: lightgreen; }
        .error { background: salmon; }
        .card { border: 1px solid #ccc; padding: 1rem; margin-bottom: 1rem; }
      </style>

      ${
        this.message
          ? `<div class="message ${this.messageType}">
        ${this.message}
      </div>`
          : ""
      }

      <h2>Resident List</h2>
      ${this.residents.length === 0 ? "<p>No residents found.</p>" : ""}
      ${this.residents
        .map((resident) => {
          if (this.editingId === resident.id) {
            return `
            <div class="card">
              <input type="text" id="edit-name-${resident.id}" value="${this.editData.name}" placeholder="Name" />
              <input type="text" id="edit-room-${resident.id}" value="${this.editData.roomNumber}" placeholder="Room Number" />
              <input type="date" id="edit-dob-${resident.id}" value="${this.editData.dateOfBirth}" />
              <div style="margin-top:0.5rem">
                <button data-save="${resident.id}">Save</button>
                <button data-cancel="${resident.id}">Cancel</button>
              </div>
            </div>
          `;
          } else {
            return `
            <div class="card">
              <p><strong>Name:</strong> ${resident.name}</p>
              <p><strong>Room:</strong> ${resident.roomNumber}</p>
              <p><strong>DOB:</strong> ${resident.dateOfBirth ?? ""}</p>
              <button data-edit="${resident.id}">Edit</button>
              <button data-delete="${resident.id}">Delete</button>
              ${
                resident.fileRefs && resident.fileRefs.length > 0
                  ? `<div><strong>Files:</strong><ul>
                      ${resident.fileRefs
                        .map(
                          (f, i) =>
                            `<li><a href="http://localhost:5000/${f}" target="_blank">View File ${
                              i + 1
                            }</a></li>`
                        )
                        .join("")}
                    </ul></div>`
                  : ""
              }
            </div>
          `;
          }
        })
        .join("")}
    `;

    // wire up events
    this.shadow.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", () =>
        this.handleDelete(Number((btn as HTMLElement).dataset.delete))
      );
    });

    this.shadow.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number((btn as HTMLElement).dataset.edit);
        const resident = this.residents.find((r) => r.id === id)!;
        this.editingId = id;
        this.editData = {
          name: resident.name,
          roomNumber: resident.roomNumber,
          dateOfBirth: resident.dateOfBirth ?? "",
        };
        this.render();
      });
    });

    this.shadow.querySelectorAll("[data-cancel]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.editingId = null;
        this.render();
      });
    });

    this.shadow.querySelectorAll("[data-save]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number((btn as HTMLElement).dataset.save);
        this.editData = {
          name: (
            this.shadow.querySelector(`#edit-name-${id}`) as HTMLInputElement
          ).value,
          roomNumber: (
            this.shadow.querySelector(`#edit-room-${id}`) as HTMLInputElement
          ).value,
          dateOfBirth: (
            this.shadow.querySelector(`#edit-dob-${id}`) as HTMLInputElement
          ).value,
        };
        this.handleUpdate(id);
      });
    });
  }
}

customElements.define("resident-list", ResidentList);
