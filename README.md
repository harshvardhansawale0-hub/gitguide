# GitGuide – Full-Stack Git & GitHub Knowledge Center

A production-ready full-stack web application designed for developers facing Git and GitHub challenges. GitGuide offers searchable step-by-step guides, interactive CLI command synthesizer with safety warnings, intelligent terminal error analyzer, bookmarking, 5-star ratings, community comments, and a comprehensive Admin & User Dashboard.

---

## 🛠️ Full-Stack Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) | Responsive editorial design, dark/light theme, micro-animations, glassmorphism |
| **Backend Server** | Node.js & Express.js (v5) | High-performance RESTful API, CORS enabled, static file server |
| **Database** | SQLite (via `better-sqlite3`) & MySQL (`schema.sql`) | Relational DBMS with foreign key constraints, indexes, and WAL journal mode |
| **Authentication** | JSON Web Tokens (JWT) & `bcryptjs` | 7-day signed tokens, role-based access control (`admin`, `user`), password complexity checks |
| **API Client** | `js/api.js` | Centralized asynchronous fetch client with automatic auth headers & offline fallback |

---

## 📋 Features

1. **Home Page**: Hero search bar with instant autocomplete, dynamic category cards with live guide counts, and trending articles feed.
2. **Search & Filter Page**: Real-time filtering by keyword, topic category, and difficulty level (`Beginner`, `Intermediate`, `Advanced`).
3. **Article Detail Page**: Step-by-step solutions with formatted bash commands, one-click copy buttons, user bookmarks, 5-star rating system, and community comments.
4. **Command Synthesizer**: Interactive Git command builder with flag combination, custom arguments, and automated dangerous command warnings (`git reset --hard`, `git push --force`, `git clean`, etc.).
5. **Error Log Analyzer**: Intelligent terminal error log analyzer using backend pattern matching and keyword relevance scoring to suggest precise solutions and guide links.
6. **User Dashboard**: Personalized user area showcasing saved bookmarks, submitted comments, and account activity.
7. **Admin Dashboard**: Full CRUD management for articles and categories, comment moderation, live KPI metrics (articles, users, ratings, comments), and audit log timeline.

---

## 📁 Project Structure

```
GitGuide/
├── server.js                   → Express.js application server & static file host
├── .env                        → Environment configuration (PORT, JWT_SECRET, DB_PATH)
├── package.json                → Project dependencies and scripts
├── schema.sql                  → Relational DBMS SQL Schema (DDL & DML)
├── gitguide.db                 → High-speed SQLite database (auto-generated)
│
├── config/
│   └── db.js                   → Database connection, WAL mode, foreign keys, table init
│
├── middleware/
│   └── auth.js                 → JWT verification, optional auth, and admin role guards
│
├── routes/
│   ├── auth.js                 → POST /register, POST /login, GET /me
│   ├── categories.js           → GET, POST, PUT, DELETE /api/categories
│   ├── articles.js             → GET /api/articles, /trending, /suggestions, CRUD
│   ├── comments.js             → GET, POST /api/comments/article/:id, admin moderation
│   ├── ratings.js              → GET, POST /api/ratings/:articleId
│   ├── bookmarks.js            → GET, POST /api/bookmarks/toggle
│   ├── commands.js             → GET /api/commands, POST /synthesize
│   ├── troubleshooting.js      → GET /patterns, POST /api/troubleshooting/analyze
│   └── dashboard.js            → GET /api/dashboard/stats, /audit-logs, /user
│
├── scripts/
│   ├── seed.js                 → Automatic database seeder from data.js
│   └── test-api.js             → Automated API test suite (13 endpoint tests)
│
├── css/
│   └── style.css               → Editorial stylesheet, CSS variables, dark mode
│
├── js/
│   ├── api.js                  → Centralized frontend API client
│   ├── auth.js                 → Authentication state & session management
│   ├── data.js                 → Fallback data dataset
│   ├── script.js               → Shared UI logic, theme toggle, toast notifications
│   ├── search.js               → Search filtering & skeleton loaders
│   ├── article.js              → Article reader, rating & comments handler
│   ├── commands.js             → CLI command synthesizer
│   ├── troubleshooting.js      → Terminal error analyzer
│   ├── dashboard.js            → Admin metrics, tables & CRUD operations
│   └── user-dashboard.js       → User bookmarks and comment history
│
├── index.html                  → Home page
├── search.html                 → Search & discovery
├── article.html                → Article detail view
├── commands.html               → Git command synthesizer
├── troubleshooting.html        → Terminal error analyzer
├── dashboard.html              → Admin dashboard
├── user-dashboard.html         → User dashboard
├── login.html                  → User login
└── register.html               → User registration
```

---

## 🚀 How to Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed the Database
Populates the SQLite database with 8 categories, 24 comprehensive articles, 15 Git commands, 10 error patterns, and default test accounts:
```bash
npm run seed
```

### 3. Start the Backend Server
```bash
npm start
```

Open your browser at **[http://localhost:5000](http://localhost:5000)**.

### 4. Run Automated Backend Tests
To verify all REST API endpoints:
```bash
npm test
```

---

## 🔐 Default Test Accounts

| Username | Password | Role | Description |
|---|---|---|---|
| `admin` | `admin123` | **Admin** | Full access to Admin Dashboard, Article CRUD, and comment moderation |
| `harsh` | `User123!` | **User** | Standard user account with bookmarks and ratings |
| `demo` | `User123!` | **User** | Sample student user account |

*(Or register a new account on `/register.html`)*

---

## 🔌 REST API Reference Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` – Register new user with strong password checks
- `POST /api/auth/login` – Login with username/password, returns JWT token
- `GET /api/auth/me` – Fetch current authenticated profile

### Articles (`/api/articles`)
- `GET /api/articles?q=&category=&difficulty=&status=` – Search & filter articles
- `GET /api/articles/trending` – Top trending articles for homepage
- `GET /api/articles/suggestions?q=` – Fast title/description autocomplete
- `GET /api/articles/:id` – Full article details with steps, FAQs, comments & ratings
- `POST /api/articles` – *(Admin)* Create article with steps & FAQs
- `PUT /api/articles/:id` – *(Admin)* Update article details & steps
- `DELETE /api/articles/:id` – *(Admin)* Remove article

### Categories (`/api/categories`)
- `GET /api/categories` – List categories with dynamic guide counts
- `GET /api/categories/:id` – Get category details and associated articles
- `POST /api/categories` – *(Admin)* Create category
- `PUT /api/categories/:id` – *(Admin)* Update category
- `DELETE /api/categories/:id` – *(Admin)* Delete category

### Comments & Ratings
- `GET /api/comments/article/:id` – Fetch comments for an article
- `POST /api/comments/article/:id` – Post comment
- `DELETE /api/comments/:id` – *(Admin / Author)* Delete comment
- `GET /api/ratings/:articleId` – Get average rating & user rating
- `POST /api/ratings/:articleId` – Submit or update rating (1-5)

### Bookmarks (`/api/bookmarks`)
- `GET /api/bookmarks` – Get user's saved guides
- `POST /api/bookmarks/toggle` – Toggle bookmark for an article

### Troubleshooting & CLI
- `POST /api/troubleshooting/analyze` – Match terminal error log against knowledge base
- `GET /api/commands` – Fetch full Git commands catalogue
- `POST /api/commands/synthesize` – Validate flag combinations & safety warnings

### Analytics & Dashboard (`/api/dashboard`)
- `GET /api/dashboard/stats` – *(Admin)* KPI statistics
- `GET /api/dashboard/audit-logs` – *(Admin)* System activity log
- `GET /api/dashboard/user` – *(User)* User profile summary

---

## 📖 How to Explain in College DBMS Viva / Presentation

### 1. Database Architecture & Relationships
- **1-to-Many**: One Category has many Articles (`categories.id` → `articles.category_id`).
- **1-to-Many**: One Article has many Step instructions (`articles.id` → `article_steps.article_id`) and FAQs (`articles.id` → `article_faqs.article_id`).
- **Many-to-Many (via junction tables)**:
  - Users bookmarked Articles (`bookmarks` table with composite uniqueness on `[article_id, user_id]`).
  - Users rated Articles (`ratings` table with constraint `1 <= rating <= 5`).
- **Foreign Key Constraints (`ON DELETE CASCADE`)**: Deleting an article automatically cleans up its steps, FAQs, comments, bookmarks, and ratings to prevent orphaned records.

### 2. Performance & Indexes
- Foreign key indexing on `articles(category_id)`, `comments(article_id)`, and `bookmarks(user_id)` ensures fast joins.
- SQLite WAL (Write-Ahead Logging) mode allows simultaneous readers and writers without blocking.

### 3. Security
- **Password Protection**: Passwords are never stored in plain text; they are hashed with `bcryptjs` (salt rounds = 10).
- **JWT Authorization**: Bearer tokens are signed with a server secret and validated on protected routes.
- **SQL Injection Prevention**: All queries use parameterized statements (`?` placeholders via prepared statements).

---

## 📝 License
This project is open-source under the ISC License.
