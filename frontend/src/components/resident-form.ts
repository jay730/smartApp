// Professional Resident Registration Form
class ResidentForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div style="background: white; border: 1px solid #ccc; padding: 20px; margin: 10px;">
        <h3>Add Resident</h3>
        <form id="residentForm">
          <div style="margin: 10px 0;">
            <label>Name:</label><br>
            <input type="text" id="name" required style="width: 200px; padding: 5px;">
          </div>
          <div style="margin: 10px 0;">
            <label>Room Number:</label><br>
            <input type="text" id="roomNumber" required style="width: 200px; padding: 5px;">
          </div>
          <div style="margin: 10px 0;">
            <label>Date of Birth:</label><br>
            <input type="date" id="dateOfBirth" required style="width: 200px; padding: 5px;">
          </div>
          <button type="submit" style="background: #2c5aa0; color: white; padding: 10px 20px; border: none;">
            Add Resident
          </button>
          <div id="message" style="margin-top: 10px; color: green;"></div>
        </form>
      </div>
    `;

    // When form is submitted, save the resident
    const form = this.querySelector('#residentForm') as HTMLFormElement;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get the form data
      const name = (this.querySelector('#name') as HTMLInputElement).value;
      const roomNumber = (this.querySelector('#roomNumber') as HTMLInputElement).value;
      const dateOfBirth = (this.querySelector('#dateOfBirth') as HTMLInputElement).value;
      
      // Show loading message
      const message = this.querySelector('#message') as HTMLDivElement;
      message.textContent = 'Saving...';
      
      try {
        // Send data to backend
        const response = await fetch('http://localhost:5000/residents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            roomNumber: roomNumber,
            dateOfBirth: dateOfBirth
          })
        });
        
        if (response.ok) {
          message.textContent = 'Resident added successfully!';
          form.reset();
          // Tell other components to refresh
          window.dispatchEvent(new CustomEvent('residentAdded'));
        } else {
          message.textContent = 'Error: Could not add resident';
        }
      } catch (error) {
        message.textContent = 'Error: Could not connect to server';
      }
    });
  }
}

// Register our custom element
customElements.define('resident-form', ResidentForm);