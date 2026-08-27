-- ============================================================
-- GitGuide – Relational Database Schema (MySQL)
-- ============================================================

-- Create and select the GitGuide database
CREATE DATABASE IF NOT EXISTS gitguide
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE gitguide;

-- ============================================================
-- 1. USERS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(50),
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    last_login DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 2. CATEGORIES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 3. ARTICLES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    difficulty ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
    description TEXT NOT NULL,
    reading_time VARCHAR(20) DEFAULT '5 min',
    author VARCHAR(100) DEFAULT 'GitGuide Team',
    keywords JSON,
    commands JSON,
    status ENUM('Published', 'Draft') DEFAULT 'Published',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_articles_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 4. ARTICLE STEPS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS article_steps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT NOT NULL,
    step_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    command TEXT,

    CONSTRAINT fk_article_steps_article
        FOREIGN KEY (article_id)
        REFERENCES articles(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 5. ARTICLE FAQS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS article_faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT NOT NULL,
    question VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,

    CONSTRAINT fk_article_faqs_article
        FOREIGN KEY (article_id)
        REFERENCES articles(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 6. COMMENTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT NOT NULL,
    user_id INT NULL,
    name VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_comments_article
        FOREIGN KEY (article_id)
        REFERENCES articles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comments_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 7. RATINGS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_article_rating (article_id, user_id),

    CONSTRAINT chk_rating
        CHECK (rating >= 1 AND rating <= 5),

    CONSTRAINT fk_ratings_article
        FOREIGN KEY (article_id)
        REFERENCES articles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_ratings_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 8. BOOKMARKS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_bookmark (article_id, user_id),

    CONSTRAINT fk_bookmarks_article
        FOREIGN KEY (article_id)
        REFERENCES articles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_bookmarks_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 9. GIT COMMANDS CATALOG
-- ============================================================

CREATE TABLE IF NOT EXISTS git_commands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    flags JSON,
    requires_arg BOOLEAN DEFAULT FALSE,
    arg_placeholder VARCHAR(100)
) ENGINE=InnoDB;

-- ============================================================
-- 10. ERROR PATTERNS
-- ============================================================

CREATE TABLE IF NOT EXISTS error_patterns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    keywords JSON NOT NULL,
    solution TEXT NOT NULL,
    article_id INT NULL,

    CONSTRAINT fk_error_patterns_article
        FOREIGN KEY (article_id)
        REFERENCES articles(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 11. AUDIT LOGS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    icon VARCHAR(20) NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_logs_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 12. ARTICLE MEDIA TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS article_media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT NOT NULL,
    media_type ENUM('image', 'video', 'url') NOT NULL,
    media_url TEXT NOT NULL,
    file_name VARCHAR(255),
    mime_type VARCHAR(100),
    file_size INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_article_media_article
        FOREIGN KEY (article_id)
        REFERENCES articles(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 13. RECENTLY VIEWED ARTICLES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS recently_viewed_articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    article_id INT NOT NULL,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_recently_viewed (user_id, article_id),

    CONSTRAINT fk_recently_viewed_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_recently_viewed_article
        FOREIGN KEY (article_id)
        REFERENCES articles(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 14. ARTICLE READING PROGRESS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS article_reading_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    article_id INT NOT NULL,
    progress_percent INT DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY unique_reading_progress (user_id, article_id),

    CONSTRAINT chk_progress_percent
        CHECK (progress_percent >= 0 AND progress_percent <= 100),

    CONSTRAINT fk_reading_progress_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_reading_progress_article
        FOREIGN KEY (article_id)
        REFERENCES articles(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_articles_category
    ON articles(category_id);

CREATE INDEX idx_articles_difficulty
    ON articles(difficulty);

CREATE INDEX idx_article_steps_article
    ON article_steps(article_id);

CREATE INDEX idx_article_faqs_article
    ON article_faqs(article_id);

CREATE INDEX idx_comments_article
    ON comments(article_id);

CREATE INDEX idx_ratings_article
    ON ratings(article_id);

CREATE INDEX idx_bookmarks_user
    ON bookmarks(user_id);

CREATE INDEX idx_article_media_article
    ON article_media(article_id);

CREATE INDEX idx_recently_viewed_user
    ON recently_viewed_articles(user_id);

CREATE INDEX idx_reading_progress_user
    ON article_reading_progress(user_id);

-- ============================================================
-- SCHEMA CREATION COMPLETE
-- ============================================================