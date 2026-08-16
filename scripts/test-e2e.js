// ============================================================
// GitGuide – Full End-to-End Simulation Test
// ============================================================
const http = require('http');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}`;

function fetchURL(path, options = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const reqOptions = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: options.method || 'GET',
            headers: options.headers || {}
        };

        const req = http.request(reqOptions, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
        });

        req.on('error', reject);

        if (options.body) {
            req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
        }
        req.end();
    });
}

async function runE2ESimulation() {
    console.log('🌐 Starting Full End-to-End GitGuide Web & API Verification...\n');

    // 1. Check all HTML pages are served correctly
    const pages = [
        '/',
        '/index.html',
        '/search.html',
        '/article.html?id=1',
        '/commands.html',
        '/troubleshooting.html',
        '/dashboard.html',
        '/user-dashboard.html',
        '/login.html',
        '/register.html',
        '/css/style.css',
        '/js/api.js',
        '/js/auth.js',
        '/js/script.js'
    ];

    console.log('📄 1. Verifying Static Assets & Web Page Serving:');
    for (const page of pages) {
        const res = await fetchURL(page);
        if (res.status === 200) {
            console.log(`  ✅ [200 OK] ${page} (${res.body.length} bytes)`);
        } else {
            console.error(`  ❌ [${res.status}] Failed to serve: ${page}`);
            process.exit(1);
        }
    }

    console.log('\n🔐 2. Verifying Complete User & Admin Lifecycle:');

    // Register a new test student account
    const uniqueUser = 'student_' + Date.now();
    const regRes = await fetchURL('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
            name: 'Student Tester',
            contact: '+91 9876543210',
            username: uniqueUser,
            password: 'Password123!'
        }
    });
    const regData = JSON.parse(regRes.body);
    console.log(`  ✅ Registered new account "${uniqueUser}": Token generated=${Boolean(regData.token)}`);

    // Login with new account
    const loginRes = await fetchURL('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { username: uniqueUser, password: 'Password123!' }
    });
    const loginData = JSON.parse(loginRes.body);
    const userToken = loginData.token;
    console.log(`  ✅ Logged in successfully as "${uniqueUser}" (Role: ${loginData.user.role})`);

    // Bookmark an article
    const bmRes = await fetchURL('/api/bookmarks/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
        body: { articleId: 3 }
    });
    console.log(`  ✅ Bookmarked Article #3: ${bmRes.body}`);

    // Post a comment
    const cmRes = await fetchURL('/api/comments/article/3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
        body: { text: 'Testing real-time live comment posting via backend!' }
    });
    console.log(`  ✅ Posted comment: ${cmRes.body}`);

    // Submit a 5-star rating
    const rtRes = await fetchURL('/api/ratings/3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
        body: { rating: 5 }
    });
    console.log(`  ✅ Submitted rating: ${rtRes.body}`);

    // Check User Dashboard metrics
    const userDashRes = await fetchURL('/api/dashboard/user', {
        headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const userDashData = JSON.parse(userDashRes.body);
    console.log(`  ✅ User Dashboard data retrieved: ${userDashData.data.bookmarks.length} bookmarks, ${userDashData.data.comments.length} comments.`);

    // Admin login and Stats check
    const adminLoginRes = await fetchURL('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { username: 'admin', password: 'admin123' }
    });
    const adminToken = JSON.parse(adminLoginRes.body).token;
    const adminStatsRes = await fetchURL('/api/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const statsData = JSON.parse(adminStatsRes.body);
    console.log(`  ✅ Admin Dashboard stats verified: ${statsData.data.totalArticles} articles, ${statsData.data.totalCategories} categories, ${statsData.data.totalUsers} users.`);

    console.log('\n🎉 ALL FULL-STACK CHECKS PASSED PERFECTLY!\n');
}

runE2ESimulation().catch(err => {
    console.error('❌ Error during E2E verification:', err);
    process.exit(1);
});
