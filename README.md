# GitGuide – Full-Stack Git & GitHub Knowledge Center

A production-grade full-stack web application designed for developers facing Git and GitHub challenges. GitGuide offers searchable step-by-step guides, an interactive CLI command synthesizer with safety warnings, an intelligent terminal error analyzer powered by Groq AI, bookmarking, 5-star ratings, community comments, media attachments, interactive chatbot assistant, and a comprehensive Admin & User Dashboard.

---

## 🛠️ Full-Stack Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) | Responsive editorial UI, Dark/Light mode, micro-animations, glassmorphism design |
| **Backend Server** | Node.js & Express.js (v5) | High-performance RESTful API, CORS enabled, static asset hosting, centralized error handling |
| **Database** | MySQL (8.0+ / HeatWave Compatible) | Relational DBMS using `mysql2/promise` connection pooling, InnoDB engine, foreign keys, cascades, indexes, and ACID transactions |
| **AI Integration** | Groq SDK (Llama 3 models) | Natural language Git command synthesis, deep command explanation & safety audits, terminal error troubleshooting |
| **Authentication** | JSON Web Tokens (JWT) & `bcryptjs` | 7-day signed Bearer tokens, Role-Based Access Control (`admin`, `user`), password complexity verification |
| **API Client** | `js/api.js` | Centralized asynchronous fetch client with automatic auth token management & offline fallback |

---

## 📋 Key Features

1. **Home Discovery**: Hero search bar with real-time suggestions, dynamic category cards with live guide counters, and trending articles feed.
2. **Search & Filter Engine**: Multi-criteria search by keyword, topic category, difficulty level (`Beginner`, `Intermediate`, `Advanced`), and publication status.
3. **Interactive Guide Reader**: Step-by-step instructions with one-click copyable bash commands, user bookmarks, 5-star rating system, frequently asked questions (FAQs), and community discussion threads.
4. **Groq AI Command Synthesizer**: Dual-mode CLI builder translating natural English into precision Git commands (`POST /api/commands/ai-synthesize`), interactive flag selectors, automated risk levels (`safe`, `caution`, `danger`), and undo blueprints.
5. **Terminal Error Analyzer**: Paste terminal error logs to receive pattern-matched diagnostic breakdowns and Groq AI-powered recovery solutions.
6. **AI Assistant Chatbot**: Integrated floating AI chatbot for interactive Git queries and instant troubleshooting.
7. **User Dashboard**: Dedicated user profile managing bookmarked guides, comment history, and account settings.
8. **Admin Control Panel**: Complete CRUD management for articles and categories, comment moderation, audit log timeline, and live KPI metrics.

---

## 📁 Project Structure

```
GitGuide/
├── server.js                   → Express.js application server & static file host
├── .env                        → Environment configuration (Port, JWT Secret, MySQL Credentials, Groq API Key)
├── .env.example                → Example environment configuration template
├── package.json                → Project dependencies and NPM scripts
├── mysql-schema.sql            → Production MySQL relational database schema (DDL & DML)
├── schema.sql                  → Relational DBMS schema reference
├── check-db.js                 → MySQL connection & table integrity verification utility
│
├── config/
│   └── db.js                   → MySQL connection pool (`mysql2/promise`) & keep-alive config
│
├── middleware/
│   └── auth.js                 → JWT verification, optional authentication, and admin role guards
│
├── routes/
│   ├── auth.js                 → POST /register, POST /login, GET /me, PUT /profile
│   ├── categories.js           → GET, POST, PUT, DELETE /api/categories
│   ├── articles.js             → GET /api/articles, /trending, /suggestions, CRUD
│   ├── comments.js             → GET, POST /api/comments/article/:id, admin moderation
│   ├── ratings.js              → GET, POST /api/ratings/:articleId
│   ├── bookmarks.js            → GET, POST /api/bookmarks/toggle
│   ├── commands.js             → GET /api/commands, POST /synthesize, AI synthesis & explain
│   ├── troubleshooting.js      → GET /patterns, POST /api/troubleshooting/analyze
│   ├── dashboard.js            → GET /api/dashboard/stats, /audit-logs, /user
│   ├── chatbot.js              → POST /api/chatbot/message (Groq AI conversational helper)
│   └── media.js                → POST /api/media/upload (Article media attachments)
│
├── scripts/
│   ├── seed.js                 → MySQL database seeder (populates categories, articles, commands, users)
│   └── test-api.js             → Automated end-to-end API test suite (13 endpoint tests)
│
├── css/
│   └── style.css               → Editorial stylesheet, design tokens, light/dark themes
│
├── js/
│   ├── api.js                  → Centralized frontend API client
│   ├── auth.js                 → Authentication state & session manager
│   ├── data.js                 → Default content dataset for seeder
│   ├── script.js               → Shared UI logic, theme switcher, toast notifications
│   ├── search.js               → Search filtering & skeleton loaders
│   ├── article.js              → Article viewer, ratings, and comments handler
│   ├── commands.js             → CLI command synthesizer & AI generator
│   ├── troubleshooting.js      → Terminal error analyzer logic
│   ├── dashboard.js            → Admin metrics, tables & CRUD operations
│   └── user-dashboard.js       → User bookmarks and personal comment history
│
├── index.html                  → Home page
├── search.html                 → Search & discovery page
├── article.html                → Article detail view
├── commands.html               → Git command synthesizer
├── troubleshooting.html        → Terminal error analyzer
├── dashboard.html              → Admin control panel
├── user-dashboard.html         → User profile dashboard
├── login.html                  → User authentication page
└── register.html               → User registration page
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory (or copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=gitguide_super_secret_jwt_key_2026_dbms_production

# Groq Cloud AI API Key
GROQ_API_KEY=your_groq_api_key_here

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=gitguide
```

---

## 🚀 Step-by-Step Setup Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MySQL Database
Ensure your local MySQL service (e.g. MySQL 8.0, XAMPP, or MySQL HeatWave) is running.

Import the database schema using MySQL CLI or MySQL Workbench:
```bash
# Using MySQL CLI
mysql -u root -p < mysql-schema.sql
```
*Alternatively, you can open `mysql-schema.sql` in MySQL Workbench and execute the script.*

### 3. Seed Initial Content
Populates the database with 8 categories, 24 comprehensive articles with 110 steps, 15 Git commands, 10 error patterns, and default test accounts:
```bash
node scripts/seed.js
```
*(or `npm run seed`)*

### 4. Verify Database Connection & Tables
Check that all 14 tables and records are properly configured:
```bash
node check-db.js
```

### 5. Start the Web Server
```bash
node server.js
```
*(or `npm start`)*

Open your browser and navigate to: **[http://localhost:5000](http://localhost:5000)**

### 6. Run Automated Backend Tests
Run the comprehensive 13-point test suite covering authentication, CRUD, and AI endpoints:
```bash
node scripts/test-api.js
```
*(or `npm test`)*

---

## 🔐 Default Test Accounts

| Username | Password | Role | Description |
|---|---|---|---|
| `admin` | `admin123` | **Admin** | Full access to Admin Dashboard, Article & Category CRUD, and Comment Moderation |
| `harsh` | `User123!` | **User** | Standard user account with personalized bookmarks and ratings |
| `demo` | `User123!` | **User** | Sample student account |

*(New accounts can also be created freely on `/register.html`)*

---

## 🔌 REST API Reference Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` – Register new user with password complexity checks
- `POST /api/auth/login` – Login with username/password, returns signed JWT token
- `GET /api/auth/me` – Fetch current authenticated profile
- `PUT /api/auth/profile` – Update user profile information

### Articles (`/api/articles`)
- `GET /api/articles` – Search & filter articles by query, category, difficulty, or status
- `GET /api/articles/trending` – Fetch curated trending articles for homepage
- `GET /api/articles/suggestions?q=` – Autocomplete suggestions for search bar
- `GET /api/articles/:id` – Full article details with steps, FAQs, comments, ratings, and media
- `POST /api/articles` – *(Admin)* Create a new article with step breakdowns and FAQs
- `PUT /api/articles/:id` – *(Admin)* Update an existing article
- `DELETE /api/articles/:id` – *(Admin)* Delete article (cascades related records)

### Categories (`/api/categories`)
- `GET /api/categories` – List all categories with dynamic guide counts
- `GET /api/categories/:id` – Get category details and associated articles
- `POST /api/categories` – *(Admin)* Create category
- `PUT /api/categories/:id` – *(Admin)* Update category
- `DELETE /api/categories/:id` – *(Admin)* Delete category

### Comments & Ratings
- `GET /api/comments/article/:id` – Fetch all comments for an article
- `POST /api/comments/article/:id` – Submit a new comment
- `DELETE /api/comments/:id` – *(Admin / Author)* Remove a comment
- `GET /api/ratings/:articleId` – Get average rating and user's specific rating
- `POST /api/ratings/:articleId` – Submit or update rating (1 to 5 stars)

### Bookmarks (`/api/bookmarks`)
- `GET /api/bookmarks` – Get current user's saved guides
- `POST /api/bookmarks/toggle` – Toggle bookmark state for an article

### Git Commands & AI Synthesizer (`/api/commands`)
- `GET /api/commands` – Fetch full Git command catalog with flags
- `POST /api/commands/synthesize` – Validate flag combinations & evaluate safety risk levels
- `POST /api/commands/ai-synthesize` – Natural language to Git command synthesis via Groq AI
- `POST /api/commands/ai-explain` – Deep AI syntax breakdown and safety audit

### Troubleshooting & Error Analyzer (`/api/troubleshooting`)
- `GET /api/troubleshooting/patterns` – List known terminal error patterns
- `POST /api/troubleshooting/analyze` – Analyze terminal error output using pattern matching and Groq AI

### Analytics & Dashboard (`/api/dashboard`)
- `GET /api/dashboard/stats` – *(Admin)* Real-time platform KPI metrics
- `GET /api/dashboard/audit-logs` – *(Admin)* Chronological audit trail of user actions
- `GET /api/dashboard/user` – *(User)* User statistics, bookmarks, and activity

---

## 📖 Relational DBMS Architecture (Viva / Presentation Notes)

### 1. Database Schema & Normalization
The database consists of **14 normalized relational tables** in MySQL:
- **Core Entities**: `users`, `categories`, `articles`, `git_commands`, `error_patterns`
- **Child / Dependent Entities**: `article_steps`, `article_faqs`, `article_media`, `comments`, `ratings`, `bookmarks`, `audit_logs`, `recently_viewed_articles`, `article_reading_progress`

### 2. Entity Relationships
- **1-to-Many**: 
  - `categories.id` $\rightarrow$ `articles.category_id`
  - `articles.id` $\rightarrow$ `article_steps.article_id`
  - `articles.id` $\rightarrow$ `article_faqs.article_id`
  - `articles.id` $\rightarrow$ `article_media.article_id`
  - `articles.id` $\rightarrow$ `comments.article_id`
- **Many-to-Many Relationships**:
  - `users` $\leftrightarrow$ `articles` via `bookmarks` (composite uniqueness on `(user_id, article_id)`)
  - `users` $\leftrightarrow$ `articles` via `ratings` (unique constraint on `(user_id, article_id)` with `CHECK (rating >= 1 AND rating <= 5)`)

### 3. Referential Integrity & Cascades
- Configured with `ON DELETE CASCADE` on child entities (steps, FAQs, media, comments, ratings, bookmarks) so that deleting an article cleans up dependent records automatically, preventing orphaned rows.
- User deletion sets comments to `NULL` via `ON DELETE SET NULL` to preserve discussion history.

### 4. Concurrency & Performance
- **Connection Pooling**: Managed via `mysql2/promise` with configurable pool size (`connectionLimit: 10`, `keepAliveInitialDelay: 0`).
- **Indexes**: Clustered Primary Keys on all tables; B-Tree indexes on foreign keys (`category_id`, `article_id`, `user_id`) and status columns for fast search lookups and aggregations.
- **Transactions**: Atomic seeding and multi-step mutations executed using `connection.beginTransaction()`, `connection.commit()`, and `connection.rollback()`.

### 5. Security Practices
- **Parameterized SQL Queries**: All database queries strictly use prepared statements (`?` placeholders) to prevent SQL Injection attacks.
- **Cryptographic Password Hashing**: Passwords stored as irreversible bcrypt hashes (salt rounds = 10).
- **Stateless Authorization**: Signed JWTs verified on protected API routes with Role-Based Access Control (RBAC).

---

## 📝 License
This project is open-source and available under the **ISC License**.
