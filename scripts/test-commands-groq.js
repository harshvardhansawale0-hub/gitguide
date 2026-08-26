// ============================================================
// GitGuide – Groq AI Command Synthesizer Test Suite
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

async function runGroqCommandsTests() {
    console.log('🧪 Starting GitGuide Groq AI Command Synthesizer Tests...\n');
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
        // Test 1: Natural language AI synthesis (undo last commit keeping staged)
        console.log('Test 1: Synthesizing undo commit command via Groq AI...');
        const undoRes = await request('POST', '/api/commands/ai-synthesize', {
            prompt: 'Undo my last commit but keep all modified files staged in index'
        });
        assert(
            undoRes.status === 200 &&
            undoRes.data &&
            undoRes.data.success &&
            undoRes.data.data &&
            undoRes.data.data.command &&
            undoRes.data.data.command.includes('reset') &&
            undoRes.data.data.command.includes('--soft'),
            'Groq AI synthesized "git reset --soft HEAD~1" with syntax breakdown',
            undoRes.data
        );

        // Test 2: Dangerous command synthesis and safety risk detection
        console.log('\nTest 2: Synthesizing destructive command with danger classification...');
        const hardResetRes = await request('POST', '/api/commands/ai-synthesize', {
            prompt: 'Permanently discard all uncommitted changes and hard reset working directory'
        });
        assert(
            hardResetRes.status === 200 &&
            hardResetRes.data &&
            hardResetRes.data.success &&
            hardResetRes.data.data &&
            hardResetRes.data.data.isDangerous === true &&
            hardResetRes.data.data.dangerLevel === 'danger' &&
            hardResetRes.data.data.warningMessage,
            'Groq AI flagged destructive hard reset with dangerLevel="danger" & warningMessage',
            hardResetRes.data
        );

        // Test 3: AI Command Explanation and Flag Audit (/ai-explain)
        console.log('\nTest 3: Deep AI Flag Audit and Explanation (/api/commands/ai-explain)...');
        const explainRes = await request('POST', '/api/commands/ai-explain', {
            command: 'git push origin main --force-with-lease'
        });
        assert(
            explainRes.status === 200 &&
            explainRes.data &&
            explainRes.data.success &&
            explainRes.data.data &&
            explainRes.data.data.explanation &&
            Array.isArray(explainRes.data.data.breakdown) &&
            explainRes.data.data.breakdown.length > 0,
            'Groq AI explained "--force-with-lease" with flag breakdown and best practices',
            explainRes.data
        );

        // Test 4: Validation on empty prompt
        console.log('\nTest 4: Input validation on empty prompt...');
        const emptyRes = await request('POST', '/api/commands/ai-synthesize', {
            prompt: '    '
        });
        assert(
            emptyRes.status === 400 &&
            emptyRes.data &&
            emptyRes.data.success === false,
            'Empty prompt returns HTTP 400 validation error',
            emptyRes.data
        );

        // Test 5: Classic Visual Combinator Formatter (/synthesize)
        console.log('\nTest 5: Visual Combinator Formatter (/api/commands/synthesize)...');
        const visualRes = await request('POST', '/api/commands/synthesize', {
            commandName: 'git reset',
            selectedFlags: [{ flag: '--hard' }],
            argument: 'HEAD~1'
        });
        assert(
            visualRes.status === 200 &&
            visualRes.data &&
            visualRes.data.success &&
            visualRes.data.data.command === 'git reset --hard HEAD~1' &&
            visualRes.data.data.isDangerous === true,
            'Visual combinator format and safety warnings intact',
            visualRes.data
        );

    } catch (err) {
        console.error('Test execution error:', err.message);
        failed++;
    }

    console.log(`\n🏁 Groq Command Synthesizer Test Run Finished: ${passed} passed, ${failed} failed.\n`);
    if (failed > 0) process.exit(1);
}

// Start server and run tests
const { server } = require('../server');

setTimeout(async () => {
    try {
        await runGroqCommandsTests();
    } finally {
        server.close();
    }
}, 600);
