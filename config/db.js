// ============================================================
// GitGuide – Database Connection (MySQL HeatWave)
// ============================================================
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gitguide',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test the connection
pool.getConnection()
    .then(connection => {
        console.log('✅ Connected to MySQL database.');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err);
        if (err) {
            console.error('Message:', err.message);
            console.error('Code:', err.code);
            if (err.errno) console.error('Errno:', err.errno);
            if (err.sqlState) console.error('SQL State:', err.sqlState);
        }
    });

module.exports = pool;
