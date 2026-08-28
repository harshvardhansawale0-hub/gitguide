// ============================================================
// GitGuide – Comprehensive Backend API Test Suite
// ============================================================
const http = require('http');

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

let authToken = null;
let adminToken = null;

function request(method, path, body = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve({ status: res.statusCode, data: json });
                } catch (e) {
                    resolve({ status: res.statusCode, raw: data });
                }
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function runTests() {
    console.log('🧪 Starting GitGuide Backend API Test Suite...\n');
    let passed = 0;
    let failed = 0;

    async function test(name, fn) {
        try {
            await fn();
            console.log(`  ✅ PASS: ${name}`);
            passed++;
        } catch (err) {
            console.error(`  ❌ FAIL: ${name}`);
            console.error(`     Reason:`, err.message);
            failed++;
        }
    }

    // 1. Health Check
    await test('Health Check /api/health', async () => {
        const res = await request('GET', '/api/health');
        if (res.status !== 200 || res.data.status !== 'online') throw new Error(`Expected 200 online, got ${res.status}`);
    });

    // 2. Auth - Login Admin
    await test('POST /api/auth/login (Admin)', async () => {
        const res = await request('POST', '/api/auth/login', { username: 'admin', password: 'admin123' });
        if (res.status !== 200 || !res.data.token) throw new Error(`Login failed: ${JSON.stringify(res.data)}`);
        adminToken = res.data.token;
    });

    // 3. Auth - Login User
    await test('POST /api/auth/login (User)', async () => {
        const res = await request('POST', '/api/auth/login', { username: 'harsh', password: 'User123!' });
        if (res.status !== 200 || !res.data.token) throw new Error(`Login failed: ${JSON.stringify(res.data)}`);
        authToken = res.data.token;
    });

    // 4. Categories Listing
    await test('GET /api/categories', async () => {
        const res = await request('GET', '/api/categories');
        if (res.status !== 200 || !Array.isArray(res.data.data) || res.data.data.length === 0) {
            throw new Error(`Expected categories array, got ${JSON.stringify(res.data)}`);
        }
    });

    // 5. Articles Search & Filter
    await test('GET /api/articles?q=commit', async () => {
        const res = await request('GET', '/api/articles?q=commit');
        if (res.status !== 200 || !Array.isArray(res.data.data)) {
            throw new Error(`Expected search results, got ${JSON.stringify(res.data)}`);
        }
    });

    // 6. Article Detail with Steps & FAQs
    await test('GET /api/articles/1', async () => {
        const res = await request('GET', '/api/articles/1', null, authToken);
        if (res.status !== 200 || !res.data.data || !Array.isArray(res.data.data.steps)) {
            throw new Error(`Expected article detail with steps, got ${JSON.stringify(res.data)}`);
        }
    });

    // 7. Post Comment
    await test('POST /api/comments/article/1', async () => {
        const res = await request('POST', '/api/comments/article/1', { text: 'Automated test comment on Article #1' }, authToken);
        if (res.status !== 201 || !res.data.success) {
            throw new Error(`Comment failed: ${JSON.stringify(res.data)}`);
        }
    });

    // 8. Submit Rating
    await test('POST /api/ratings/1', async () => {
        const res = await request('POST', '/api/ratings/1', { rating: 5 }, authToken);
        if (res.status !== 200 || !res.data.success) {
            throw new Error(`Rating failed: ${JSON.stringify(res.data)}`);
        }
    });

    // 9. Toggle Bookmark
    await test('POST /api/bookmarks/toggle', async () => {
        const res = await request('POST', '/api/bookmarks/toggle', { articleId: 5 }, authToken);
        if (res.status !== 200 || typeof res.data.bookmarked !== 'boolean') {
            throw new Error(`Bookmark toggle failed: ${JSON.stringify(res.data)}`);
        }
    });

    // 10. Troubleshooting Analyzer
    await test('POST /api/troubleshooting/analyze', async () => {
        const res = await request('POST', '/api/troubleshooting/analyze', { errorText: 'fatal: Authentication failed for remote repo' });
        if (res.status !== 200 || !res.data.matched || res.data.data.length === 0) {
            throw new Error(`Analysis failed: ${JSON.stringify(res.data)}`);
        }
    });

    // 11. Git Command Synthesizer
    await test('POST /api/commands/synthesize', async () => {
        const res = await request('POST', '/api/commands/synthesize', {
            commandName: 'git reset',
            selectedFlags: [{ flag: '--hard' }],
            argument: 'HEAD~1'
        }, authToken);
        if (res.status !== 200 || !res.data.data.isDangerous || res.data.data.command !== 'git reset --hard HEAD~1') {
            throw new Error(`Synthesis failed: ${JSON.stringify(res.data)}`);
        }
    });

    // 12. Admin Dashboard Stats
    await test('GET /api/dashboard/stats (Admin)', async () => {
        const res = await request('GET', '/api/dashboard/stats', null, adminToken);
        if (res.status !== 200 || typeof res.data.data.totalArticles !== 'number') {
            throw new Error(`Dashboard stats failed: ${JSON.stringify(res.data)}`);
        }
    });

    // 13. User Dashboard
    await test('GET /api/dashboard/user (User)', async () => {
        const res = await request('GET', '/api/dashboard/user', null, authToken);
        if (res.status !== 200 || !res.data.data.user) {
            throw new Error(`User dashboard failed: ${JSON.stringify(res.data)}`);
        }
    });

    console.log(`\n🏁 Test Run Finished: ${passed} passed, ${failed} failed.\n`);
    if (failed > 0) {
        process.exit(1);
    }
}

module.exports = runTests;

if (require.main === module) {
    const { server } = require('../server');
    setTimeout(async () => {
        try {
            await runTests();
        } catch (err) {
            console.error(err);
            process.exit(1);
        } finally {
            server.close();
        }
    }, 500);
}
