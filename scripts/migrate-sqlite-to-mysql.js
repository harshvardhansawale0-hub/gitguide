// ============================================================
// GitGuide – Blazing-Fast SQLite to MySQL Database Migration
// ============================================================
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const db = require('../config/db');

// Order of insertion respecting relational dependencies
const TABLE_ORDER = [
    'users',
    'categories',
    'articles',
    'article_steps',
    'article_faqs',
    'article_media',
    'comments',
    'ratings',
    'bookmarks',
    'git_commands',
    'error_patterns',
    'audit_logs',
    'recently_viewed_articles',
    'article_reading_progress'
];

async function runMigration() {
    console.log('🚀 Starting SQLite to MySQL Database Migration...\n');

    // 1. Export SQLite data to JSON via Python
    const exportScript = path.resolve(__dirname, 'export_sqlite.py');
    const dumpPath = path.resolve(__dirname, 'sqlite_dump.json');

    console.log('📦 Step 1: Extracting SQLite database (gitguide.db)...');
    try {
        execSync(`python "${exportScript}"`, { stdio: 'inherit' });
    } catch (e) {
        console.error('❌ Failed to extract SQLite database:', e.message);
        process.exit(1);
    }

    if (!fs.existsSync(dumpPath)) {
        console.error('❌ Dump file not found at:', dumpPath);
        process.exit(1);
    }

    const dump = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));
    console.log('✅ SQLite data extracted successfully.\n');

    // 2. Connect to MySQL
    console.log('🔌 Step 2: Connecting to MySQL database:', process.env.DB_NAME);
    const connection = await db.getConnection();

    try {
        // Disable foreign key checks for schema setup and data import
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        // Ensure all tables exist in target MySQL database
        console.log('🏗️  Ensuring all MySQL tables exist...');
        const schemaPath = path.resolve(__dirname, '../mysql-schema.sql');
        if (fs.existsSync(schemaPath)) {
            let schemaSql = fs.readFileSync(schemaPath, 'utf8');
            schemaSql = schemaSql.replace(/CREATE DATABASE[\s\S]*?;/i, '');
            schemaSql = schemaSql.replace(/USE\s+[\w`]+;/gi, '');
            schemaSql = schemaSql.replace(/--.*$/gm, '');

            const statements = schemaSql
                .split(';')
                .map(s => s.trim())
                .filter(s => s.length > 0);

            for (const stmt of statements) {
                try {
                    await connection.query(stmt);
                } catch (stmtErr) {
                    if (!stmtErr.message.includes('Duplicate key name') && !stmtErr.message.includes('already exists')) {
                        console.warn('  ⚠️ Schema notice:', stmtErr.message);
                    }
                }
            }
        }
        console.log('✅ MySQL tables and indexes ready.\n');

        await connection.beginTransaction();
        console.log('🔒 Transaction started.');

        // Clear existing MySQL tables in reverse order
        console.log('🧹 Clearing existing records in MySQL...');
        for (const table of [...TABLE_ORDER].reverse()) {
            await connection.query(`TRUNCATE TABLE \`${table}\``);
        }
        console.log('✅ MySQL tables cleared.\n');

        // 3. Migrate each table using bulk batching for maximum performance over network
        console.log('📥 Step 3: Migrating tables from SQLite to MySQL (Bulk Optimized)...');
        let totalMigratedRows = 0;

        for (const tableName of TABLE_ORDER) {
            const rows = dump[tableName] || [];
            if (rows.length === 0) {
                console.log(`  • ${tableName}: 0 rows (skipped)`);
                continue;
            }

            const columns = Object.keys(rows[0]);
            const columnNamesSql = columns.map(c => `\`${c}\``).join(', ');

            // Prepare all row value arrays
            const allValues = rows.map(row => {
                return columns.map(col => {
                    let val = row[col];
                    if (val === undefined || val === null) {
                        return null;
                    }
                    if (['keywords', 'commands', 'flags'].includes(col)) {
                        if (typeof val === 'object') {
                            return JSON.stringify(val);
                        }
                    }
                    if (col === 'requires_arg') {
                        return val ? 1 : 0;
                    }
                    return val;
                });
            });

            // Insert in chunks of 100
            const CHUNK_SIZE = 100;
            for (let i = 0; i < allValues.length; i += CHUNK_SIZE) {
                const chunk = allValues.slice(i, i + CHUNK_SIZE);
                const placeholders = chunk.map(() => `(${columns.map(() => '?').join(',')})`).join(',');
                const flatValues = chunk.flat();
                await connection.query(`INSERT INTO \`${tableName}\` (${columnNamesSql}) VALUES ${placeholders}`, flatValues);
            }

            console.log(`  ✅ ${tableName}: ${rows.length} rows migrated`);
            totalMigratedRows += rows.length;
        }

        // Re-enable foreign key checks
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        await connection.commit();
        console.log('\n🎉 Migration committed successfully!');
        console.log(`📊 Total rows migrated: ${totalMigratedRows}\n`);

        // 4. Verification Step
        console.log('🔍 Step 4: Verifying MySQL row counts vs SQLite:');
        console.log('---------------------------------------------------------');
        console.log(
            'Table Name'.padEnd(28) + 
            'SQLite Count'.padEnd(15) + 
            'MySQL Count'.padEnd(15) + 
            'Status'
        );
        console.log('---------------------------------------------------------');

        for (const tableName of TABLE_ORDER) {
            const sqliteCount = (dump[tableName] || []).length;
            const [myRows] = await connection.query(`SELECT COUNT(*) AS count FROM \`${tableName}\``);
            const mysqlCount = myRows[0].count;
            const status = sqliteCount === mysqlCount ? '✅ MATCH' : '❌ MISMATCH';

            console.log(
                tableName.padEnd(28) + 
                String(sqliteCount).padEnd(15) + 
                String(mysqlCount).padEnd(15) + 
                status
            );
        }
        console.log('---------------------------------------------------------');

    } catch (err) {
        await connection.rollback();
        console.error('❌ Migration failed! Transaction rolled back:', err);
        process.exit(1);
    } finally {
        connection.release();
        process.exit(0);
    }
}

runMigration().catch(err => {
    console.error('Unexpected migration error:', err);
    process.exit(1);
});
