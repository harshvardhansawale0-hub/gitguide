// ============================================================
// GitGuide – Database Seeder Script
// ============================================================
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function seedDatabase() {
    console.log('🌱 Starting GitGuide database seed process...');

    // 1. Read data from js/data.js
    const dataJsPath = path.resolve(__dirname, '..', 'js', 'data.js');
    const dataJsCode = fs.readFileSync(dataJsPath, 'utf8');

    const loaderScript = `
        ${dataJsCode}
        ({ categories, articles, gitCommands, errorPatterns, trendingArticleIds })
    `;

    const extracted = vm.runInThisContext(loaderScript);
    const { categories = [], articles = [], gitCommands = [], errorPatterns = [] } = extracted;

    // Use a transaction for atomic and fast insertion
    const seedTransaction = db.transaction(() => {
        // Clear existing records if needed
        db.prepare('DELETE FROM audit_logs').run();
        db.prepare('DELETE FROM error_patterns').run();
        db.prepare('DELETE FROM git_commands').run();
        db.prepare('DELETE FROM bookmarks').run();
        db.prepare('DELETE FROM ratings').run();
        db.prepare('DELETE FROM comments').run();
        db.prepare('DELETE FROM article_faqs').run();
        db.prepare('DELETE FROM article_steps').run();
        db.prepare('DELETE FROM articles').run();
        db.prepare('DELETE FROM categories').run();
        db.prepare('DELETE FROM users').run();

        // 2. Seed Default Users
        console.log('👤 Seeding default users...');
        const adminHash = bcrypt.hashSync('admin123', 10);
        const userHash = bcrypt.hashSync('User123!', 10);

        const insertUser = db.prepare(`
            INSERT INTO users (id, name, contact, username, password_hash, role)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        insertUser.run(1, 'System Administrator', '+1234567890', 'admin', adminHash, 'admin');
        insertUser.run(2, 'Harshwardhan Sawale', 'developer@gitguide.io', 'harsh', userHash, 'user');
        insertUser.run(3, 'Demo User', 'user@gitguide.io', 'demo', userHash, 'user');

        // 3. Seed Categories
        console.log(`📁 Seeding ${categories.length} categories...`);
        const insertCategory = db.prepare(`
            INSERT INTO categories (id, name, icon, description)
            VALUES (?, ?, ?, ?)
        `);

        const categoryMap = new Map(); // name -> id

        categories.forEach(cat => {
            insertCategory.run(cat.id, cat.name, cat.icon, cat.description);
            categoryMap.set(cat.name, cat.id);
        });

        // 4. Seed Articles with Steps and FAQs
        console.log(`📄 Seeding ${articles.length} articles with step-by-step guides and FAQs...`);
        const insertArticle = db.prepare(`
            INSERT INTO articles (id, title, category_id, difficulty, description, reading_time, author, keywords, commands, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Published')
        `);

        const insertStep = db.prepare(`
            INSERT INTO article_steps (article_id, step_number, title, content, command)
            VALUES (?, ?, ?, ?, ?)
        `);

        const insertFaq = db.prepare(`
            INSERT INTO article_faqs (article_id, question, answer)
            VALUES (?, ?, ?)
        `);

        articles.forEach(art => {
            const categoryId = categoryMap.get(art.category) || 1;
            insertArticle.run(
                art.id,
                art.title,
                categoryId,
                art.difficulty || 'Beginner',
                art.description || '',
                art.readingTime || '5 min',
                art.author || 'GitGuide Team',
                JSON.stringify(art.keywords || []),
                JSON.stringify(art.commands || [])
            );

            // Steps
            if (art.steps && Array.isArray(art.steps)) {
                art.steps.forEach((step, idx) => {
                    insertStep.run(art.id, idx + 1, step.title || '', step.content || '', step.command || null);
                });
            }

            // FAQs
            if (art.faqs && Array.isArray(art.faqs)) {
                art.faqs.forEach(faq => {
                    insertFaq.run(art.id, faq.question || '', faq.answer || '');
                });
            }
        });

        // 5. Seed Git Commands
        console.log(`💻 Seeding ${gitCommands.length} Git commands...`);
        const insertCommand = db.prepare(`
            INSERT INTO git_commands (name, description, flags, requires_arg, arg_placeholder)
            VALUES (?, ?, ?, ?, ?)
        `);

        gitCommands.forEach(cmd => {
            insertCommand.run(
                cmd.name,
                cmd.description || '',
                JSON.stringify(cmd.flags || []),
                cmd.requiresArg ? 1 : 0,
                cmd.argPlaceholder || ''
            );
        });

        // 6. Seed Error Patterns (Troubleshooting)
        console.log(`🔍 Seeding ${errorPatterns.length} error patterns...`);
        const insertErrorPattern = db.prepare(`
            INSERT INTO error_patterns (title, keywords, solution, article_id)
            VALUES (?, ?, ?, ?)
        `);

        errorPatterns.forEach(pat => {
            insertErrorPattern.run(
                pat.title,
                JSON.stringify(pat.keywords || []),
                pat.solution || '',
                pat.articleId || null
            );
        });

        // 7. Seed Sample Comments
        console.log('💬 Seeding sample user comments...');
        const insertComment = db.prepare(`
            INSERT INTO comments (article_id, user_id, name, text, created_at)
            VALUES (?, ?, ?, ?, datetime('now', ?))
        `);

        insertComment.run(1, 2, 'harsh', 'This guide made setting up Git on Windows extremely straightforward. Thank you!', '-3 days');
        insertComment.run(2, 3, 'demo', 'The visual explanation of merge conflicts saved me during my team sprint today.', '-2 days');
        insertComment.run(3, 2, 'harsh', 'The fast-forward explanation is clear and easy to follow.', '-1 day');
        insertComment.run(4, 3, 'demo', 'Personal Access Tokens finally make sense now.', '-5 hours');

        // 8. Seed Sample Ratings
        console.log('⭐ Seeding sample article ratings...');
        const insertRating = db.prepare(`
            INSERT INTO ratings (article_id, user_id, rating)
            VALUES (?, ?, ?)
        `);

        insertRating.run(1, 2, 5);
        insertRating.run(1, 3, 5);
        insertRating.run(2, 2, 5);
        insertRating.run(3, 3, 4);
        insertRating.run(4, 2, 5);

        // 9. Seed Sample Bookmarks
        console.log('🔖 Seeding sample user bookmarks...');
        const insertBookmark = db.prepare(`
            INSERT INTO bookmarks (article_id, user_id)
            VALUES (?, ?)
        `);

        insertBookmark.run(1, 2);
        insertBookmark.run(2, 2);
        insertBookmark.run(4, 2);
        insertBookmark.run(3, 3);

        // 10. Seed Sample Audit Logs
        console.log('📝 Seeding initial audit log records...');
        const insertAudit = db.prepare(`
            INSERT INTO audit_logs (user_id, icon, message, created_at)
            VALUES (?, ?, ?, datetime('now', ?))
        `);

        insertAudit.run(1, '🚀', 'System database initialized and seeded with Git & GitHub knowledge base', '-4 hours');
        insertAudit.run(1, '📄', 'Published core article series: Git Basics & Branching', '-3 hours');
        insertAudit.run(2, '⭐', 'User "harsh" rated Article #1 with 5 stars', '-2 hours');
        insertAudit.run(3, '💬', 'User "demo" commented on "How to Fix Git Merge Conflicts"', '-1 hour');
    });

    seedTransaction();

    console.log('✅ Database seeded successfully with complete GitGuide content!');
}

if (require.main === module) {
    seedDatabase()
        .then(() => process.exit(0))
        .catch(err => {
            console.error('❌ Error seeding database:', err);
            process.exit(1);
        });
}

module.exports = seedDatabase;
