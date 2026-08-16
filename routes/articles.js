// ============================================================
// GitGuide – Articles API Routes
// ============================================================
const express = require('express');
const db = require('../config/db');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Helper to format article row
function formatArticle(row) {
    if (!row) return null;
    return {
        id: row.id,
        title: row.title,
        categoryId: row.category_id,
        category: row.category_name || row.category,
        difficulty: row.difficulty,
        description: row.description,
        readingTime: row.reading_time,
        author: row.author,
        keywords: row.keywords ? JSON.parse(row.keywords) : [],
        commands: row.commands ? JSON.parse(row.commands) : [],
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

// GET /api/articles/trending – Get trending articles for homepage
router.get('/trending', (req, res) => {
    try {
        const trendingIds = [7, 2, 3, 4, 5, 6, 11, 8];
        const placeholders = trendingIds.map(() => '?').join(',');

        const query = `
            SELECT 
                a.*, 
                c.name AS category_name
            FROM articles a
            JOIN categories c ON c.id = a.category_id
            WHERE a.id IN (${placeholders}) AND a.status = 'Published'
        `;

        const rows = db.prepare(query).all(...trendingIds);
        const articlesMap = new Map(rows.map(r => [r.id, formatArticle(r)]));
        // Maintain trending ordered list
        const trendingArticles = trendingIds
            .map(id => articlesMap.get(id))
            .filter(Boolean);

        return res.json({ success: true, data: trendingArticles });
    } catch (err) {
        console.error('Error fetching trending articles:', err);
        return res.status(500).json({ success: false, message: 'Server error fetching trending articles.' });
    }
});

// GET /api/articles/suggestions – Fast title & keyword suggestions
router.get('/suggestions', (req, res) => {
    try {
        const queryParam = (req.query.q || '').trim().toLowerCase();
        if (queryParam.length < 2) {
            return res.json({ success: true, data: [] });
        }

        const query = `
            SELECT 
                a.id, 
                a.title, 
                c.name AS category_name
            FROM articles a
            JOIN categories c ON c.id = a.category_id
            WHERE a.status = 'Published' 
              AND (
                  LOWER(a.title) LIKE ? 
                  OR LOWER(a.description) LIKE ? 
                  OR LOWER(c.name) LIKE ?
                  OR LOWER(a.keywords) LIKE ?
              )
            LIMIT 6
        `;
        const pattern = `%${queryParam}%`;
        const rows = db.prepare(query).all(pattern, pattern, pattern, pattern);

        const suggestions = rows.map(r => ({
            id: r.id,
            title: r.title,
            category: r.category_name
        }));

        return res.json({ success: true, data: suggestions });
    } catch (err) {
        console.error('Error fetching suggestions:', err);
        return res.status(500).json({ success: false, message: 'Server error fetching suggestions.' });
    }
});

// GET /api/articles – Search & filter articles
router.get('/', (req, res) => {
    try {
        const { q, category, difficulty, status } = req.query;

        let sql = `
            SELECT 
                a.*, 
                c.name AS category_name
            FROM articles a
            JOIN categories c ON c.id = a.category_id
            WHERE 1=1
        `;
        const params = [];

        // Status filter (defaults to 'Published' unless admin requests otherwise)
        if (status) {
            sql += ' AND a.status = ?';
            params.push(status);
        } else {
            sql += " AND a.status = 'Published'";
        }

        // Category filter
        if (category && category.toLowerCase() !== 'all') {
            sql += ' AND LOWER(c.name) = LOWER(?)';
            params.push(category.trim());
        }

        // Difficulty filter
        if (difficulty && difficulty.toLowerCase() !== 'all') {
            sql += ' AND LOWER(a.difficulty) = LOWER(?)';
            params.push(difficulty.trim());
        }

        // Search query filter
        if (q && q.trim()) {
            const queryPattern = `%${q.trim().toLowerCase()}%`;
            sql += ` AND (
                LOWER(a.title) LIKE ? 
                OR LOWER(a.description) LIKE ? 
                OR LOWER(c.name) LIKE ? 
                OR LOWER(a.keywords) LIKE ?
                OR LOWER(a.commands) LIKE ?
            )`;
            params.push(queryPattern, queryPattern, queryPattern, queryPattern, queryPattern);
        }

        sql += ' ORDER BY a.id ASC';

        const rows = db.prepare(sql).all(...params);
        const formatted = rows.map(formatArticle);

        return res.json({ success: true, count: formatted.length, data: formatted });
    } catch (err) {
        console.error('Error fetching articles:', err);
        return res.status(500).json({ success: false, message: 'Server error fetching articles.' });
    }
});

// GET /api/articles/:id – Full article with steps, FAQs, comments, and rating metadata
router.get('/:id', optionalAuth, (req, res) => {
    try {
        const articleId = parseInt(req.params.id);

        const articleRow = db.prepare(`
            SELECT 
                a.*, 
                c.name AS category_name
            FROM articles a
            JOIN categories c ON c.id = a.category_id
            WHERE a.id = ?
        `).get(articleId);

        if (!articleRow) {
            return res.status(404).json({ success: false, message: 'Article not found.' });
        }

        // Steps
        const steps = db.prepare(`
            SELECT id, step_number AS stepNumber, title, content, command 
            FROM article_steps 
            WHERE article_id = ? 
            ORDER BY step_number ASC
        `).all(articleId);

        // FAQs
        const faqs = db.prepare(`
            SELECT id, question, answer 
            FROM article_faqs 
            WHERE article_id = ? 
            ORDER BY id ASC
        `).all(articleId);

        // Comments
        const comments = db.prepare(`
            SELECT 
                id, 
                article_id AS articleId, 
                name, 
                text, 
                strftime('%b %d, %Y', created_at) AS date,
                created_at AS createdAt
            FROM comments 
            WHERE article_id = ? 
            ORDER BY id ASC
        `).all(articleId);

        // Rating Stats
        const ratingStats = db.prepare(`
            SELECT 
                COUNT(id) AS totalRatings,
                COALESCE(AVG(rating), 0) AS averageRating
            FROM ratings
            WHERE article_id = ?
        `).get(articleId);

        // Check user bookmark and user rating if authenticated
        let isBookmarked = false;
        let userRating = 0;

        if (req.user) {
            const bookmarkCheck = db.prepare('SELECT id FROM bookmarks WHERE article_id = ? AND user_id = ?').get(articleId, req.user.id);
            isBookmarked = Boolean(bookmarkCheck);

            const ratingCheck = db.prepare('SELECT rating FROM ratings WHERE article_id = ? AND user_id = ?').get(articleId, req.user.id);
            userRating = ratingCheck ? ratingCheck.rating : 0;
        }

        const fullArticle = {
            ...formatArticle(articleRow),
            steps,
            faqs,
            comments,
            ratings: {
                total: ratingStats.totalRatings,
                average: Math.round(ratingStats.averageRating * 10) / 10,
                userRating
            },
            isBookmarked
        };

        return res.json({ success: true, data: fullArticle });
    } catch (err) {
        console.error('Error fetching article detail:', err);
        return res.status(500).json({ success: false, message: 'Server error fetching article details.' });
    }
});

// POST /api/articles – Admin create article with steps and faqs
router.post('/', authenticateToken, requireAdmin, (req, res) => {
    try {
        const { title, categoryId, categoryName, difficulty, description, readingTime, author, keywords, commands, steps, faqs, status } = req.body;

        if (!title || !description) {
            return res.status(400).json({ success: false, message: 'Title and description are required.' });
        }

        let catId = categoryId;
        if (!catId && categoryName) {
            const cat = db.prepare('SELECT id FROM categories WHERE LOWER(name) = LOWER(?)').get(categoryName.trim());
            catId = cat ? cat.id : 1;
        }

        if (!catId) catId = 1;

        const insertTransaction = db.transaction(() => {
            const result = db.prepare(`
                INSERT INTO articles (title, category_id, difficulty, description, reading_time, author, keywords, commands, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
                title.trim(),
                catId,
                difficulty || 'Beginner',
                description.trim(),
                readingTime || '5 min',
                author || req.user.username,
                JSON.stringify(keywords || []),
                JSON.stringify(commands || []),
                status || 'Published'
            );

            const articleId = result.lastInsertRowid;

            if (steps && Array.isArray(steps)) {
                const insertStep = db.prepare(`
                    INSERT INTO article_steps (article_id, step_number, title, content, command)
                    VALUES (?, ?, ?, ?, ?)
                `);
                steps.forEach((s, idx) => {
                    insertStep.run(articleId, idx + 1, s.title || '', s.content || '', s.command || null);
                });
            }

            if (faqs && Array.isArray(faqs)) {
                const insertFaq = db.prepare(`
                    INSERT INTO article_faqs (article_id, question, answer)
                    VALUES (?, ?, ?)
                `);
                faqs.forEach(f => {
                    insertFaq.run(articleId, f.question || '', f.answer || '');
                });
            }

            db.prepare('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)')
                .run(req.user.id, '📄', `New article published: "${title}"`);

            return articleId;
        });

        const newArticleId = insertTransaction();
        return res.status(201).json({ success: true, message: 'Article created successfully.', id: newArticleId });
    } catch (err) {
        console.error('Error creating article:', err);
        return res.status(500).json({ success: false, message: 'Server error creating article.' });
    }
});

// PUT /api/articles/:id – Admin update article
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
    try {
        const articleId = parseInt(req.params.id);
        const { title, categoryId, categoryName, difficulty, description, readingTime, author, keywords, commands, status, steps, faqs } = req.body;

        const existing = db.prepare('SELECT id FROM articles WHERE id = ?').get(articleId);
        if (!existing) {
            return res.status(404).json({ success: false, message: 'Article not found.' });
        }

        let catId = categoryId;
        if (!catId && categoryName) {
            const cat = db.prepare('SELECT id FROM categories WHERE LOWER(name) = LOWER(?)').get(categoryName.trim());
            if (cat) catId = cat.id;
        }

        const updateTransaction = db.transaction(() => {
            db.prepare(`
                UPDATE articles
                SET title = COALESCE(?, title),
                    category_id = COALESCE(?, category_id),
                    difficulty = COALESCE(?, difficulty),
                    description = COALESCE(?, description),
                    reading_time = COALESCE(?, reading_time),
                    author = COALESCE(?, author),
                    keywords = COALESCE(?, keywords),
                    commands = COALESCE(?, commands),
                    status = COALESCE(?, status),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `).run(
                title !== undefined ? title.trim() : null,
                catId !== undefined ? catId : null,
                difficulty !== undefined ? difficulty : null,
                description !== undefined ? description.trim() : null,
                readingTime !== undefined ? readingTime : null,
                author !== undefined ? author : null,
                keywords !== undefined ? JSON.stringify(keywords) : null,
                commands !== undefined ? JSON.stringify(commands) : null,
                status !== undefined ? status : null,
                articleId
            );

            if (steps && Array.isArray(steps)) {
                db.prepare('DELETE FROM article_steps WHERE article_id = ?').run(articleId);
                const insertStep = db.prepare(`
                    INSERT INTO article_steps (article_id, step_number, title, content, command)
                    VALUES (?, ?, ?, ?, ?)
                `);
                steps.forEach((s, idx) => {
                    insertStep.run(articleId, idx + 1, s.title || '', s.content || '', s.command || null);
                });
            }

            if (faqs && Array.isArray(faqs)) {
                db.prepare('DELETE FROM article_faqs WHERE article_id = ?').run(articleId);
                const insertFaq = db.prepare(`
                    INSERT INTO article_faqs (article_id, question, answer)
                    VALUES (?, ?, ?)
                `);
                faqs.forEach(f => {
                    insertFaq.run(articleId, f.question || '', f.answer || '');
                });
            }

            db.prepare('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)')
                .run(req.user.id, '✏️', `Article #${articleId} updated: "${title || 'Article'}"`);
        });

        updateTransaction();
        return res.json({ success: true, message: 'Article updated successfully.' });
    } catch (err) {
        console.error('Error updating article:', err);
        return res.status(500).json({ success: false, message: 'Server error updating article.' });
    }
});

// DELETE /api/articles/:id – Admin delete article
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
    try {
        const articleId = parseInt(req.params.id);
        const article = db.prepare('SELECT title FROM articles WHERE id = ?').get(articleId);

        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found.' });
        }

        db.prepare('DELETE FROM articles WHERE id = ?').run(articleId);

        db.prepare('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)')
            .run(req.user.id, '🗑️', `Article #${articleId} deleted: "${article.title}"`);

        return res.json({ success: true, message: 'Article deleted successfully.' });
    } catch (err) {
        console.error('Error deleting article:', err);
        return res.status(500).json({ success: false, message: 'Server error deleting article.' });
    }
});

module.exports = router;
