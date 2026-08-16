// ============================================================
// GitGuide – Dashboard & Analytics API Routes
// ============================================================
const express = require('express');
const db = require('../config/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/dashboard/stats – Admin KPI metrics
router.get('/stats', authenticateToken, requireAdmin, (req, res) => {
    try {
        const totalArticles = db.prepare('SELECT COUNT(*) AS count FROM articles').get().count;
        const publishedArticles = db.prepare("SELECT COUNT(*) AS count FROM articles WHERE status = 'Published'").get().count;
        const draftArticles = db.prepare("SELECT COUNT(*) AS count FROM articles WHERE status = 'Draft'").get().count;
        const totalCategories = db.prepare('SELECT COUNT(*) AS count FROM categories').get().count;
        const totalUsers = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
        const totalComments = db.prepare('SELECT COUNT(*) AS count FROM comments').get().count;
        const totalRatings = db.prepare('SELECT COUNT(*) AS count FROM ratings').get().count;
        const totalBookmarks = db.prepare('SELECT COUNT(*) AS count FROM bookmarks').get().count;

        const ratingAgg = db.prepare('SELECT COALESCE(AVG(rating), 0) AS avgRating FROM ratings').get();

        return res.json({
            success: true,
            data: {
                totalArticles,
                publishedArticles,
                draftArticles,
                totalCategories,
                totalUsers,
                totalComments,
                totalRatings,
                totalBookmarks,
                averageRating: Math.round(ratingAgg.avgRating * 10) / 10
            }
        });
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        return res.status(500).json({ success: false, message: 'Server error fetching stats.' });
    }
});

// GET /api/dashboard/audit-logs – Admin audit log timeline
router.get('/audit-logs', authenticateToken, requireAdmin, (req, res) => {
    try {
        const logs = db.prepare(`
            SELECT 
                al.id,
                al.icon,
                al.message,
                al.created_at AS createdAt,
                strftime('%b %d, %H:%M', al.created_at) AS formattedTime,
                u.username AS triggeredBy
            FROM audit_logs al
            LEFT JOIN users u ON u.id = al.user_id
            ORDER BY al.created_at DESC
            LIMIT 50
        `).all();

        return res.json({ success: true, count: logs.length, data: logs });
    } catch (err) {
        console.error('Error fetching audit logs:', err);
        return res.status(500).json({ success: false, message: 'Server error fetching audit logs.' });
    }
});

// GET /api/dashboard/user – User dashboard metrics & items
router.get('/user', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;

        // User bookmarks
        const bookmarks = db.prepare(`
            SELECT 
                a.id,
                a.title,
                c.name AS category,
                a.difficulty,
                a.description,
                a.reading_time AS readingTime,
                b.created_at AS bookmarkedAt
            FROM bookmarks b
            JOIN articles a ON a.id = b.article_id
            JOIN categories c ON c.id = a.category_id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `).all(userId);

        // User comments
        const comments = db.prepare(`
            SELECT 
                c.id,
                c.article_id AS articleId,
                a.title AS articleTitle,
                c.text,
                strftime('%b %d, %Y', c.created_at) AS date,
                c.created_at AS createdAt
            FROM comments c
            JOIN articles a ON a.id = c.article_id
            WHERE c.user_id = ? OR LOWER(c.name) = LOWER(?)
            ORDER BY c.created_at DESC
        `).all(userId, req.user.username);

        // User ratings count
        const ratingsCount = db.prepare('SELECT COUNT(*) AS count FROM ratings WHERE user_id = ?').get(userId).count;

        return res.json({
            success: true,
            data: {
                user: {
                    id: req.user.id,
                    name: req.user.name,
                    username: req.user.username,
                    role: req.user.role,
                    createdAt: req.user.created_at
                },
                stats: {
                    bookmarksCount: bookmarks.length,
                    commentsCount: comments.length,
                    ratingsCount
                },
                bookmarks,
                comments
            }
        });
    } catch (err) {
        console.error('Error fetching user dashboard data:', err);
        return res.status(500).json({ success: false, message: 'Server error fetching user data.' });
    }
});

module.exports = router;
