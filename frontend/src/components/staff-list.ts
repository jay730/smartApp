// Professional Staff Directory
class StaffList extends HTMLElement {
  connectedCallback() {
    this.loadStaff();
    
    window.addEventListener('staffAdded', () => {
      this.loadStaff();
    });
  }
  
  async loadStaff() {
    try {
      const response = await fetch('http://localhost:5000/staff');
      const staff = await response.json();
      
          this.innerHTML = `
            <div style="background: white; border: 1px solid #ccc; padding: 20px; margin: 10px;">
              <h3>Staff (${staff.length})</h3>
              ${staff.length === 0 ? `
                <p>No staff yet. Add one above.</p>
              ` : `
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="background: #f0f0f0;">
                    <th style="border: 1px solid #ccc; padding: 8px;">Name</th>
                    <th style="border: 1px solid #ccc; padding: 8px;">Position</th>
                  </tr>
                  ${staff.map((member: any) => `
                    <tr>
                      <td style="border: 1px solid #ccc; padding: 8px;">${member.name}</td>
                      <td style="border: 1px solid #ccc; padding: 8px;">${this.formatRole(member.role)}</td>
                    </tr>
                  `).join('')}
                </table>
              `}
            </div>
          `;
    } catch (error) {
      this.innerHTML = `
        <div style="background: white; border: 1px solid #ccc; padding: 20px; margin: 10px;">
          <h3>Staff</h3>
          <p style="color: red;">Error: Cannot load staff. Check connection.</p>
        </div>
      `;
    }
  }
  
  formatRole(role: string): string {
    return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}

customElements.define('staff-list', StaffList);