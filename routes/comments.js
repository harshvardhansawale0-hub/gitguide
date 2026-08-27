// ============================================================
// GitGuide – Comments API Routes
// ============================================================
const express = require('express');
const db = require('../config/db');
const { authenticateToken, optionalAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/comments/article/:articleId – Get comments for an article
router.get('/article/:articleId', async (req, res) => {
    try {
        const articleId = parseInt(req.params.articleId);
        const [comments] = await db.query(`
            SELECT 
                id, 
                article_id AS articleId, 
                user_id AS userId,
                name, 
                text, 
                DATE_FORMAT(created_at, '%b %d, %Y') AS date,
                created_at AS createdAt
            FROM comments 
            WHERE article_id = ? 
            ORDER BY id ASC
        `, [articleId]);

        return res.json({ success: true, count: comments.length, data: comments });
    } catch (err) {
        console.error('Error fetching comments:', err);
        return res.status(500).json({ success: false, message: 'Server error fetching comments.' });
    }
});

// POST /api/comments/article/:articleId – Post a comment
router.post('/article/:articleId', authenticateToken, async (req, res) => {
    try {
        const articleId = parseInt(req.params.articleId);
        const { text, name } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ success: false, message: 'Comment text is required.' });
        }

        const authorName = req.user ? req.user.username : (name ? name.trim() : 'Anonymous');
        const userId = req.user ? req.user.id : null;

        const [articles] = await db.query('SELECT title FROM articles WHERE id = ?', [articleId]);
        if (articles.length === 0) {
            return res.status(404).json({ success: false, message: 'Article not found.' });
        }
        const article = articles[0];

        const [result] = await db.query(`
            INSERT INTO comments (article_id, user_id, name, text)
            VALUES (?, ?, ?, ?)
        `, [articleId, userId, authorName, text.trim()]);

        const [newComments] = await db.query(`
            SELECT 
                id, 
                article_id AS articleId, 
                name, 
                text, 
                DATE_FORMAT(created_at, '%b %d, %Y') AS date,
                created_at AS createdAt
            FROM comments 
            WHERE id = ?
        `, [result.insertId]);
        const newComment = newComments[0];

        await db.query('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)', [
            userId, '💬', `New comment on "${article.title}" by ${authorName}`
        ]);

        return res.status(201).json({ success: true, message: 'Comment posted successfully.', data: newComment });
    } catch (err) {
        console.error('Error posting comment:', err);
        return res.status(500).json({ success: false, message: 'Server error posting comment.' });
    }
});

// GET /api/comments – Admin get all comments with article titles
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [comments] = await db.query(`
            SELECT 
                c.id, 
                c.article_id AS articleId, 
                a.title AS articleTitle,
                c.user_id AS userId,
                c.name, 
                c.text, 
                DATE_FORMAT(c.created_at, '%b %d, %Y') AS date,
                c.created_at AS createdAt
            FROM comments c
            LEFT JOIN articles a ON a.id = c.article_id
            ORDER BY c.created_at DESC
        `);

        return res.json({ success: true, count: comments.length, data: comments });
    } catch (err) {
        console.error('Error fetching admin comments:', err);
        return res.status(500).json({ success: false, message: 'Server error fetching all comments.' });
    }
});

// DELETE /api/comments/:id – Delete comment (Admin or author)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const commentId = parseInt(req.params.id);
        const [comments] = await db.query('SELECT * FROM comments WHERE id = ?', [commentId]);

        if (comments.length === 0) {
            return res.status(404).json({ success: false, message: 'Comment not found.' });
        }
        const comment = comments[0];

        // Only admin or the author of the comment can delete it
        if (req.user.role !== 'admin' && comment.user_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this comment.' });
        }

        await db.query('DELETE FROM comments WHERE id = ?', [commentId]);

        await db.query('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)', [
            req.user.id, '🗑️', `Comment #${commentId} deleted`
        ]);

        return res.json({ success: true, message: 'Comment deleted successfully.' });
    } catch (err) {
        console.error('Error deleting comment:', err);
        return res.status(500).json({ success: false, message: 'Server error deleting comment.' });
    }
});

module.exports = router;
