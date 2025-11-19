// Professional Resident Directory
class ResidentList extends HTMLElement {
  connectedCallback() {
    this.loadResidents();
    
    // Listen for when a new resident is added
    window.addEventListener('residentAdded', () => {
      this.loadResidents();
    });
  }
  
  async loadResidents() {
    try {
      // Get residents from backend
      const response = await fetch('http://localhost:5000/residents');
      const residents = await response.json();
      
      // Show the residents in a professional table format
          this.innerHTML = `
            <div style="background: white; border: 1px solid #ccc; padding: 20px; margin: 10px;">
              <h3>Residents (${residents.length})</h3>
              ${residents.length === 0 ? `
                <p>No residents yet. Add one above.</p>
              ` : `
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="background: #f0f0f0;">
                    <th style="border: 1px solid #ccc; padding: 8px;">Name</th>
                    <th style="border: 1px solid #ccc; padding: 8px;">Room</th>
                    <th style="border: 1px solid #ccc; padding: 8px;">Birth Date</th>
                    <th style="border: 1px solid #ccc; padding: 8px;">Age</th>
                  </tr>
                  ${residents.map((resident: any) => `
                    <tr>
                      <td style="border: 1px solid #ccc; padding: 8px;">${resident.name}</td>
                      <td style="border: 1px solid #ccc; padding: 8px;">${resident.roomNumber}</td>
                      <td style="border: 1px solid #ccc; padding: 8px;">${new Date(resident.dateOfBirth).toLocaleDateString()}</td>
                      <td style="border: 1px solid #ccc; padding: 8px;">${this.calculateAge(resident.dateOfBirth)}</td>
                    </tr>
                  `).join('')}
                </table>
              `}
            </div>
          `;
    } catch (error) {
        this.innerHTML = `
          <div style="background: white; border: 1px solid #ccc; padding: 20px; margin: 10px;">
            <h3>Residents</h3>
            <p style="color: red;">Error: Cannot load residents. Check connection.</p>
          </div>
        `;
    }
  }
  
  calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}

// Register our custom element
customElements.define('resident-list', ResidentList);