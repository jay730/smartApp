// Resident Form Web Component
// This component creates a form for adding new residents with file upload capability

import residentService from '../services/resident-service.js';
import { Resident } from '../types/index.js';

class ResidentForm extends HTMLElement {
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
      </style>
      
      <div class="form-container">
        <h2 class="form-title">➕ Add New Resident</h2>
        
        <!-- Message area for success/error messages -->
        <div id="message" class="message" style="display: none;"></div>
        
        <form id="residentForm">
          <div class="form-group">
            <label for="name" class="form-label">Full Name *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              class="form-input" 
              required 
              placeholder="Enter resident's full name"
            >
          </div>
          
          <div class="form-group">
            <label for="roomNumber" class="form-label">Room Number *</label>
            <input 
              type="text" 
              id="roomNumber" 
              name="roomNumber" 
              class="form-input" 
              required 
              placeholder="e.g., 101, 2A, etc."
            >
          </div>
          
          <div class="form-group">
            <label for="dateOfBirth" class="form-label">Date of Birth</label>
            <input 
              type="date" 
              id="dateOfBirth" 
              name="dateOfBirth" 
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">Upload Files</label>
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
            Add Resident
          </button>
        </form>
      </div>
    `;
  }

  // Set up all the event listeners for our form
  private setupEventListeners(): void {
    const form = this.shadow.getElementById('residentForm') as HTMLFormElement;
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
      submitBtn.textContent = 'Adding Resident...';
      this.hideMessage();

      // Get form data
      const formData = new FormData();
      const name = (this.shadow.getElementById('name') as HTMLInputElement).value;
      const roomNumber = (this.shadow.getElementById('roomNumber') as HTMLInputElement).value;
      const dateOfBirth = (this.shadow.getElementById('dateOfBirth') as HTMLInputElement).value;
      const files = (this.shadow.getElementById('files') as HTMLInputElement).files;

      // Add form fields to FormData
      formData.append('name', name);
      formData.append('roomNumber', roomNumber);
      if (dateOfBirth) {
        formData.append('dateOfBirth', dateOfBirth);
      }

      // Add files to FormData
      if (files) {
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }
      }

      // Send the data to the backend
      const result = await residentService.createResident(formData);
      
      // Show success message
      this.showMessage('Resident added successfully!', 'success');
      
      // Reset the form
      this.resetForm();
      
      // Dispatch a custom event to notify other components
      this.dispatchEvent(new CustomEvent('residentAdded', {
        detail: result,
        bubbles: true,
        composed: true
      }));

    } catch (error) {
      console.error('Form submission error:', error);
      this.showMessage(error instanceof Error ? error.message : 'Failed to add resident. Please try again.', 'error');
    } finally {
      // Re-enable the submit button
      submitBtn.disabled = false;
      submitBtn.textContent = 'Add Resident';
    }
  }

  // Reset the form to its initial state
  private resetForm(): void {
    const form = this.shadow.getElementById('residentForm') as HTMLFormElement;
    form.reset();
    (this.shadow.getElementById('selectedFiles') as HTMLDivElement).innerHTML = '';
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
// This makes the browser recognize <resident-form> as a valid HTML element
customElements.define('resident-form', ResidentForm);
