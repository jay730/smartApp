// Resident List Web Component
// This component displays a list of all residents and handles refreshing/deleting

import residentService from '../services/resident-service.js';
import { Resident } from '../types/index.js';

class ResidentList extends HTMLElement {
  private shadow: ShadowRoot;
  private residents: Resident[] = []; // Store the residents data

  constructor() {
    super();
    // This is called when the component is created
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  // This method is called when the component is added to the page
  connectedCallback(): void {
    this.render();
    this.setupEventListeners();
    this.loadResidents(); // Load residents when component is ready
  }

  // Render the HTML structure of our component
  private render(): void {
    this.shadow.innerHTML = `
      <style>
        /* Import the main styles */
        @import url('/src/styles.css');
        
        /* Component-specific styles */
        .list-container {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border: 1px solid #e9ecef;
        }
        
        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 10px;
        }
        
        .list-title {
          font-size: 1.5rem;
          color: #495057;
          margin: 0;
        }
        
        .refresh-button {
          background: #28a745;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .refresh-button:hover {
          background: #218838;
        }
        
        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .resident-item {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 15px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .resident-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .resident-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        
        .resident-name {
          font-size: 1.2rem;
          font-weight: 600;
          color: #495057;
          margin: 0;
        }
        
        .delete-button {
          background: #dc3545;
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .delete-button:hover {
          background: #c82333;
        }
        
        .resident-details {
          color: #6c757d;
          font-size: 0.9rem;
          margin-bottom: 10px;
        }
        
        .resident-details span {
          margin-right: 15px;
        }
        
        .resident-files {
          margin-top: 10px;
        }
        
        .files-title {
          font-weight: 600;
          color: #495057;
          margin-bottom: 5px;
        }
        
        .file-list {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        
        .file-tag {
          background: #e9ecef;
          color: #495057;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
        }
        
        .loading {
          text-align: center;
          padding: 40px;
          color: #6c757d;
        }
        
        .error {
          background: #f8d7da;
          color: #721c24;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #f5c6cb;
          margin-bottom: 20px;
        }
        
        .empty-state {
          text-align: center;
          padding: 40px;
          color: #6c757d;
        }
        
        .empty-state-icon {
          font-size: 3rem;
          margin-bottom: 10px;
        }
      </style>
      
      <div class="list-container">
        <div class="list-header">
          <h2 class="list-title">👥 Residents List</h2>
          <button class="refresh-button" id="refreshBtn">
            🔄 Refresh
          </button>
        </div>
        
        <!-- Message area for error messages -->
        <div id="message" class="error" style="display: none;"></div>
        
        <!-- Loading state -->
        <div id="loading" class="loading" style="display: none;">
          Loading residents...
        </div>
        
        <!-- Empty state -->
        <div id="emptyState" class="empty-state" style="display: none;">
          <div class="empty-state-icon">🏠</div>
          <h3>No residents yet</h3>
          <p>Add your first resident using the form on the left!</p>
        </div>
        
        <!-- Residents list -->
        <div id="residentsList"></div>
      </div>
    `;
  }

  // Set up event listeners
  private setupEventListeners(): void {
    const refreshBtn = this.shadow.getElementById('refreshBtn') as HTMLButtonElement;
    
    // Handle refresh button click
    refreshBtn.addEventListener('click', () => {
      this.loadResidents();
    });

    // Listen for custom events from other components
    document.addEventListener('residentAdded', () => {
      // Refresh the list when a new resident is added
      this.loadResidents();
    });
  }

  // Load residents from the backend
  private async loadResidents(): Promise<void> {
    const loadingDiv = this.shadow.getElementById('loading') as HTMLDivElement;
    const residentsListDiv = this.shadow.getElementById('residentsList') as HTMLDivElement;
    const emptyStateDiv = this.shadow.getElementById('emptyState') as HTMLDivElement;
    const refreshBtn = this.shadow.getElementById('refreshBtn') as HTMLButtonElement;
    
    try {
      // Show loading state
      loadingDiv.style.display = 'block';
      residentsListDiv.style.display = 'none';
      emptyStateDiv.style.display = 'none';
      this.hideMessage();
      refreshBtn.disabled = true;

      // Fetch residents from the backend
      this.residents = await residentService.getAllResidents();
      
      // Debug: Log the residents data to see the structure
      console.log('Residents data received:', this.residents);
      if (this.residents.length > 0) {
        console.log('First resident fileRefs:', this.residents[0].fileRefs);
        console.log('Type of fileRefs:', typeof this.residents[0].fileRefs);
        console.log('Is Array?', Array.isArray(this.residents[0].fileRefs));
      }
      
      // Hide loading state
      loadingDiv.style.display = 'none';
      
      // Render the residents
      this.renderResidents();

    } catch (error) {
      console.error('Error loading residents:', error);
      loadingDiv.style.display = 'none';
      this.showMessage(error instanceof Error ? error.message : 'Failed to load residents. Please try again.');
    } finally {
      refreshBtn.disabled = false;
    }
  }

  // Render the list of residents
  private renderResidents(): void {
    const residentsListDiv = this.shadow.getElementById('residentsList') as HTMLDivElement;
    const emptyStateDiv = this.shadow.getElementById('emptyState') as HTMLDivElement;
    
    if (this.residents.length === 0) {
      // Show empty state
      residentsListDiv.style.display = 'none';
      emptyStateDiv.style.display = 'block';
      return;
    }
    
    // Show residents list
    residentsListDiv.style.display = 'block';
    emptyStateDiv.style.display = 'none';
    
    // Create HTML for each resident
    const residentsHTML = this.residents.map(resident => this.createResidentHTML(resident)).join('');
    residentsListDiv.innerHTML = residentsHTML;
    
    // Add event listeners to delete buttons
    this.setupDeleteListeners();
  }

  // Create HTML for a single resident
  private createResidentHTML(resident: Resident): string {
    const dateOfBirth = resident.dateOfBirth ? new Date(resident.dateOfBirth).toLocaleDateString() : 'Not provided';
    const filesCount = (resident.fileRefs && Array.isArray(resident.fileRefs)) ? resident.fileRefs.length : 0;
    
    return `
      <div class="resident-item" data-id="${resident.id}">
        <div class="resident-header">
          <h3 class="resident-name">${this.escapeHtml(resident.name)}</h3>
          <button class="delete-button" data-id="${resident.id}">
            🗑️ Delete
          </button>
        </div>
        
        <div class="resident-details">
          <span><strong>Room:</strong> ${this.escapeHtml(resident.roomNumber)}</span>
          <span><strong>Date of Birth:</strong> ${dateOfBirth}</span>
          <span><strong>Files:</strong> ${filesCount}</span>
        </div>
        
        ${this.createFilesHTML(resident.fileRefs)}
      </div>
    `;
  }

  // Create HTML for files section
  private createFilesHTML(fileRefs: string[]): string {
    // Ensure fileRefs is an array
    if (!fileRefs || !Array.isArray(fileRefs) || fileRefs.length === 0) {
      return '';
    }
    
    const fileTags = fileRefs.map(fileRef => 
      `<span class="file-tag">📄 ${this.escapeHtml(fileRef)}</span>`
    ).join('');
    
    return `
      <div class="resident-files">
        <div class="files-title">Uploaded Files:</div>
        <div class="file-list">
          ${fileTags}
        </div>
      </div>
    `;
  }

  // Set up event listeners for delete buttons
  private setupDeleteListeners(): void {
    const deleteButtons = this.shadow.querySelectorAll('.delete-button');
    
    deleteButtons.forEach(button => {
      button.addEventListener('click', async (e: Event) => {
        e.stopPropagation();
        const target = e.target as HTMLButtonElement;
        const residentId = target.getAttribute('data-id');
        if (residentId) {
          await this.deleteResident(parseInt(residentId));
        }
      });
    });
  }

  // Delete a resident
  private async deleteResident(residentId: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this resident? This action cannot be undone.')) {
      return;
    }
    
    try {
      await residentService.deleteResident(residentId);
      
      // Remove the resident from our local array
      this.residents = this.residents.filter(r => r.id !== residentId);
      
      // Re-render the list
      this.renderResidents();
      
      // Show success message
      this.showMessage('Resident deleted successfully!', 'success');
      
    } catch (error) {
      console.error('Error deleting resident:', error);
      this.showMessage(error instanceof Error ? error.message : 'Failed to delete resident. Please try again.');
    }
  }

  // Show a message to the user
  private showMessage(text: string, type: 'error' | 'success' = 'error'): void {
    const messageDiv = this.shadow.getElementById('message') as HTMLDivElement;
    messageDiv.textContent = text;
    messageDiv.className = type;
    messageDiv.style.display = 'block';
    
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
      setTimeout(() => {
        this.hideMessage();
      }, 3000);
    }
  }

  // Hide the message
  private hideMessage(): void {
    const messageDiv = this.shadow.getElementById('message') as HTMLDivElement;
    messageDiv.style.display = 'none';
  }

  // Escape HTML to prevent XSS attacks
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Register the custom element
// This makes the browser recognize <resident-list> as a valid HTML element
customElements.define('resident-list', ResidentList);
