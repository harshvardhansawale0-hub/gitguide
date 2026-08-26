// ============================================================
// GitGuide – Full-Stack Express Server
// ============================================================
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize database schema
require('./config/db');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logger for development
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    }
    next();
});

// Serve frontend static assets (HTML, CSS, JS, Images)
app.use(express.static(path.join(__dirname)));
app.use('/uploads', authenticateToken, express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/bookmarks', require('./routes/bookmarks'));
app.use('/api/commands', require('./routes/commands'));
app.use('/api/troubleshooting', require('./routes/troubleshooting'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/media', require('./routes/media'));

// API Health Check & Info
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'GitGuide REST API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// 404 handler for unmatched API routes (Express 5 compatible)
app.use('/api', (req, res) => {
    res.status(404).json({
        success: false,
        message: `API route ${req.method} ${req.originalUrl} not found.`
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error occurred.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                   🚀 GITGUIDE SERVER                      ║
╠═══════════════════════════════════════════════════════════╣
║  • Status:     Online & Serving Requests                  ║
║  • Local:      http://localhost:${PORT}                      ║
║  • API:        http://localhost:${PORT}/api/health           ║
║  • Database:   SQLite (WAL Mode & Foreign Keys Active)    ║
║  • Auth:       JWT (7-day tokens + bcrypt encryption)     ║
╚═══════════════════════════════════════════════════════════╝
    `);
});

module.exports = { app, server };