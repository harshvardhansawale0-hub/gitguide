// ============================================================
// GitGuide – Authentication JavaScript (Full-Stack Integrated)
// ============================================================
// Handles user registration, login, logout, and session management
// with live Express REST API integration and graceful fallback.
// ============================================================

// Initialize default fallback data if not present
function initAuth() {
    var users = localStorage.getItem('gitguide_users');
    if (!users) {
        var defaultUsers = [
            {
                username: 'admin',
                password: 'admin123',
                role: 'admin'
            },
            {
                username: 'harsh',
                password: 'User123!',
                role: 'user'
            },
            {
                username: 'demo',
                password: 'User123!',
                role: 'user'
            }
        ];
        localStorage.setItem('gitguide_users', JSON.stringify(defaultUsers));
    }
}

// Get all users (fallback helper)
function getUsers() {
    var users = localStorage.getItem('gitguide_users');
    return users ? JSON.parse(users) : [];
}

// Register a new user (Calls backend API with validation & fallback)
async function registerUser(name, contact, username, password) {
    // Password validation protocol
    if (password.length < 8) {
        return { success: false, message: 'Password must be at least 8 characters long.' };
    }
    if (!/[A-Z]/.test(password)) {
        return { success: false, message: 'Password must contain at least one uppercase letter.' };
    }
    if (!/\d/.test(password)) {
        return { success: false, message: 'Password must contain at least one number.' };
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
        return { success: false, message: 'Password must contain at least one symbol.' };
    }

    if (typeof API !== 'undefined' && API.auth) {
        var res = await API.auth.register(name, contact, username, password);
        if (res.success) {
            return { success: true, message: res.message || 'Registration successful!' };
        } else if (!res.isNetworkError) {
            return { success: false, message: res.message || 'Registration failed.' };
        }
    }

    // Fallback to localStorage if server offline
    var users = getUsers();
    var existingUser = users.find(function(u) {
        return u.username.toLowerCase() === username.toLowerCase();
    });

    if (existingUser) {
        return { success: false, message: 'Username already exists.' };
    }

    users.push({
        name: name,
        contact: contact,
        username: username,
        password: password,
        role: 'user'
    });

    localStorage.setItem('gitguide_users', JSON.stringify(users));
    return { success: true, message: 'Registration successful!' };
}

// Login user (Calls backend API with fallback)
async function loginUser(username, password) {
    if (typeof API !== 'undefined' && API.auth) {
        var res = await API.auth.login(username, password);
        if (res.success && res.user) {
            return { success: true, message: 'Login successful!', role: res.user.role };
        } else if (!res.isNetworkError) {
            return { success: false, message: res.message || 'Invalid username or password.' };
        }
    }

    // Fallback to localStorage if server offline
    var users = getUsers();
    var user = users.find(function(u) {
        return u.username.toLowerCase() === username.toLowerCase() && u.password === password;
    });

    if (user) {
        localStorage.setItem('gitguide_current_user', JSON.stringify({
            username: user.username,
            role: user.role
        }));
        return { success: true, message: 'Login successful!', role: user.role };
    } else {
        return { success: false, message: 'Invalid username or password.' };
    }
}

// Logout user
function logoutUser() {
    if (typeof API !== 'undefined' && API.auth) {
        API.auth.logout();
    }
    localStorage.removeItem('gitguide_current_user');
    localStorage.removeItem('gitguide_auth_token');
    window.location.href = 'index.html';
}

// Get current logged-in user
function getCurrentUser() {
    if (typeof API !== 'undefined' && API.getCurrentUser) {
        var u = API.getCurrentUser();
        if (u) return u;
    }
    var user = localStorage.getItem('gitguide_current_user');
    return user ? JSON.parse(user) : null;
}

// Run initialization on load
initAuth();
