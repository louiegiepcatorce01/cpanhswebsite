// Admin credentials (for demonstration only)
const DEMO_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Session timeout after 30 minutes
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Check if user is already logged in
function checkLoginState() {
    const loginData = localStorage.getItem('adminLoginData');
    if (loginData) {
        const data = JSON.parse(loginData);
        const now = new Date().getTime();
        
        // Check if session has expired
        if (now - data.timestamp > SESSION_TIMEOUT) {
            localStorage.removeItem('adminLoginData');
            return false;
        }
        return true;
    }
    return false;
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('loginMessage');

    // Clear previous messages
    messageElement.className = 'message';
    
    // Validate credentials
    if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
        messageElement.textContent = 'Login successful!';
        messageElement.classList.add('success');
        // Set unified login state for dashboard
        localStorage.setItem('isAdminLoggedIn', 'true');
        // Redirect to dashboard after delay
        setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
        }, 1500);
    } else {
        messageElement.textContent = 'Invalid username or password';
        messageElement.classList.add('error');
    }
    return false;
}

// Check login status when page loads
window.addEventListener('load', () => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    // If already logged in and trying to access login page, redirect to dashboard
    if (isLoggedIn && window.location.pathname.endsWith('admin.html')) {
        window.location.href = 'admin-dashboard.html';
    }
});