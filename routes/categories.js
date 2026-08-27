// ============================================================
// GitGuide – Categories API Routes
// ============================================================
const express = require('express');
const db = require('../config/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/categories – Get all categories with dynamic guide count
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                c.id, 
                c.name, 
                c.icon, 
                c.description, 
                c.created_at,
                COUNT(a.id) AS guideCount
            FROM categories c
            LEFT JOIN articles a ON a.category_id = c.id AND a.status = 'Published'
            GROUP BY c.id
            ORDER BY c.id ASC
        `;
        const [categories] = await db.query(query);
        return res.json({ success: true, count: categories.length, data: categories });
    } catch (err) {
        console.error('Error fetching categories:', err);
        return res.status(500).json({ success: false, message: 'Server error fetching categories.' });
    }
});

// GET /api/categories/:id – Get single category with its articles
router.get('/:id', async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);
        const [categories] = await db.query('SELECT * FROM categories WHERE id = ?', [categoryId]);

        if (categories.length === 0) {
            return res.status(404).json({ success: false, message: 'Category not found.' });
        }
        const category = categories[0];

        const [articles] = await db.query(`
            SELECT id, title, difficulty, description, reading_time, author, status, created_at 
            FROM articles 
            WHERE category_id = ? AND status = 'Published'
            ORDER BY id ASC
        `, [categoryId]);

        return res.json({
            success: true,
            data: {
                ...category,
                guideCount: articles.length,
                articles
            }
        });
    } catch (err) {
        console.error('Error fetching category:', err);
        return res.status(500).json({ success: false, message: 'Server error fetching category details.' });
    }
});

// POST /api/categories – Admin create category
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name, icon, description } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: 'Category name is required.' });
        }

        const [existing] = await db.query('SELECT id FROM categories WHERE LOWER(name) = LOWER(?)', [name.trim()]);
        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: 'Category already exists.' });
        }

        const [result] = await db.query(`
            INSERT INTO categories (name, icon, description)
            VALUES (?, ?, ?)
        `, [name.trim(), icon || '📁', description ? description.trim() : '']);

        const [newCategories] = await db.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);
        const newCategory = newCategories[0];

        await db.query('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)', [
            req.user.id, '📁', `New category created: "${newCategory.name}"`
        ]);

        return res.status(201).json({ success: true, message: 'Category created successfully.', data: newCategory });
    } catch (err) {
        console.error('Error creating category:', err);
        return res.status(500).json({ success: false, message: 'Server error creating category.' });
    }
});

// PUT /api/categories/:id – Admin update category
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);
        const { name, icon, description } = req.body;

        const [categories] = await db.query('SELECT * FROM categories WHERE id = ?', [categoryId]);
        if (categories.length === 0) {
            return res.status(404).json({ success: false, message: 'Category not found.' });
        }

        if (name !== undefined) {
            const [existing] = await db.query('SELECT id FROM categories WHERE LOWER(name) = LOWER(?) AND id != ?', [name.trim(), categoryId]);
            if (existing.length > 0) {
                return res.status(409).json({ success: false, message: 'Category name already exists.' });
            }
        }

        await db.query(`
            UPDATE categories 
            SET name = COALESCE(?, name),
                icon = COALESCE(?, icon),
                description = COALESCE(?, description)
            WHERE id = ?
        `, [
            name !== undefined ? name.trim() : null,
            icon !== undefined ? icon : null,
            description !== undefined ? description.trim() : null,
            categoryId
        ]);

        const [updatedCategories] = await db.query('SELECT * FROM categories WHERE id = ?', [categoryId]);
        const updatedCategory = updatedCategories[0];

        await db.query('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)', [
            req.user.id, '✏️', `Category #${categoryId} updated: "${updatedCategory.name}"`
        ]);

        return res.json({ success: true, message: 'Category updated successfully.', data: updatedCategory });
    } catch (err) {
        console.error('Error updating category:', err);
        return res.status(500).json({ success: false, message: 'Server error updating category.' });
    }
});

// DELETE /api/categories/:id – Admin delete category
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);
        const [categories] = await db.query('SELECT * FROM categories WHERE id = ?', [categoryId]);

        if (categories.length === 0) {
            return res.status(404).json({ success: false, message: 'Category not found.' });
        }
        const category = categories[0];

        const [counts] = await db.query('SELECT COUNT(*) as count FROM articles WHERE category_id = ?', [categoryId]);
        const articleCount = counts[0].count;

        if (articleCount > 0) {
            return res.status(400).json({ success: false, message: 'Cannot delete category because it is currently used by ' + articleCount + ' article(s).' });
        }

        await db.query('DELETE FROM categories WHERE id = ?', [categoryId]);

        await db.query('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)', [
            req.user.id, '🗑️', `Category deleted: "${category.name}"`
        ]);

        return res.json({ success: true, message: 'Category deleted successfully.' });
    } catch (err) {
        console.error('Error deleting category:', err);
        return res.status(500).json({ success: false, message: 'Server error deleting category.' });
    }
});

module.exports = router;
