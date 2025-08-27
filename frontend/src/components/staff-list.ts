// Staff List Web Component - Barebones TypeScript version
interface Staff {
    id: number;
    name: string;
    role: 'caregiver' | 'nurse' | 'admin';
    assignedResidents: number[];
    fileRefs: string[];
    createdAt?: string;
    updatedAt?: string;
}

interface Resident {
    id: number;
    name: string;
    roomNumber: string;
}

class StaffList extends HTMLElement {
    private shadow: ShadowRoot;
    private staff: Staff[] = [];
    private residents: Resident[] = [];

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.render();
        this.setupEventListeners();
        this.loadResidents();
        this.loadStaff();
    }

    private render(): void {
        this.shadow.innerHTML = `
            <style>
                .list-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    border-bottom: 2px solid #e9ecef;
                    padding-bottom: 0.5rem;
                }
                
                .refresh-button {
                    background: #28a745;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
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
                    border-radius: 4px;
                    padding: 1rem;
                    margin-bottom: 1rem;
                }
                
                .staff-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 0.5rem;
                }
                
                .staff-name {
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: #495057;
                    margin: 0;
                }
                
                .delete-button {
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.8rem;
                }
                
                .delete-button:hover {
                    background: #c82333;
                }
                
                .staff-details {
                    color: #6c757d;
                    font-size: 0.9rem;
                }
                
                .staff-details p {
                    margin: 0.25rem 0;
                }
                
                .role-badge {
                    display: inline-block;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    font-weight: bold;
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
                
                .assigned-residents {
                    margin-top: 0.5rem;
                    padding-top: 0.5rem;
                    border-top: 1px solid #e9ecef;
                }
                
                .residents-title {
                    font-weight: bold;
                    color: #495057;
                    margin-bottom: 0.25rem;
                }
                
                .resident-tag {
                    display: inline-block;
                    background: #e9ecef;
                    color: #495057;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    margin: 0.125rem;
                }
                
                .files-section {
                    margin-top: 0.5rem;
                    padding-top: 0.5rem;
                    border-top: 1px solid #e9ecef;
                }
                
                .files-title {
                    font-weight: bold;
                    color: #495057;
                    margin-bottom: 0.25rem;
                }
                
                .file-link {
                    color: #007bff;
                    text-decoration: none;
                    margin-right: 1rem;
                }
                
                .file-link:hover {
                    text-decoration: underline;
                }
                
                .loading {
                    text-align: center;
                    padding: 2rem;
                    color: #666;
                }
                
                .empty-state {
                    text-align: center;
                    padding: 2rem;
                    color: #666;
                }
                
                .error {
                    background: #f8d7da;
                    color: #721c24;
                    padding: 1rem;
                    border-radius: 4px;
                    margin-bottom: 1rem;
                }
            </style>
            
            <div class="list-header">
                <h3>Staff</h3>
                <button class="refresh-button" id="refreshBtn">🔄 Refresh</button>
            </div>
            
            <div id="loading" class="loading" style="display: none;">
                Loading staff...
            </div>
            
            <div id="error" class="error" style="display: none;"></div>
            
            <div id="emptyState" class="empty-state" style="display: none;">
                <p>No staff found.</p>
                <p>Add a new staff member using the form above.</p>
            </div>
            
            <div id="staffList"></div>
        `;
    }

    private setupEventListeners(): void {
        const refreshBtn = this.shadow.getElementById('refreshBtn') as HTMLButtonElement;
        
        refreshBtn.addEventListener('click', () => {
            this.loadStaff();
        });

        // Listen for custom events from other components
        document.addEventListener('staffAdded', () => {
            this.loadStaff();
        });
    }

    private async loadResidents(): Promise<void> {
        try {
            const response = await fetch('http://localhost:5000/residents');
            if (response.ok) {
                this.residents = await response.json();
            }
        } catch (error) {
            console.error('Error loading residents:', error);
        }
    }

    private async loadStaff(): Promise<void> {
        const loadingDiv = this.shadow.getElementById('loading') as HTMLDivElement;
        const staffListDiv = this.shadow.getElementById('staffList') as HTMLDivElement;
        const emptyStateDiv = this.shadow.getElementById('emptyState') as HTMLDivElement;
        const errorDiv = this.shadow.getElementById('error') as HTMLDivElement;
        const refreshBtn = this.shadow.getElementById('refreshBtn') as HTMLButtonElement;
        
        try {
            loadingDiv.style.display = 'block';
            staffListDiv.style.display = 'none';
            emptyStateDiv.style.display = 'none';
            errorDiv.style.display = 'none';
            refreshBtn.disabled = true;

            const response = await fetch('http://localhost:5000/staff');
            
            if (!response.ok) {
                throw new Error('Failed to fetch staff');
            }

            this.staff = await response.json();
            console.log('Staff loaded:', this.staff);
            
            loadingDiv.style.display = 'none';
            this.renderStaff();

        } catch (error) {
            console.error('Error loading staff:', error);
            loadingDiv.style.display = 'none';
            errorDiv.style.display = 'block';
            errorDiv.textContent = 'Failed to load staff. Please try again.';
        } finally {
            refreshBtn.disabled = false;
        }
    }

    private renderStaff(): void {
        const staffListDiv = this.shadow.getElementById('staffList') as HTMLDivElement;
        const emptyStateDiv = this.shadow.getElementById('emptyState') as HTMLDivElement;
        
        if (this.staff.length === 0) {
            staffListDiv.style.display = 'none';
            emptyStateDiv.style.display = 'block';
            return;
        }
        
        staffListDiv.style.display = 'block';
        emptyStateDiv.style.display = 'none';
        
        const staffHTML = this.staff.map(staffMember => this.createStaffHTML(staffMember)).join('');
        staffListDiv.innerHTML = staffHTML;
        
        this.setupDeleteListeners();
    }

    private createStaffHTML(staffMember: Staff): string {
        const filesCount = (staffMember.fileRefs && Array.isArray(staffMember.fileRefs)) ? staffMember.fileRefs.length : 0;
        const assignedResidentsCount = (staffMember.assignedResidents && Array.isArray(staffMember.assignedResidents)) ? staffMember.assignedResidents.length : 0;
        
        let assignedResidentsHTML = '';
        if (assignedResidentsCount > 0) {
            const residentTags = staffMember.assignedResidents.map(residentId => {
                const resident = this.residents.find(r => r.id === residentId);
                return resident ? `<span class="resident-tag">${resident.name} (Room ${resident.roomNumber})</span>` : '';
            }).filter(tag => tag !== '').join('');
            
            assignedResidentsHTML = `
                <div class="assigned-residents">
                    <div class="residents-title">Assigned Residents (${assignedResidentsCount}):</div>
                    ${residentTags}
                </div>
            `;
        }
        
        let filesHTML = '';
        if (filesCount > 0) {
            filesHTML = `
                <div class="files-section">
                    <div class="files-title">Files (${filesCount}):</div>
                    ${staffMember.fileRefs.map(fileRef => 
                        `<a href="http://localhost:5000/uploads/${fileRef}" target="_blank" class="file-link">📎 ${fileRef}</a>`
                    ).join('')}
                </div>
            `;
        }
        
        return `
            <div class="staff-item" data-id="${staffMember.id}">
                <div class="staff-header">
                    <h4 class="staff-name">${this.escapeHtml(staffMember.name)}</h4>
                    <button class="delete-button" data-id="${staffMember.id}">
                        🗑️ Delete
                    </button>
                </div>
                <div class="staff-details">
                    <p><strong>Role:</strong> <span class="role-badge role-${staffMember.role}">${staffMember.role}</span></p>
                    <p><strong>ID:</strong> ${staffMember.id}</p>
                </div>
                ${assignedResidentsHTML}
                ${filesHTML}
            </div>
        `;
    }

    private setupDeleteListeners(): void {
        const deleteButtons = this.shadow.querySelectorAll('.delete-button');
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', async (e: Event) => {
                const target = e.target as HTMLButtonElement;
                const id = target.getAttribute('data-id');
                if (id && confirm('Are you sure you want to delete this staff member?')) {
                    await this.deleteStaff(parseInt(id));
                }
            });
        });
    }

    private async deleteStaff(id: number): Promise<void> {
        try {
            const response = await fetch(`http://localhost:5000/staff/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete staff');
            }

            // Remove from local array
            this.staff = this.staff.filter(s => s.id !== id);
            this.renderStaff();
            
        } catch (error) {
            console.error('Error deleting staff:', error);
            alert('Failed to delete staff. Please try again.');
        }
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

customElements.define('staff-list', StaffList);
