// ============================================================
// GitGuide – Frontend Assets & Integration Test Suite
// ============================================================
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

function fetchUrl(pathname) {
    return new Promise((resolve, reject) => {
        http.get(BASE_URL + pathname, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                resolve({ status: res.statusCode, headers: res.headers, body: data });
            });
        }).on('error', reject);
    });
}

async function runFrontendTests() {
    console.log('🧪 Starting Chatbot Frontend & Assets Integration Tests...\n');
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
        // 1. Check black-cat.svg served correctly
        const svgRes = await fetchUrl('/images/black-cat.svg');
        assert(
            svgRes.status === 200 && svgRes.body.includes('catEyeGrad') && svgRes.body.includes('ellipse'),
            'Black Cat SVG asset served properly with vector gradients and paths'
        );

        // 2. Check chatbot.css served correctly
        const cssRes = await fetchUrl('/css/chatbot.css');
        assert(
            cssRes.status === 200 && cssRes.body.includes('.git-chat-widget') && cssRes.body.includes('.git-chat-tooltip'),
            'chatbot.css served with all widget, tooltip, modal, and responsive styles'
        );

        // 3. Check chatbot.js served correctly
        const jsRes = await fetchUrl('/js/chatbot.js');
        assert(
            jsRes.status === 200 && jsRes.body.includes('AVATAR_SVG') && jsRes.body.includes('renderMarkdown'),
            'chatbot.js served with full controller logic, SVG templates, and markdown parsers'
        );

        // 4. Verify all HTML pages include chatbot CSS and JS
        const htmlFiles = [
            'index.html',
            'article.html',
            'commands.html',
            'troubleshooting.html',
            'search.html',
            'dashboard.html',
            'user-dashboard.html',
            'login.html',
            'register.html'
        ];

        for (const file of htmlFiles) {
            const filePath = path.join(__dirname, '..', file);
            const content = fs.readFileSync(filePath, 'utf8');
            const hasCss = content.includes('css/chatbot.css');
            const hasJs = content.includes('js/chatbot.js');
            assert(
                hasCss && hasJs,
                `${file} properly links chatbot.css and chatbot.js`
            );
        }

    } catch (err) {
        console.error('Integration test error:', err);
        failed++;
    }

    console.log(`\n🏁 Frontend Integration Test Run Finished: ${passed} passed, ${failed} failed.\n`);
    if (failed > 0) process.exit(1);
}

if (require.main === module) {
    const { server } = require('../server');
    setTimeout(async () => {
        try {
            await runFrontendTests();
        } catch (err) {
            console.error(err);
            process.exit(1);
        } finally {
            server.close();
        }
    }, 500);
}

module.exports = runFrontendTests;
