// ============================================================
// GitGuide – Dashboard & Analytics API Routes
// ============================================================
const express = require('express');
const db = require('../config/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/dashboard/stats – Admin KPI metrics
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [totalArticlesRows] = await db.query('SELECT COUNT(*) AS count FROM articles');
        const [publishedArticlesRows] = await db.query("SELECT COUNT(*) AS count FROM articles WHERE status = 'Published'");
        const [draftArticlesRows] = await db.query("SELECT COUNT(*) AS count FROM articles WHERE status = 'Draft'");
        const [totalCategoriesRows] = await db.query('SELECT COUNT(*) AS count FROM categories');
        const [totalUsersRows] = await db.query('SELECT COUNT(*) AS count FROM users');
        const [totalCommentsRows] = await db.query('SELECT COUNT(*) AS count FROM comments');
        const [totalRatingsRows] = await db.query('SELECT COUNT(*) AS count FROM ratings');
        const [totalBookmarksRows] = await db.query('SELECT COUNT(*) AS count FROM bookmarks');

        const [ratingAggRows] = await db.query('SELECT COALESCE(AVG(rating), 0) AS avgRating FROM ratings');

        return res.json({
            success: true,
            data: {
                totalArticles: totalArticlesRows[0].count,
                publishedArticles: publishedArticlesRows[0].count,
                draftArticles: draftArticlesRows[0].count,
                totalCategories: totalCategoriesRows[0].count,
                totalUsers: totalUsersRows[0].count,
                totalComments: totalCommentsRows[0].count,
                totalRatings: totalRatingsRows[0].count,
                totalBookmarks: totalBookmarksRows[0].count,
                averageRating: Math.round(ratingAggRows[0].avgRating * 10) / 10
            }
        });
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        return res.status(500).json({ success: false, message: 'Server error fetching stats.' });
    }
});

// GET /api/dashboard/audit-logs – Admin audit log timeline
router.get('/audit-logs', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [logs] = await db.query(`
            SELECT 
                al.id,
                al.icon,
                al.message,
                al.created_at AS createdAt,
                DATE_FORMAT(al.created_at, '%b %d, %H:%i') AS formattedTime,
                u.username AS triggeredBy
            FROM audit_logs al
            LEFT JOIN users u ON u.id = al.user_id
            ORDER BY al.created_at DESC
            LIMIT 50
        `);

        return res.json({ success: true, count: logs.length, data: logs });
    } catch (err) {
        console.error('Error fetching audit logs:', err);
        return res.status(500).json({ success: false, message: 'Server error fetching audit logs.' });
    }
});

// GET /api/dashboard/user – User dashboard metrics & items
router.get('/user', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Ensure user exists and get last login
        const [userDbs] = await db.query('SELECT id, name, username, role, created_at, last_login FROM users WHERE id = ?', [userId]);
        const userDb = userDbs[0];

        // User activity
        const [activity] = await db.query(`
            SELECT id, icon, message, created_at AS createdAt, DATE_FORMAT(created_at, '%b %d, %H:%i') AS formattedTime
            FROM audit_logs
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT 20
        `, [userId]);

        // Recently viewed
        const [recentlyViewed] = await db.query(`
            SELECT 
                r.article_id AS articleId,
                a.title,
                c.name AS category,
                a.difficulty,
                r.viewed_at AS viewedAt,
                DATE_FORMAT(r.viewed_at, '%b %d, %Y') AS date
            FROM recently_viewed_articles r
            JOIN articles a ON a.id = r.article_id
            JOIN categories c ON c.id = a.category_id
            WHERE r.user_id = ?
            ORDER BY r.viewed_at DESC
            LIMIT 10
        `, [userId]);

        // Reading progress
        const [readingProgress] = await db.query(`
            SELECT 
                p.article_id AS articleId,
                a.title,
                p.progress_percent AS progress,
                p.updated_at AS updatedAt
            FROM article_reading_progress p
            JOIN articles a ON a.id = p.article_id
            WHERE p.user_id = ?
            ORDER BY p.updated_at DESC
        `, [userId]);

        // User bookmarks
        const [bookmarks] = await db.query(`
            SELECT 
                b.id AS bookmarkId,
                a.id AS articleId,
                a.title,
                c.name AS category,
                a.difficulty,
                a.description,
                a.reading_time AS readingTime,
                b.created_at AS bookmarkedAt,
                DATE_FORMAT(b.created_at, '%b %d, %Y') AS date
            FROM bookmarks b
            JOIN articles a ON a.id = b.article_id
            JOIN categories c ON c.id = a.category_id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `, [userId]);

        // User comments - strictly checked by user_id
        const [comments] = await db.query(`
            SELECT 
                c.id,
                c.article_id AS articleId,
                a.title AS articleTitle,
                c.text,
                DATE_FORMAT(c.created_at, '%b %d, %Y') AS date,
                c.created_at AS createdAt
            FROM comments c
            JOIN articles a ON a.id = c.article_id
            WHERE c.user_id = ?
            ORDER BY c.created_at DESC
        `, [userId]);

        // Stats
        const [ratingsCountRows] = await db.query('SELECT COUNT(*) AS count FROM ratings WHERE user_id = ?', [userId]);
        const ratingsCount = ratingsCountRows[0].count;
        const [articlesReadCountRows] = await db.query('SELECT COUNT(DISTINCT article_id) AS count FROM recently_viewed_articles WHERE user_id = ?', [userId]);
        const articlesReadCount = articlesReadCountRows[0].count;

        return res.json({
            success: true,
            data: {
                user: {
                    id: userDb.id,
                    name: userDb.name,
                    username: userDb.username,
                    role: userDb.role,
                    createdAt: userDb.created_at,
                    lastLogin: userDb.last_login
                },
                stats: {
                    articlesRead: articlesReadCount,
                    bookmarksCount: bookmarks.length,
                    commentsCount: comments.length,
                    ratingsCount
                },
                activity,
                recentlyViewed,
                readingProgress,
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
