// ============================================================
// GitGuide – Troubleshooting & Error Analyzer API Routes
// ============================================================
const express = require('express');
const db = require('../config/db');

const router = express.Router();

// GET /api/troubleshooting/patterns – Get all error pattern definitions
router.get('/patterns', (req, res) => {
    try {
        const rows = db.prepare(`
            SELECT 
                ep.id,
                ep.title,
                ep.keywords,
                ep.solution,
                ep.article_id AS articleId,
                a.title AS articleTitle
            FROM error_patterns ep
            LEFT JOIN articles a ON a.id = ep.article_id
            ORDER BY ep.id ASC
        `).all();

        const patterns = rows.map(r => ({
            id: r.id,
            title: r.title,
            keywords: r.keywords ? JSON.parse(r.keywords) : [],
            solution: r.solution,
            articleId: r.articleId,
            articleTitle: r.articleTitle
        }));

        return res.json({ success: true, count: patterns.length, data: patterns });
    } catch (err) {
        console.error('Error fetching error patterns:', err);
        return res.status(500).json({ success: false, message: 'Server error fetching error patterns.' });
    }
});

// POST /api/troubleshooting/analyze – Terminal error log analyzer
router.post('/analyze', (req, res) => {
    try {
        const { errorText } = req.body;

        if (!errorText || !errorText.trim()) {
            return res.status(400).json({ success: false, message: 'Please provide an error message to analyze.' });
        }

        const normalizedInput = errorText.toLowerCase();

        const rows = db.prepare(`
            SELECT 
                ep.id,
                ep.title,
                ep.keywords,
                ep.solution,
                ep.article_id AS articleId,
                a.title AS articleTitle,
                a.description AS articleDescription,
                c.name AS articleCategory
            FROM error_patterns ep
            LEFT JOIN articles a ON a.id = ep.article_id
            LEFT JOIN categories c ON c.id = a.category_id
        `).all();

        const matches = [];

        rows.forEach(r => {
            const keywords = r.keywords ? JSON.parse(r.keywords) : [];
            let score = 0;
            const matchedKeywords = [];

            keywords.forEach(kw => {
                const kwLower = kw.toLowerCase();
                if (normalizedInput.includes(kwLower)) {
                    score += kwLower.length * 2; // Longer keyword match gives higher score
                    matchedKeywords.push(kw);
                }
            });

            if (score > 0) {
                matches.push({
                    id: r.id,
                    title: r.title,
                    solution: r.solution,
                    articleId: r.articleId,
                    articleTitle: r.articleTitle,
                    articleCategory: r.articleCategory,
                    score,
                    matchedKeywords
                });
            }
        });

        // Sort matches by relevance score
        matches.sort((a, b) => b.score - a.score);

        return res.json({
            success: true,
            matched: matches.length > 0,
            count: matches.length,
            data: matches
        });
    } catch (err) {
        console.error('Error analyzing error text:', err);
        return res.status(500).json({ success: false, message: 'Server error analyzing error message.' });
    }
});

module.exports = router;
