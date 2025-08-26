// Staff List Web Component
// This component displays a list of all staff members and handles refreshing/deleting

import staffService from '../services/staff-service.js';
import { Staff } from '../types/index.js';

class StaffList extends HTMLElement {
  private shadow: ShadowRoot;
  private staff: Staff[] = []; // Store the staff data

  constructor() {
    super();
    // This is called when the component is created
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  // This method is called when the component is added to the page
  connectedCallback(): void {
    this.render();
    this.setupEventListeners();
    this.loadStaff(); // Load staff when component is ready
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
        
        .staff-item {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 15px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .staff-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .staff-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        
        .staff-name {
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
        
        .staff-details {
          color: #6c757d;
          font-size: 0.9rem;
          margin-bottom: 10px;
        }
        
        .staff-details span {
          margin-right: 15px;
        }
        
        .role-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .role-caregiver {
          background: #e3f2fd;
          color: #1976d2;
        }
        
        .role-nurse {
          background: #f3e5f5;
          color: #7b1fa2;
        }
        
        .role-admin {
          background: #fff3e0;
          color: #f57c00;
        }
        
        .staff-files {
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
        
        .assigned-residents {
          margin-top: 10px;
        }
        
        .residents-title {
          font-weight: 600;
          color: #495057;
          margin-bottom: 5px;
        }
        
        .resident-tag {
          background: #d4edda;
          color: #155724;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          margin-right: 5px;
          margin-bottom: 5px;
          display: inline-block;
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
          <h2 class="list-title">👥 Staff List</h2>
          <button class="refresh-button" id="refreshBtn">
            🔄 Refresh
          </button>
        </div>
        
        <!-- Message area for error messages -->
        <div id="message" class="error" style="display: none;"></div>
        
        <!-- Loading state -->
        <div id="loading" class="loading" style="display: none;">
          Loading staff members...
        </div>
        
        <!-- Empty state -->
        <div id="emptyState" class="empty-state" style="display: none;">
          <div class="empty-state-icon">👨‍⚕️</div>
          <h3>No staff members yet</h3>
          <p>Add your first staff member using the form on the left!</p>
        </div>
        
        <!-- Staff list -->
        <div id="staffList"></div>
      </div>
    `;
  }

  // Set up event listeners
  private setupEventListeners(): void {
    const refreshBtn = this.shadow.getElementById('refreshBtn') as HTMLButtonElement;
    
    // Handle refresh button click
    refreshBtn.addEventListener('click', () => {
      this.loadStaff();
    });

    // Listen for custom events from other components
    document.addEventListener('staffAdded', () => {
      // Refresh the list when a new staff member is added
      this.loadStaff();
    });
  }

  // Load staff from the backend
  private async loadStaff(): Promise<void> {
    const loadingDiv = this.shadow.getElementById('loading') as HTMLDivElement;
    const staffListDiv = this.shadow.getElementById('staffList') as HTMLDivElement;
    const emptyStateDiv = this.shadow.getElementById('emptyState') as HTMLDivElement;
    const refreshBtn = this.shadow.getElementById('refreshBtn') as HTMLButtonElement;
    
    try {
      // Show loading state
      loadingDiv.style.display = 'block';
      staffListDiv.style.display = 'none';
      emptyStateDiv.style.display = 'none';
      this.hideMessage();
      refreshBtn.disabled = true;

      // Fetch staff from the backend
      this.staff = await staffService.getAllStaff();
      
      // Debug: Log the staff data to see the structure
      console.log('Staff data received:', this.staff);
      if (this.staff.length > 0) {
        console.log('First staff member fileRefs:', this.staff[0].fileRefs);
        console.log('Type of fileRefs:', typeof this.staff[0].fileRefs);
        console.log('Is Array?', Array.isArray(this.staff[0].fileRefs));
      }
      
      // Hide loading state
      loadingDiv.style.display = 'none';
      
      // Render the staff
      this.renderStaff();

    } catch (error) {
      console.error('Error loading staff:', error);
      loadingDiv.style.display = 'none';
      this.showMessage(error instanceof Error ? error.message : 'Failed to load staff members. Please try again.');
    } finally {
      refreshBtn.disabled = false;
    }
  }

  // Render the list of staff members
  private renderStaff(): void {
    const staffListDiv = this.shadow.getElementById('staffList') as HTMLDivElement;
    const emptyStateDiv = this.shadow.getElementById('emptyState') as HTMLDivElement;
    
    if (this.staff.length === 0) {
      // Show empty state
      staffListDiv.style.display = 'none';
      emptyStateDiv.style.display = 'block';
      return;
    }
    
    // Show staff list
    staffListDiv.style.display = 'block';
    emptyStateDiv.style.display = 'none';
    
    // Create HTML for each staff member
    const staffHTML = this.staff.map(staffMember => this.createStaffHTML(staffMember)).join('');
    staffListDiv.innerHTML = staffHTML;
    
    // Add event listeners to delete buttons
    this.setupDeleteListeners();
  }

  // Create HTML for a single staff member
  private createStaffHTML(staffMember: Staff): string {
    const filesCount = (staffMember.fileRefs && Array.isArray(staffMember.fileRefs)) ? staffMember.fileRefs.length : 0;
    const assignedResidentsCount = (staffMember.assignedResidents && Array.isArray(staffMember.assignedResidents)) ? staffMember.assignedResidents.length : 0;
    
    return `
      <div class="staff-item" data-id="${staffMember.id}">
        <div class="staff-header">
          <h3 class="staff-name">${this.escapeHtml(staffMember.name)}</h3>
          <button class="delete-button" data-id="${staffMember.id}">
            🗑️ Delete
          </button>
        </div>
        
        <div class="staff-details">
          <span><strong>Role:</strong> <span class="role-badge role-${staffMember.role}">${staffMember.role}</span></span>
          <span><strong>Files:</strong> ${filesCount}</span>
          <span><strong>Assigned Residents:</strong> ${assignedResidentsCount}</span>
        </div>
        
        ${this.createFilesHTML(staffMember.fileRefs)}
        ${this.createAssignedResidentsHTML(staffMember.assignedResidents)}
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
      <div class="staff-files">
        <div class="files-title">Uploaded Files:</div>
        <div class="file-list">
          ${fileTags}
        </div>
      </div>
    `;
  }

  // Create HTML for assigned residents section
  private createAssignedResidentsHTML(assignedResidents: number[]): string {
    // Ensure assignedResidents is an array
    if (!assignedResidents || !Array.isArray(assignedResidents) || assignedResidents.length === 0) {
      return '';
    }
    
    const residentTags = assignedResidents.map(residentId => 
      `<span class="resident-tag">🏠 Resident ${residentId}</span>`
    ).join('');
    
    return `
      <div class="assigned-residents">
        <div class="residents-title">Assigned Residents:</div>
        <div>
          ${residentTags}
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
        const staffId = target.getAttribute('data-id');
        if (staffId) {
          await this.deleteStaff(parseInt(staffId));
        }
      });
    });
  }

  // Delete a staff member
  private async deleteStaff(staffId: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this staff member? This action cannot be undone.')) {
      return;
    }
    
    try {
      await staffService.deleteStaff(staffId);
      
      // Remove the staff member from our local array
      this.staff = this.staff.filter(s => s.id !== staffId);
      
      // Re-render the list
      this.renderStaff();
      
      // Show success message
      this.showMessage('Staff member deleted successfully!', 'success');
      
    } catch (error) {
      console.error('Error deleting staff member:', error);
      this.showMessage(error instanceof Error ? error.message : 'Failed to delete staff member. Please try again.');
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
// This makes the browser recognize <staff-list> as a valid HTML element
customElements.define('staff-list', StaffList);
