class ResidentForm extends HTMLElement {
  private shadow: ShadowRoot;
  private name = "";
  private roomNumber = "";
  private dateOfBirth = "";
  private files: FileList | null = null;
  private message: { type: "success" | "error"; text: string } | null = null;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  private handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const { name, value, files } = target;

    if (name === "name") this.name = value;
    if (name === "roomNumber") this.roomNumber = value;
    if (name === "dateOfBirth") this.dateOfBirth = value;
    if (name === "files" && files) this.files = files;
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", this.name);
    formData.append("roomNumber", this.roomNumber);
    formData.append("dateOfBirth", this.dateOfBirth);

    if (this.files) {
      Array.from(this.files).forEach((file) => {
        formData.append("file", file);
      });
    }

    try {
      const res = await fetch("http://localhost:5000/residents", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to add resident");

      this.message = { type: "success", text: "Resident added successfully!" };

      // Reset state
      this.name = "";
      this.roomNumber = "";
      this.dateOfBirth = "";
      this.files = null;
    } catch (err) {
      console.error(err);
      this.message = { type: "error", text: "Failed to add resident." };
    }

    this.render(); // re-render to update message + clear form
  }

  private render() {
    this.shadow.innerHTML = `
      <style>
        form div { margin: 0.5rem 0; }
        .success { color: green; }
        .error { color: red; }
      </style>
      <h2>Add New Resident</h2>
      <form id="residentForm" enctype="multipart/form-data">
        <div>
          <label>Name:</label>
          <input name="name" value="${this.name}" required />
        </div>
        <div>
          <label>Room Number:</label>
          <input name="roomNumber" value="${this.roomNumber}" required />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input type="date" name="dateOfBirth" value="${
            this.dateOfBirth
          }" required />
        </div>
        <div>
          <label>Upload Files:</label>
          <input type="file" name="files" multiple />
        </div>
        <button type="submit">Submit</button>
      </form>

      ${
        this.message
          ? `<div class="${this.message.type}">${this.message.text}</div>`
          : ""
      }
    `;

    // Add listeners after rendering
    this.shadow
      .querySelector("#residentForm")
      ?.addEventListener("submit", (e) => this.handleSubmit(e));

    this.shadow.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", (e) => this.handleInputChange(e));
      input.addEventListener("change", (e) => this.handleInputChange(e));
    });
  }
}

customElements.define("resident-form", ResidentForm);
