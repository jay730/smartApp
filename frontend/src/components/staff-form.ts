// src/components/staff-form.ts
class StaffForm extends HTMLElement {
  private static readonly API = "http://localhost:5000/staff";

  connectedCallback(): void {
    this.innerHTML = `
			<form id="staffForm">
				<div>
					<label>Name</label>
					<input id="name" required />
				</div>
				<div>
					<label>Role</label>
					<select id="role" required>
						<option value="">Select</option>
						<option value="caregiver">caregiver</option>
						<option value="nurse">nurse</option>
						<option value="admin">admin</option>
					</select>
				</div>
				<div>
					<label>Assigned Resident IDs (comma-separated)</label>
					<input id="residentIds" placeholder="e.g. 1,2,3" />
				</div>
				<div>
					<label>Files (optional)</label>
					<input id="files" type="file" multiple />
				</div>
				<button type="submit">Add Staff</button>
				<div id="msg" style="margin-top:8px;"></div>
			</form>
		`;

    const form = this.querySelector("#staffForm") as HTMLFormElement | null;
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
        "role",
        (this.querySelector("#role") as HTMLSelectElement).value
      );

      // Parse IDs as numbers, append as repeated "assignedResidents"
      const idsRaw = (
        this.querySelector("#residentIds") as HTMLInputElement
      ).value.trim();
      const ids = idsRaw
        ? idsRaw
            .split(",")
            .map((s) => parseInt(s.trim(), 10))
            .filter((n) => Number.isFinite(n))
        : [];
      ids.forEach((n) => fd.append("assignedResidents", String(n)));

      // Files must use key "file"
      const filesInput = this.querySelector("#files") as HTMLInputElement;
      Array.from(filesInput.files || []).forEach((file) => {
        fd.append("file", file);
      });

      try {
        const res = await fetch(StaffForm.API, { method: "POST", body: fd });
        if (!res.ok) throw new Error(`Create failed: ${res.status}`);
        msg.textContent = "Staff added";
        form.reset();
        document.dispatchEvent(new CustomEvent("staffAdded"));
        setTimeout(() => (msg.textContent = ""), 1200);
      } catch (err) {
        console.error("[StaffForm] create error", err);
        msg.textContent = "Failed to add staff";
      }
    });
  }
}

customElements.define("staff-form", StaffForm);
