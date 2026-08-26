// ============================================================
// GitGuide – Auth API Routes
// ============================================================
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Helper: generate token
function generateToken(user) {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

// POST /api/auth/register
router.post('/register', (req, res) => {
    try {
        const { name, contact, username, password } = req.body;

        if (!name || !username || !password) {
            return res.status(400).json({ success: false, message: 'Name, username, and password are required.' });
        }

        const cleanUsername = username.trim();

        // Password complexity validation matching frontend requirements
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
        }
        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({ success: false, message: 'Password must contain at least one uppercase letter.' });
        }
        if (!/\d/.test(password)) {
            return res.status(400).json({ success: false, message: 'Password must contain at least one number.' });
        }
        if (!/[^a-zA-Z0-9]/.test(password)) {
            return res.status(400).json({ success: false, message: 'Password must contain at least one symbol.' });
        }

        // Check if username is already taken
        const existing = db.prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?)').get(cleanUsername);
        if (existing) {
            return res.status(409).json({ success: false, message: 'Username already exists. Please choose another.' });
        }

        const passwordHash = bcrypt.hashSync(password, 10);
        const result = db.prepare(`
            INSERT INTO users (name, contact, username, password_hash, role)
            VALUES (?, ?, ?, ?, 'user')
        `).run(name.trim(), contact ? contact.trim() : null, cleanUsername, passwordHash);

        const newUser = db.prepare('SELECT id, name, contact, username, role, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
        const token = generateToken(newUser);

        // Record in audit log
        db.prepare('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)')
            .run(newUser.id, '👤', `New user registered: "${newUser.username}"`);

        return res.status(201).json({
            success: true,
            message: 'Registration successful! Welcome to GitGuide.',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                username: newUser.username,
                role: newUser.role
            }
        });
    } catch (err) {
        console.error('Error during registration:', err);
        return res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required.' });
        }

        const user = db.prepare('SELECT * FROM users WHERE LOWER(username) = LOWER(?)').get(username.trim());
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }

        const isMatch = bcrypt.compareSync(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }

        const token = generateToken(user);

        // Record successful login
        db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);
        db.prepare('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)')
            .run(user.id, '🔑', 'Successful login');

        return res.json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ success: false, message: 'Server error during login.' });
    }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
    return res.json({
        success: true,
        user: req.user
    });
});

// PUT /api/auth/profile
router.put('/profile', authenticateToken, (req, res) => {
    try {
        const { name, contact, username } = req.body;
        
        if (!name || !username) {
            return res.status(400).json({ success: false, message: 'Name and username are required.' });
        }

        const cleanUsername = username.trim();
        
        // Check if username is taken by another user
        const existing = db.prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?) AND id != ?').get(cleanUsername, req.user.id);
        if (existing) {
            return res.status(409).json({ success: false, message: 'Username already exists. Please choose another.' });
        }

        db.prepare('UPDATE users SET name = ?, contact = ?, username = ? WHERE id = ?')
            .run(name.trim(), contact ? contact.trim() : null, cleanUsername, req.user.id);

        const updatedUser = db.prepare('SELECT id, name, contact, username, role, created_at FROM users WHERE id = ?').get(req.user.id);
        const token = generateToken(updatedUser);

        // Record in audit log
        db.prepare('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)')
            .run(req.user.id, '✏️', 'Profile updated');

        return res.json({
            success: true,
            message: 'Profile updated successfully.',
            token,
            user: updatedUser
        });
    } catch (err) {
        console.error('Error updating profile:', err);
        return res.status(500).json({ success: false, message: 'Server error during profile update.' });
    }
});

// PUT /api/auth/password
router.put('/password', authenticateToken, (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, message: 'All password fields are required.' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'New password and confirm password do not match.' });
        }

        // Get full user with password hash
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
        
        const isMatch = bcrypt.compareSync(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect current password.' });
        }

        // Password complexity validation matching frontend requirements
        if (newPassword.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
        }
        if (!/[A-Z]/.test(newPassword)) {
            return res.status(400).json({ success: false, message: 'Password must contain at least one uppercase letter.' });
        }
        if (!/\d/.test(newPassword)) {
            return res.status(400).json({ success: false, message: 'Password must contain at least one number.' });
        }
        if (!/[^a-zA-Z0-9]/.test(newPassword)) {
            return res.status(400).json({ success: false, message: 'Password must contain at least one symbol.' });
        }

        const passwordHash = bcrypt.hashSync(newPassword, 10);
        db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, req.user.id);

        // Record in audit log
        db.prepare('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)')
            .run(req.user.id, '🔑', 'Password changed');

        return res.json({
            success: true,
            message: 'Password changed successfully.'
        });
    } catch (err) {
        console.error('Error changing password:', err);
        return res.status(500).json({ success: false, message: 'Server error during password change.' });
    }
});

module.exports = router;
