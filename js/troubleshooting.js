// ============================================================
// GitGuide – Troubleshooting Page JavaScript (Groq AI Integrated)
// ============================================================
// Analyzes pasted terminal errors with Groq AI diagnostic engine,
// generating root-cause analysis, immediate quick fixes, step-by-step
// bash instructions, and linking related knowledge base guides.
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    var user = null;
    if (typeof API !== 'undefined' && API.getCurrentUser) {
        user = API.getCurrentUser();
    } else if (typeof getCurrentUser === 'function') {
        user = getCurrentUser();
    }

    var analyzeBtn = document.getElementById('analyzeBtn');
    var errorInput = document.getElementById('errorInput');
    var clearInputBtn = document.getElementById('clearInputBtn');

    if (!user) {
        if (errorInput) {
            errorInput.disabled = true;
            errorInput.placeholder = "Please login to use the Error Log Analyzer.";
            errorInput.style.opacity = "0.5";
        }
        if (analyzeBtn) {
            analyzeBtn.disabled = true;
            analyzeBtn.innerHTML = "Login to Analyze";
            analyzeBtn.style.opacity = "1";
            analyzeBtn.onclick = function() { window.location.href = 'login.html'; };
        }
        var resultsArea = document.getElementById('resultsArea');
        if (resultsArea) {
            resultsArea.innerHTML = '<div style="background:var(--surface); border:1px solid var(--border); padding:2.5rem; border-radius:var(--radius-lg); text-align:center;"><div style="font-size:2.5rem; margin-bottom:1rem;">🔒</div><h3 style="color:var(--text); margin-bottom:1rem;">Authentication Required</h3><p style="color:var(--text-muted); margin-bottom:1.5rem;">You must be logged in to use the Groq AI Diagnostic Engine.</p><a href="login.html" class="btn btn-primary" style="display:inline-flex; padding:0.75rem 1.5rem;">Login to Continue</a></div>';
        }
        return; // Skip attaching active event listeners
    }

    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeError);
    }

    if (errorInput) {
        errorInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                analyzeError();
            }
        });
    }

    if (clearInputBtn && errorInput) {
        clearInputBtn.addEventListener('click', function () {
            errorInput.value = '';
            var resultsArea = document.getElementById('resultsArea');
            if (resultsArea) resultsArea.innerHTML = '';
            errorInput.focus();
        });
    }

    // Sample error pills
    var pills = document.querySelectorAll('.sample-error-pill');
    pills.forEach(function (pill) {
        pill.addEventListener('click', function () {
            var sampleText = this.getAttribute('data-error');
            if (errorInput && sampleText) {
                errorInput.value = sampleText;
                errorInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                analyzeError();
            }
        });
    });
});

// ---- ANALYZE ERROR ----

var loadingInterval = null;

async function analyzeError() {
    var errorInput = document.getElementById('errorInput');
    var resultsArea = document.getElementById('resultsArea');
    var analyzeBtn = document.getElementById('analyzeBtn');

    if (!errorInput || !resultsArea) return;

    var errorText = errorInput.value.trim();

    if (!errorText) {
        if (typeof showToast === 'function') {
            showToast('Please paste a Git error message first.', 'error');
        } else {
            alert('Please paste a Git error message first.');
        }
        errorInput.focus();
        return;
    }

    // Disable button & show animated AI analyzer loading card
    if (analyzeBtn) {
        analyzeBtn.disabled = true;
        analyzeBtn.style.opacity = '0.7';
    }

    renderLoadingState(resultsArea);

    try {
        var response = null;

        if (typeof API !== 'undefined' && API.troubleshooting && API.troubleshooting.analyze) {
            response = await API.troubleshooting.analyze(errorText);
        } else {
            // Direct fetch fallback
            var res = await fetch('/api/troubleshooting/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ errorText: errorText })
            });
            response = await res.json();
        }

        clearInterval(loadingInterval);

        if (response && response.success && response.matched && response.analysis) {
            renderAiAnalysis(response, errorText);
            if (typeof showToast === 'function') {
                showToast('Groq AI Diagnosis ready!', 'success');
            }
        } else if (response && response.data && response.data.length > 0) {
            // Fallback match array
            renderLegacyMatches(response.data);
        } else {
            renderNoMatch(errorText);
        }

    } catch (err) {
        clearInterval(loadingInterval);
        console.error('[Troubleshooting] Analysis error:', err);
        renderErrorFallback(err.message);
    } finally {
        if (analyzeBtn) {
            analyzeBtn.disabled = false;
            analyzeBtn.style.opacity = '1';
        }
    }
}

// ---- LOADING STATE ----

function renderLoadingState(container) {
    var loadingSteps = [
        '⚡ Connecting to Groq AI Diagnostic Engine...',
        '🔍 Parsing terminal log patterns & stack trace...',
        '🧠 Formulating root cause & step-by-step resolution...',
        '✨ Finalizing verified fix with Git commands...'
    ];
    var stepIndex = 0;

    container.innerHTML = `
        <div class="ai-loading-card" style="background:var(--surface); border:1px solid rgba(0,240,255,0.3); border-radius:var(--radius-lg); padding:3rem 2rem; text-align:center; box-shadow:0 0 30px rgba(0,240,255,0.1);">
            <div style="position:relative; width:64px; height:64px; margin:0 auto 1.5rem;">
                <div style="position:absolute; inset:0; border-radius:50%; border:3px solid rgba(0,240,255,0.15); border-top-color:var(--primary); animation: spin 1s linear infinite;"></div>
                <div style="position:absolute; inset:8px; border-radius:50%; background:rgba(0,240,255,0.1); display:flex; align-items:center; justify-content:center; font-size:1.5rem;">
                    ⚡
                </div>
            </div>
            <h3 style="font-size:1.25rem; margin-bottom:0.5rem; color:var(--text);">Analyzing Git Error with Groq AI</h3>
            <p id="aiLoadingStepText" style="color:var(--primary); font-family:monospace; font-size:0.95rem; min-height:1.5rem;">
                ${loadingSteps[0]}
            </p>
            <div style="width:200px; height:4px; background:rgba(255,255,255,0.1); border-radius:999px; margin:1.5rem auto 0; overflow:hidden;">
                <div style="height:100%; width:50%; background:var(--primary); border-radius:999px; animation: progressIndeterminate 1.5s ease-in-out infinite;"></div>
            </div>
        </div>
    `;

    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    loadingInterval = setInterval(function () {
        stepIndex = (stepIndex + 1) % loadingSteps.length;
        var textEl = document.getElementById('aiLoadingStepText');
        if (textEl) {
            textEl.textContent = loadingSteps[stepIndex];
        }
    }, 1200);
}

// ---- RENDER AI ANALYSIS ----

function renderAiAnalysis(response, rawErrorText) {
    var resultsArea = document.getElementById('resultsArea');
    var analysis = response.analysis;
    var matchedArticles = response.matchedArticles || [];
    var sourceLabel = response.source === 'groq-ai' ? 'Groq AI Diagnostic' : 'GitGuide Diagnostic';

    var html = '';

    html += '<div class="ai-analysis-container" style="background:var(--surface); border:1px solid rgba(0,240,255,0.3); border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-md); margin-bottom:2.5rem; animation: fadeUp 0.5s ease;">';

    // 1. Header Banner
    html += '  <div style="background:linear-gradient(135deg, rgba(0,240,255,0.12) 0%, rgba(37,99,235,0.08) 100%); border-bottom:1px solid rgba(0,240,255,0.2); padding:1.5rem 2rem; display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1rem;">';
    html += '    <div style="display:flex; align-items:center; gap:0.75rem;">';
    html += '      <div style="width:36px; height:36px; border-radius:8px; background:rgba(0,240,255,0.15); display:flex; align-items:center; justify-content:center; font-size:1.2rem; border:1px solid rgba(0,240,255,0.3);">';
    html += '        ⚡';
    html += '      </div>';
    html += '      <div>';
    html += '        <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--primary);">' + escapeHtml(sourceLabel) + '</div>';
    html += '        <h2 style="font-size:1.4rem; font-weight:700; color:var(--text); margin:0.2rem 0 0 0;">' + escapeHtml(analysis.title) + '</h2>';
    html += '      </div>';
    html += '    </div>';
    if (analysis.category) {
        html += '    <span style="background:rgba(0,240,255,0.15); color:var(--primary); border:1px solid rgba(0,240,255,0.3); padding:0.35rem 0.85rem; border-radius:999px; font-size:0.8rem; font-weight:600;">' + escapeHtml(analysis.category) + '</span>';
    }
    html += '  </div>';

    // 2. Card Body
    html += '  <div style="padding:2rem;">';

    // Root Cause Box
    if (analysis.rootCause) {
        html += '    <div style="background:rgba(239,68,68,0.08); border-left:4px solid var(--danger); border-radius:0 var(--radius) var(--radius) 0; padding:1.25rem 1.5rem; margin-bottom:1.75rem;">';
        html += '      <div style="display:flex; align-items:center; gap:0.5rem; color:var(--danger); font-size:0.85rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.4rem;">';
        html += '        <span>🔍</span> Root Cause & Diagnosis';
        html += '      </div>';
        html += '      <p style="color:var(--text); font-size:0.95rem; line-height:1.6; margin:0;">' + escapeHtml(analysis.rootCause) + '</p>';
        html += '    </div>';
    }

    // Quick Fix Command Bar (if single immediate command exists)
    if (analysis.quickFix && analysis.quickFix.trim()) {
        var quickFixId = 'quick-fix-' + Date.now();
        html += '    <div style="background:rgba(0,240,255,0.06); border:1px solid rgba(0,240,255,0.3); border-radius:var(--radius); padding:1.25rem 1.5rem; margin-bottom:1.75rem;">';
        html += '      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">';
        html += '        <span style="font-size:0.8rem; font-weight:700; text-transform:uppercase; color:var(--primary); letter-spacing:0.05em;">⚡ Quick Fix Command</span>';
        html += '        <button type="button" class="troubleshoot-copy-btn" data-copy-target="' + quickFixId + '" style="background:var(--primary); color:#000; border:none; padding:0.3rem 0.75rem; border-radius:4px; font-size:0.75rem; font-weight:600; cursor:pointer; transition:opacity 0.2s;">Copy</button>';
        html += '      </div>';
        html += '      <div id="' + quickFixId + '" style="font-family:\'Fira Code\', Consolas, monospace; font-size:0.95rem; color:var(--code-text); background:var(--code-bg); padding:0.75rem 1rem; border-radius:6px; border:1px solid rgba(255,255,255,0.1); word-break:break-all;">' + escapeHtml(analysis.quickFix) + '</div>';
        html += '    </div>';
    }

    // Detailed Step-by-Step Resolution
    html += '    <div style="margin-bottom:2rem;">';
    html += '      <h3 style="font-size:1.15rem; font-weight:700; color:var(--text); margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">';
    html += '        <span>🛠️</span> Recommended Resolution Steps';
    html += '      </h3>';
    html += '      <div class="ai-solution-markdown" style="line-height:1.7; font-size:0.95rem; color:var(--text);">';
    html += renderTroubleshootMarkdown(analysis.solution);
    html += '      </div>';
    html += '    </div>';

    // Prevention Tip Box
    if (analysis.preventionTip) {
        html += '    <div style="background:rgba(16,185,129,0.08); border-left:4px solid var(--success); border-radius:0 var(--radius) var(--radius) 0; padding:1.25rem 1.5rem; margin-bottom:2rem;">';
        html += '      <div style="display:flex; align-items:center; gap:0.5rem; color:var(--success); font-size:0.85rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.4rem;">';
        html += '        <span>💡</span> Prevention & Pro Tip';
        html += '      </div>';
        html += '      <p style="color:var(--text); font-size:0.95rem; line-height:1.6; margin:0;">' + escapeHtml(analysis.preventionTip) + '</p>';
        html += '    </div>';
    }

    // Related Knowledge Base Articles
    if (matchedArticles.length > 0) {
        html += '    <div style="margin-top:2rem; padding-top:1.5rem; border-top:1px solid var(--border);">';
        html += '      <div style="font-size:0.85rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); letter-spacing:0.05em; margin-bottom:1rem;">';
        html += '        📚 Related Knowledge Base Guides';
        html += '      </div>';
        html += '      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1rem;">';
        matchedArticles.forEach(function (art) {
            html += '        <a href="article.html?id=' + art.id + '" style="display:block; padding:1rem 1.25rem; background:var(--background); border:1px solid var(--border); border-radius:var(--radius); text-decoration:none; transition:all 0.2s;" onmouseover="this.style.borderColor=\'var(--primary)\'; this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.borderColor=\'var(--border)\'; this.style.transform=\'none\'">';
            html += '          <div style="font-size:0.75rem; color:var(--primary); font-weight:600; margin-bottom:0.25rem;">' + escapeHtml(art.category || 'Guide') + '</div>';
            html += '          <div style="font-weight:600; color:var(--text); font-size:0.95rem; margin-bottom:0.35rem;">' + escapeHtml(art.title) + '</div>';
            if (art.readingTime) {
                html += '          <div style="font-size:0.75rem; color:var(--text-muted);">⏱️ ' + escapeHtml(art.readingTime) + '</div>';
            }
            html += '        </a>';
        });
        html += '      </div>';
        html += '    </div>';
    }

    // Interactive Action Footer
    html += '    <div style="margin-top:2.5rem; padding-top:1.5rem; border-top:1px solid var(--border); display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1rem;">';
    html += '      <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">';
    html += '        <button type="button" id="copyFullSolutionBtn" class="btn btn-secondary" style="padding:0.6rem 1.2rem; font-size:0.85rem;">';
    html += '          📋 Copy Full Solution';
    html += '        </button>';
    html += '        <button type="button" id="askEdiBtn" class="btn btn-primary" style="padding:0.6rem 1.2rem; font-size:0.85rem;">';
    html += '          💬 Ask Edi in Chat';
    html += '        </button>';
    html += '      </div>';
    html += '      <button type="button" id="analyzeAnotherBtn" style="background:transparent; border:none; color:var(--text-muted); font-size:0.85rem; cursor:pointer; text-decoration:underline;" onclick="document.getElementById(\'errorInput\').value=\'\'; document.getElementById(\'resultsArea\').innerHTML=\'\'; document.getElementById(\'errorInput\').focus();">';
    html += '        Analyze Another Error →';
    html += '      </button>';
    html += '    </div>';

    html += '  </div>'; // End Card Body
    html += '</div>'; // End Container

    resultsArea.innerHTML = html;
    resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Bind Copy Full Solution button
    var copyFullBtn = document.getElementById('copyFullSolutionBtn');
    if (copyFullBtn) {
        copyFullBtn.addEventListener('click', function () {
            var fullText = '=== ' + analysis.title + ' ===\n\n' +
                'Root Cause:\n' + analysis.rootCause + '\n\n' +
                (analysis.quickFix ? 'Quick Fix:\n' + analysis.quickFix + '\n\n' : '') +
                'Solution:\n' + analysis.solution + '\n\n' +
                'Prevention:\n' + analysis.preventionTip;

            navigator.clipboard.writeText(fullText).then(function () {
                var oldText = copyFullBtn.textContent;
                copyFullBtn.textContent = '✅ Copied to Clipboard!';
                setTimeout(function () { copyFullBtn.textContent = oldText; }, 2000);
            });
        });
    }

    // Bind Ask Edi in Chat button
    var askEdiBtn = document.getElementById('askEdiBtn');
    if (askEdiBtn) {
        askEdiBtn.addEventListener('click', function () {
            var chatBtn = document.getElementById('gitChatBtn');
            var chatInput = document.getElementById('gitChatInput');
            var chatForm = document.getElementById('gitChatForm');

            if (chatBtn) {
                // Open widget if closed
                var chatWindow = document.getElementById('gitChatWindow');
                if (chatWindow && !chatWindow.classList.contains('is-open')) {
                    chatBtn.click();
                }
                if (chatInput) {
                    chatInput.value = 'Can you help me solve this Git error: ' + (analysis.title || rawErrorText.substring(0, 100));
                    chatInput.focus();
                }
            }
        });
    }
}

// ---- RENDER LEGACY / FALLBACK MATCHES ----

function renderLegacyMatches(patterns) {
    var resultsArea = document.getElementById('resultsArea');
    var html = '';

    patterns.forEach(function (pattern) {
        html += '<div class="result-card faq-item open" style="padding: 0; border: none; margin-bottom: 2rem; background: var(--surface); border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border);">';
        html += '  <button class="faq-question" style="background: rgba(0,255,255,0.05); border-bottom: 1px solid var(--primary); padding: 1.5rem; width: 100%; text-align:left; display:flex; justify-content:space-between; align-items:center;" onclick="this.parentElement.classList.toggle(\'open\')">';
        html += '    <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem;">';
        html += '      <span class="eyebrow" style="color:var(--primary); font-size: 0.75rem;">Known Error Pattern</span>';
        html += '      <span style="font-size: 1.25rem; font-weight: 600; color: var(--text);">' + escapeHtml(pattern.title) + '</span>';
        html += '    </div>';
        html += '    <span class="faq-icon" style="color: var(--primary);">▼</span>';
        html += '  </button>';
        html += '  <div class="faq-answer">';
        html += '    <div class="faq-answer-inner" style="padding: 2rem;">';
        html += '      <p class="eyebrow" style="margin-top:0; color:var(--text-muted); font-size:0.8rem;">Recommended Solution</p>';
        html += '      <div class="ai-solution-markdown" style="color:var(--text); line-height: 1.6; font-size: 1rem; margin-bottom: 0;">' + renderTroubleshootMarkdown(pattern.solution) + '</div>';

        if (pattern.articleId) {
            html += '      <div style="margin-top: 2rem;">';
            html += '        <a href="article.html?id=' + pattern.articleId + '" class="btn btn-primary" style="padding: 0.75rem 1.5rem;">';
            html += '          Read Full Guide <span class="arrow">→</span>';
            html += '        </a>';
            html += '      </div>';
        }

        html += '    </div>';
        html += '  </div>';
        html += '</div>';
    });

    resultsArea.innerHTML = html;
}

// ---- RENDER NO MATCH ----

function renderNoMatch(errorText) {
    var resultsArea = document.getElementById('resultsArea');
    var html = `
        <div class="result-card no-match" style="background:var(--surface); border:1px solid rgba(239,68,68,0.3); border-radius:var(--radius-lg); padding:2.5rem; text-align:center;">
            <div style="font-size:3rem; margin-bottom:1rem;">🤔</div>
            <h3 style="margin-bottom:0.75rem; color:var(--text);">No matching error pattern found</h3>
            <p style="color:var(--text-muted); margin-bottom:2rem; max-width:500px; margin-left:auto; margin-right:auto;">
                We couldn't generate a specific solution for this exact log. Try the following alternatives:
            </p>
            <div style="display:flex; flex-direction:column; gap:0.75rem; max-width:420px; margin:0 auto 2rem;">
                <div style="background:var(--background); padding:0.85rem 1.25rem; border-radius:var(--radius); border:1px solid var(--border); text-align:left; font-size:0.9rem;">
                    1. Ensure you copied the <strong>full terminal message</strong> including any <code style="color:var(--primary);">fatal:</code> or <code style="color:var(--danger);">error:</code> lines.
                </div>
                <div style="background:var(--background); padding:0.85rem 1.25rem; border-radius:var(--radius); border:1px solid var(--border); text-align:left; font-size:0.9rem;">
                    2. Ask our floating AI Assistant <strong>Edi</strong> using the chat widget in the bottom-right corner.
                </div>
                <div style="background:var(--background); padding:0.85rem 1.25rem; border-radius:var(--radius); border:1px solid var(--border); text-align:left; font-size:0.9rem;">
                    3. Search our <a href="search.html" style="color:var(--primary); font-weight:600;">Knowledge Base Guides</a>.
                </div>
            </div>
            <button type="button" class="btn btn-primary" onclick="document.getElementById('gitChatBtn') && document.getElementById('gitChatBtn').click();" style="padding:0.75rem 1.5rem;">
                💬 Ask Edi AI Assistant
            </button>
        </div>
    `;
    resultsArea.innerHTML = html;
}

function renderErrorFallback(msg) {
    var resultsArea = document.getElementById('resultsArea');
    resultsArea.innerHTML = `
        <div style="background:var(--surface); border:1px solid var(--danger); border-radius:var(--radius-lg); padding:2rem; text-align:center;">
            <div style="font-size:2rem; margin-bottom:0.5rem;">⚠️</div>
            <h4 style="color:var(--danger); margin-bottom:0.5rem;">Unable to complete analysis</h4>
            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1rem;">${escapeHtml(msg || 'Server connection error.')}</p>
            <button class="btn btn-secondary" onclick="analyzeError()">Try Again</button>
        </div>
    `;
}

// ---- MARKDOWN RENDERER FOR TROUBLESHOOTING ----

function renderTroubleshootMarkdown(raw) {
    if (!raw) return '';
    var escaped = escapeHtml(raw);
    var codeBlocks = [];

    // Extract code blocks first
    var text = escaped.replace(/```(\w*)\n([\s\S]*?)```/g, function (match, lang, code) {
        var idx = codeBlocks.length;
        codeBlocks.push({ lang: lang || 'bash', code: code.replace(/\n$/, '') });
        return '\u0000CODEBLOCK' + idx + '\u0000';
    });

    // Headers
    text = text.replace(/^### (.*)$/gm, '<h4 style="font-size:1.05rem; font-weight:600; color:var(--text); margin:1.2rem 0 0.5rem;">$1</h4>');
    text = text.replace(/^## (.*)$/gm, '<h3 style="font-size:1.15rem; font-weight:700; color:var(--text); margin:1.4rem 0 0.6rem;">$1</h3>');

    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.08); color:var(--primary); padding:0.15rem 0.35rem; border-radius:4px; font-family:monospace; font-size:0.9em;">$1</code>');

    // Numbered lists (1. Item)
    text = text.replace(/(^|\n)((?:\d+\. .*(?:\n|$))+)/g, function (match, lead, block) {
        var items = block.trim().split('\n').map(function (l) {
            return '<li style="margin-bottom:0.5rem;">' + l.replace(/^\d+\. /, '') + '</li>';
        }).join('');
        return lead + '<ol style="padding-left:1.5rem; margin:0.75rem 0;">' + items + '</ol>';
    });

    // Bullet lists (- Item or * Item)
    text = text.replace(/(^|\n)((?:[-*] .*(?:\n|$))+)/g, function (match, lead, block) {
        var items = block.trim().split('\n').map(function (l) {
            return '<li style="margin-bottom:0.4rem;">' + l.replace(/^[-*] /, '') + '</li>';
        }).join('');
        return lead + '<ul style="padding-left:1.5rem; margin:0.75rem 0;">' + items + '</ul>';
    });

    // Paragraphs
    text = text.split(/\n{2,}/).map(function (block) {
        var trimmed = block.trim();
        if (!trimmed) return '';
        if (/^<h[34]|^<ul|^<ol|^\u0000CODEBLOCK/.test(trimmed)) return trimmed;
        return '<p style="margin-bottom:0.75rem;">' + trimmed.replace(/\n/g, '<br>') + '</p>';
    }).join('');

    // Re-insert code blocks with copy buttons
    text = text.replace(/\u0000CODEBLOCK(\d+)\u0000/g, function (match, idx) {
        var block = codeBlocks[Number(idx)];
        var blockId = 'ts-code-' + Date.now() + '-' + idx;
        return `
            <div class="git-code-block" style="background:var(--code-bg); border:1px solid rgba(255,255,255,0.1); border-radius:var(--radius); overflow:hidden; margin:1rem 0 1.25rem;">
                <div class="git-code-header" style="background:rgba(255,255,255,0.03); border-bottom:1px solid rgba(255,255,255,0.08); padding:0.4rem 0.85rem; display:flex; justify-content:space-between; align-items:center; font-family:monospace; font-size:0.75rem; color:var(--text-muted);">
                    <span>${escapeHtml(block.lang)}</span>
                    <button type="button" class="troubleshoot-copy-btn" data-copy-target="${blockId}" style="background:transparent; border:1px solid rgba(255,255,255,0.2); color:var(--text); padding:0.2rem 0.6rem; border-radius:4px; font-size:0.75rem; cursor:pointer; transition:all 0.2s;">Copy</button>
                </div>
                <div class="git-code-content" id="${blockId}" style="padding:1rem; font-family:'Fira Code', Consolas, monospace; font-size:0.9rem; color:var(--code-text); overflow-x:auto; line-height:1.5;">${block.code}</div>
            </div>
        `;
    });

    return text;
}

function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Global click handler for copy buttons in results
document.addEventListener('click', function (e) {
    var btn = e.target.closest('.troubleshoot-copy-btn');
    if (!btn) return;
    var targetId = btn.getAttribute('data-copy-target');
    var targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    var textToCopy = targetEl.textContent;
    navigator.clipboard.writeText(textToCopy).then(function () {
        var orig = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = 'var(--success)';
        btn.style.color = '#000';
        setTimeout(function () {
            btn.textContent = orig;
            btn.style.background = '';
            btn.style.color = '';
        }, 1800);
    });
});

