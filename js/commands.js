// ============================================================
// GitGuide – Command Synthesizer JavaScript (Groq AI Integrated)
// ============================================================
// Dual-mode Git command synthesis engine:
// 1. AI Natural Language Synthesizer (Groq AI powered)
// 2. Visual Flag Builder with AI Safety & Breakdown Audit
// ============================================================

var liveGitCommands = typeof gitCommands !== 'undefined' ? gitCommands : [];
var currentSynthesizedData = null;

// ---- INITIALIZE COMMANDS PAGE ----

document.addEventListener('DOMContentLoaded', async function () {
    initTabs();
    initAiSynthesizer();
    await populateCommandDropdown();
    initVisualBuilder();
});

// ---- TAB SWITCHING ----

function initTabs() {
    var tabAi = document.getElementById('tabAiMode');
    var tabVisual = document.getElementById('tabVisualMode');
    var panelAi = document.getElementById('aiSynthesizerPanel');
    var panelVisual = document.getElementById('visualBuilderPanel');
    var resultsArea = document.getElementById('synthesizerResults');

    if (tabAi && tabVisual && panelAi && panelVisual) {
        tabAi.addEventListener('click', function () {
            tabAi.classList.add('active');
            tabVisual.classList.remove('active');
            panelAi.style.display = 'block';
            panelVisual.style.display = 'none';
        });

        tabVisual.addEventListener('click', function () {
            tabVisual.classList.add('active');
            tabAi.classList.remove('active');
            panelVisual.style.display = 'block';
            panelAi.style.display = 'none';
        });
    }
}

// ---- AI NATURAL LANGUAGE SYNTHESIZER ----

function initAiSynthesizer() {
    var promptInput = document.getElementById('aiPromptInput');
    var synthesizeBtn = document.getElementById('synthesizeAiBtn');
    var clearBtn = document.getElementById('clearAiPromptBtn');
    var sampleChips = document.querySelectorAll('.sample-prompt-chip');

    if (clearBtn && promptInput) {
        clearBtn.addEventListener('click', function () {
            promptInput.value = '';
            promptInput.focus();
            var resultsArea = document.getElementById('synthesizerResults');
            if (resultsArea) resultsArea.innerHTML = '';
        });
    }

    if (sampleChips) {
        sampleChips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                var prompt = chip.getAttribute('data-prompt');
                if (promptInput && prompt) {
                    promptInput.value = prompt;
                    synthesizeWithAi(prompt);
                }
            });
        });
    }

    if (synthesizeBtn && promptInput) {
        synthesizeBtn.addEventListener('click', function () {
            synthesizeWithAi(promptInput.value);
        });

        promptInput.addEventListener('keydown', function (e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                synthesizeWithAi(promptInput.value);
            }
        });
    }
}

// ---- SYNTHESIZE WITH GROQ AI ----

async function synthesizeWithAi(promptText) {
    if (!promptText || !promptText.trim()) {
        showToast('Please describe what you want to achieve with Git.', 'error');
        var promptInput = document.getElementById('aiPromptInput');
        if (promptInput) promptInput.focus();
        return;
    }

    var resultsArea = document.getElementById('synthesizerResults');
    if (!resultsArea) return;

    var synthesizeBtn = document.getElementById('synthesizeAiBtn');
    if (synthesizeBtn) {
        synthesizeBtn.disabled = true;
        synthesizeBtn.innerHTML = '<span style="display:inline-block; animation:spin 1s linear infinite; margin-right:0.5rem;">⚡</span> Synthesizing with Groq AI...';
    }

    renderLoadingState(resultsArea, 'Synthesizing precision Git command with Groq AI...');

    try {
        var response;
        if (typeof API !== 'undefined' && API.commands && API.commands.aiSynthesize) {
            response = await API.commands.aiSynthesize(promptText.trim());
        } else {
            var fetchRes = await fetch('/api/commands/ai-synthesize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: promptText.trim() })
            });
            response = await fetchRes.json();
        }

        if (response && response.success && response.data) {
            currentSynthesizedData = response.data;
            renderSynthesizedResult(resultsArea, response.data, response.source || 'groq-ai');
            showToast('Git command synthesized successfully!', 'success');
        } else {
            resultsArea.innerHTML = '<div style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); padding:1.5rem; border-radius:var(--radius-lg); color:var(--text); text-align:center;">' +
                '<h4 style="color:var(--danger); margin-bottom:0.5rem;">Synthesis Error</h4>' +
                '<p>' + (response?.message || 'Unable to synthesize command. Please try again.') + '</p>' +
                '</div>';
        }
    } catch (err) {
        console.error('Synthesizer request error:', err);
        resultsArea.innerHTML = '<div style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); padding:1.5rem; border-radius:var(--radius-lg); color:var(--text); text-align:center;">' +
            '<h4 style="color:var(--danger); margin-bottom:0.5rem;">Connection Error</h4>' +
            '<p>Could not connect to the synthesizer engine. Please check your connection and try again.</p>' +
            '</div>';
    } finally {
        if (synthesizeBtn) {
            synthesizeBtn.disabled = false;
            synthesizeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:0.5rem;"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg> Synthesize with Groq AI';
        }
    }
}

// ---- AI AUDIT VISUAL COMMAND ----

async function auditVisualCommand() {
    var commandTextEl = document.getElementById('commandText');
    var command = commandTextEl ? commandTextEl.textContent.trim() : '';

    if (!command || command === 'Select a command to begin...') {
        showToast('Please select or configure a command first.', 'error');
        return;
    }

    var resultsArea = document.getElementById('synthesizerResults');
    if (!resultsArea) return;

    var auditBtn = document.getElementById('aiAuditBtn');
    if (auditBtn) {
        auditBtn.disabled = true;
        auditBtn.innerHTML = '<span style="display:inline-block; animation:spin 1s linear infinite; margin-right:0.5rem;">⚡</span> Auditing command with Groq AI...';
    }

    renderLoadingState(resultsArea, 'Auditing command flags and safety risks with Groq AI...');

    try {
        var response;
        if (typeof API !== 'undefined' && API.commands && API.commands.aiExplain) {
            response = await API.commands.aiExplain(command);
        } else {
            var fetchRes = await fetch('/api/commands/ai-explain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: command })
            });
            response = await fetchRes.json();
        }

        if (response && response.success && response.data) {
            currentSynthesizedData = response.data;
            renderSynthesizedResult(resultsArea, response.data, response.source || 'groq-ai');
            showToast('Command audit complete!', 'success');
        } else {
            resultsArea.innerHTML = '<div style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); padding:1.5rem; border-radius:var(--radius-lg); color:var(--text); text-align:center;">' +
                '<h4 style="color:var(--danger); margin-bottom:0.5rem;">Audit Error</h4>' +
                '<p>' + (response?.message || 'Unable to audit command. Please try again.') + '</p>' +
                '</div>';
        }
    } catch (err) {
        console.error('Audit error:', err);
        resultsArea.innerHTML = '<div style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); padding:1.5rem; border-radius:var(--radius-lg); color:var(--text); text-align:center;">' +
            '<h4 style="color:var(--danger); margin-bottom:0.5rem;">Connection Error</h4>' +
            '<p>Could not connect to the audit engine. Please try again.</p>' +
            '</div>';
    } finally {
        if (auditBtn) {
            auditBtn.disabled = false;
            auditBtn.innerHTML = '<span>⚡</span> AI Explain & Safety Audit';
        }
    }
}

// ---- RENDER LOADING STATE ----

function renderLoadingState(container, message) {
    var loadingSteps = [
        '⚡ Connecting to Groq AI Synthesizer Engine...',
        '🧠 Analyzing Git CLI syntax, options, and parameters...',
        '🛡️ Performing risk classification & safety audit...',
        '⏪ Generating undo blueprints & best practices...'
    ];

    container.innerHTML = '<div style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:3rem 2rem; text-align:center; box-shadow:var(--shadow); animation:fadeUp 0.3s ease;">' +
        '<div style="width:64px; height:64px; margin:0 auto 1.5rem; position:relative; display:flex; align-items:center; justify-content:center;">' +
            '<div style="position:absolute; inset:0; border-radius:50%; border:3px solid rgba(0,240,255,0.15); border-top-color:var(--primary); animation:spin 1s linear infinite;"></div>' +
            '<span style="font-size:1.8rem;">⚡</span>' +
        '</div>' +
        '<h3 style="font-size:1.25rem; margin-bottom:0.5rem; color:var(--text);">' + escapeHtml(message) + '</h3>' +
        '<p id="synthesizerStatusStep" style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.5rem; min-height:1.4rem;">' + loadingSteps[0] + '</p>' +
        '<div style="max-width:320px; height:4px; background:rgba(255,255,255,0.08); border-radius:999px; margin:0 auto; overflow:hidden; position:relative;">' +
            '<div style="position:absolute; height:100%; width:40%; background:var(--primary); border-radius:999px; animation:progressIndeterminate 1.5s infinite ease-in-out;"></div>' +
        '</div>' +
    '</div>';

    var stepIdx = 0;
    var stepTimer = setInterval(function () {
        stepIdx = (stepIdx + 1) % loadingSteps.length;
        var el = document.getElementById('synthesizerStatusStep');
        if (el) {
            el.textContent = loadingSteps[stepIdx];
        } else {
            clearInterval(stepTimer);
        }
    }, 1200);

    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---- RENDER SYNTHESIZED RESULT ----

function renderSynthesizedResult(container, data, source) {
    var isGroq = source === 'groq-ai';
    var sourceLabel = isGroq ? 'Groq AI • openai/gpt-oss-120b' : 'GitGuide Rule Engine';
    var dangerLevel = (data.dangerLevel || (data.isDangerous ? 'danger' : 'safe')).toLowerCase();
    
    var dangerBadgeHtml = '';
    var dangerAlertHtml = '';

    if (dangerLevel === 'danger' || data.isDangerous) {
        dangerBadgeHtml = '<span class="danger-badge danger">🚨 Destructive / High Risk</span>';
        dangerAlertHtml = '<div class="synthesizer-danger-alert danger">' +
            '<span style="font-size:1.5rem; line-height:1;">⚠️</span>' +
            '<div>' +
                '<strong style="display:block; margin-bottom:0.25rem; color:var(--danger);">Destructive Operation Warning</strong>' +
                '<p style="margin:0; font-size:0.9rem; line-height:1.5; color:var(--text);">' + 
                    escapeHtml(data.warningMessage || 'This command modifies repository history or removes uncommitted changes permanently.') + 
                '</p>' +
            '</div>' +
        '</div>';
    } else if (dangerLevel === 'caution') {
        dangerBadgeHtml = '<span class="danger-badge caution">⚠️ Caution Required</span>';
        dangerAlertHtml = '<div class="synthesizer-danger-alert caution">' +
            '<span style="font-size:1.5rem; line-height:1;">⚡</span>' +
            '<div>' +
                '<strong style="display:block; margin-bottom:0.25rem; color:var(--warning);">Cautionary Operation</strong>' +
                '<p style="margin:0; font-size:0.9rem; line-height:1.5; color:var(--text);">' + 
                    escapeHtml(data.warningMessage || 'This command rewrites local history or updates tracked branch references.') + 
                '</p>' +
            '</div>' +
        '</div>';
    } else {
        dangerBadgeHtml = '<span class="danger-badge safe">✅ Safe Operation</span>';
        dangerAlertHtml = '<div class="synthesizer-danger-alert safe">' +
            '<span style="font-size:1.3rem; line-height:1;">🛡️</span>' +
            '<div>' +
                '<strong style="display:block; margin-bottom:0.25rem; color:var(--success);">Non-Destructive Execution</strong>' +
                '<p style="margin:0; font-size:0.9rem; line-height:1.5; color:var(--text);">' +
                    escapeHtml(data.explanation || 'This command safely performs the requested operation without risk of unrecoverable data loss.') +
                '</p>' +
            '</div>' +
        '</div>';
    }

    // Breakdown pills / table
    var breakdownHtml = '';
    if (Array.isArray(data.breakdown) && data.breakdown.length > 0) {
        breakdownHtml = '<div class="syntax-breakdown-section">' +
            '<div class="syntax-breakdown-title">' +
                '<span>🧩</span> Syntax & Flag Breakdown' +
            '</div>' +
            '<div class="breakdown-grid">';
        
        data.breakdown.forEach(function (item) {
            breakdownHtml += '<div class="breakdown-item">' +
                '<div class="breakdown-item-code">' + escapeHtml(item.part || '') + '</div>' +
                '<div class="breakdown-item-desc">' + escapeHtml(item.meaning || '') + '</div>' +
            '</div>';
        });

        breakdownHtml += '</div></div>';
    }

    // Undo Box and Pro-Tip Box
    var metaHtml = '<div class="synthesizer-meta-section">';
    
    // Undo Box
    if (data.undoCommand) {
        metaHtml += '<div class="undo-box">' +
            '<div class="undo-box-title"><span>⏪</span> How to Undo / Revert:</div>' +
            '<div class="undo-code-box">' +
                '<span>' + escapeHtml(data.undoCommand) + '</span>' +
                '<button type="button" class="btn-copy-undo" data-undo="' + escapeHtml(data.undoCommand) + '" style="background:transparent; border:none; color:var(--primary); cursor:pointer; font-size:0.75rem; padding:0.2rem 0.5rem;" title="Copy undo command">Copy</button>' +
            '</div>' +
        '</div>';
    } else {
        metaHtml += '<div class="undo-box">' +
            '<div class="undo-box-title"><span>ℹ️</span> Reversibility:</div>' +
            '<p style="font-size:0.85rem; color:var(--text-muted); margin:0;">' +
                (data.isDangerous ? 'This action is irreversible once executed. Ensure changes are committed or stashed.' : 'Standard non-destructive command or normal forward workflow.') +
            '</p>' +
        '</div>';
    }

    // Pro-Tip Box
    metaHtml += '<div class="pro-tip-box">' +
        '<div class="pro-tip-title"><span>💡</span> Pro-Tip & Best Practice:</div>' +
        '<p class="pro-tip-text">' + escapeHtml(data.bestPractice || 'Verify branch state with git status before and after execution.') + '</p>' +
    '</div>';

    metaHtml += '</div>';

    // Related Articles
    var articlesHtml = '';
    if (Array.isArray(data.matchedArticles) && data.matchedArticles.length > 0) {
        articlesHtml = '<div class="synthesizer-related-articles">' +
            '<div class="synthesizer-related-title">📖 Recommended GitGuide Articles</div>' +
            '<div class="synthesizer-related-grid">';
        
        data.matchedArticles.forEach(function (art) {
            articlesHtml += '<a href="article.html?id=' + art.id + '" class="synthesizer-article-pill">' +
                '<div style="font-weight:600; font-size:0.9rem; margin-bottom:0.25rem; color:var(--text);">' + escapeHtml(art.title) + '</div>' +
                '<div style="font-size:0.78rem; color:var(--text-muted); display:flex; gap:0.5rem;">' +
                    '<span>' + escapeHtml(art.category || 'Guide') + '</span> • <span>' + escapeHtml(art.readingTime || '5 min') + '</span>' +
                '</div>' +
            '</a>';
        });

        articlesHtml += '</div></div>';
    }

    var html = '<div class="synthesizer-result-card">' +
        '<div class="synthesizer-result-header">' +
            '<div class="synthesizer-badge-group">' +
                '<span class="ai-engine-tag">⚡ ' + escapeHtml(sourceLabel) + '</span>' +
                (data.category ? '<span class="category-tag">' + escapeHtml(data.category) + '</span>' : '') +
            '</div>' +
            dangerBadgeHtml +
        '</div>' +

        '<div class="synthesizer-command-hero">' +
            '<button class="copy-btn-overlay" id="copyResultCommandBtn" aria-label="Copy code" style="position:absolute; right:1.25rem; top:1.25rem; background:var(--surface); border:1px solid var(--border); border-radius:6px; padding:0.6rem 0.85rem; color:var(--text); cursor:pointer; display:flex; align-items:center; gap:0.4rem; font-size:0.85rem; font-weight:600; transition:all 0.2s;">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                    '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>' +
                    '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>' +
                '</svg>' +
                '<span>Copy Command</span>' +
            '</button>' +
            '<div class="synthesizer-command-text">' +
                '<span class="prompt-symbol">$</span>' +
                '<span id="finalCommandStr">' + escapeHtml(data.command || '') + '</span>' +
            '</div>' +
            '<div style="margin-top:0.75rem; font-size:0.9rem; color:var(--text-muted); line-height:1.5;">' +
                escapeHtml(data.explanation || '') +
            '</div>' +
        '</div>' +

        dangerAlertHtml +
        breakdownHtml +
        metaHtml +
        articlesHtml +
    '</div>';

    container.innerHTML = html;

    // Attach copy event handlers
    var copyBtn = document.getElementById('copyResultCommandBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function () {
            var cmdStr = data.command || '';
            copyToClipboard(cmdStr, copyBtn);
        });
    }

    var undoCopyBtns = container.querySelectorAll('.btn-copy-undo');
    undoCopyBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var undoStr = btn.getAttribute('data-undo');
            if (undoStr) {
                copyToClipboard(undoStr, btn);
            }
        });
    });

    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---- POPULATE COMMAND DROPDOWN (VISUAL BUILDER) ----

async function populateCommandDropdown() {
    var select = document.getElementById('commandSelect');
    if (!select) return;

    if (typeof API !== 'undefined' && API.commands) {
        var res = await API.commands.getAll();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            liveGitCommands = res.data;
        }
    }

    select.innerHTML = '<option value="">Choose a Git command...</option>';

    liveGitCommands.forEach(function (cmd) {
        var option = document.createElement('option');
        option.value = cmd.name;
        option.textContent = cmd.name;
        select.appendChild(option);
    });
}

// ---- INITIALIZE VISUAL BUILDER ----

function initVisualBuilder() {
    var select = document.getElementById('commandSelect');
    if (select) {
        select.addEventListener('change', onCommandChange);
    }

    var copyBtn = document.getElementById('copyCommandBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function () {
            var commandText = document.getElementById('commandText');
            if (commandText && commandText.textContent !== 'Select a command to begin...') {
                copyToClipboard(commandText.textContent, copyBtn);
            }
        });
    }

    var auditBtn = document.getElementById('aiAuditBtn');
    if (auditBtn) {
        auditBtn.addEventListener('click', auditVisualCommand);
    }
}

// ---- HANDLE COMMAND SELECTION ----

function onCommandChange() {
    var select = document.getElementById('commandSelect');
    var commandName = select.value;

    var command = liveGitCommands.find(function (cmd) {
        return cmd.name === commandName;
    });

    var descEl = document.getElementById('commandDescription');
    if (descEl) {
        descEl.textContent = command ? command.description : '';
    }

    var argGroup = document.getElementById('argGroup');
    var argInput = document.getElementById('argInput');
    var argLabel = document.getElementById('argLabel');

    if (command && command.argPlaceholder) {
        argGroup.style.display = 'block';
        argInput.placeholder = command.argPlaceholder;
        argLabel.textContent = 'Argument (' + command.argPlaceholder + ')';
        argInput.value = '';

        argInput.removeEventListener('input', generateCommand);
        argInput.addEventListener('input', generateCommand);
    } else {
        argGroup.style.display = 'none';
        argInput.value = '';
    }

    renderFlags(command);
    generateCommand();
}

// ---- RENDER FLAGS ----

function renderFlags(command) {
    var container = document.getElementById('flagsContainer');
    if (!container) return;

    if (!command || !command.flags || command.flags.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted); font-size:0.9rem;">Select a command to see available flags.</p>';
        return;
    }

    var html = '<h4 style="margin-bottom:0.75rem; font-size:0.95rem;">Available Flags</h4>';

    command.flags.forEach(function (flag, index) {
        html += '<div class="flag-item" style="margin-bottom:0.75rem; background:var(--background); padding:0.6rem 0.85rem; border-radius:var(--radius); border:1px solid var(--border);">';
        html += '  <div style="display:flex; align-items:flex-start; gap:0.6rem;">';
        html += '    <input type="checkbox" id="flag-' + index + '" data-flag="' + escapeHtml(flag.flag) + '" data-dangerous="' + flag.dangerous + '" data-has-value="' + (flag.hasValue || false) + '" style="margin-top:0.25rem; cursor:pointer;">';
        html += '    <label for="flag-' + index + '" style="cursor:pointer; flex:1;">';
        html += '      <span style="font-family:monospace; font-weight:700; color:var(--primary); font-size:0.9rem;">' + escapeHtml(flag.flag) + '</span>';
        if (flag.dangerous) {
            html += '      <span class="danger-badge danger" style="margin-left:0.4rem; font-size:0.6rem; padding:0.1rem 0.4rem;">DANGEROUS</span>';
        }
        html += '      <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem; line-height:1.4;">' + escapeHtml(flag.description) + '</div>';

        if (flag.hasValue) {
            html += '      <input type="text" class="flag-value-input" id="flag-value-' + index + '" placeholder="' + escapeHtml(flag.placeholder || 'value') + '" data-for-flag="' + escapeHtml(flag.flag) + '" style="width:100%; margin-top:0.4rem; padding:0.4rem 0.6rem; background:var(--surface); border:1px solid var(--border); border-radius:4px; font-family:monospace; font-size:0.85rem; color:var(--text);">';
        }

        html += '    </label>';
        html += '  </div>';
        html += '</div>';
    });

    container.innerHTML = html;

    var checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (cb) {
        cb.addEventListener('change', generateCommand);
    });

    var valueInputs = container.querySelectorAll('.flag-value-input');
    valueInputs.forEach(function (input) {
        input.addEventListener('input', generateCommand);
    });
}

// ---- GENERATE COMMAND (VISUAL BUILDER) ----

function generateCommand() {
    var select = document.getElementById('commandSelect');
    var commandName = select.value;
    var commandTextEl = document.getElementById('commandText');
    var warningBox = document.getElementById('warningBox');

    if (!commandName) {
        commandTextEl.textContent = 'Select a command to begin...';
        if (warningBox) warningBox.style.display = 'none';
        return;
    }

    var parts = [commandName];
    var hasDangerousFlag = false;

    var checkboxes = document.querySelectorAll('#flagsContainer input[type="checkbox"]:checked');
    checkboxes.forEach(function (cb) {
        var flagName = cb.getAttribute('data-flag');
        var isDangerous = cb.getAttribute('data-dangerous') === 'true';
        var hasValue = cb.getAttribute('data-has-value') === 'true';

        if (isDangerous) {
            hasDangerousFlag = true;
        }

        if (hasValue) {
            var index = cb.id.replace('flag-', '');
            var valueInput = document.getElementById('flag-value-' + index);
            var value = valueInput ? valueInput.value.trim() : '';

            if (value) {
                parts.push(flagName.replace(/<[^>]+>/g, '') + ' ' + value);
            } else {
                parts.push(flagName);
            }
        } else {
            parts.push(flagName);
        }
    });

    var argInput = document.getElementById('argInput');
    if (argInput && argInput.value.trim()) {
        parts.push(argInput.value.trim());
    }

    var fullCmd = parts.join(' ');
    commandTextEl.textContent = fullCmd;

    if (hasDangerousFlag && warningBox) {
        warningBox.style.display = 'flex';
        var warningText = document.getElementById('warningText');
        if (commandName.includes('reset') && fullCmd.includes('--hard')) {
            warningText.textContent = 'git reset --hard will permanently discard all uncommitted changes in your working directory. This action cannot be undone.';
        } else if (commandName.includes('clean')) {
            warningText.textContent = 'git clean will permanently delete untracked files from your working directory. These files cannot be recovered.';
        } else if (commandName.includes('push') && fullCmd.includes('--force')) {
            warningText.textContent = 'Force pushing will overwrite remote branch history. Collaborators may lose their work.';
        } else if (commandName.includes('branch') && fullCmd.includes('-D')) {
            warningText.textContent = 'Force deleting a branch removes it even with unmerged commits.';
        } else {
            warningText.textContent = 'This command performs destructive modifications. Use with caution.';
        }
    } else if (warningBox) {
        warningBox.style.display = 'none';
    }
}

// ---- UTILITIES ----

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function copyToClipboard(text, btnElement) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(function () {
        showToast('Command copied to clipboard!', 'success');
        if (btnElement) {
            var originalHtml = btnElement.innerHTML;
            btnElement.innerHTML = '<span style="color:var(--success);">✓ Copied!</span>';
            setTimeout(function () {
                btnElement.innerHTML = originalHtml;
            }, 2000);
        }
    }).catch(function () {
        showToast('Failed to copy to clipboard', 'error');
    });
}
