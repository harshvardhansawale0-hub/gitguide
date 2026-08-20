// ============================================================
// GitGuide – Chatbot API Test Suite
// ============================================================
const http = require('http');

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

function request(method, path, body = null) {
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

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
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

async function runChatbotTests() {
    console.log('🧪 Starting GitGuide AI Chatbot Test Suite...\n');
    let passed = 0;
    let failed = 0;

    function assert(condition, message, detail) {
        if (condition) {
            console.log(`  ✅ PASS: ${message}`);
            passed++;
        } else {
            console.error(`  ❌ FAIL: ${message}`, detail || '');
            failed++;
        }
    }

    try {
        // Test 1: GET /api/chatbot/categories
        const catRes = await request('GET', '/api/chatbot/categories');
        assert(
            catRes.status === 200 && catRes.data && catRes.data.success && Array.isArray(catRes.data.data) && catRes.data.data.length >= 5,
            'GET /api/chatbot/categories returns curated suggestion categories',
            catRes
        );

        // Test 2: POST /api/chatbot/query (Category Prompt)
        const catQueryRes = await request('POST', '/api/chatbot/query', {
            query: 'How to resolve merge conflicts',
            categoryId: 'conflicts'
        });
        assert(
            catQueryRes.status === 200 && catQueryRes.data && catQueryRes.data.success && catQueryRes.data.message.includes('<<<<<<< HEAD'),
            'POST /api/chatbot/query (Category: conflicts) returns conflict resolution steps',
            catQueryRes
        );

        // Test 3: POST /api/chatbot/query (Error log analysis)
        const errorQueryRes = await request('POST', '/api/chatbot/query', {
            query: 'error: failed to push some refs to origin main updates were rejected'
        });
        assert(
            errorQueryRes.status === 200 && errorQueryRes.data && errorQueryRes.data.success && errorQueryRes.data.message.includes('git pull --rebase'),
            'POST /api/chatbot/query (Push Rejected error) diagnoses remote divergence & gives rebase solution',
            errorQueryRes
        );

        // Test 4: POST /api/chatbot/query (Undo commit)
        const undoQueryRes = await request('POST', '/api/chatbot/query', {
            query: 'how to undo last commit safely'
        });
        assert(
            undoQueryRes.status === 200 && undoQueryRes.data && undoQueryRes.data.success && undoQueryRes.data.message.includes('git reset --soft HEAD~1'),
            'POST /api/chatbot/query (Undo commit) provides git reset --soft explanation',
            undoQueryRes
        );

        // Test 5: POST /api/chatbot/query (Empty input validation)
        const emptyQueryRes = await request('POST', '/api/chatbot/query', {
            query: '   '
        });
        assert(
            emptyQueryRes.status === 400 && emptyQueryRes.data && !emptyQueryRes.data.success,
            'POST /api/chatbot/query (Empty query) returns HTTP 400 validation error',
            emptyQueryRes
        );

    } catch (err) {
        console.error('Test execution error:', err.message);
        failed++;
    }

    console.log(`\n🏁 Chatbot Test Run Finished: ${passed} passed, ${failed} failed.\n`);
    if (failed > 0) process.exit(1);
}

// Start server if needed or test directly
const { server } = require('../server');

setTimeout(async () => {
    try {
        await runChatbotTests();
    } finally {
        server.close();
    }
}, 500);
