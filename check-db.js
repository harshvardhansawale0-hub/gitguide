const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'gitguide.db');

console.log('Checking database:', dbPath);

const db = new Database(dbPath, { readonly: true });

const tables = db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
    ORDER BY name
`).all();

console.log('\nTables:');
console.log(tables.map(t => t.name));

for (const table of ['articles', 'users', 'categories', 'article_steps', 'article_media']) {
    try {
        const result = db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get();
        console.log(`${table}: ${result.count}`);
    } catch (error) {
        console.log(`${table}: TABLE NOT FOUND`);
    }
}

console.log('\nFirst 10 articles:');
try {
    console.log(
        db.prepare('SELECT id, title, status FROM articles LIMIT 10').all()
    );
} catch (error) {
    console.log('Could not read articles:', error.message);
}

console.log('\nUsers:');
try {
    console.log(
        db.prepare('SELECT id, username, role FROM users').all()
    );
} catch (error) {
    console.log('Could not read users:', error.message);
}

db.close();