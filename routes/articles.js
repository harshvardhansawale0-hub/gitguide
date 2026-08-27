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
        keywords: typeof row.keywords === 'string' ? JSON.parse(row.keywords) : (row.keywords || []),
        commands: typeof row.commands === 'string' ? JSON.parse(row.commands) : (row.commands || []),
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

// GET /api/articles/trending – Get trending articles for homepage
router.get('/trending', async (req, res) => {
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

        const [rows] = await db.query(query, trendingIds);
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
router.get('/suggestions', async (req, res) => {
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
        const [rows] = await db.query(query, [pattern, pattern, pattern, pattern]);

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
router.get('/', async (req, res) => {
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
        if (status && status.toLowerCase() !== 'all') {
            sql += ' AND a.status = ?';
            params.push(status);
        } else if (!status) {
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

        const [rows] = await db.query(sql, params);
        const formatted = rows.map(formatArticle);

        return res.json({ success: true, count: formatted.length, data: formatted });
    } catch (err) {
        console.error('Error fetching articles:', err);
        return res.status(500).json({ success: false, message: 'Server error fetching articles.' });
    }
});

// GET /api/articles/:id – Full article with steps, FAQs, comments, and rating metadata
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const articleId = parseInt(req.params.id);

        const [articleRows] = await db.query(`
            SELECT 
                a.*, 
                c.name AS category_name
            FROM articles a
            JOIN categories c ON c.id = a.category_id
            WHERE a.id = ?
        `, [articleId]);
        
        const articleRow = articleRows[0];

        if (!articleRow) {
            return res.status(404).json({ success: false, message: 'Article not found.' });
        }

        // Steps
        const [steps] = await db.query(`
            SELECT id, step_number AS stepNumber, title, content, command 
            FROM article_steps 
            WHERE article_id = ? 
            ORDER BY step_number ASC
        `, [articleId]);

        // FAQs
        const [faqs] = await db.query(`
            SELECT id, question, answer 
            FROM article_faqs 
            WHERE article_id = ? 
            ORDER BY id ASC
        `, [articleId]);

        // Comments
        const [comments] = await db.query(`
            SELECT 
                id, 
                article_id AS articleId, 
                name, 
                text, 
                DATE_FORMAT(created_at, '%b %d, %Y') AS date,
                created_at AS createdAt
            FROM comments 
            WHERE article_id = ? 
            ORDER BY id ASC
        `, [articleId]);

        // Rating Stats
        const [ratingStatsRows] = await db.query(`
            SELECT 
                COUNT(id) AS totalRatings,
                COALESCE(AVG(rating), 0) AS averageRating
            FROM ratings
            WHERE article_id = ?
        `, [articleId]);
        const ratingStats = ratingStatsRows[0];

        // Check user bookmark and user rating if authenticated
        let isBookmarked = false;
        let userRating = 0;

        if (req.user) {
            const [bookmarkCheck] = await db.query('SELECT id FROM bookmarks WHERE article_id = ? AND user_id = ?', [articleId, req.user.id]);
            isBookmarked = bookmarkCheck.length > 0;

            const [ratingCheck] = await db.query('SELECT rating FROM ratings WHERE article_id = ? AND user_id = ?', [articleId, req.user.id]);
            userRating = ratingCheck.length > 0 ? ratingCheck[0].rating : 0;
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
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { title, categoryId, categoryName, difficulty, description, readingTime, author, keywords, commands, steps, faqs, status } = req.body;

        if (!title || !description) {
            connection.release();
            return res.status(400).json({ success: false, message: 'Title and description are required.' });
        }

        let catId = categoryId;
        if (!catId && categoryName) {
            const [cats] = await connection.query('SELECT id FROM categories WHERE LOWER(name) = LOWER(?)', [categoryName.trim()]);
            catId = cats.length > 0 ? cats[0].id : 1;
        }

        if (!catId) catId = 1;

        await connection.beginTransaction();

        const [result] = await connection.query(`
            INSERT INTO articles (title, category_id, difficulty, description, reading_time, author, keywords, commands, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            title.trim(),
            catId,
            difficulty || 'Beginner',
            description.trim(),
            readingTime || '5 min',
            author || req.user.username,
            JSON.stringify(keywords || []),
            JSON.stringify(commands || []),
            status || 'Published'
        ]);

        const articleId = result.insertId;

        if (steps && Array.isArray(steps)) {
            for (let idx = 0; idx < steps.length; idx++) {
                const s = steps[idx];
                await connection.query(`
                    INSERT INTO article_steps (article_id, step_number, title, content, command)
                    VALUES (?, ?, ?, ?, ?)
                `, [articleId, idx + 1, s.title || '', s.content || '', s.command || null]);
            }
        }

        if (faqs && Array.isArray(faqs)) {
            for (const f of faqs) {
                await connection.query(`
                    INSERT INTO article_faqs (article_id, question, answer)
                    VALUES (?, ?, ?)
                `, [articleId, f.question || '', f.answer || '']);
            }
        }

        await connection.query('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)', [
            req.user.id, '📄', `New article published: "${title}"`
        ]);

        await connection.commit();
        connection.release();

        return res.status(201).json({ success: true, message: 'Article created successfully.', id: articleId });
    } catch (err) {
        await connection.rollback();
        connection.release();
        console.error('Error creating article:', err);
        return res.status(500).json({ success: false, message: 'Server error creating article.' });
    }
});

// PUT /api/articles/:id – Admin update article
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    const connection = await db.getConnection();
    try {
        const articleId = parseInt(req.params.id);
        const { title, categoryId, categoryName, difficulty, description, readingTime, author, keywords, commands, status, steps, faqs } = req.body;

        const [existingRows] = await connection.query('SELECT id FROM articles WHERE id = ?', [articleId]);
        if (existingRows.length === 0) {
            connection.release();
            return res.status(404).json({ success: false, message: 'Article not found.' });
        }

        let catId = categoryId;
        if (!catId && categoryName) {
            const [cats] = await connection.query('SELECT id FROM categories WHERE LOWER(name) = LOWER(?)', [categoryName.trim()]);
            if (cats.length > 0) catId = cats[0].id;
        }

        await connection.beginTransaction();

        await connection.query(`
            UPDATE articles
            SET title = COALESCE(?, title),
                category_id = COALESCE(?, category_id),
                difficulty = COALESCE(?, difficulty),
                description = COALESCE(?, description),
                reading_time = COALESCE(?, reading_time),
                author = COALESCE(?, author),
                keywords = COALESCE(?, keywords),
                commands = COALESCE(?, commands),
                status = COALESCE(?, status)
            WHERE id = ?
        `, [
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
        ]);

        if (steps && Array.isArray(steps)) {
            await connection.query('DELETE FROM article_steps WHERE article_id = ?', [articleId]);
            for (let idx = 0; idx < steps.length; idx++) {
                const s = steps[idx];
                await connection.query(`
                    INSERT INTO article_steps (article_id, step_number, title, content, command)
                    VALUES (?, ?, ?, ?, ?)
                `, [articleId, idx + 1, s.title || '', s.content || '', s.command || null]);
            }
        }

        if (faqs && Array.isArray(faqs)) {
            await connection.query('DELETE FROM article_faqs WHERE article_id = ?', [articleId]);
            for (const f of faqs) {
                await connection.query(`
                    INSERT INTO article_faqs (article_id, question, answer)
                    VALUES (?, ?, ?)
                `, [articleId, f.question || '', f.answer || '']);
            }
        }

        await connection.query('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)', [
            req.user.id, '✏️', `Article #${articleId} updated: "${title || 'Article'}"`
        ]);

        await connection.commit();
        connection.release();

        return res.json({ success: true, message: 'Article updated successfully.' });
    } catch (err) {
        await connection.rollback();
        connection.release();
        console.error('Error updating article:', err);
        return res.status(500).json({ success: false, message: 'Server error updating article.' });
    }
});

// DELETE /api/articles/:id – Admin delete article
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const articleId = parseInt(req.params.id);
        const [articles] = await db.query('SELECT title FROM articles WHERE id = ?', [articleId]);

        if (articles.length === 0) {
            return res.status(404).json({ success: false, message: 'Article not found.' });
        }

        await db.query('DELETE FROM articles WHERE id = ?', [articleId]);

        await db.query('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)', [
            req.user.id, '🗑️', `Article #${articleId} deleted: "${articles[0].title}"`
        ]);

        return res.json({ success: true, message: 'Article deleted successfully.' });
    } catch (err) {
        console.error('Error deleting article:', err);
        return res.status(500).json({ success: false, message: 'Server error deleting article.' });
    }
});

// POST /api/articles/:id/view – Record article as recently viewed
router.post('/:id/view', authenticateToken, async (req, res) => {
    try {
        const articleId = parseInt(req.params.id);
        
        const [articles] = await db.query('SELECT title FROM articles WHERE id = ?', [articleId]);
        if (articles.length === 0) {
            return res.status(404).json({ success: false, message: 'Article not found.' });
        }

        await db.query(`
            INSERT INTO recently_viewed_articles (user_id, article_id)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE viewed_at = CURRENT_TIMESTAMP
        `, [req.user.id, articleId]);

        const [recentViewLogs] = await db.query(`
            SELECT id FROM audit_logs 
            WHERE user_id = ? AND icon = '📖' AND message LIKE ? AND created_at >= NOW() - INTERVAL 1 HOUR
        `, [req.user.id, `Viewed "${articles[0].title}"%`]);

        if (recentViewLogs.length === 0) {
            await db.query('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)', [
                req.user.id, '📖', `Viewed "${articles[0].title}"`
            ]);
        }

        return res.json({ success: true, message: 'View recorded.' });
    } catch (err) {
        console.error('Error recording article view:', err);
        return res.status(500).json({ success: false, message: 'Server error recording view.' });
    }
});

// POST /api/articles/:id/progress – Record reading progress
router.post('/:id/progress', authenticateToken, async (req, res) => {
    try {
        const articleId = parseInt(req.params.id);
        let { percent } = req.body;
        
        percent = parseInt(percent);
        if (isNaN(percent) || percent < 0 || percent > 100) {
            return res.status(400).json({ success: false, message: 'Invalid progress percent.' });
        }

        const [articles] = await db.query('SELECT id FROM articles WHERE id = ?', [articleId]);
        if (articles.length === 0) {
            return res.status(404).json({ success: false, message: 'Article not found.' });
        }

        await db.query(`
            INSERT INTO article_reading_progress (user_id, article_id, progress_percent)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE progress_percent = VALUES(progress_percent)
        `, [req.user.id, articleId, percent]);

        return res.json({ success: true, message: 'Progress saved.' });
    } catch (err) {
        console.error('Error recording reading progress:', err);
        return res.status(500).json({ success: false, message: 'Server error recording progress.' });
    }
});

module.exports = router;
