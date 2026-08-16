// ============================================================
// GitGuide – Troubleshooting Page JavaScript (Full-Stack Integrated)
// ============================================================
// Analyzes pasted terminal errors by querying the backend analyzer engine
// with keyword relevance matching and direct solution resolution.
// ============================================================

// ---- INITIALIZE TROUBLESHOOTING PAGE ----

document.addEventListener('DOMContentLoaded', function () {
    var analyzeBtn = document.getElementById('analyzeBtn');

    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeError);
    }

    var errorInput = document.getElementById('errorInput');
    if (errorInput) {
        errorInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                analyzeError();
            }
        });
    }
});

// ---- ANALYZE ERROR ----

async function analyzeError() {
    var errorInput = document.getElementById('errorInput');
    var resultsArea = document.getElementById('resultsArea');

    if (!errorInput || !resultsArea) return;

    var errorText = errorInput.value.trim();

    if (!errorText) {
        showToast('Please paste an error message first.', 'error');
        return;
    }

    // Show analyzer loading spinner
    resultsArea.innerHTML = '<div style="text-align:center; padding: 2rem; color:var(--text-muted);"><span style="display:inline-block; animation: pulse 1s infinite;">🔍 Analyzing terminal log patterns...</span></div>';

    var matchedPatterns = [];

    if (typeof API !== 'undefined' && API.troubleshooting) {
        var res = await API.troubleshooting.analyze(errorText);
        if (res.success && res.matched && Array.isArray(res.data)) {
            matchedPatterns = res.data;
        }
    }

    // Fallback if offline
    if (matchedPatterns.length === 0 && typeof errorPatterns !== 'undefined') {
        var normalizedInput = errorText.toLowerCase();
        errorPatterns.forEach(function (pattern) {
            var isMatch = pattern.keywords.some(function (keyword) {
                return normalizedInput.includes(keyword.toLowerCase());
            });
            if (isMatch) {
                matchedPatterns.push(pattern);
            }
        });
    }

    if (matchedPatterns.length > 0) {
        renderMatchedResults(matchedPatterns);
        showToast(`Found ${matchedPatterns.length} matching solution${matchedPatterns.length > 1 ? 's' : ''}!`, 'success');
    } else {
        renderNoMatch();
    }
}

// ---- RENDER MATCHED RESULTS ----

function renderMatchedResults(patterns) {
    var resultsArea = document.getElementById('resultsArea');
    var html = '';

    patterns.forEach(function (pattern) {
        html += '<div class="result-card faq-item open" style="padding: 0; border: none; margin-bottom: 2rem; background: var(--surface); border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--border);">';
        
        // Accordion Header
        html += '  <button class="faq-question" style="background: rgba(0,255,255,0.05); border-bottom: 1px solid var(--primary); padding: 1.5rem; width: 100%;" onclick="this.parentElement.classList.toggle(\'open\')">';
        html += '    <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem;">';
        html += '      <span class="eyebrow" style="color:var(--primary); font-size: 0.75rem;">Analysis Result Found</span>';
        html += '      <span style="font-size: 1.25rem; font-weight: 600; color: var(--text);">' + pattern.title + '</span>';
        html += '    </div>';
        html += '    <span class="faq-icon" style="color: var(--primary);">▼</span>';
        html += '  </button>';
        
        // Accordion Body
        html += '  <div class="faq-answer">';
        html += '    <div class="faq-answer-inner" style="padding: 2rem;">';
        html += '      <p class="eyebrow" style="margin-top:0; color:var(--text-muted); font-size:0.8rem;">Recommended Solution</p>';
        html += '      <p style="color:var(--text); line-height: 1.6; font-size: 1rem; margin-bottom: 0;">' + pattern.solution + '</p>';

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

function renderNoMatch() {
    var resultsArea = document.getElementById('resultsArea');

    var html = '';
    html += '<div class="result-card no-match" style="background:var(--surface); border:1px solid rgba(255,100,100,0.3); border-radius:var(--radius-lg); padding:2rem; text-align:center;">';
    html += '  <div style="font-size:3rem; margin-bottom:1rem;">🤔</div>';
    html += '  <h3 style="margin-bottom:1rem;">No matching solution found</h3>';
    html += '  <p style="color:var(--text-muted); margin-bottom:2rem;">We couldn\'t find an exact matching error pattern. Try the following:</p>';
    html += '  <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:1rem; align-items:center;">';
    html += '    <li style="color:var(--text-light); background:var(--background); padding:1rem; border-radius:var(--radius); border:1px solid var(--border); width:100%; max-width:400px;">Make sure you pasted the complete error message</li>';
    html += '    <li style="color:var(--text-light); background:var(--background); padding:1rem; border-radius:var(--radius); border:1px solid var(--border); width:100%; max-width:400px;">Search for the error on our <a href="search.html" style="color:var(--primary); text-decoration:none;">search page</a></li>';
    html += '    <li style="color:var(--text-light); background:var(--background); padding:1rem; border-radius:var(--radius); border:1px solid var(--border); width:100%; max-width:400px;">Check the <a href="search.html?category=Troubleshooting" style="color:var(--primary); text-decoration:none;">Troubleshooting category</a></li>';
    html += '  </ul>';
    html += '</div>';

    resultsArea.innerHTML = html;
}
