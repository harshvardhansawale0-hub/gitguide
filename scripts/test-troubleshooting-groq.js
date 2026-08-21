// ============================================================
// GitGuide – Groq AI Troubleshooting Test Suite
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

async function runGroqTroubleshootingTests() {
    console.log('🧪 Starting GitGuide Groq AI Troubleshooting Analyzer Tests...\n');
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
        // Test 1: Password authentication error
        console.log('Test 1: Analyzing Password Authentication Removed Error...');
        const authErrRes = await request('POST', '/api/troubleshooting/analyze', {
            errorText: `remote: Support for password authentication was removed on August 13, 2021.
fatal: Authentication failed for 'https://github.com/user/my-app.git/'`
        });
        assert(
            authErrRes.status === 200 &&
            authErrRes.data &&
            authErrRes.data.success &&
            authErrRes.data.source === 'groq-ai' &&
            authErrRes.data.analysis &&
            authErrRes.data.analysis.rootCause &&
            authErrRes.data.analysis.solution.length > 50,
            'Groq AI successfully diagnosed password authentication error with solution',
            authErrRes.data
        );

        // Test 2: Divergent branches / Push rejected
        console.log('\nTest 2: Analyzing Failed Push (Updates Rejected / Divergent Branch)...');
        const pushErrRes = await request('POST', '/api/troubleshooting/analyze', {
            errorText: `To https://github.com/user/repo.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://github.com/user/repo.git'
hint: Updates were rejected because the remote contains work that you do not have locally.`
        });
        assert(
            pushErrRes.status === 200 &&
            pushErrRes.data &&
            pushErrRes.data.success &&
            pushErrRes.data.source === 'groq-ai' &&
            (pushErrRes.data.analysis.solution.includes('git pull') || pushErrRes.data.analysis.solution.includes('rebase')),
            'Groq AI diagnosed push rejected error and suggested pull/rebase',
            pushErrRes.data
        );

        // Test 3: Detached HEAD state
        console.log('\nTest 3: Analyzing Detached HEAD state error...');
        const detachedRes = await request('POST', '/api/troubleshooting/analyze', {
            errorText: `You are in 'detached HEAD' state. You can look around, make experimental changes and commit them...`
        });
        assert(
            detachedRes.status === 200 &&
            detachedRes.data &&
            detachedRes.data.success &&
            detachedRes.data.analysis.category,
            'Groq AI diagnosed detached HEAD with category categorization',
            detachedRes.data
        );

        // Test 4: Empty validation
        console.log('\nTest 4: Empty input validation...');
        const emptyRes = await request('POST', '/api/troubleshooting/analyze', {
            errorText: '   '
        });
        assert(
            emptyRes.status === 400 &&
            emptyRes.data &&
            emptyRes.data.success === false,
            'Empty errorText returns HTTP 400 validation error',
            emptyRes.data
        );

    } catch (err) {
        console.error('Test execution error:', err.message);
        failed++;
    }

    console.log(`\n🏁 Groq Troubleshooting Test Run Finished: ${passed} passed, ${failed} failed.\n`);
    if (failed > 0) process.exit(1);
}

// Start server and run tests
const { server } = require('../server');

setTimeout(async () => {
    try {
        await runGroqTroubleshootingTests();
    } finally {
        server.close();
    }
}, 600);
