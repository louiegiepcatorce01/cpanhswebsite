// Check authentication status
function checkAuth() {
    try {
        const loginData = localStorage.getItem('isAdminLoggedIn');
        if (!loginData) {
            window.location.href = 'admin.html';
            return false;
        }
        
        // Add additional security checks here if needed
        // For example, check login timestamp
        return true;
    } catch (error) {
        console.error('Error checking authentication:', error);
        window.location.href = 'admin.html';
        return false;
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) {
        window.location.href = 'admin.html';
        return;
    }

    // Initialize all dashboard components
    try {
        window.cmsSystem.initialize();
        initializeDashboard();
        loadDashboardContent();
        
        // Initialize rich text editor and image management
        if (typeof tinymce !== 'undefined') {
            initializeRichTextEditor();
        }
        initializeImageUpload();
        setupImagePreviews();
        loadGallery();
    } catch (error) {
        console.error('Error initializing dashboard:', error);
    }
});

function initializeDashboard() {
    // Set up navigation
    setupNavigation();
    
    // Set up event handlers
    setupEventHandlers();
    
    // Initialize modals
    setupModals();
}

function loadDashboardContent() {
    const content = window.cmsSystem.getContent();
    
    // Load updates
    const updatesList = document.querySelector('#updates .content-list');
    updatesList.innerHTML = ''; // Clear existing content
    
    content.updates.forEach(update => {
        updatesList.appendChild(createContentItem(update, 'update'));
    });
    
    // Load events
    const eventsList = document.querySelector('#events .content-list');
    eventsList.innerHTML = ''; // Clear existing content
    
    content.events.forEach(event => {
        eventsList.appendChild(createContentItem(event, 'event'));
    });
    
    // Update stats
    document.querySelector('#overview .stat-card:nth-child(1) p').textContent = 
        `${content.updates.length} posts`;
    document.querySelector('#overview .stat-card:nth-child(2) p').textContent = 
        `${content.events.length} total`;
}

// Navigation functionality
function setupNavigation() {
    try {
        const navLinks = document.querySelectorAll('.dashboard-nav a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (this.id === 'logoutBtn') {
                    // Handle logout
                    localStorage.removeItem('isAdminLoggedIn');
                    window.location.href = 'admin.html';
                    return;
                }
                
                // Store the section ID before removing active classes
                const sectionId = this.getAttribute('data-section');
                if (!sectionId) return;
                
                // Remove active class from all links and sections
                document.querySelectorAll('.dashboard-nav a').forEach(l => l.classList.remove('active'));
                document.querySelectorAll('.dashboard-section').forEach(section => {
                    section.classList.remove('active');
                });
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Show corresponding section
                const section = document.getElementById(sectionId);
                if (section) {
                    section.classList.add('active');
                    // Trigger a refresh of the content if needed
                    if (sectionId === 'updates' || sectionId === 'events') {
                        loadDashboardContent();
                    }
                }
            });
        });
        
        // Set initial active section (default to overview)
        const defaultSection = document.querySelector('.dashboard-nav a[data-section="overview"]');
        if (defaultSection) {
            defaultSection.click();
        }
    } catch (error) {
        console.error('Error in setupNavigation:', error);
    }
}

// Event handlers
function setupEventHandlers() {
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // New update button
    const newUpdateBtn = document.getElementById('newUpdateBtn');
    if (newUpdateBtn) {
        newUpdateBtn.addEventListener('click', function() {
            openModal('Add New Update');
        });
    }
    
    // New event button
    const newEventBtn = document.getElementById('newEventBtn');
    if (newEventBtn) {
        newEventBtn.addEventListener('click', function() {
            openModal('Add New Event');
        });
    }
    
    // Edit page button
    const editPageBtn = document.getElementById('editPageBtn');
    if (editPageBtn) {
        editPageBtn.addEventListener('click', function() {
            const selectedPage = document.getElementById('pageSelect').value;
            if (selectedPage) {
                openModal('Edit ' + selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1) + ' Page');
            }
        });
    }
    
    // Settings form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSettings();
        });
    }
    
    // Content form
    const contentForm = document.getElementById('contentForm');
    if (contentForm) {
        contentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveContent();
        });
    }
    
    // Setup close modal button
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            document.getElementById('contentModal').style.display = 'none';
        });
    }
    
    // Edit and delete buttons
    setupItemActions();
}

// Modal functionality
function setupModals() {
    const modal = document.getElementById('contentModal');
    const closeBtn = document.querySelector('.close-modal');
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function createContentItem(item, type) {
    const div = document.createElement('div');
    div.className = 'content-item';
    div.dataset.id = item.id || Date.now();
    div.dataset.type = type;
    
    const title = document.createElement('h3');
    title.textContent = item.title;
    
    const content = document.createElement('p');
    content.className = 'item-content';
    content.innerHTML = type === 'update' ? item.content : item.description;
    
    const date = document.createElement('p');
    date.className = 'item-date';
    date.dataset.date = item.date;
    date.textContent = new Date(item.date).toLocaleDateString();
    
    // Add image if exists
    if (item.image) {
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.title;
        div.appendChild(img);
    }
    
    const actions = document.createElement('div');
    actions.className = 'item-actions';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
        editItem(type, item.id);
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
        deleteItem(type, item.id);
    });
    
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    
    div.appendChild(title);
    div.appendChild(content);
    div.appendChild(date);
    div.appendChild(actions);
    
    return div;
}

function openModal(title) {
    const modal = document.getElementById('contentModal');
    const modalTitle = document.getElementById('modalTitle');

    modalTitle.textContent = title;
    modal.style.display = 'block';

    // Clear form
    document.getElementById('contentForm').reset();
    document.getElementById('contentForm').dataset.itemId = '';

    // Remove any existing TinyMCE instance and re-initialize
    if (window.tinymce && tinymce.get('contentBody')) {
        tinymce.get('contentBody').remove();
    }
    if (window.initializeRichTextEditor) {
        initializeRichTextEditor();
    }
}

// Content management functions
async function saveContent() {
    try {
        const title = document.getElementById('contentTitle').value;
        const body = tinymce.get('contentBody').getContent(); // Get content from TinyMCE
        const date = document.getElementById('contentDate').value;
        const modalTitle = document.getElementById('modalTitle').textContent;
        const imageInput = document.getElementById('contentImage');
        const formEl = document.getElementById('contentForm');
        
        if (!title || !body || !date) {
            alert('Please fill in all required fields');
            return;
        }

        let imageData = null;
        if (imageInput && imageInput.files && imageInput.files[0]) {
            const file = imageInput.files[0];
            imageData = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = () => reject(new Error('Failed to read image'));
                reader.readAsDataURL(file);
            });
        }

        const itemId = formEl.dataset.itemId ? Number(formEl.dataset.itemId) : Date.now();
        
        if (modalTitle.includes('Update')) {
            const update = {
                title: title,
                content: body,
                date: date,
                image: imageData,
                id: itemId
            };
            window.cmsSystem.addUpdate(update);
        } else if (modalTitle.includes('Event')) {
            const event = {
                title: title,
                description: body,
                date: date,
                image: imageData,
                id: itemId
            };
            window.cmsSystem.addEvent(event);
        } else {
            // Handle page content editing
            const pageName = document.getElementById('pageSelect').value;
            if (pageName) {
                const pageContent = {
                    title: title,
                    content: body,
                    lastUpdated: date,
                    image: imageData
                };
                window.cmsSystem.updatePage(pageName, pageContent);
            }
        }

        // Clear form and close modal
        formEl.reset();
        if (imageInput) {
            imageInput.value = '';
        }
        document.getElementById('contentImagePreview').innerHTML = '';
        document.getElementById('contentModal').style.display = 'none';
        
        // Reload content
        loadDashboardContent();
        
        alert('Content saved successfully!');
    } catch (error) {
        console.error('Error saving content:', error);
        alert('Error saving content. Please try again.');
    }
    
    // Reload dashboard content
    loadDashboardContent();
    
    // Trigger content update event
    window.dispatchEvent(new CustomEvent('contentUpdated', {
        detail: {
            type: modalTitle.includes('Update') ? 'updates' : 
                  modalTitle.includes('Event') ? 'events' : 'page',
            pageName: document.getElementById('pageSelect').value
        }
    }));
    
    // Close modal
    document.getElementById('contentModal').style.display = 'none';
    
    // Show success message
    alert('Content saved successfully!');
}

// Edit item function
function editItem(type, id) {
    const content = window.cmsSystem.getContent();
    const item = type === 'update' 
        ? content.updates.find(u => u.id === id)
        : content.events.find(e => e.id === id);
    
    if (item) {
        document.getElementById('contentTitle').value = item.title;
        document.getElementById('contentBody').value = type === 'update' ? item.content : item.description;
        document.getElementById('contentDate').value = item.date;
        document.getElementById('contentForm').dataset.itemId = id;
        
        // Clear existing image preview
        const previewDiv = document.getElementById('contentImagePreview');
        if (previewDiv) {
            previewDiv.innerHTML = item.image 
                ? `<img src="${item.image}" alt="Current Image">` 
                : '';
        }
        
        openModal('Edit ' + (type === 'update' ? 'Update' : 'Event'));
    }
}

// Delete item function
function deleteItem(type, id) {
    if (confirm('Are you sure you want to delete this item?')) {
        if (type === 'update') {
            window.cmsSystem.deleteUpdate(id);
        } else if (type === 'event') {
            window.cmsSystem.deleteEvent(id);
        }
        loadDashboardContent();
    }
}

function setupItemActions() {
    // No need for event listeners as we're using onclick attributes now
}

// Settings management
function saveSettings() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    // Here you would typically send this data to a server
    console.log('Saving settings:', { username, password });
    
    // Show success message
    alert('Settings saved successfully!');
}

// Logout functionality
function logout() {
    localStorage.removeItem('isAdminLoggedIn');
    window.location.href = 'admin.html';
}
