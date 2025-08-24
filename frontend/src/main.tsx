class ResidentTable extends HTMLElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private residents: any[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.fetchResidents();
  }

  async fetchResidents() {
    try {
      const res = await fetch("http://localhost:3000/residents");
      this.residents = await res.json();
      this.render();
    } catch (err) {
      console.error("Failed to load residents:", err);
    }
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background: #f4f4f4; }
      </style>
      <button id="createBtn">Add Resident</button>
      <table>
        <thead>
          <tr>
            <th>Resident ID</th>
            <th>Name</th>
            <th>Room</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${this.residents
            .map(
              (r) => `
            <tr>
              <td>${r.residentId}</td>
              <td>${r.name}</td>
              <td>${r.roomNumber}</td>
              <td>
                <button data-id="${r.residentId}" class="edit">Edit</button>
                <button data-id="${r.residentId}" class="delete">Delete</button>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    // Event Listeners
    this.shadowRoot
      .querySelector<HTMLButtonElement>("#createBtn")
      ?.addEventListener("click", () =>
        alert("Open CreateResidentDialog here")
      );

    this.shadowRoot
      .querySelectorAll<HTMLButtonElement>(".edit")
      .forEach((btn) =>
        btn.addEventListener("click", () =>
          alert("Open EditResidentDialog for " + btn.dataset.id)
        )
      );

    this.shadowRoot
      .querySelectorAll<HTMLButtonElement>(".delete")
      .forEach((btn) =>
        btn.addEventListener("click", () =>
          alert("Open DeleteResidentDialog for " + btn.dataset.id)
        )
      );
  }
}

customElements.define("resident-table", ResidentTable);
