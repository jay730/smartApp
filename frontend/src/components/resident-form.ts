class ResidentForm extends HTMLElement {
  private static readonly API = "http://localhost:5000/residents";

  connectedCallback(): void {
    this.innerHTML = `
			<form id="residentForm">
				<div>
					<label>Name</label>
					<input id="name" required />
				</div>
				<div>
					<label>Room Number</label>
					<input id="roomNumber" required />
				</div>
				<div>
					<label>Date of Birth (YYYY-MM-DD)</label>
					<input id="dateOfBirth" type="date" required />
				</div>
				<div>
					<label>Files (optional)</label>
					<input id="files" type="file" multiple />
				</div>
				<button type="submit">Add Resident</button>
				<div id="msg" style="margin-top:8px;"></div>
			</form>
		`;

    const form = this.querySelector("#residentForm") as HTMLFormElement | null;
    const msg = this.querySelector("#msg") as HTMLDivElement | null;
    if (!form || !msg) return;

    form.addEventListener("submit", async (e: Event) => {
      e.preventDefault();
      msg.textContent = "Saving...";

      const fd = new FormData();
      fd.append(
        "name",
        (this.querySelector("#name") as HTMLInputElement).value.trim()
      );
      fd.append(
        "roomNumber",
        (this.querySelector("#roomNumber") as HTMLInputElement).value.trim()
      );
      fd.append(
        "dateOfBirth",
        (this.querySelector("#dateOfBirth") as HTMLInputElement).value
      );

      const filesInput = this.querySelector(
        "#files"
      ) as HTMLInputElement | null;
      const files = filesInput?.files ? Array.from(filesInput.files) : [];
      files.forEach((file) => fd.append("files", file));

      const res = await fetch(ResidentForm.API, { method: "POST", body: fd });
      if (!res.ok) {
        msg.textContent = "Failed to add resident";
        return;
      }

      msg.textContent = "Resident added";
      form.reset();
      document.dispatchEvent(new CustomEvent("residentAdded"));
      setTimeout(() => (msg.textContent = ""), 1200);
    });
  }
}

customElements.define("resident-form", ResidentForm);
