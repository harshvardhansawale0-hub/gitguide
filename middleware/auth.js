// ============================================================
// GitGuide – Authentication Middleware (JWT & RBAC)
// ============================================================
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'gitguide_super_secret_jwt_key_2026_dbms_production';

// Authenticate JWT Token for Protected Routes
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.split(' ')[1] 
        : null;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const [rows] = await db.execute('SELECT id, name, contact, username, role, created_at FROM users WHERE id = ?', [decoded.id]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ success: false, message: 'User session invalid or user not found.' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
}

// Optional Auth (For endpoints that provide additional features if logged in)
async function optionalAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.split(' ')[1] 
        : null;

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const [rows] = await db.execute('SELECT id, name, contact, username, role, created_at FROM users WHERE id = ?', [decoded.id]);
        req.user = rows[0] || null;
    } catch (err) {
        req.user = null;
    }

    next();
}

// Require Admin Role
function requireAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access restricted to administrators only.' });
    }

    next();
}

module.exports = {
    authenticateToken,
    optionalAuth,
    requireAdmin,
    JWT_SECRET
};
