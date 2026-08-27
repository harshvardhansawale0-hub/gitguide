// ============================================================
// GitGuide – Database Seeder Script (MySQL)
// ============================================================
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function seedDatabase() {
    console.log('🌱 Starting GitGuide database seed process (MySQL)...');

    // 1. Read data from js/data.js
    const dataJsPath = path.resolve(__dirname, '..', 'js', 'data.js');
    const dataJsCode = fs.readFileSync(dataJsPath, 'utf8');

    const loaderScript = `
        ${dataJsCode}
        ({ categories, articles, gitCommands, errorPatterns, trendingArticleIds })
    `;

    const extracted = vm.runInThisContext(loaderScript);
    const { categories = [], articles = [], gitCommands = [], errorPatterns = [] } = extracted;

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Clear existing records in correct foreign key order
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('TRUNCATE TABLE audit_logs');
        await connection.query('TRUNCATE TABLE error_patterns');
        await connection.query('TRUNCATE TABLE git_commands');
        await connection.query('TRUNCATE TABLE bookmarks');
        await connection.query('TRUNCATE TABLE ratings');
        await connection.query('TRUNCATE TABLE comments');
        await connection.query('TRUNCATE TABLE article_faqs');
        await connection.query('TRUNCATE TABLE article_steps');
        await connection.query('TRUNCATE TABLE article_media');
        await connection.query('TRUNCATE TABLE recently_viewed_articles');
        await connection.query('TRUNCATE TABLE article_reading_progress');
        await connection.query('TRUNCATE TABLE articles');
        await connection.query('TRUNCATE TABLE categories');
        await connection.query('TRUNCATE TABLE users');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        // 2. Seed Default Users
        console.log('👤 Seeding default users...');
        const adminHash = bcrypt.hashSync('admin123', 10);
        const userHash = bcrypt.hashSync('User123!', 10);

        const insertUserQuery = `
            INSERT INTO users (id, name, contact, username, password_hash, role)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        await connection.query(insertUserQuery, [1, 'System Administrator', '+1234567890', 'admin', adminHash, 'admin']);
        await connection.query(insertUserQuery, [2, 'Harshwardhan Sawale', 'developer@gitguide.io', 'harsh', userHash, 'user']);
        await connection.query(insertUserQuery, [3, 'Demo User', 'user@gitguide.io', 'demo', userHash, 'user']);

        // 3. Seed Categories
        console.log(`📁 Seeding ${categories.length} categories...`);
        const insertCategoryQuery = `
            INSERT INTO categories (id, name, icon, description)
            VALUES (?, ?, ?, ?)
        `;

        const categoryMap = new Map(); // name -> id

        for (const cat of categories) {
            await connection.query(insertCategoryQuery, [cat.id, cat.name, cat.icon, cat.description]);
            categoryMap.set(cat.name, cat.id);
        }

        // 4. Seed Articles with Steps and FAQs
        console.log(`📄 Seeding ${articles.length} articles with step-by-step guides and FAQs...`);
        const insertArticleQuery = `
            INSERT INTO articles (id, title, category_id, difficulty, description, reading_time, author, keywords, commands, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Published')
        `;

        const insertStepQuery = `
            INSERT INTO article_steps (article_id, step_number, title, content, command)
            VALUES (?, ?, ?, ?, ?)
        `;

        const insertFaqQuery = `
            INSERT INTO article_faqs (article_id, question, answer)
            VALUES (?, ?, ?)
        `;

        for (const art of articles) {
            const categoryId = categoryMap.get(art.category) || 1;
            await connection.query(insertArticleQuery, [
                art.id,
                art.title,
                categoryId,
                art.difficulty || 'Beginner',
                art.description || '',
                art.readingTime || '5 min',
                art.author || 'GitGuide Team',
                JSON.stringify(art.keywords || []),
                JSON.stringify(art.commands || [])
            ]);

            // Steps
            if (art.steps && Array.isArray(art.steps)) {
                for (let idx = 0; idx < art.steps.length; idx++) {
                    const step = art.steps[idx];
                    await connection.query(insertStepQuery, [
                        art.id, idx + 1, step.title || '', step.content || '', step.command || null
                    ]);
                }
            }

            // FAQs
            if (art.faqs && Array.isArray(art.faqs)) {
                for (const faq of art.faqs) {
                    await connection.query(insertFaqQuery, [
                        art.id, faq.question || '', faq.answer || ''
                    ]);
                }
            }
        }

        // 5. Seed Git Commands
        console.log(`💻 Seeding ${gitCommands.length} Git commands...`);
        const insertCommandQuery = `
            INSERT INTO git_commands (name, description, flags, requires_arg, arg_placeholder)
            VALUES (?, ?, ?, ?, ?)
        `;

        for (const cmd of gitCommands) {
            await connection.query(insertCommandQuery, [
                cmd.name,
                cmd.description || '',
                JSON.stringify(cmd.flags || []),
                cmd.requiresArg ? 1 : 0,
                cmd.argPlaceholder || ''
            ]);
        }

        // 6. Seed Error Patterns (Troubleshooting)
        console.log(`🔍 Seeding ${errorPatterns.length} error patterns...`);
        const insertErrorPatternQuery = `
            INSERT INTO error_patterns (title, keywords, solution, article_id)
            VALUES (?, ?, ?, ?)
        `;

        for (const pat of errorPatterns) {
            await connection.query(insertErrorPatternQuery, [
                pat.title,
                JSON.stringify(pat.keywords || []),
                pat.solution || '',
                pat.articleId || null
            ]);
        }

        // 7. Seed Sample Comments
        console.log('💬 Seeding sample user comments...');
        const insertCommentQuery = `
            INSERT INTO comments (article_id, user_id, name, text, created_at)
            VALUES (?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL ? DAY))
        `;

        await connection.query(insertCommentQuery, [1, 2, 'harsh', 'This guide made setting up Git on Windows extremely straightforward. Thank you!', 3]);
        await connection.query(insertCommentQuery, [2, 3, 'demo', 'The visual explanation of merge conflicts saved me during my team sprint today.', 2]);
        await connection.query(insertCommentQuery, [3, 2, 'harsh', 'The fast-forward explanation is clear and easy to follow.', 1]);
        // Last comment using hours instead of days
        await connection.query(`
            INSERT INTO comments (article_id, user_id, name, text, created_at)
            VALUES (?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL ? HOUR))
        `, [4, 3, 'demo', 'Personal Access Tokens finally make sense now.', 5]);

        // 8. Seed Sample Ratings
        console.log('⭐ Seeding sample article ratings...');
        const insertRatingQuery = `
            INSERT INTO ratings (article_id, user_id, rating)
            VALUES (?, ?, ?)
        `;

        await connection.query(insertRatingQuery, [1, 2, 5]);
        await connection.query(insertRatingQuery, [1, 3, 5]);
        await connection.query(insertRatingQuery, [2, 2, 5]);
        await connection.query(insertRatingQuery, [3, 3, 4]);
        await connection.query(insertRatingQuery, [4, 2, 5]);

        // 9. Seed Sample Bookmarks
        console.log('🔖 Seeding sample user bookmarks...');
        const insertBookmarkQuery = `
            INSERT INTO bookmarks (article_id, user_id)
            VALUES (?, ?)
        `;

        await connection.query(insertBookmarkQuery, [1, 2]);
        await connection.query(insertBookmarkQuery, [2, 2]);
        await connection.query(insertBookmarkQuery, [4, 2]);
        await connection.query(insertBookmarkQuery, [3, 3]);

        // 10. Seed Sample Audit Logs
        console.log('📝 Seeding initial audit log records...');
        const insertAuditQuery = `
            INSERT INTO audit_logs (user_id, icon, message, created_at)
            VALUES (?, ?, ?, DATE_SUB(NOW(), INTERVAL ? HOUR))
        `;

        await connection.query(insertAuditQuery, [1, '🚀', 'System database initialized and seeded with Git & GitHub knowledge base', 4]);
        await connection.query(insertAuditQuery, [1, '📄', 'Published core article series: Git Basics & Branching', 3]);
        await connection.query(insertAuditQuery, [2, '⭐', 'User "harsh" rated Article #1 with 5 stars', 2]);
        await connection.query(insertAuditQuery, [3, '💬', 'User "demo" commented on "How to Fix Git Merge Conflicts"', 1]);

        await connection.commit();
        console.log('✅ Database seeded successfully with complete GitGuide content!');
    } catch (err) {
        await connection.rollback();
        console.error('❌ Error seeding database:', err);
        throw err;
    } finally {
        connection.release();
    }
}

if (require.main === module) {
    seedDatabase()
        .then(() => process.exit(0))
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}

module.exports = seedDatabase;
