// Staff Form Web Component - Barebones TypeScript version
interface Resident {
    id: number;
    name: string;
    roomNumber: string;
}

class StaffForm extends HTMLElement {
    private shadow: ShadowRoot;
    private residents: Resident[] = [];

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.render();
        this.setupEventListeners();
        this.loadResidents();
    }

    private render(): void {
        this.shadow.innerHTML = `
            <style>
                .form-group {
                    margin-bottom: 1rem;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: bold;
                }
                .form-group input, .form-group select {
                    width: 100%;
                    padding: 0.5rem;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }
                .btn {
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    cursor: pointer;
                    border-radius: 4px;
                }
                .btn:hover {
                    background: #0056b3;
                }
                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .file-upload {
                    border: 2px dashed #ddd;
                    padding: 1rem;
                    text-align: center;
                    border-radius: 4px;
                    margin-bottom: 1rem;
                }
                .file-upload.dragover {
                    border-color: #007bff;
                    background: #f8f9fa;
                }
                .file-list {
                    margin-top: 0.5rem;
                }
                .file-item {
                    background: #f8f9fa;
                    padding: 0.5rem;
                    margin: 0.25rem 0;
                    border-radius: 4px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .remove-file {
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .message {
                    padding: 1rem;
                    border-radius: 4px;
                    margin-bottom: 1rem;
                }
                .message.error {
                    background: #f8d7da;
                    color: #721c24;
                }
                .message.success {
                    background: #d4edda;
                    color: #155724;
                }
                .resident-checkboxes {
                    max-height: 200px;
                    overflow-y: auto;
                    border: 1px solid #ddd;
                    padding: 0.5rem;
                    border-radius: 4px;
                }
                .resident-checkbox {
                    display: flex;
                    align-items: center;
                    margin-bottom: 0.25rem;
                }
                .resident-checkbox input {
                    width: auto;
                    margin-right: 0.5rem;
                }
            </style>
            
            <form id="staffForm">
                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="role">Role:</label>
                    <select id="role" name="role" required>
                        <option value="">Select a role</option>
                        <option value="caregiver">Caregiver</option>
                        <option value="nurse">Nurse</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Assigned Residents:</label>
                    <div class="resident-checkboxes" id="residentCheckboxes">
                        <p>Loading residents...</p>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Files:</label>
                    <div class="file-upload" id="fileUpload">
                        <p>Drag and drop files here or click to select</p>
                        <input type="file" id="fileInput" multiple style="display: none;">
                    </div>
                    <div class="file-list" id="fileList"></div>
                </div>
                
                <button type="submit" class="btn" id="submitBtn">Add Staff</button>
            </form>
            
            <div id="message"></div>
        `;
    }

    private setupEventListeners(): void {
        const form = this.shadow.getElementById('staffForm') as HTMLFormElement;
        const fileUpload = this.shadow.getElementById('fileUpload') as HTMLDivElement;
        const fileInput = this.shadow.getElementById('fileInput') as HTMLInputElement;
        const submitBtn = this.shadow.getElementById('submitBtn') as HTMLButtonElement;

        // File upload handling
        fileUpload.addEventListener('click', () => fileInput.click());
        fileUpload.addEventListener('dragover', (e: DragEvent) => {
            e.preventDefault();
            fileUpload.classList.add('dragover');
        });
        fileUpload.addEventListener('dragleave', () => {
            fileUpload.classList.remove('dragover');
        });
        fileUpload.addEventListener('drop', (e: DragEvent) => {
            e.preventDefault();
            fileUpload.classList.remove('dragover');
            if (e.dataTransfer?.files) {
                this.handleFiles(e.dataTransfer.files);
            }
        });
        fileInput.addEventListener('change', (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.files) {
                this.handleFiles(target.files);
            }
        });

        // Form submission
        form.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    private async loadResidents(): Promise<void> {
        try {
            const response = await fetch('http://localhost:5000/residents');
            if (response.ok) {
                this.residents = await response.json();
                this.renderResidentCheckboxes();
            }
        } catch (error) {
            console.error('Error loading residents:', error);
        }
    }

    private renderResidentCheckboxes(): void {
        const checkboxesDiv = this.shadow.getElementById('residentCheckboxes') as HTMLDivElement;
        
        if (this.residents.length === 0) {
            checkboxesDiv.innerHTML = '<p>No residents available</p>';
            return;
        }

        const checkboxesHTML = this.residents.map(resident => `
            <div class="resident-checkbox">
                <input type="checkbox" id="resident-${resident.id}" value="${resident.id}">
                <label for="resident-${resident.id}">${resident.name} (Room ${resident.roomNumber})</label>
            </div>
        `).join('');

        checkboxesDiv.innerHTML = checkboxesHTML;
    }

    private handleFiles(files: FileList): void {
        const fileList = this.shadow.getElementById('fileList') as HTMLDivElement;
        const fileArray = Array.from(files);
        
        fileArray.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <span>${file.name}</span>
                <button type="button" class="remove-file" onclick="this.parentElement.remove()">Remove</button>
            `;
            fileList.appendChild(fileItem);
        });
    }

    private async handleSubmit(): Promise<void> {
        const submitBtn = this.shadow.getElementById('submitBtn') as HTMLButtonElement;
        const messageDiv = this.shadow.getElementById('message') as HTMLDivElement;
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';
            
            const formData = new FormData();
            formData.append('name', (this.shadow.getElementById('name') as HTMLInputElement).value);
            formData.append('role', (this.shadow.getElementById('role') as HTMLSelectElement).value);
            
            // Add assigned residents
            const selectedResidents = this.shadow.querySelectorAll('input[type="checkbox"]:checked');
            selectedResidents.forEach(checkbox => {
                formData.append('assignedResidents', (checkbox as HTMLInputElement).value);
            });
            
            // Add files
            const fileItems = this.shadow.querySelectorAll('.file-item');
            fileItems.forEach(item => {
                const fileName = item.querySelector('span')?.textContent;
                if (fileName) {
                    formData.append('files', fileName);
                }
            });

            const response = await fetch('http://localhost:5000/staff/', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to add staff');
            }

            const result = await response.json();
            this.showMessage('Staff added successfully!', 'success');
            this.resetForm();
            
            // Notify other components
            document.dispatchEvent(new CustomEvent('staffAdded'));
            
        } catch (error) {
            console.error('Error adding staff:', error);
            this.showMessage('Failed to add staff. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Add Staff';
        }
    }

    private resetForm(): void {
        (this.shadow.getElementById('staffForm') as HTMLFormElement).reset();
        (this.shadow.getElementById('fileList') as HTMLDivElement).innerHTML = '';
    }

    private showMessage(text: string, type: 'error' | 'success'): void {
        const messageDiv = this.shadow.getElementById('message') as HTMLDivElement;
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }, 3000);
    }
}

customElements.define('staff-form', StaffForm);
