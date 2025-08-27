// Resident Form Web Component - Barebones version
class ResidentForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
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
            </style>
            
            <form id="residentForm">
                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="roomNumber">Room Number:</label>
                    <input type="text" id="roomNumber" name="roomNumber" required>
                </div>
                
                <div class="form-group">
                    <label for="dateOfBirth">Date of Birth:</label>
                    <input type="date" id="dateOfBirth" name="dateOfBirth">
                </div>
                
                <div class="form-group">
                    <label>Files:</label>
                    <div class="file-upload" id="fileUpload">
                        <p>Drag and drop files here or click to select</p>
                        <input type="file" id="fileInput" multiple style="display: none;">
                    </div>
                    <div class="file-list" id="fileList"></div>
                </div>
                
                <button type="submit" class="btn" id="submitBtn">Add Resident</button>
            </form>
            
            <div id="message"></div>
        `;
    }

    setupEventListeners() {
        const form = this.shadowRoot.getElementById('residentForm');
        const fileUpload = this.shadowRoot.getElementById('fileUpload');
        const fileInput = this.shadowRoot.getElementById('fileInput');
        const submitBtn = this.shadowRoot.getElementById('submitBtn');

        // File upload handling
        fileUpload.addEventListener('click', () => fileInput.click());
        fileUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUpload.classList.add('dragover');
        });
        fileUpload.addEventListener('dragleave', () => {
            fileUpload.classList.remove('dragover');
        });
        fileUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUpload.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleFiles(files) {
        const fileList = this.shadowRoot.getElementById('fileList');
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

    async handleSubmit() {
        const submitBtn = this.shadowRoot.getElementById('submitBtn');
        const messageDiv = this.shadowRoot.getElementById('message');
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';
            
            const formData = new FormData();
            formData.append('name', this.shadowRoot.getElementById('name').value);
            formData.append('roomNumber', this.shadowRoot.getElementById('roomNumber').value);
            formData.append('dateOfBirth', this.shadowRoot.getElementById('dateOfBirth').value);
            
            // Add files
            const fileItems = this.shadowRoot.querySelectorAll('.file-item');
            fileItems.forEach(item => {
                const fileName = item.querySelector('span').textContent;
                // In a real app, you'd get the actual file object
                // For now, we'll just send the filename
                formData.append('files', fileName);
            });

            const response = await fetch('http://localhost:5000/residents/', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to add resident');
            }

            const result = await response.json();
            this.showMessage('Resident added successfully!', 'success');
            this.resetForm();
            
            // Notify other components
            document.dispatchEvent(new CustomEvent('residentAdded'));
            
        } catch (error) {
            console.error('Error adding resident:', error);
            this.showMessage('Failed to add resident. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Add Resident';
        }
    }

    resetForm() {
        this.shadowRoot.getElementById('residentForm').reset();
        this.shadowRoot.getElementById('fileList').innerHTML = '';
    }

    showMessage(text, type) {
        const messageDiv = this.shadowRoot.getElementById('message');
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }, 3000);
    }
}

customElements.define('resident-form', ResidentForm);
