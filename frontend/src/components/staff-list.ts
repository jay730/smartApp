// src/components/staff-list.ts
interface Staff {
  id: number;
  name: string;
  role: string;
  assignedResidents?: number[];
  fileRefs?: string[];
}

class StaffList extends HTMLElement {
  private static readonly API = "http://localhost:5000/staff";
  private staff: Staff[] = [];
  private editingId: number | null = null;

  connectedCallback(): void {
    this.innerHTML = `
			<div><button id="refresh">Refresh</button></div>
			<div id="status" style="margin:8px 0;"></div>
			<ul id="list"></ul>
		`;

    this.querySelector("#refresh")?.addEventListener("click", () =>
      this.load()
    );
    document.addEventListener("staffAdded", () => this.load());
    this.load();
  }

  private async load(): Promise<void> {
    const status = this.querySelector("#status") as HTMLDivElement | null;
    const list = this.querySelector("#list") as HTMLUListElement | null;
    if (!status || !list) return;

    status.textContent = "Loading...";
    list.innerHTML = "";

    try {
      const res = await fetch(StaffList.API);
      if (!res.ok) throw new Error();
      this.staff = await res.json();
      this.renderList();
    } catch {
      status.textContent = "Failed to load";
    }
  }

  private renderList(): void {
    const list = this.querySelector("#list") as HTMLUListElement | null;
    const status = this.querySelector("#status") as HTMLDivElement | null;
    if (!list || !status) return;

    status.textContent = this.staff.length ? "" : "No staff";

    list.innerHTML = this.staff
      .map((s) => {
        if (this.editingId === s.id) {
          // EDIT MODE
          return `
						<li data-id="${s.id}">
							<div><label>Name</label><input name="name" value="${this.escape(
                s.name
              )}" /></div>
							<div>
								<label>Role</label>
								<select name="role">
									<option value="caregiver" ${
                    s.role === "caregiver" ? "selected" : ""
                  }>caregiver</option>
									<option value="nurse" ${s.role === "nurse" ? "selected" : ""}>nurse</option>
									<option value="admin" ${s.role === "admin" ? "selected" : ""}>admin</option>
								</select>
							</div>
							<div>
								<label>Assigned Resident IDs (comma-separated)</label>
								<input name="residentIds" value="${(s.assignedResidents || []).join(",")}" />
							</div>
							<button data-save="${s.id}">Save</button>
							<button data-cancel="${s.id}">Cancel</button>
						</li>
					`;
        }
        // VIEW MODE
        return `
					<li data-id="${s.id}">
						<strong>${this.escape(s.name)}</strong>
						— Role: ${this.escape(s.role)}
						— Assigned: ${(s.assignedResidents || []).join(", ")}
						<button data-edit="${s.id}">Update</button>
						<button data-del="${s.id}">Delete</button>
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
        await this.saveItem(Number(idAttr));
      });
    });

    list.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const idAttr = (btn as HTMLElement).getAttribute("data-del");
        if (!idAttr) return;
        await this.removeItem(idAttr);
      });
    });
  }

  private async saveItem(id: number): Promise<void> {
    const li = this.querySelector(
      `li[data-id="${id}"]`
    ) as HTMLLIElement | null;
    if (!li) return;

    const name =
      (
        li.querySelector('input[name="name"]') as HTMLInputElement
      )?.value?.trim() || "";
    const role =
      (li.querySelector('select[name="role"]') as HTMLSelectElement)?.value ||
      "";
    const idsRaw =
      (
        li.querySelector('input[name="residentIds"]') as HTMLInputElement
      )?.value?.trim() || "";

    // Coerce to array of numbers
    const ids = idsRaw
      ? idsRaw
          .split(",")
          .map((s) => parseInt(s.trim(), 10))
          .filter((n) => Number.isFinite(n))
      : [];

    // Backend PUT is JSON or multipart? Route supports both via controller/middleware selection.
    // Keep it simple: send JSON for fields only (no files here).
    const payload = {
      name,
      role,
      assignedResidents: ids,
    };

    try {
      const res = await fetch(`${StaffList.API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);

      this.editingId = null;
      await this.load();
    } catch (err) {
      console.error("[StaffList] update error", err);
      alert("Update failed");
    }
  }

  private async removeItem(id: string): Promise<void> {
    if (!confirm("Delete this staff?")) return;
    try {
      const res = await fetch(`${StaffList.API}/${id}`, { method: "DELETE" });
      if (res.ok) this.load();
      else alert("Delete failed");
    } catch (err) {
      console.error("[StaffList] delete error", err);
      alert("Delete failed");
    }
  }

  private escape(s: string | undefined | null): string {
    const d = document.createElement("div");
    d.textContent = s ?? "";
    return d.innerHTML;
  }
}

customElements.define("staff-list", StaffList);
