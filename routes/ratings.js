// ============================================================
// GitGuide – Ratings API Routes
// ============================================================
const express = require('express');
const db = require('../config/db');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/ratings/:articleId – Get rating summary
router.get('/:articleId', optionalAuth, async (req, res) => {
    try {
        const articleId = parseInt(req.params.articleId);

        const [statsRows] = await db.query(`
            SELECT 
                COUNT(id) AS totalRatings,
                COALESCE(AVG(rating), 0) AS averageRating
            FROM ratings
            WHERE article_id = ?
        `, [articleId]);
        const stats = statsRows[0];

        let userRating = 0;
        if (req.user) {
            const [userVote] = await db.query('SELECT rating FROM ratings WHERE article_id = ? AND user_id = ?', [articleId, req.user.id]);
            if (userVote.length > 0) userRating = userVote[0].rating;
        }

        return res.json({
            success: true,
            data: {
                articleId,
                totalRatings: stats.totalRatings,
                averageRating: Math.round(stats.averageRating * 10) / 10,
                userRating
            }
        });
    } catch (err) {
        console.error('Error fetching rating:', err);
        return res.status(500).json({ success: false, message: 'Server error fetching ratings.' });
    }
});

// POST /api/ratings/:articleId – Submit or update rating
router.post('/:articleId', authenticateToken, async (req, res) => {
    try {
        const articleId = parseInt(req.params.articleId);
        const { rating } = req.body;
        const ratingVal = parseInt(rating);

        if (!ratingVal || ratingVal < 1 || ratingVal > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5.' });
        }

        const [articles] = await db.query('SELECT title FROM articles WHERE id = ?', [articleId]);
        if (articles.length === 0) {
            return res.status(404).json({ success: false, message: 'Article not found.' });
        }
        const article = articles[0];

        // Upsert rating
        await db.query(`
            INSERT INTO ratings (article_id, user_id, rating)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE rating = VALUES(rating), created_at = CURRENT_TIMESTAMP
        `, [articleId, req.user.id, ratingVal]);

        const [statsRows] = await db.query(`
            SELECT 
                COUNT(id) AS totalRatings,
                COALESCE(AVG(rating), 0) AS averageRating
            FROM ratings
            WHERE article_id = ?
        `, [articleId]);
        const stats = statsRows[0];

        await db.query('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)', [
            req.user.id, '⭐', `User "${req.user.username}" gave ${ratingVal} stars to "${article.title}"`
        ]);

        return res.json({
            success: true,
            message: `Rated ${ratingVal}/5 stars successfully!`,
            data: {
                articleId,
                userRating: ratingVal,
                totalRatings: stats.totalRatings,
                averageRating: Math.round(stats.averageRating * 10) / 10
            }
        });
    } catch (err) {
        console.error('Error submitting rating:', err);
        return res.status(500).json({ success: false, message: 'Server error submitting rating.' });
    }
});

module.exports = router;
