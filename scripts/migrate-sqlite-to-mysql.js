const path = require('path');
const Database = require('better-sqlite3');
const db = require('../config/db'); // MySQL

async function migrateData() {
    console.log('🚀 Starting data migration from SQLite to MySQL...');

    const sqlitePath = path.resolve(__dirname, '..', 'gitguide.db');
    let sqliteDb;
    try {
        sqliteDb = new Database(sqlitePath, { readonly: true });
        console.log(`✅ Connected to SQLite database at ${sqlitePath}`);
    } catch (err) {
        console.error('❌ Failed to open SQLite database:', err.message);
        console.error('Make sure gitguide.db exists in the project root.');
        process.exit(1);
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();
        console.log('🧹 Clearing existing MySQL data...');
        
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        const tables = [
            'audit_logs', 'error_patterns', 'git_commands', 'bookmarks',
            'ratings', 'comments', 'article_faqs', 'article_steps',
            'article_media', 'recently_viewed_articles', 'article_reading_progress',
            'articles', 'categories', 'users'
        ];
        
        for (const table of tables) {
            await connection.query(`TRUNCATE TABLE ${table}`);
        }
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        // Helper to insert rows
        const migrateTable = async (tableName, mysqlInsertQuery, columns, defaults = {}) => {
            console.log(`📦 Migrating ${tableName}...`);
            let rows = [];
            try {
                rows = sqliteDb.prepare(`SELECT * FROM ${tableName}`).all();
            } catch (err) {
                console.log(`   ⚠️ Table ${tableName} might not exist in SQLite or error reading it: ${err.message}`);
                return;
            }

            if (rows.length === 0) {
                console.log(`   ℹ️ No records found in ${tableName}.`);
                return;
            }

            for (const row of rows) {
                const values = columns.map(col => {
                    const val = row[col];
                    if ((val === undefined || val === null) && defaults[col] !== undefined) {
                        return defaults[col];
                    }
                    return val;
                });
                try {
                    await connection.query(mysqlInsertQuery, values);
                } catch (err) {
                    console.error(`   ❌ Error inserting into ${tableName}:`, err.message);
                    console.error(`   Row data:`, row);
                    throw err;
                }
            }
            console.log(`   ✅ Migrated ${rows.length} records to ${tableName}.`);
        };

        await migrateTable('users', 
            `INSERT INTO users (id, username, password_hash, role, name, contact, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            ['id', 'username', 'password_hash', 'role', 'name', 'contact', 'created_at'],
            { role: 'user' }
        );

        await migrateTable('categories', 
            `INSERT INTO categories (id, name, icon, description, created_at) VALUES (?, ?, ?, ?, ?)`,
            ['id', 'name', 'icon', 'description', 'created_at']
        );

        await migrateTable('articles', 
            `INSERT INTO articles (id, title, category_id, difficulty, description, reading_time, author, keywords, commands, status, view_count, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            ['id', 'title', 'category_id', 'difficulty', 'description', 'reading_time', 'author', 'keywords', 'commands', 'status', 'view_count', 'created_at', 'updated_at'],
            { difficulty: 'Beginner', reading_time: '5 min', author: 'GitGuide Team', status: 'Published', view_count: 0 }
        );

        await migrateTable('article_steps', 
            `INSERT INTO article_steps (id, article_id, step_number, title, content, command) VALUES (?, ?, ?, ?, ?, ?)`,
            ['id', 'article_id', 'step_number', 'title', 'content', 'command']
        );

        await migrateTable('article_faqs', 
            `INSERT INTO article_faqs (id, article_id, question, answer) VALUES (?, ?, ?, ?)`,
            ['id', 'article_id', 'question', 'answer']
        );

        await migrateTable('git_commands', 
            `INSERT INTO git_commands (id, name, description, flags, requires_arg, arg_placeholder) VALUES (?, ?, ?, ?, ?, ?)`,
            ['id', 'name', 'description', 'flags', 'requires_arg', 'arg_placeholder'],
            { requires_arg: 0 }
        );

        await migrateTable('error_patterns', 
            `INSERT INTO error_patterns (id, title, keywords, solution, article_id) VALUES (?, ?, ?, ?, ?)`,
            ['id', 'title', 'keywords', 'solution', 'article_id']
        );

        await migrateTable('comments', 
            `INSERT INTO comments (id, article_id, user_id, name, text, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
            ['id', 'article_id', 'user_id', 'name', 'text', 'created_at']
        );

        await migrateTable('ratings', 
            `INSERT INTO ratings (id, article_id, user_id, rating, created_at) VALUES (?, ?, ?, ?, ?)`,
            ['id', 'article_id', 'user_id', 'rating', 'created_at']
        );

        await migrateTable('bookmarks', 
            `INSERT INTO bookmarks (id, article_id, user_id, created_at) VALUES (?, ?, ?, ?)`,
            ['id', 'article_id', 'user_id', 'created_at']
        );

        await migrateTable('audit_logs', 
            `INSERT INTO audit_logs (id, user_id, icon, message, created_at) VALUES (?, ?, ?, ?, ?)`,
            ['id', 'user_id', 'icon', 'message', 'created_at']
        );

        await migrateTable('article_media', 
            `INSERT INTO article_media (id, article_id, media_type, media_url, file_name, mime_type, file_size, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            ['id', 'article_id', 'media_type', 'media_url', 'file_name', 'mime_type', 'file_size', 'created_at']
        );

        await migrateTable('article_reading_progress', 
            `INSERT INTO article_reading_progress (id, article_id, user_id, progress_percent, updated_at) VALUES (?, ?, ?, ?, ?)`,
            ['id', 'article_id', 'user_id', 'progress_percent', 'last_read_at'],
            { progress_percent: 0 }
        );

        await migrateTable('recently_viewed_articles', 
            `INSERT INTO recently_viewed_articles (id, user_id, article_id, viewed_at) VALUES (?, ?, ?, ?)`,
            ['id', 'user_id', 'article_id', 'viewed_at']
        );

        await connection.commit();
        console.log('🎉 Data migration completed successfully!');
    } catch (err) {
        await connection.rollback();
        console.error('❌ Data migration failed:', err);
    } finally {
        sqliteDb.close();
        connection.release();
        process.exit(0);
    }
}

migrateData();
