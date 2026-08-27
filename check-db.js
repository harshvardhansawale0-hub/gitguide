require('dotenv').config();
const db = require('./config/db');

async function checkDatabase() {
    console.log('Checking MySQL database:', process.env.DB_NAME);

    const connection = await db.getConnection();

    try {
        const [tablesRows] = await connection.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = ?
            ORDER BY table_name
        `, [process.env.DB_NAME]);

        console.log('\nTables:');
        console.log(tablesRows.map(t => t.table_name || t.TABLE_NAME));

        for (const table of ['articles', 'users', 'categories', 'article_steps', 'article_media']) {
            try {
                const [result] = await connection.query(`SELECT COUNT(*) AS count FROM ${table}`);
                console.log(`${table}: ${result[0].count}`);
            } catch (error) {
                console.log(`${table}: TABLE NOT FOUND or error: ${error.message}`);
            }
        }

        console.log('\nFirst 10 articles:');
        try {
            const [articles] = await connection.query('SELECT id, title, status FROM articles LIMIT 10');
            console.log(articles);
        } catch (error) {
            console.log('Could not read articles:', error.message);
        }

        console.log('\nUsers:');
        try {
            const [users] = await connection.query('SELECT id, username, role FROM users');
            console.log(users);
        } catch (error) {
            console.log('Could not read users:', error.message);
        }

    } catch (err) {
        console.error('Database connection error:', err);
    } finally {
        connection.release();
        process.exit(0);
    }
}

checkDatabase();