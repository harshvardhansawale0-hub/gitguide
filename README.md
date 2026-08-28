# GitGuide – Full-Stack Git & GitHub Knowledge Center

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5.2-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B%20%2F%20HeatWave-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Groq AI](https://img.shields.io/badge/Groq%20AI-LLaMA%203-F55036?style=flat&logo=openai&logoColor=white)](https://groq.com/)
[![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?style=flat&logo=render&logoColor=black)](https://render.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

A production-ready full-stack web application and developer knowledge platform engineered to solve real-world Git and GitHub challenges. **GitGuide** combines rich editorial documentation with AI-powered developer utilities: natural language command synthesis, interactive terminal error troubleshooting, step-by-step guides, 5-star ratings, community discussions, reading progress tracking, and complete Admin and User management dashboards.

---

## 🛠️ Full-Stack Technology Stack

| Layer | Technology | Key Modules & Role |
|---|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) | Modern editorial UI, Dark/Light theme system, glassmorphic cards, micro-animations, skeleton loaders |
| **Backend Server** | Node.js & Express.js (v5.2) | RESTful API architecture, CORS handling, static asset pipeline, centralized error handling |
| **Database** | MySQL (8.0+ / HeatWave / Aiven Compatible) | Relational DBMS with `mysql2/promise` connection pooling, InnoDB engine, foreign keys, cascades, indexes, and ACID transactions |
| **AI Integration** | Groq Cloud SDK (`groq-sdk`) | Powered by LLaMA 3 models for real-time natural language Git command synthesis, syntax explanations, safety risk audits, and error analysis |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) & `bcryptjs` | Stateless Bearer token authorization (7-day validity), Role-Based Access Control (`admin`, `user`), password complexity verification |
| **Media Handling** | Centralized Upload Pipeline | Media attachment storage with MIME validation for article screenshots and tutorials |
| **Cloud Deployment** | Render & Cloud MySQL | Native Blueprint deployment via `render.yaml`, automatic SSL detection for cloud MySQL hosts (Aiven, AWS RDS, TiDB) |

---

## 🌟 Key Features

### 1. 🔍 Discovery & Search Engine
- **Instant Search with Autocomplete**: Real-time suggestion dropdown as you type (`GET /api/articles/suggestions`).
- **Multi-Filter Search**: Filter articles by keyword, category, difficulty (`Beginner`, `Intermediate`, `Advanced`), and publication status.
- **Dynamic Category Hub**: Live article count badges for each category.
- **Trending & Featured Feed**: Curated high-impact guides displayed on the home view.

### 2. 📖 Interactive Step-by-Step Guide Reader
- **Copyable Commands**: One-click bash code block copying with instant feedback.
- **5-Star Community Rating System**: Submit and view weighted ratings with duplicate prevention.
- **Personalized Bookmarking**: Save guides to read later, synced across your user account.
- **Reading Progress Tracking**: Automatically records user progress (`article_reading_progress`).
- **Interactive FAQs & Discussion**: Collapsible FAQs and real-time community comment threads.
- **Media Attachments**: Embedded images, diagrams, and video walkthroughs (`article_media`).

### 3. 🤖 Groq AI Git Command Synthesizer
- **Natural Language Translation**: Converts plain English (e.g., *"undo last commit but keep changes"*) into exact Git commands using Groq LLaMA 3.
- **Visual Flag Builder**: Select command flags with live risk analysis (`safe`, `caution`, `danger`).
- **Deep Syntax Explanations**: Detailed breakdown of what each argument does before execution.
- **Emergency Undo Blueprints**: Step-by-step instructions on how to revert commands if something goes wrong.

### 4. 🧰 Intelligent Terminal Error Analyzer
- **Dual-Engine Analysis**: Fast regex pattern matching combined with Groq AI diagnostic breakdown.
- **Root-Cause Analysis**: Explains *why* the terminal threw the error.
- **Step-by-Step Fixes**: Provides verified copyable terminal commands to resolve the issue safely.

### 5. 💬 Interactive Chatbot Assistant
- Floating AI assistant widget accessible across all pages for instant conversational Git queries and troubleshooting.

### 6. 👤 User Profile Dashboard
- Personalized view of bookmarked guides and recently viewed articles.
- Activity metrics: total bookmarks, comments submitted, and reading progress.
- Profile settings management (name, contact, password update).

### 7. 🛡️ Admin Control Panel
- **Complete Article & Category CMS**: Create, edit, and delete guides with step builders, FAQ managers, and media attachments.
- **Comment Moderation**: Review and delete inappropriate user comments.
- **Real-Time KPI Metrics**: Total users, guides, categories, comments, and average ratings.
- **Live Audit Trail**: Chronological log of administrative and system activities (`audit_logs`).

---

## 📁 Project Structure

```
GitGuide/
├── server.js                   → Express application entry point & static file hosting
├── render.yaml                 → Render Infrastructure-as-Code (IaC) deployment blueprint
├── mysql-schema.sql            → Production MySQL relational database schema (DDL & DML)
├── schema.sql                  → Relational DBMS schema reference
├── check-db.js                 → MySQL connection & table integrity verification utility
├── package.json                → Project dependencies, scripts, and engine metadata
├── .env.example                → Template for environment configuration
│
├── config/
│   └── db.js                   → MySQL connection pool (`mysql2/promise`) with SSL & keep-alive
│
├── middleware/
│   └── auth.js                 → JWT verification, optional auth, and Admin role guards
│
├── routes/
│   ├── auth.js                 → Authentication (register, login, me, profile updates)
│   ├── categories.js           → Category CRUD & dynamic guide counts
│   ├── articles.js             → Article search, suggestions, trending, details, CRUD
│   ├── comments.js             → Comment submission, retrieval, and admin deletion
│   ├── ratings.js              → 5-star ratings handler with check constraints
│   ├── bookmarks.js            → User bookmark management & toggling
│   ├── commands.js             → Git command catalog, synthesis & Groq AI generation
│   ├── troubleshooting.js      → Terminal error analyzer (Regex + Groq AI)
│   ├── chatbot.js              → AI conversational assistant (`POST /api/chatbot/message`)
│   ├── media.js                → Media upload and attachment management
│   └── dashboard.js            → Admin statistics, audit logs, and User dashboard metrics
│
├── scripts/
│   ├── seed.js                 → Production MySQL database seeder (categories, articles, users)
│   ├── seed-new-articles.js    → Extended article dataset populator
│   ├── init-mysql.js           → Database initialization script
│   ├── migrate-sqlite-to-mysql.js → Automated data migration utility
│   ├── test-api.js             → End-to-end API test suite (13 endpoint test scenarios)
│   ├── test-commands-groq.js   → Groq AI command synthesis test runner
│   ├── test-troubleshooting-groq.js → AI troubleshooting test runner
│   └── test-chatbot.js         → AI chatbot validation script
│
├── css/
│   └── style.css               → Design system, CSS variables, dark/light themes, responsiveness
│
├── js/
│   ├── api.js                  → Centralized asynchronous API client with JWT token management
│   ├── auth.js                 → Frontend authentication & session state manager
│   ├── script.js               → Global UI scripts, theme switcher, toast alerts
│   ├── search.js               → Search page filters, pagination & skeleton loaders
│   ├── article.js              → Article viewer, ratings, progress tracking & comments
│   ├── commands.js             → Command synthesizer & Groq AI prompt builder
│   ├── troubleshooting.js      → Error analyzer UI logic
│   ├── chatbot.js              → Floating chatbot widget interface
│   ├── dashboard.js            → Admin metrics, CRUD modals & audit log viewer
│   └── user-dashboard.js       → User profile, saved bookmarks & comment history
│
├── index.html                  → Homepage (Search hero, category grid, trending guides)
├── search.html                 → Advanced search & filter interface
├── article.html                → Article reader (steps, FAQs, media, comments, ratings)
├── commands.html               → Git Command Synthesizer & AI Generator
├── troubleshooting.html        → Terminal Error Analyzer
├── dashboard.html              → Admin Control Center
├── user-dashboard.html         → User Profile Dashboard
├── login.html                  → User Sign-In page
└── register.html               → User Registration page
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory (or copy from `.env.example`):

```env
# Server Port & Environment
PORT=5000
NODE_ENV=development

# JWT Secret for Authentication
JWT_SECRET=gitguide_super_secret_jwt_key_2026_dbms_production

# Groq Cloud AI API Key (Get yours at https://console.groq.com)
GROQ_API_KEY=gsk_your_groq_api_key_here

# MySQL Database Configuration (Local or Cloud)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=gitguide

# Optional: Set to "true" for Cloud MySQL instances requiring SSL (Aiven, AWS RDS, TiDB)
DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=false
```

---

## 🚀 Step-by-Step Setup Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MySQL Server**: v8.0+ (Local MySQL, XAMPP, MySQL HeatWave, or Aiven Cloud MySQL)
- **Groq API Key**: Free API key from [Groq Console](https://console.groq.com/)

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/harshvardhansawale0-hub/gitguide.git
cd gitguide
npm install
```

### 3. Initialize the MySQL Database
Ensure your MySQL server is running. Create and load the schema:
```bash
# Using MySQL Command Line
mysql -u root -p < mysql-schema.sql
```
*Alternatively, run `mysql-schema.sql` inside MySQL Workbench or phpMyAdmin.*

### 4. Seed Initial Content & Default Users
Populate the database with default categories, detailed articles, commands, error patterns, and default test accounts:
```bash
npm run seed
```

### 5. Verify Database Tables & Connectivity
Run the built-in verification script to ensure all 14 tables and indexes are healthy:
```bash
node check-db.js
```

### 6. Start the Application Server
```bash
# Start in standard mode
npm start

# Or start for development
npm run dev
```

Visit the application at: **[http://localhost:5000](http://localhost:5000)**

### 7. Run Automated Test Suite
Verify all backend endpoints, authentication flows, and AI integration:
```bash
npm test
```

---

## ☁️ Cloud Deployment (Render + Aiven / Cloud MySQL)

GitGuide is fully pre-configured for one-click deployment on **Render** using the included `render.yaml` blueprint.

### Deploying to Render:
1. **Push your repository** to GitHub.
2. **Create a Free Cloud MySQL Database** on [Aiven.io](https://aiven.io/) or [TiDB Cloud](https://tidbcloud.com/).
3. **Import Schema & Seed**: Connect your MySQL client to the cloud database and run `mysql-schema.sql`, then run `npm run seed` with the remote DB credentials in `.env`.
4. **Deploy on Render**:
   - Go to [Render Dashboard](https://dashboard.render.com/) &rarr; **New** &rarr; **Blueprint**.
   - Connect your `gitguide` GitHub repository.
   - Render will read `render.yaml` automatically.
   - Set the required Environment Variables in Render (`GROQ_API_KEY`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_PORT`, `DB_NAME`, `DB_SSL=true`).
   - Click **Apply** to deploy!

---

## 🔐 Default Test Accounts

| Username | Password | Role | Permissions |
|---|---|---|---|
| `admin` | `admin123` | **Admin** | Full access to Admin Dashboard, Article/Category CRUD, Comment Moderation, and Audit Logs |
| `harsh` | `User123!` | **User** | Standard user account with personalized bookmarks, ratings, and progress tracking |
| `demo` | `User123!` | **User** | Sample student account for testing |

*(New accounts can also be created freely via the `/register.html` page)*

---

## 🔌 REST API Reference

### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account with password validation | Public |
| `POST` | `/api/auth/login` | Authenticate user & return signed JWT Bearer token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile data | Bearer Token |
| `PUT` | `/api/auth/profile` | Update profile information and password | Bearer Token |

### 📚 Articles (`/api/articles`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/articles` | Filter and paginate articles by keyword, category, difficulty | Public |
| `GET` | `/api/articles/trending` | Fetch trending articles for home page | Public |
| `GET` | `/api/articles/suggestions?q=` | Fast autocomplete search suggestions | Public |
| `GET` | `/api/articles/:id` | Fetch full guide with steps, FAQs, media, comments, and ratings | Optional |
| `POST` | `/api/articles` | Create a new article with steps and FAQs | Admin |
| `PUT` | `/api/articles/:id` | Update an existing article and its child entities | Admin |
| `DELETE` | `/api/articles/:id` | Delete article (cascades all child records) | Admin |

### 🏷️ Categories (`/api/categories`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/categories` | List all categories with live article counts | Public |
| `GET` | `/api/categories/:id` | Get category details and associated guides | Public |
| `POST` | `/api/categories` | Create new category | Admin |
| `PUT` | `/api/categories/:id` | Update category details | Admin |
| `DELETE` | `/api/categories/:id` | Delete category | Admin |

### ⭐ Ratings & 🔖 Bookmarks
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/ratings/:articleId` | Get average rating and user's submitted score | Optional |
| `POST` | `/api/ratings/:articleId` | Submit or update 1-to-5 star rating | Bearer Token |
| `GET` | `/api/bookmarks` | Get all saved guides for current user | Bearer Token |
| `POST` | `/api/bookmarks/toggle` | Toggle bookmark status for an article | Bearer Token |

### 💬 Comments (`/api/comments`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/comments/article/:id` | Get all comments for a guide | Public |
| `POST` | `/api/comments/article/:id` | Post a new comment | Bearer Token |
| `DELETE` | `/api/comments/:id` | Delete comment | Admin / Author |

### ⚡ Git Commands & AI Synthesizer (`/api/commands`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/commands` | Fetch complete Git command catalog with flags | Public |
| `POST` | `/api/commands/synthesize` | Validate flag combinations & compute risk level | Public |
| `POST` | `/api/commands/ai-synthesize` | Synthesize Git commands from natural English via Groq AI | Public |
| `POST` | `/api/commands/ai-explain` | Deep syntax explanation & undo safety guidelines | Public |

### 🛠️ Terminal Troubleshooting & Chatbot
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/troubleshooting/patterns` | List common error patterns and fixes | Public |
| `POST` | `/api/troubleshooting/analyze` | Diagnose terminal error via Pattern Matcher & Groq AI | Public |
| `POST` | `/api/chatbot/message` | Conversational Git assistant query | Public |

### 📊 Dashboard & Analytics (`/api/dashboard`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Platform KPIs (users, articles, categories, ratings) | Admin |
| `GET` | `/api/dashboard/audit-logs` | Chronological administrative action history | Admin |
| `GET` | `/api/dashboard/user` | User metrics, reading progress, and bookmark stats | Bearer Token |

---

## 🏛️ Relational DBMS Architecture (Viva & Examination Notes)

### 1. Database Schema & Normalization
The system is built on **14 normalized relational tables** in MySQL following 3NF (Third Normal Form):
- **Core Entity Tables**: `users`, `categories`, `articles`, `git_commands`, `error_patterns`
- **Child & Dependent Tables**: `article_steps`, `article_faqs`, `article_media`, `comments`, `ratings`, `bookmarks`, `audit_logs`, `recently_viewed_articles`, `article_reading_progress`

### 2. Entity Relationships
- **One-to-Many (1:N)**:
  - `categories.id` $\rightarrow$ `articles.category_id`
  - `articles.id` $\rightarrow$ `article_steps.article_id`
  - `articles.id` $\rightarrow$ `article_faqs.article_id`
  - `articles.id` $\rightarrow$ `article_media.article_id`
  - `articles.id` $\rightarrow$ `comments.article_id`
- **Many-to-Many (M:N)**:
  - `users` $\leftrightarrow$ `articles` resolved via `bookmarks` (Composite Unique constraint on `(user_id, article_id)`)
  - `users` $\leftrightarrow$ `articles` resolved via `ratings` (Unique constraint on `(user_id, article_id)` with `CHECK (rating >= 1 AND rating <= 5)`)
  - `users` $\leftrightarrow$ `articles` resolved via `recently_viewed_articles` and `article_reading_progress`

### 3. Referential Integrity & Cascade Rules
- **`ON DELETE CASCADE`**: Configured on child entities (`article_steps`, `article_faqs`, `article_media`, `comments`, `ratings`, `bookmarks`, `recently_viewed_articles`, `article_reading_progress`) ensuring clean automated cleanup when parent articles or users are deleted, eliminating orphan records.
- **`ON DELETE SET NULL`**: Applied to `comments.user_id` and `audit_logs.user_id` so that historical community discussion and audit logs remain intact even if an account is removed.

### 4. Concurrency, Performance & Indexing
- **Connection Pooling**: Implemented via `mysql2/promise` with configurable pool parameters (`connectionLimit: 10`, `idleTimeout: 60000`, `enableKeepAlive: true`).
- **B-Tree Secondary Indexes**: Added on high-cardinality foreign keys and lookup columns (`idx_articles_category`, `idx_articles_difficulty`, `idx_comments_article`, `idx_ratings_article`, `idx_bookmarks_user`, `idx_recently_viewed_user`, `idx_reading_progress_user`) for optimal sub-millisecond query execution.
- **ACID Transactions**: Atomic database operations and seeders use `connection.beginTransaction()`, `connection.commit()`, and `connection.rollback()`.

### 5. Security Engineering
- **SQL Injection Prevention**: 100% of database interactions utilize prepared statements with parameterized placeholders (`?`).
- **Cryptographic Hashing**: User passwords are encrypted using `bcryptjs` with salt rounds = 10.
- **Role-Based Access Control**: Protected administrative routes verify signed JWT Bearer tokens and enforce role checks before granting execution.

---

## 📜 License
This project is open-source and distributed under the **ISC License**.
