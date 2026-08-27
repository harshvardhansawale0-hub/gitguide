const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('../config/db');

// Use the actual authentication middleware from your project
const { authenticateToken } = require('../middleware/auth');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// ============================================================
// Admin authorization middleware
// authenticateToken runs first and sets req.user
// ============================================================
function enforceAdmin(req, res, next) {
    if (!req.user || String(req.user.role).toLowerCase() !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Unauthorized. Admin access required.'
        });
    }

    next();
}

// ============================================================
// GET /api/media/:articleId
// Get all media belonging to one article
// Protected
// ============================================================
router.get('/:articleId', authenticateToken, async (req, res) => {
    try {
        const articleId = parseInt(req.params.articleId, 10);

        if (!Number.isInteger(articleId) || articleId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid article ID.'
            });
        }

        const [media] = await db.query(`
            SELECT *
            FROM article_media
            WHERE article_id = ?
            ORDER BY created_at ASC
        `, [articleId]);

        return res.json({
            success: true,
            data: media
        });

    } catch (err) {
        console.error('Error fetching media:', err);

        return res.status(500).json({
            success: false,
            message: 'Server error fetching media.'
        });
    }
});

// ============================================================
// POST /api/media/:articleId
// Upload image, video, or URL
// Admin only
// ============================================================
router.post(
    '/:articleId',
    authenticateToken,
    enforceAdmin,
    async (req, res) => {
        try {
            const articleId = parseInt(req.params.articleId, 10);

            if (!Number.isInteger(articleId) || articleId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid article ID.'
                });
            }

            const {
                media_type,
                file_name,
                mime_type,
                file_size,
                data_base64,
                media_url
            } = req.body;

            // Verify that the article exists
            const [articles] = await db.query('SELECT id FROM articles WHERE id = ?', [articleId]);

            if (articles.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Article not found.'
                });
            }

            if (!['image', 'video', 'url'].includes(media_type)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid media type.'
                });
            }

            let finalUrl = '';
            let finalFileName = '';
            let finalMimeType = mime_type || '';
            let finalFileSize = Number(file_size) || 0;

            // ====================================================
            // URL
            // ====================================================
            if (media_type === 'url') {
                if (!media_url) {
                    return res.status(400).json({
                        success: false,
                        message: 'Media URL is required.'
                    });
                }

                let parsedUrl;

                try {
                    parsedUrl = new URL(media_url);
                } catch {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid URL provided.'
                    });
                }

                if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Only HTTP and HTTPS URLs are allowed.'
                    });
                }

                finalUrl = parsedUrl.toString();
                finalFileName = '';
                finalMimeType = 'text/url';
                finalFileSize = 0;

                // ====================================================
                // IMAGE OR VIDEO
                // ====================================================
            } else {
                if (!data_base64) {
                    return res.status(400).json({
                        success: false,
                        message: 'No file data provided.'
                    });
                }

                const base64Data = data_base64.includes(',')
                    ? data_base64.split(',')[1]
                    : data_base64;

                const buffer = Buffer.from(base64Data, 'base64');

                if (!buffer.length) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid file data.'
                    });
                }

                if (buffer.length > MAX_FILE_SIZE) {
                    return res.status(400).json({
                        success: false,
                        message: 'File exceeds the 50MB size limit.'
                    });
                }

                const allowedImageTypes = [
                    'image/jpeg',
                    'image/png',
                    'image/webp',
                    'image/gif'
                ];

                const allowedVideoTypes = [
                    'video/mp4',
                    'video/webm'
                ];

                if (
                    media_type === 'image' &&
                    !allowedImageTypes.includes(finalMimeType)
                ) {
                    return res.status(400).json({
                        success: false,
                        message: 'Unsupported image type. Use JPG, PNG, WEBP, or GIF.'
                    });
                }

                if (
                    media_type === 'video' &&
                    !allowedVideoTypes.includes(finalMimeType)
                ) {
                    return res.status(400).json({
                        success: false,
                        message: 'Unsupported video type. Use MP4 or WEBM.'
                    });
                }

                finalFileSize = buffer.length;

                const originalExt = path
                    .extname(file_name || '')
                    .toLowerCase();

                const mimeExtensions = {
                    'image/jpeg': '.jpg',
                    'image/png': '.png',
                    'image/webp': '.webp',
                    'image/gif': '.gif',
                    'video/mp4': '.mp4',
                    'video/webm': '.webm'
                };

                const ext =
                    originalExt ||
                    mimeExtensions[finalMimeType] ||
                    (media_type === 'image' ? '.png' : '.mp4');

                const safeUUID = crypto.randomUUID();

                finalFileName = `${safeUUID}${ext}`;
                finalUrl = `/uploads/${finalFileName}`;

                if (!fs.existsSync(UPLOAD_DIR)) {
                    fs.mkdirSync(UPLOAD_DIR, {
                        recursive: true
                    });
                }

                const filePath = path.join(
                    UPLOAD_DIR,
                    finalFileName
                );

                fs.writeFileSync(filePath, buffer);
            }

            // ====================================================
            // Save ONE media record linked to this article
            // ====================================================
            const [result] = await db.query(`
                INSERT INTO article_media
                (
                    article_id,
                    media_type,
                    media_url,
                    file_name,
                    mime_type,
                    file_size
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                articleId,
                media_type,
                finalUrl,
                finalFileName,
                finalMimeType,
                finalFileSize
            ]);

            // ====================================================
            // Save ONE audit log entry
            // ====================================================
            await db.query(`
                INSERT INTO audit_logs (user_id, icon, message)
                VALUES (?, ?, ?)
            `, [
                req.user.id,
                '🖼️',
                `Added ${media_type} to article #${articleId}`
            ]);

            return res.status(201).json({
                success: true,
                message: 'Media added successfully.',
                id: result.insertId,
                article_id: articleId,
                media_url: finalUrl
            });

        } catch (err) {
            console.error('Error uploading media:', err);

            return res.status(500).json({
                success: false,
                message: 'Server error processing media.'
            });
        }
    }
);

// ============================================================
// DELETE /api/media/:mediaId
// Delete one media item
// Admin only
// ============================================================
router.delete(
    '/:mediaId',
    authenticateToken,
    enforceAdmin,
    async (req, res) => {
        try {
            const mediaId = parseInt(req.params.mediaId, 10);

            if (!Number.isInteger(mediaId) || mediaId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid media ID.'
                });
            }

            const [mediaRows] = await db.query('SELECT * FROM article_media WHERE id = ?', [mediaId]);

            if (mediaRows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Media not found.'
                });
            }
            const media = mediaRows[0];

            // Delete physical file only for uploaded images/videos
            if (media.media_type !== 'url' && media.file_name) {
                const filePath = path.join(
                    UPLOAD_DIR,
                    path.basename(media.file_name)
                );

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            // Delete database record
            await db.query('DELETE FROM article_media WHERE id = ?', [mediaId]);

            // Create ONE audit log
            await db.query(`
                INSERT INTO audit_logs (user_id, icon, message)
                VALUES (?, ?, ?)
            `, [
                req.user.id,
                '🗑️',
                `Deleted media #${mediaId} from article #${media.article_id}`
            ]);

            return res.json({
                success: true,
                message: 'Media deleted successfully.'
            });

        } catch (err) {
            console.error('Error deleting media:', err);

            return res.status(500).json({
                success: false,
                message: 'Server error deleting media.'
            });
        }
    }
);

module.exports = router;