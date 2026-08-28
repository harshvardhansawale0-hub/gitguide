// ============================================================
// GitGuide – Database Connection (MySQL HeatWave)
// ============================================================
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create connection pool configuration
const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gitguide',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};

// Enable SSL if explicitly configured or if connecting to any remote host (e.g. Aiven, AWS RDS, TiDB)
const isRemoteHost = process.env.DB_HOST && !['localhost', '127.0.0.1', '::1'].includes(process.env.DB_HOST.toLowerCase());
if (process.env.DB_SSL === 'true' || isRemoteHost) {
    poolConfig.ssl = {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true' ? true : false
    };
}

const pool = mysql.createPool(poolConfig);

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
