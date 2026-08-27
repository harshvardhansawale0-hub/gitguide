const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initMysql() {
    console.log('📦 Initializing MySQL database...');

    try {
        // First connect without database name to ensure the database exists
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306,
            multipleStatements: true
        });

        const dbName = process.env.DB_NAME || 'gitguide';

        console.log(`Checking if database '${dbName}' exists...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        console.log(`Database '${dbName}' is ready.`);

        // Now connect to the specific database
        await connection.changeUser({ database: dbName });

        console.log('Reading mysql-schema.sql...');
        const schemaPath = path.resolve(__dirname, '..', 'mysql-schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

        console.log('Executing schema script (this may take a few seconds)...');
        await connection.query(schemaSql);
        
        console.log('✅ Schema initialization complete!');
        await connection.end();
    } catch (err) {
        console.error('❌ Error initializing MySQL database:', err);
        process.exit(1);
    }
}

initMysql();
