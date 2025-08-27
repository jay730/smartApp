// src/components/resident-list.ts
interface Resident {
  id: number;
  name: string;
  roomNumber: string;
  dateOfBirth?: string;
  fileRefs?: string[];
}

class ResidentList extends HTMLElement {
  private static readonly API = "http://localhost:5000/residents";
  private residents: Resident[] = [];
  private editingId: number | null = null;

  connectedCallback(): void {
    console.log("[ResidentList] connectedCallback");
    this.innerHTML = `
			<div><button id="refresh">Refresh</button></div>
			<div id="status" style="margin:8px 0;"></div>
			<ul id="list"></ul>
		`;

    const refreshBtn = this.querySelector("#refresh");
    console.log("[ResidentList] refreshBtn exists?", !!refreshBtn);
    refreshBtn?.addEventListener("click", () => {
      console.log("[ResidentList] Refresh clicked");
      this.load();
    });

    document.addEventListener("residentAdded", () => {
      console.log("[ResidentList] residentAdded event received");
      this.load();
    });

    this.load();
  }

  private async load(): Promise<void> {
    const status = this.querySelector("#status") as HTMLDivElement | null;
    const list = this.querySelector("#list") as HTMLUListElement | null;
    console.log("[ResidentList] load() start", {
      hasStatus: !!status,
      hasList: !!list,
    });

    if (!status || !list) {
      console.warn("[ResidentList] Missing status or list element");
      return;
    }

    status.textContent = "Loading...";
    list.innerHTML = "";

    try {
      console.log("[ResidentList] fetching", ResidentList.API);
      const res = await fetch(ResidentList.API);
      console.log("[ResidentList] load() response", res.status, res.statusText);

      if (!res.ok) throw new Error(`GET failed: ${res.status}`);
      this.residents = await res.json();
      console.log("[ResidentList] load() parsed", {
        count: this.residents.length,
        sample: this.residents[0],
      });

      this.renderList();
    } catch (err) {
      console.error("[ResidentList] load() error", err);
      status.textContent = "Failed to load";
    }
  }

  private renderList(): void {
    const list = this.querySelector("#list") as HTMLUListElement | null;
    const status = this.querySelector("#status") as HTMLDivElement | null;
    console.log("[ResidentList] renderList()", {
      residents: this.residents.length,
      editingId: this.editingId,
      hasList: !!list,
    });

    if (!list || !status) return;

    status.textContent = this.residents.length ? "" : "No residents";

    list.innerHTML = this.residents
      .map((r) => {
        if (this.editingId === r.id) {
          return `
					<li data-id="${r.id}">
						<div><label>Name</label><input name="name" value="${this.escape(
              r.name
            )}" /></div>
						<div><label>Room Number</label><input name="roomNumber" value="${this.escape(
              r.roomNumber
            )}" /></div>
						<div><label>Date of Birth</label><input name="dateOfBirth" type="date" value="${(
              r.dateOfBirth || ""
            ).slice(0, 10)}" /></div>
						<button data-save="${r.id}">Save</button>
						<button data-cancel="${r.id}">Cancel</button>
					</li>
				`;
        }
        return `
				<li data-id="${r.id}">
					<strong>${this.escape(r.name)}</strong>
					— Room: ${this.escape(r.roomNumber)}
					— DOB: ${r.dateOfBirth || ""}
					<button data-edit="${r.id}">Update</button>
					<button data-del="${r.id}">Delete</button>
				</li>
			`;
      })
      .join("");

    this.attachItemHandlers();
  }

  private attachItemHandlers(): void {
    const list = this.querySelector("#list") as HTMLUListElement | null;
    if (!list) {
      console.warn("[ResidentList] attachItemHandlers(): no list");
      return;
    }

    const editBtns = Array.from(list.querySelectorAll("[data-edit]"));
    const cancelBtns = Array.from(list.querySelectorAll("[data-cancel]"));
    const saveBtns = Array.from(list.querySelectorAll("[data-save]"));
    const delBtns = Array.from(list.querySelectorAll("[data-del]"));

    console.log("[ResidentList] attachItemHandlers()", {
      editBtns: editBtns.length,
      cancelBtns: cancelBtns.length,
      saveBtns: saveBtns.length,
      delBtns: delBtns.length,
    });

    editBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const idAttr = (btn as HTMLElement).getAttribute("data-edit");
        console.log("[ResidentList] Update clicked", { idAttr });
        const id = idAttr ? Number(idAttr) : NaN;
        if (!Number.isFinite(id)) return;
        this.editingId = id;
        this.renderList();
      });
    });

    cancelBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const idAttr = (btn as HTMLElement).getAttribute("data-cancel");
        console.log("[ResidentList] Cancel clicked", { idAttr });
        this.editingId = null;
        this.renderList();
      });
    });

    saveBtns.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const idAttr = (btn as HTMLElement).getAttribute("data-save");
        console.log("[ResidentList] Save clicked", { idAttr });
        const id = idAttr ? Number(idAttr) : NaN;
        if (!Number.isFinite(id)) return;
        await this.saveItem(id);
      });
    });

    delBtns.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const idAttr = (btn as HTMLElement).getAttribute("data-del");
        console.log("[ResidentList] Delete clicked", { idAttr });
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
    const roomNumber =
      (
        li.querySelector('input[name="roomNumber"]') as HTMLInputElement
      )?.value?.trim() || "";
    const dateOfBirth =
      (li.querySelector('input[name="dateOfBirth"]') as HTMLInputElement)
        ?.value || "";

    // Enforce required fields the backend expects to be non-empty
    if (!name) {
      alert("Name is required");
      return;
    }
    if (!roomNumber) {
      alert("Room number is required");
      return;
    }

    // Build multipart/form-data (resident PUT route expects multer)
    const fd = new FormData();
    fd.append("name", name);
    fd.append("roomNumber", roomNumber);

    // Only send date if provided (avoid sending empty string to a DATE column)
    if (dateOfBirth) {
      const valid = /^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth);
      if (!valid) {
        alert("Date must be YYYY-MM-DD");
        return;
      }
      fd.append("dateOfBirth", dateOfBirth);
    }

    try {
      const url = `${ResidentList.API}/${id}`; // API = http://localhost:5000/residents
      const res = await fetch(url, { method: "PUT", body: fd });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.error("Update failed", res.status, body);
        alert("Update failed");
        return;
      }
      this.editingId = null;
      await this.load();
    } catch (err) {
      console.error("Update error", err);
      alert("Update failed");
    }
  }

  private async removeItem(id: string): Promise<void> {
    console.log("[ResidentList] removeItem() start", { id });
    if (!confirm("Delete this resident?")) return;
    try {
      const res = await fetch(`${ResidentList.API}/${id}`, {
        method: "DELETE",
      });
      console.log(
        "[ResidentList] removeItem() response",
        res.status,
        res.statusText
      );
      if (res.ok) this.load();
      else alert("Delete failed");
    } catch (err) {
      console.error("[ResidentList] removeItem() error", err);
      alert("Delete failed");
    }
  }

  private escape(s: string | undefined | null): string {
    const d = document.createElement("div");
    d.textContent = s ?? "";
    return d.innerHTML;
  }
}

customElements.define("resident-list", ResidentList);
