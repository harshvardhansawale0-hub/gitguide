// ============================================================
// GitGuide – Bookmarks API Routes
// ============================================================
const express = require('express');
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/bookmarks – Get all bookmarked articles for logged-in user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [bookmarks] = await db.query(`
            SELECT 
                b.id AS bookmarkId,
                b.created_at AS bookmarkedAt,
                a.id,
                a.title,
                c.name AS category,
                a.difficulty,
                a.description,
                a.reading_time AS readingTime,
                a.author
            FROM bookmarks b
            JOIN articles a ON a.id = b.article_id
            JOIN categories c ON c.id = a.category_id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `, [req.user.id]);

        return res.json({ success: true, count: bookmarks.length, data: bookmarks });
    } catch (err) {
        console.error('Error fetching bookmarks:', err);
        return res.status(500).json({ success: false, message: 'Server error fetching bookmarks.' });
    }
});

// GET /api/bookmarks/ids – Get list of bookmarked article IDs
router.get('/ids', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT article_id FROM bookmarks WHERE user_id = ?', [req.user.id]);
        const ids = rows.map(r => r.article_id);
        return res.json({ success: true, data: ids });
    } catch (err) {
        console.error('Error fetching bookmark IDs:', err);
        return res.status(500).json({ success: false, message: 'Server error fetching bookmark IDs.' });
    }
});

// POST /api/bookmarks/toggle – Toggle bookmark status
router.post('/toggle', authenticateToken, async (req, res) => {
    try {
        const { articleId } = req.body;
        const artId = parseInt(articleId);

        if (!artId) {
            return res.status(400).json({ success: false, message: 'Valid articleId is required.' });
        }

        const [articles] = await db.query('SELECT title FROM articles WHERE id = ?', [artId]);
        if (articles.length === 0) {
            return res.status(404).json({ success: false, message: 'Article not found.' });
        }
        const article = articles[0];

        const [existing] = await db.query('SELECT id FROM bookmarks WHERE article_id = ? AND user_id = ?', [artId, req.user.id]);

        if (existing.length > 0) {
            await db.query('DELETE FROM bookmarks WHERE id = ?', [existing[0].id]);
            
            await db.query('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)', [
                req.user.id, '🔖', `Removed bookmark for "${article.title}"`
            ]);
                
            return res.json({
                success: true,
                bookmarked: false,
                message: 'Bookmark removed.'
            });
        } else {
            await db.query('INSERT INTO bookmarks (article_id, user_id) VALUES (?, ?)', [artId, req.user.id]);
            
            await db.query('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)', [
                req.user.id, '🔖', `Bookmarked "${article.title}"`
            ]);
                
            return res.json({
                success: true,
                bookmarked: true,
                message: 'Article bookmarked!'
            });
        }
    } catch (err) {
        console.error('Error toggling bookmark:', err);
        return res.status(500).json({ success: false, message: 'Server error toggling bookmark.' });
    }
});

module.exports = router;
