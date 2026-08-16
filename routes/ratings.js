// ============================================================
// GitGuide – Ratings API Routes
// ============================================================
const express = require('express');
const db = require('../config/db');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/ratings/:articleId – Get rating summary
router.get('/:articleId', optionalAuth, (req, res) => {
    try {
        const articleId = parseInt(req.params.articleId);

        const stats = db.prepare(`
            SELECT 
                COUNT(id) AS totalRatings,
                COALESCE(AVG(rating), 0) AS averageRating
            FROM ratings
            WHERE article_id = ?
        `).get(articleId);

        let userRating = 0;
        if (req.user) {
            const userVote = db.prepare('SELECT rating FROM ratings WHERE article_id = ? AND user_id = ?').get(articleId, req.user.id);
            if (userVote) userRating = userVote.rating;
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
router.post('/:articleId', authenticateToken, (req, res) => {
    try {
        const articleId = parseInt(req.params.articleId);
        const { rating } = req.body;
        const ratingVal = parseInt(rating);

        if (!ratingVal || ratingVal < 1 || ratingVal > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5.' });
        }

        const article = db.prepare('SELECT title FROM articles WHERE id = ?').get(articleId);
        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found.' });
        }

        // Upsert rating
        db.prepare(`
            INSERT INTO ratings (article_id, user_id, rating)
            VALUES (?, ?, ?)
            ON CONFLICT(article_id, user_id) DO UPDATE SET rating = excluded.rating, created_at = CURRENT_TIMESTAMP
        `).run(articleId, req.user.id, ratingVal);

        const stats = db.prepare(`
            SELECT 
                COUNT(id) AS totalRatings,
                COALESCE(AVG(rating), 0) AS averageRating
            FROM ratings
            WHERE article_id = ?
        `).get(articleId);

        db.prepare('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)')
            .run(req.user.id, '⭐', `User "${req.user.username}" gave ${ratingVal} stars to "${article.title}"`);

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
