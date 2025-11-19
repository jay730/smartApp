// Professional Staff Registration Form
class StaffForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div style="background: white; border: 1px solid #ccc; padding: 20px; margin: 10px;">
        <h3>Add Staff</h3>
        <form id="staffForm">
          <div style="margin: 10px 0;">
            <label>Name:</label><br>
            <input type="text" id="name" required style="width: 200px; padding: 5px;">
          </div>
          <div style="margin: 10px 0;">
            <label>Position:</label><br>
            <select id="role" required style="width: 200px; padding: 5px;">
              <option value="">Select Position</option>
              <option value="nurse">Nurse</option>
              <option value="doctor">Doctor</option>
              <option value="aide">Nursing Aide</option>
              <option value="therapist">Therapist</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <button type="submit" style="background: #2c5aa0; color: white; padding: 10px 20px; border: none;">
            Add Staff
          </button>
          <div id="message" style="margin-top: 10px; color: green;"></div>
        </form>
      </div>
    `;

    const form = this.querySelector('#staffForm') as HTMLFormElement;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = (this.querySelector('#name') as HTMLInputElement).value;
      const role = (this.querySelector('#role') as HTMLSelectElement).value;
      
      const message = this.querySelector('#message') as HTMLDivElement;
      message.textContent = 'Saving...';
      
      try {
        const response = await fetch('http://localhost:5000/staff', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            role: role
          })
        });
        
        if (response.ok) {
          message.textContent = 'Staff member added successfully!';
          form.reset();
          window.dispatchEvent(new CustomEvent('staffAdded'));
        } else {
          message.textContent = 'Error: Could not add staff member';
        }
      } catch (error) {
        message.textContent = 'Error: Could not connect to server';
      }
    });
  }
}

customElements.define('staff-form', StaffForm);