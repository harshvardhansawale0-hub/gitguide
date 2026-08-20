// ============================================================
// GitGuide – AI Chatbot Controller (Edi / GitCat AI Buddy)
// ============================================================
(function () {
    'use strict';

    // Black Cat SVG Icon Template (Matches reference picture 2)
    var BLACK_CAT_SVG = '<svg viewBox="0 0 500 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
        '  <radialGradient id="catEyeGradUI" cx="45%" cy="45%" r="55%">' +
        '    <stop offset="0%" stop-color="#FFD000" />' +
        '    <stop offset="70%" stop-color="#FFAC00" />' +
        '    <stop offset="100%" stop-color="#E68A00" />' +
        '  </radialGradient>' +
        '</defs>' +
        '<!-- Sparkle Star -->' +
        '<path d="M 250 20 C 250 50, 265 65, 295 65 C 265 65, 250 80, 250 110 C 250 80, 235 65, 205 65 C 235 65, 250 50, 250 20 Z" fill="#111827" />' +
        '<!-- Collar Body -->' +
        '<path d="M 215 365 L 285 365 L 305 435 C 270 445, 230 445, 195 435 Z" fill="#111827" />' +
        '<!-- Collar Star -->' +
        '<path d="M 250 375 C 250 390, 258 398, 273 398 C 258 398, 250 406, 250 421 C 250 406, 242 398, 227 398 C 242 398, 250 390, 250 375 Z" fill="#FFFFFF" />' +
        '<!-- Head -->' +
        '<path d="M 250 140 C 310 140, 350 170, 365 210 L 410 110 C 400 160, 385 205, 385 240 C 385 315, 325 355, 250 355 C 175 355, 115 315, 115 240 C 115 205, 100 160, 90 110 L 135 210 C 150 170, 190 140, 250 140 Z" fill="#111827" />' +
        '<!-- Whiskers -->' +
        '<path d="M 125 268 C 100 268, 70 266, 50 268 C 65 278, 95 280, 125 278 Z" fill="#111827" />' +
        '<path d="M 135 298 C 105 305, 75 312, 60 318 C 75 328, 105 322, 135 308 Z" fill="#111827" />' +
        '<path d="M 155 328 C 125 342, 95 358, 80 370 C 95 378, 125 362, 155 338 Z" fill="#111827" />' +
        '<path d="M 375 268 C 400 268, 430 266, 450 268 C 435 278, 405 280, 375 278 Z" fill="#111827" />' +
        '<path d="M 365 298 C 395 305, 425 312, 440 318 C 425 328, 395 322, 365 308 Z" fill="#111827" />' +
        '<path d="M 345 328 C 375 342, 405 358, 420 370 C 405 378, 375 362, 345 338 Z" fill="#111827" />' +
        '<!-- Eyes -->' +
        '<ellipse cx="190" cy="225" rx="42" ry="46" fill="url(#catEyeGradUI)" />' +
        '<ellipse cx="196" cy="225" rx="14" ry="26" fill="#111827" />' +
        '<ellipse cx="206" cy="205" rx="6" ry="8" fill="#FFFFFF" />' +
        '<circle cx="184" cy="242" r="3" fill="#FFFFFF" opacity="0.8" />' +
        '<ellipse cx="310" cy="225" rx="42" ry="46" fill="url(#catEyeGradUI)" />' +
        '<ellipse cx="304" cy="225" rx="14" ry="26" fill="#111827" />' +
        '<ellipse cx="314" cy="205" rx="6" ry="8" fill="#FFFFFF" />' +
        '<circle cx="292" cy="242" r="3" fill="#FFFFFF" opacity="0.8" />' +
        '<!-- Nose & Smile -->' +
        '<path d="M 240 252 Q 250 248 260 252 Q 250 258 240 252 Z" fill="#FFFFFF" />' +
        '<path d="M 236 270 C 236 270, 230 305, 250 305 C 270 305, 264 270, 264 270 Z" fill="#FFFFFF" />' +
        '</svg>';

    // Initial Quick Categories for AI Buddy (Matching Reference Image 3)
    var DEFAULT_CATEGORIES = [
        { id: 'basics', icon: '❓', title: 'Git Basics & Setup', prompt: 'How do I initialize and set up a new Git repository?' },
        { id: 'config', icon: '👤', title: 'Profile & Config', prompt: 'How to configure Git username, email, and SSH keys?' },
        { id: 'branching', icon: '🌿', title: 'Branching & Merging', prompt: 'How do I create, switch, and merge Git branches?' },
        { id: 'conflicts', icon: '💥', title: 'Resolving Merge Conflicts', prompt: 'How to safely resolve merge conflicts step-by-step?' },
        { id: 'push-pull', icon: '🚀', title: 'Push, Pull & Remote Errors', prompt: 'How do I fix rejected push and non-fast-forward errors?' },
        { id: 'undo', icon: '⏪', title: 'Undo Changes & Revert', prompt: 'How to undo my last commit or discard unwanted changes?' },
        { id: 'auth', icon: '🔑', title: 'Authentication & GitHub Tokens', prompt: 'How to fix GitHub Authentication Failed and setup Personal Access Tokens?' },
        { id: 'stash', icon: '🗄️', title: 'Stash & Discard Work', prompt: 'How to temporarily save uncommitted work using git stash?' }
    ];

    // Client-side fallback knowledge in case backend is offline
    var CLIENT_FALLBACKS = {
        basics: {
            topic: 'Git Basics & Setup',
            message: '### Initializing a new Git project\n\n```bash\n# 1. Initialize repo\ngit init\n\n# 2. Configure identity\ngit config --global user.name "Your Name"\ngit config --global user.email "you@example.com"\n\n# 3. Add and commit\ngit add .\ngit commit -m "feat: initial commit"\n```\n\n💡 Use `git status` anytime to check your branch progress!'
        },
        config: {
            topic: 'Git User & Profile Config',
            message: '### Set your name and email\n\n```bash\ngit config --global user.name "Your Name"\ngit config --global user.email "you@example.com"\n\n# Verify your settings\ngit config --list --show-origin\n```'
        },
        branching: {
            topic: 'Git Branching & Merging',
            message: '### Create and switch branches\n\n```bash\n# Create and switch to new branch\ngit checkout -b feature/my-feature\n# or:\ngit switch -c feature/my-feature\n\n# View all branches\ngit branch -a\n\n# Merge branch into main\ngit checkout main\ngit merge feature/my-feature\n```'
        },
        conflicts: {
            topic: 'Resolving Merge Conflicts',
            message: '### Steps to resolve merge conflicts\n\n1. Run `git status` to see conflicting files.\n2. Open files and look for `<<<<<<< HEAD` conflict markers.\n3. Keep the correct code and delete the markers.\n4. Stage and finish:\n\n```bash\ngit add .\ngit commit -m "fix: resolved merge conflict"\n```\n\nTo abort: `git merge --abort`'
        },
        'push-pull': {
            topic: 'Push Rejected / Remote Error',
            message: '### How to fix rejected push\n\n```bash\n# 1. Pull latest remote changes first\ngit pull --rebase origin main\n\n# 2. Push your changes\ngit push origin main\n```\n\n⚠️ If force pushing is needed, always use `git push origin main --force-with-lease` to prevent overwriting team commits.'
        },
        undo: {
            topic: 'Undoing Commits & Changes',
            message: '### Safe commit undos\n\n```bash\n# Undo last commit but keep changes staged\ngit reset --soft HEAD~1\n\n# Undo commit and unstage\ngit reset HEAD~1\n\n# Amend commit message\ngit commit --amend -m "new message"\n\n# Discard changes in a file\ngit restore <file>\n```'
        },
        auth: {
            topic: 'GitHub Authentication & Tokens',
            message: '### Setup Personal Access Token (PAT)\n\n1. Go to GitHub → **Settings** → **Developer Settings** → **Personal Access Tokens**.\n2. Generate a token with `repo` permissions.\n3. Use the token as your password when Git prompts you in the terminal.\n\n```bash\n# Enable credential helper\ngit config --global credential.helper wincred\n```'
        },
        stash: {
            topic: 'Git Stash Temporary Storage',
            message: '### Stash uncommitted changes\n\n```bash\n# Save uncommitted work\ngit stash push -m "work in progress"\n\n# See stashes\ngit stash list\n\n# Restore latest stash\ngit stash pop\n```'
        }
    };

    var state = {
        isOpen: false,
        isThinking: false,
        messages: []
    };

    // Initialize the Chatbot
    function initChatbot() {
        if (document.getElementById('gitChatWidget')) return;

        // Build DOM
        var widget = document.createElement('div');
        widget.id = 'gitChatWidget';
        widget.className = 'git-chat-widget';

        widget.innerHTML = 
            '<!-- Greeting Tooltip Pill (Ref Image 1) -->' +
            '<div class="git-chat-tooltip" id="gitChatTooltip" title="Click to chat with Edi">' +
            '    <span>👋 Hi! I\'m Edi</span>' +
            '    <button class="git-chat-tooltip-close" id="gitChatTooltipClose" aria-label="Dismiss greeting">×</button>' +
            '</div>' +
            '<!-- Floating Trigger Button -->' +
            '<button class="git-chat-btn" id="gitChatTrigger" aria-label="Open Git AI Assistant" title="Git AI Assistant">' +
            '    <div class="git-chat-avatar-icon">' + BLACK_CAT_SVG + '</div>' +
            '    <div class="git-chat-close-icon">' +
            '        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
            '            <line x1="18" y1="6" x2="6" y2="18"></line>' +
            '            <line x1="6" y1="6" x2="18" y2="18"></line>' +
            '        </svg>' +
            '    </div>' +
            '    <div class="git-chat-badge"></div>' +
            '</button>';

        // Build Chat Window (Ref Image 3)
        var chatWindow = document.createElement('div');
        chatWindow.id = 'gitChatWindow';
        chatWindow.className = 'git-chat-window';

        chatWindow.innerHTML = 
            '<!-- Header -->' +
            '<div class="git-chat-header">' +
            '    <div class="git-chat-header-info">' +
            '        <div class="git-chat-header-avatar">' +
            '            ' + BLACK_CAT_SVG +
            '            <div class="git-chat-status-dot"></div>' +
            '        </div>' +
            '        <div>' +
            '            <div class="git-chat-header-title">Edi – Your AI Buddy</div>' +
            '            <div class="git-chat-header-subtitle">Online • Always Here</div>' +
            '        </div>' +
            '    </div>' +
            '    <div class="git-chat-header-actions">' +
            '        <button class="git-chat-hdr-btn" id="gitChatResetBtn" title="Reset chat" aria-label="Reset chat">' +
            '            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>' +
            '                <path d="M3 3v5h5"></path>' +
            '            </svg>' +
            '        </button>' +
            '        <button class="git-chat-hdr-btn" id="gitChatCloseBtn" title="Minimize" aria-label="Minimize">' +
            '            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
            '                <line x1="18" y1="6" x2="6" y2="18"></line>' +
            '                <line x1="6" y1="6" x2="18" y2="18"></line>' +
            '            </svg>' +
            '        </button>' +
            '    </div>' +
            '</div>' +
            '<!-- Message Area -->' +
            '<div class="git-chat-messages" id="gitChatMessages"></div>' +
            '<!-- Footer / Input Form -->' +
            '<div class="git-chat-footer">' +
            '    <form class="git-chat-form" id="gitChatForm">' +
            '        <input type="text" class="git-chat-input" id="gitChatInput" placeholder="Type your message or Git error..." autocomplete="off">' +
            '        <button type="submit" class="git-chat-send-btn" id="gitChatSendBtn" aria-label="Send message" disabled>' +
            '            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '                <line x1="22" y1="2" x2="11" y2="13"></line>' +
            '                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>' +
            '            </svg>' +
            '        </button>' +
            '    </form>' +
            '    <div class="git-chat-hint">Press Enter to send • Shift+Enter for new line</div>' +
            '</div>';

        document.body.appendChild(widget);
        document.body.appendChild(chatWindow);

        // Bind DOM Elements
        var triggerBtn = document.getElementById('gitChatTrigger');
        var tooltip = document.getElementById('gitChatTooltip');
        var tooltipClose = document.getElementById('gitChatTooltipClose');
        var closeBtn = document.getElementById('gitChatCloseBtn');
        var resetBtn = document.getElementById('gitChatResetBtn');
        var chatForm = document.getElementById('gitChatForm');
        var chatInput = document.getElementById('gitChatInput');
        var sendBtn = document.getElementById('gitChatSendBtn');

        // Toggle Chat
        triggerBtn.addEventListener('click', toggleChat);
        tooltip.addEventListener('click', function (e) {
            if (e.target !== tooltipClose && !tooltipClose.contains(e.target)) {
                openChat();
            }
        });

        // Dismiss Tooltip
        tooltipClose.addEventListener('click', function (e) {
            e.stopPropagation();
            tooltip.style.display = 'none';
        });

        // Close Chat
        closeBtn.addEventListener('click', closeChat);

        // Reset Chat
        resetBtn.addEventListener('click', function () {
            state.messages = [];
            renderWelcomeMessage();
        });

        // Enable / Disable Send Button based on input
        chatInput.addEventListener('input', function () {
            sendBtn.disabled = !chatInput.value.trim();
        });

        // Form Submit
        chatForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var text = chatInput.value.trim();
            if (!text || state.isThinking) return;

            chatInput.value = '';
            sendBtn.disabled = true;
            handleUserMessage(text);
        });

        // Render Welcome Message on start
        renderWelcomeMessage();
    }

    function toggleChat() {
        if (state.isOpen) {
            closeChat();
        } else {
            openChat();
        }
    }

    function openChat() {
        state.isOpen = true;
        var widget = document.getElementById('gitChatWidget');
        var windowEl = document.getElementById('gitChatWindow');
        var tooltip = document.getElementById('gitChatTooltip');

        if (widget) widget.classList.add('is-open');
        if (windowEl) windowEl.classList.add('is-open');
        if (tooltip) tooltip.style.display = 'none';

        // Focus input
        setTimeout(function () {
            var input = document.getElementById('gitChatInput');
            if (input) input.focus();
        }, 150);

        scrollToBottom();
    }

    function closeChat() {
        state.isOpen = false;
        var widget = document.getElementById('gitChatWidget');
        var windowEl = document.getElementById('gitChatWindow');

        if (widget) widget.classList.remove('is-open');
        if (windowEl) windowEl.classList.remove('is-open');
    }

    // Render Initial Welcome Card with Category Buttons (Ref Image 3)
    function renderWelcomeMessage() {
        var container = document.getElementById('gitChatMessages');
        if (!container) return;

        container.innerHTML = '';

        var welcomeHtml = 
            '<div class="git-msg-row bot">' +
            '    <div class="git-msg-avatar">' + BLACK_CAT_SVG + '</div>' +
            '    <div class="git-msg-bubble">' +
            '        <p>👋 <strong>Hello! I\'m Edi</strong>, your Git & GitHub AI assistant. How can I help you today? Please select a category or ask any question:</p>' +
            '        <div class="git-categories-container" id="gitChatCategories"></div>' +
            '        <div class="git-msg-time">' + formatTime(new Date()) + '</div>' +
            '    </div>' +
            '</div>';

        container.innerHTML = welcomeHtml;

        // Render Category Pills
        var catContainer = document.getElementById('gitChatCategories');
        if (catContainer) {
            DEFAULT_CATEGORIES.forEach(function (cat) {
                var btn = document.createElement('button');
                btn.className = 'git-category-pill';
                btn.innerHTML = 
                    '<span class="git-cat-icon">' + cat.icon + '</span>' +
                    '<span class="git-cat-text">' + cat.title + '</span>' +
                    '<span class="git-cat-arrow">→</span>';

                btn.addEventListener('click', function () {
                    handleCategoryClick(cat);
                });

                catContainer.appendChild(btn);
            });
        }
    }

    // Handle Category Pill Click
    function handleCategoryClick(cat) {
        if (state.isThinking) return;
        appendUserMessage(cat.title);
        showTypingIndicator();

        // Query API
        queryAI(cat.prompt, cat.id);
    }

    // Handle Free-text User Message
    function handleUserMessage(text) {
        appendUserMessage(text);
        showTypingIndicator();
        queryAI(text);
    }

    // Append User Message to UI
    function appendUserMessage(text) {
        var container = document.getElementById('gitChatMessages');
        if (!container) return;

        var row = document.createElement('div');
        row.className = 'git-msg-row user';
        row.innerHTML = 
            '<div class="git-msg-bubble">' +
            '    <p>' + escapeHtml(text) + '</p>' +
            '    <div class="git-msg-time">' + formatTime(new Date()) + '</div>' +
            '</div>';

        container.appendChild(row);
        scrollToBottom();
    }

    // Show Typing Indicator
    function showTypingIndicator() {
        state.isThinking = true;
        var container = document.getElementById('gitChatMessages');
        if (!container) return;

        var row = document.createElement('div');
        row.id = 'gitTypingIndicator';
        row.className = 'git-msg-row bot';
        row.innerHTML = 
            '<div class="git-msg-avatar">' + BLACK_CAT_SVG + '</div>' +
            '<div class="git-msg-bubble">' +
            '    <div class="git-typing-indicator">' +
            '        <div class="git-typing-dot"></div>' +
            '        <div class="git-typing-dot"></div>' +
            '        <div class="git-typing-dot"></div>' +
            '    </div>' +
            '</div>';

        container.appendChild(row);
        scrollToBottom();
    }

    // Remove Typing Indicator
    function removeTypingIndicator() {
        state.isThinking = false;
        var typing = document.getElementById('gitTypingIndicator');
        if (typing) typing.remove();
    }

    // Append AI Response to UI
    function appendBotResponse(data) {
        removeTypingIndicator();

        var container = document.getElementById('gitChatMessages');
        if (!container) return;

        var row = document.createElement('div');
        row.className = 'git-msg-row bot';

        var formattedContent = parseMarkdown(data.message || data);

        var articleHtml = '';
        if (data.relatedArticle) {
            articleHtml = 
                '<a href="article.html?id=' + data.relatedArticle.id + '" class="git-related-card">' +
                '    <span>📖 Read Complete Guide: <strong>' + escapeHtml(data.relatedArticle.title) + '</strong></span>' +
                '    <span>→</span>' +
                '</a>';
        }

        var chipsHtml = '';
        if (data.suggestedQuestions && data.suggestedQuestions.length > 0) {
            chipsHtml = '<div class="git-chips-row">';
            data.suggestedQuestions.forEach(function (q) {
                chipsHtml += '<button class="git-chip-btn" data-query="' + escapeHtml(q) + '">' + escapeHtml(q) + '</button>';
            });
            chipsHtml += '</div>';
        }

        row.innerHTML = 
            '<div class="git-msg-avatar">' + BLACK_CAT_SVG + '</div>' +
            '<div class="git-msg-bubble">' +
            '    ' + formattedContent +
            '    ' + articleHtml +
            '    ' + chipsHtml +
            '    <div class="git-msg-time">' + formatTime(new Date()) + '</div>' +
            '</div>';

        container.appendChild(row);

        // Bind copy buttons inside code blocks
        var copyButtons = row.querySelectorAll('.git-code-copy-btn');
        copyButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var codeEl = btn.closest('.git-code-block').querySelector('.git-code-content');
                if (codeEl) {
                    copyToClipboard(codeEl.textContent.trim(), btn);
                }
            });
        });

        // Bind chip clicks
        var chips = row.querySelectorAll('.git-chip-btn');
        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                var q = chip.getAttribute('data-query');
                if (q) handleUserMessage(q);
            });
        });

        scrollToBottom();
    }

    // Send Query to Backend with Offline Fallback
    async function queryAI(queryText, categoryId) {
        var payload = { query: queryText, categoryId: categoryId };

        try {
            // Check if API module exists
            var res;
            if (window.API && typeof window.API.request === 'function') {
                res = await window.API.request('/chatbot/query', {
                    method: 'POST',
                    body: payload
                });
            } else {
                var response = await fetch('/api/chatbot/query', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                res = await response.json();
            }

            // Simulate slight natural typing pause
            setTimeout(function () {
                if (res && res.success) {
                    appendBotResponse(res);
                } else {
                    fallbackClientAnswer(queryText, categoryId);
                }
            }, 350);

        } catch (err) {
            console.warn('[GitCat Chatbot] Network request error, using client engine:', err);
            setTimeout(function () {
                fallbackClientAnswer(queryText, categoryId);
            }, 300);
        }
    }

    // Client-side Knowledge Fallback
    function fallbackClientAnswer(queryText, categoryId) {
        if (categoryId && CLIENT_FALLBACKS[categoryId]) {
            appendBotResponse({
                topic: CLIENT_FALLBACKS[categoryId].topic,
                message: CLIENT_FALLBACKS[categoryId].message,
                suggestedQuestions: ['How to resolve merge conflicts?', 'How to undo last commit?']
            });
            return;
        }

        var q = queryText.toLowerCase();
        var matched = null;

        for (var key in CLIENT_FALLBACKS) {
            if (q.includes(key) || q.includes(CLIENT_FALLBACKS[key].topic.toLowerCase())) {
                matched = CLIENT_FALLBACKS[key];
                break;
            }
        }

        if (matched) {
            appendBotResponse({
                topic: matched.topic,
                message: matched.message,
                suggestedQuestions: ['How to switch branches?', 'How to push to GitHub?']
            });
        } else {
            appendBotResponse({
                topic: 'Git Guide Answer',
                message: 'Here are standard commands to check repository status:\n\n```bash\n# Check status\ngit status\n\n# Check recent log\ngit log --oneline -n 5\n```\n\n💡 Try clicking any of the categories above for full guided instructions!',
                suggestedQuestions: ['Git Basics & Setup', 'Resolving Merge Conflicts', 'Undo Changes & Revert']
            });
        }
    }

    // Simple Markdown Parser for Rich Answers
    function parseMarkdown(text) {
        if (!text) return '';

        var html = text;

        // Code blocks: ```bash ... ```
        html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, function (_, lang, code) {
            var languageLabel = lang || 'terminal';
            return '<div class="git-code-block">' +
                   '  <div class="git-code-header">' +
                   '    <span>' + escapeHtml(languageLabel) + '</span>' +
                   '    <button class="git-code-copy-btn" title="Copy code">' +
                   '      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                   '        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>' +
                   '        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>' +
                   '      </svg> Copy' +
                   '    </button>' +
                   '  </div>' +
                   '  <div class="git-code-content">' + escapeHtml(code.trim()) + '</div>' +
                   '</div>';
        });

        // Headers ### Header
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h3>$1</h3>');

        // Bold **text**
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Inline code `code`
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Unordered lists - item
        html = html.replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // Paragraphs
        var paragraphs = html.split(/\n\n+/);
        html = paragraphs.map(function (p) {
            if (p.startsWith('<div class="git-code-block">') || p.startsWith('<h3>') || p.startsWith('<ul>')) {
                return p;
            }
            return '<p>' + p.replace(/\n/g, '<br>') + '</p>';
        }).join('');

        return html;
    }

    // Copy to Clipboard Helper
    function copyToClipboard(text, btnEl) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
                showCopiedFeedback(btnEl);
            }).catch(function () {
                fallbackCopy(text, btnEl);
            });
        } else {
            fallbackCopy(text, btnEl);
        }
    }

    function fallbackCopy(text, btnEl) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showCopiedFeedback(btnEl);
        } catch (e) { }
        document.body.removeChild(textarea);
    }

    function showCopiedFeedback(btnEl) {
        var orig = btnEl.innerHTML;
        btnEl.innerHTML = '✓ Copied!';
        btnEl.style.color = '#10B981';
        setTimeout(function () {
            btnEl.innerHTML = orig;
            btnEl.style.color = '';
        }, 2000);
    }

    function scrollToBottom() {
        var container = document.getElementById('gitChatMessages');
        if (container) {
            setTimeout(function () {
                container.scrollTop = container.scrollHeight;
            }, 50);
        }
    }

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Auto-init on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }

})();
