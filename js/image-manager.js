// Initialize TinyMCE
function initializeRichTextEditor() {
    tinymce.init({
        selector: '.rich-text-editor',
        plugins: 'link image table lists advlist',
        toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | indent outdent | bullist numlist | link image | removeformat',
        height: 300,
        file_picker_callback: handleImageUpload,
        license_key: 'gpl'
    });
}

// Handle image uploads in TinyMCE
function handleImageUpload(callback, value, meta) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    input.onchange = function() {
        const file = this.files[0];
        const reader = new FileReader();
        
        reader.onload = function() {
            // Save image to localStorage
            const imageId = Date.now().toString();
            const imageData = {
                id: imageId,
                title: file.name,
                data: reader.result
            };
            saveImage(imageData);
            
            // Call the callback with the URL
            callback(reader.result, { title: file.name });
        };
        
        reader.readAsDataURL(file);
    };

    input.click();
}

// Save image to localStorage
function saveImage(imageData) {
    const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    images.push(imageData);
    localStorage.setItem('galleryImages', JSON.stringify(images));
    loadGallery(); // Refresh gallery display
}

// Delete image from localStorage
function deleteImage(imageId) {
    const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    const updatedImages = images.filter(img => img.id !== imageId);
    localStorage.setItem('galleryImages', JSON.stringify(updatedImages));
    loadGallery(); // Refresh gallery display
}

// Load gallery images
function loadGallery() {
    const gallery = document.getElementById('imageGallery');
    const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    
    gallery.innerHTML = images.map(image => `
        <div class="gallery-item" data-id="${image.id}">
            <img src="${image.data}" alt="${image.title}">
            <div class="image-info">
                <p>${image.title}</p>
            </div>
            <div class="image-actions">
                <button onclick="copyImageURL('${image.id}')" title="Copy URL">📋</button>
                <button onclick="deleteImage('${image.id}')" title="Delete">🗑️</button>
            </div>
        </div>
    `).join('');
}

// Copy image URL to clipboard
function copyImageURL(imageId) {
    const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    const image = images.find(img => img.id === imageId);
    if (image) {
        navigator.clipboard.writeText(image.data)
            .then(() => alert('Image URL copied to clipboard!'))
            .catch(err => console.error('Failed to copy URL:', err));
    }
}

// Handle image preview for content images
function setupImagePreviews() {
    const contentImage = document.getElementById('contentImage');
    const imagePreview = document.getElementById('contentImagePreview');
    
    contentImage.addEventListener('change', function(e) {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Initialize image upload form
function initializeImageUpload() {
    const uploadForm = document.getElementById('imageUploadForm');
    const imagePreview = document.getElementById('imagePreview');
    
    document.getElementById('imageFile').addEventListener('change', function(e) {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('imageTitle').value;
        const file = document.getElementById('imageFile').files[0];
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function() {
                const imageData = {
                    id: Date.now().toString(),
                    title: title || file.name,
                    data: reader.result
                };
                saveImage(imageData);
                uploadForm.reset();
                imagePreview.innerHTML = '';
                alert('Image uploaded successfully!');
            };
            reader.readAsDataURL(file);
        }
    });
}