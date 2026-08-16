// ============================================================
// GitGuide – Database Connection & Schema Setup
// ============================================================
const Database = require('better-sqlite3');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const dbPath = process.env.DB_PATH 
    ? path.resolve(__dirname, '..', process.env.DB_PATH) 
    : path.resolve(__dirname, '..', 'gitguide.db');

const db = new Database(dbPath);

// Enable Foreign Key constraints and WAL mode for maximum speed and concurrency
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Initialize database schema
function initSchema() {
    db.exec(`
        -- 1. USERS TABLE
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            contact VARCHAR(50),
            username VARCHAR(50) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(20) DEFAULT 'user' CHECK(role IN ('user', 'admin')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- 2. CATEGORIES TABLE
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL UNIQUE,
            icon TEXT,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- 3. ARTICLES TABLE
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title VARCHAR(255) NOT NULL,
            category_id INTEGER NOT NULL,
            difficulty VARCHAR(20) DEFAULT 'Beginner' CHECK(difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
            description TEXT NOT NULL,
            reading_time VARCHAR(20) DEFAULT '5 min',
            author VARCHAR(100) DEFAULT 'GitGuide Team',
            keywords TEXT, -- JSON Array of keywords
            commands TEXT, -- JSON Array of related commands
            status VARCHAR(20) DEFAULT 'Published' CHECK(status IN ('Published', 'Draft')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        );

        -- 4. ARTICLE STEPS TABLE
        CREATE TABLE IF NOT EXISTS article_steps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            article_id INTEGER NOT NULL,
            step_number INTEGER NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            command TEXT,
            FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
        );

        -- 5. ARTICLE FAQS TABLE
        CREATE TABLE IF NOT EXISTS article_faqs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            article_id INTEGER NOT NULL,
            question VARCHAR(255) NOT NULL,
            answer TEXT NOT NULL,
            FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
        );

        -- 6. COMMENTS TABLE
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            article_id INTEGER NOT NULL,
            user_id INTEGER,
            name VARCHAR(100) NOT NULL,
            text TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        );

        -- 7. RATINGS TABLE
        CREATE TABLE IF NOT EXISTS ratings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            article_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(article_id, user_id),
            FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        -- 8. BOOKMARKS TABLE
        CREATE TABLE IF NOT EXISTS bookmarks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            article_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(article_id, user_id),
            FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        -- 9. GIT COMMANDS CATALOG
        CREATE TABLE IF NOT EXISTS git_commands (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL UNIQUE,
            description TEXT NOT NULL,
            flags TEXT, -- JSON Array of flag objects
            requires_arg INTEGER DEFAULT 0,
            arg_placeholder VARCHAR(100)
        );

        -- 10. ERROR PATTERNS (TROUBLESHOOTING)
        CREATE TABLE IF NOT EXISTS error_patterns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title VARCHAR(255) NOT NULL,
            keywords TEXT NOT NULL, -- JSON Array of keywords
            solution TEXT NOT NULL,
            article_id INTEGER,
            FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE SET NULL
        );

        -- 11. AUDIT LOGS TABLE
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            icon VARCHAR(10) DEFAULT '📌',
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        );

        -- INDEXES FOR FAST SEARCH & JOINS
        CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
        CREATE INDEX IF NOT EXISTS idx_articles_difficulty ON articles(difficulty);
        CREATE INDEX IF NOT EXISTS idx_article_steps_article ON article_steps(article_id);
        CREATE INDEX IF NOT EXISTS idx_article_faqs_article ON article_faqs(article_id);
        CREATE INDEX IF NOT EXISTS idx_comments_article ON comments(article_id);
        CREATE INDEX IF NOT EXISTS idx_ratings_article ON ratings(article_id);
        CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
    `);
}

// Execute schema creation on startup
initSchema();

module.exports = db;
