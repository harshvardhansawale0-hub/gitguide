// ============================================================
// GitGuide – Categories API Routes
// ============================================================
const express = require('express');
const db = require('../config/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/categories – Get all categories with dynamic guide count
router.get('/', (req, res) => {
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
        const categories = db.prepare(query).all();
        return res.json({ success: true, count: categories.length, data: categories });
    } catch (err) {
        console.error('Error fetching categories:', err);
        return res.status(500).json({ success: false, message: 'Server error fetching categories.' });
    }
});

// GET /api/categories/:id – Get single category with its articles
router.get('/:id', (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);
        const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found.' });
        }

        const articles = db.prepare(`
            SELECT id, title, difficulty, description, reading_time, author, status, created_at 
            FROM articles 
            WHERE category_id = ? AND status = 'Published'
            ORDER BY id ASC
        `).all(categoryId);

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
router.post('/', authenticateToken, requireAdmin, (req, res) => {
    try {
        const { name, icon, description } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: 'Category name is required.' });
        }

        const existing = db.prepare('SELECT id FROM categories WHERE LOWER(name) = LOWER(?)').get(name.trim());
        if (existing) {
            return res.status(409).json({ success: false, message: 'Category already exists.' });
        }

        const result = db.prepare(`
            INSERT INTO categories (name, icon, description)
            VALUES (?, ?, ?)
        `).run(name.trim(), icon || '📁', description ? description.trim() : '');

        const newCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);

        db.prepare('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)')
            .run(req.user.id, '📁', `New category created: "${newCategory.name}"`);

        return res.status(201).json({ success: true, message: 'Category created successfully.', data: newCategory });
    } catch (err) {
        console.error('Error creating category:', err);
        return res.status(500).json({ success: false, message: 'Server error creating category.' });
    }
});

// PUT /api/categories/:id – Admin update category
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);
        const { name, icon, description } = req.body;

        const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found.' });
        }

        db.prepare(`
            UPDATE categories 
            SET name = COALESCE(?, name),
                icon = COALESCE(?, icon),
                description = COALESCE(?, description)
            WHERE id = ?
        `).run(
            name !== undefined ? name.trim() : null,
            icon !== undefined ? icon : null,
            description !== undefined ? description.trim() : null,
            categoryId
        );

        const updatedCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId);

        db.prepare('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)')
            .run(req.user.id, '✏️', `Category #${categoryId} updated: "${updatedCategory.name}"`);

        return res.json({ success: true, message: 'Category updated successfully.', data: updatedCategory });
    } catch (err) {
        console.error('Error updating category:', err);
        return res.status(500).json({ success: false, message: 'Server error updating category.' });
    }
});

// DELETE /api/categories/:id – Admin delete category
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);
        const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId);

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found.' });
        }

        db.prepare('DELETE FROM categories WHERE id = ?').run(categoryId);

        db.prepare('INSERT INTO audit_logs (user_id, icon, message) VALUES (?, ?, ?)')
            .run(req.user.id, '🗑️', `Category deleted: "${category.name}"`);

        return res.json({ success: true, message: 'Category deleted successfully.' });
    } catch (err) {
        console.error('Error deleting category:', err);
        return res.status(500).json({ success: false, message: 'Server error deleting category.' });
    }
});

module.exports = router;
