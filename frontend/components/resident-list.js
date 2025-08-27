// Resident List Web Component - Barebones version
class ResidentList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.residents = [];
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.loadResidents();
    }

    render() {
        this.shadowRoot.innerHTML = `
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
                
                .resident-item {
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 4px;
                    padding: 1rem;
                    margin-bottom: 1rem;
                }
                
                .resident-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 0.5rem;
                }
                
                .resident-name {
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
                
                .resident-details {
                    color: #6c757d;
                    font-size: 0.9rem;
                }
                
                .resident-details p {
                    margin: 0.25rem 0;
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
                <h3>Residents</h3>
                <button class="refresh-button" id="refreshBtn">🔄 Refresh</button>
            </div>
            
            <div id="loading" class="loading" style="display: none;">
                Loading residents...
            </div>
            
            <div id="error" class="error" style="display: none;"></div>
            
            <div id="emptyState" class="empty-state" style="display: none;">
                <p>No residents found.</p>
                <p>Add a new resident using the form above.</p>
            </div>
            
            <div id="residentsList"></div>
        `;
    }

    setupEventListeners() {
        const refreshBtn = this.shadowRoot.getElementById('refreshBtn');
        
        refreshBtn.addEventListener('click', () => {
            this.loadResidents();
        });

        // Listen for custom events from other components
        document.addEventListener('residentAdded', () => {
            this.loadResidents();
        });
    }

    async loadResidents() {
        const loadingDiv = this.shadowRoot.getElementById('loading');
        const residentsListDiv = this.shadowRoot.getElementById('residentsList');
        const emptyStateDiv = this.shadowRoot.getElementById('emptyState');
        const errorDiv = this.shadowRoot.getElementById('error');
        const refreshBtn = this.shadowRoot.getElementById('refreshBtn');
        
        try {
            loadingDiv.style.display = 'block';
            residentsListDiv.style.display = 'none';
            emptyStateDiv.style.display = 'none';
            errorDiv.style.display = 'none';
            refreshBtn.disabled = true;

            const response = await fetch('http://localhost:5000/residents');
            
            if (!response.ok) {
                throw new Error('Failed to fetch residents');
            }

            this.residents = await response.json();
            console.log('Residents loaded:', this.residents);
            
            loadingDiv.style.display = 'none';
            this.renderResidents();

        } catch (error) {
            console.error('Error loading residents:', error);
            loadingDiv.style.display = 'none';
            errorDiv.style.display = 'block';
            errorDiv.textContent = 'Failed to load residents. Please try again.';
        } finally {
            refreshBtn.disabled = false;
        }
    }

    renderResidents() {
        const residentsListDiv = this.shadowRoot.getElementById('residentsList');
        const emptyStateDiv = this.shadowRoot.getElementById('emptyState');
        
        if (this.residents.length === 0) {
            residentsListDiv.style.display = 'none';
            emptyStateDiv.style.display = 'block';
            return;
        }
        
        residentsListDiv.style.display = 'block';
        emptyStateDiv.style.display = 'none';
        
        const residentsHTML = this.residents.map(resident => this.createResidentHTML(resident)).join('');
        residentsListDiv.innerHTML = residentsHTML;
        
        this.setupDeleteListeners();
    }

    createResidentHTML(resident) {
        const dateOfBirth = resident.dateOfBirth ? new Date(resident.dateOfBirth).toLocaleDateString() : 'Not provided';
        const filesCount = (resident.fileRefs && Array.isArray(resident.fileRefs)) ? resident.fileRefs.length : 0;
        
        let filesHTML = '';
        if (filesCount > 0) {
            filesHTML = `
                <div class="files-section">
                    <div class="files-title">Files (${filesCount}):</div>
                    ${resident.fileRefs.map(fileRef => 
                        `<a href="http://localhost:5000/uploads/${fileRef}" target="_blank" class="file-link">📎 ${fileRef}</a>`
                    ).join('')}
                </div>
            `;
        }
        
        return `
            <div class="resident-item" data-id="${resident.id}">
                <div class="resident-header">
                    <h4 class="resident-name">${this.escapeHtml(resident.name)}</h4>
                    <button class="delete-button" data-id="${resident.id}">
                        🗑️ Delete
                    </button>
                </div>
                <div class="resident-details">
                    <p><strong>Room:</strong> ${this.escapeHtml(resident.roomNumber)}</p>
                    <p><strong>Date of Birth:</strong> ${dateOfBirth}</p>
                    <p><strong>ID:</strong> ${resident.id}</p>
                </div>
                ${filesHTML}
            </div>
        `;
    }

    setupDeleteListeners() {
        const deleteButtons = this.shadowRoot.querySelectorAll('.delete-button');
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this resident?')) {
                    await this.deleteResident(id);
                }
            });
        });
    }

    async deleteResident(id) {
        try {
            const response = await fetch(`http://localhost:5000/residents/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete resident');
            }

            // Remove from local array
            this.residents = this.residents.filter(r => r.id != id);
            this.renderResidents();
            
        } catch (error) {
            console.error('Error deleting resident:', error);
            alert('Failed to delete resident. Please try again.');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

customElements.define('resident-list', ResidentList);
