// Staff Form Web Component
// This component creates a form for adding new staff members with file upload capability

import staffService from '../services/staff-service.js';
import { Staff, Resident } from '../types/index.js';

class StaffForm extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    // This is called when the component is created
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  // This method is called when the component is added to the page
  connectedCallback(): void {
    this.render();
    this.setupEventListeners();
  }

  // Render the HTML structure of our component
  private render(): void {
    this.shadow.innerHTML = `
      <style>
        /* Import the main styles */
        @import url('/src/styles.css');
        
        /* Component-specific styles */
        .form-container {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border: 1px solid #e9ecef;
        }
        
        .form-title {
          font-size: 1.5rem;
          margin-bottom: 20px;
          color: #495057;
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 10px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #495057;
        }
        
        .form-input {
          width: 100%;
          padding: 12px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .form-select {
          width: 100%;
          padding: 12px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
          background-color: white;
        }
        
        .form-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .form-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .form-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .form-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .file-upload {
          border: 2px dashed #e9ecef;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          transition: border-color 0.3s ease;
          cursor: pointer;
        }
        
        .file-upload:hover {
          border-color: #667eea;
        }
        
        .file-upload input[type="file"] {
          display: none;
        }
        
        .file-upload-label {
          color: #6c757d;
          cursor: pointer;
        }
        
        .file-upload-label:hover {
          color: #667eea;
        }
        
        .selected-files {
          margin-top: 10px;
          font-size: 0.9rem;
          color: #6c757d;
        }
        
        .message {
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        
        .error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        
        .assigned-residents {
          margin-top: 10px;
        }
        
        .resident-checkbox {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .resident-checkbox input[type="checkbox"] {
          margin-right: 8px;
        }
      </style>
      
      <div class="form-container">
        <h2 class="form-title">👨‍⚕️ Add New Staff Member</h2>
        
        <!-- Message area for success/error messages -->
        <div id="message" class="message" style="display: none;"></div>
        
        <form id="staffForm">
          <div class="form-group">
            <label for="name" class="form-label">Full Name *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              class="form-input" 
              required 
              placeholder="Enter staff member's full name"
            >
          </div>
          
          <div class="form-group">
            <label for="role" class="form-label">Role *</label>
            <select id="role" name="role" class="form-select" required>
              <option value="">Select a role</option>
              <option value="caregiver">Caregiver</option>
              <option value="nurse">Nurse</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Assigned Residents</label>
            <div id="residentsList" class="assigned-residents">
              <div class="loading">Loading residents...</div>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Upload Files (Certificates, Credentials)</label>
            <div class="file-upload" id="fileUpload">
              <input type="file" id="files" name="files" multiple accept="image/*,.pdf,.doc,.docx">
              <label for="files" class="file-upload-label">
                📁 Click to select files or drag and drop here
                <br>
                <small>Supports: Images, PDF, Word documents</small>
              </label>
            </div>
            <div id="selectedFiles" class="selected-files"></div>
          </div>
          
          <button type="submit" class="form-button" id="submitBtn">
            Add Staff Member
          </button>
        </form>
      </div>
    `;
  }

  // Set up all the event listeners for our form
  private setupEventListeners(): void {
    const form = this.shadow.getElementById('staffForm') as HTMLFormElement;
    const fileInput = this.shadow.getElementById('files') as HTMLInputElement;
    const fileUpload = this.shadow.getElementById('fileUpload') as HTMLDivElement;

    // Handle form submission
    form.addEventListener('submit', async (e: Event) => {
      e.preventDefault();
      await this.handleFormSubmit();
    });

    // Handle file selection
    fileInput.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.updateSelectedFiles(target.files);
    });

    // Handle drag and drop for files
    fileUpload.addEventListener('dragover', (e: DragEvent) => {
      e.preventDefault();
      fileUpload.style.borderColor = '#667eea';
    });

    fileUpload.addEventListener('dragleave', (e: DragEvent) => {
      e.preventDefault();
      fileUpload.style.borderColor = '#e9ecef';
    });

    fileUpload.addEventListener('drop', (e: DragEvent) => {
      e.preventDefault();
      fileUpload.style.borderColor = '#e9ecef';
      const files = e.dataTransfer?.files;
      if (files) {
        fileInput.files = files;
        this.updateSelectedFiles(files);
      }
    });

    // Load residents for assignment
    this.loadResidents();
  }

  // Load residents for assignment
  private async loadResidents(): Promise<void> {
    try {
      const response = await fetch('http://localhost:5000/residents');
      const residents: Resident[] = await response.json();
      this.renderResidentsList(residents);
    } catch (error) {
      console.error('Error loading residents:', error);
      (this.shadow.getElementById('residentsList') as HTMLDivElement).innerHTML = 
        '<div class="error">Failed to load residents</div>';
    }
  }

  // Render the residents list for assignment
  private renderResidentsList(residents: Resident[]): void {
    const residentsListDiv = this.shadow.getElementById('residentsList') as HTMLDivElement;
    
    if (residents.length === 0) {
      residentsListDiv.innerHTML = '<div>No residents available</div>';
      return;
    }

    const checkboxes = residents.map(resident => `
      <div class="resident-checkbox">
        <input type="checkbox" id="resident_${resident.id}" value="${resident.id}" name="assignedResidents">
        <label for="resident_${resident.id}">${resident.name} (Room ${resident.roomNumber})</label>
      </div>
    `).join('');

    residentsListDiv.innerHTML = checkboxes;
  }

  // Update the display of selected files
  private updateSelectedFiles(files: FileList | null): void {
    const selectedFilesDiv = this.shadow.getElementById('selectedFiles') as HTMLDivElement;
    
    if (!files || files.length === 0) {
      selectedFilesDiv.innerHTML = '';
      return;
    }

    const fileList = Array.from(files)
      .map(file => `<div>📄 ${file.name} (${this.formatFileSize(file.size)})</div>`)
      .join('');
    
    selectedFilesDiv.innerHTML = `
      <strong>Selected Files:</strong>
      ${fileList}
    `;
  }

  // Format file size for display
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Handle the form submission
  private async handleFormSubmit(): Promise<void> {
    const submitBtn = this.shadow.getElementById('submitBtn') as HTMLButtonElement;
    
    try {
      // Disable the submit button and show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Adding Staff Member...';
      this.hideMessage();

      // Get form data
      const formData = new FormData();
      const name = (this.shadow.getElementById('name') as HTMLInputElement).value;
      const role = (this.shadow.getElementById('role') as HTMLSelectElement).value;
      const files = (this.shadow.getElementById('files') as HTMLInputElement).files;

      // Get selected residents
      const selectedResidents = Array.from(
        this.shadow.querySelectorAll('input[name="assignedResidents"]:checked') as NodeListOf<HTMLInputElement>
      ).map(checkbox => parseInt(checkbox.value));

      // Add form fields to FormData
      formData.append('name', name);
      formData.append('role', role);
      formData.append('assignedResidents', JSON.stringify(selectedResidents));

      // Add files to FormData
      if (files) {
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }
      }

      // Send the data to the backend
      const result = await staffService.createStaff(formData);
      
      // Show success message
      this.showMessage('Staff member added successfully!', 'success');
      
      // Reset the form
      this.resetForm();
      
      // Dispatch a custom event to notify other components
      this.dispatchEvent(new CustomEvent('staffAdded', {
        detail: result,
        bubbles: true,
        composed: true
      }));

    } catch (error) {
      console.error('Form submission error:', error);
      this.showMessage(error instanceof Error ? error.message : 'Failed to add staff member. Please try again.', 'error');
    } finally {
      // Re-enable the submit button
      submitBtn.disabled = false;
      submitBtn.textContent = 'Add Staff Member';
    }
  }

  // Reset the form to its initial state
  private resetForm(): void {
    const form = this.shadow.getElementById('staffForm') as HTMLFormElement;
    form.reset();
    (this.shadow.getElementById('selectedFiles') as HTMLDivElement).innerHTML = '';
    
    // Uncheck all resident checkboxes
    const checkboxes = this.shadow.querySelectorAll('input[name="assignedResidents"]') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(checkbox => checkbox.checked = false);
  }

  // Show a message to the user
  private showMessage(text: string, type: 'success' | 'error'): void {
    const messageDiv = this.shadow.getElementById('message') as HTMLDivElement;
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        this.hideMessage();
      }, 5000);
    }
  }

  // Hide the message
  private hideMessage(): void {
    const messageDiv = this.shadow.getElementById('message') as HTMLDivElement;
    messageDiv.style.display = 'none';
  }
}

// Register the custom element
// This makes the browser recognize <staff-form> as a valid HTML element
customElements.define('staff-form', StaffForm);
