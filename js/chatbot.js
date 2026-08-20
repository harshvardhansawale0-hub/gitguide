/* ============================================================
   GitGuide – AI Chatbot Widget (Frontend)
   Renders the floating "Edi" chat widget and talks to the
   Groq-powered backend at POST /api/chatbot/query
   Pairs with: chatbot.css, routes/chatbot.js (Groq/llama-3.3-70b)
   ============================================================ */
(function () {
    'use strict';

    const API_ENDPOINT = '/api/chatbot/query';

    const QUICK_CATEGORIES = [
        { id: 'basics', icon: '📘', label: 'Git Basics' },
        { id: 'branching', icon: '🌿', label: 'Branching & Merging' },
        { id: 'conflicts', icon: '⚔️', label: 'Merge Conflicts' },
        { id: 'github', icon: '🐙', label: 'GitHub Workflow' }
    ];

    const AVATAR_SVG = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" fill="#3B82F6"/>
            <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#3B82F6" stroke-width="2" fill="none" stroke-linecap="round"/>
        </svg>`;

    const SEND_SVG = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12L20 4L14 20L11 13L4 12Z" fill="currentColor"/>
        </svg>`;

    const CLOSE_SVG = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>`;

    const MINIMIZE_SVG = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>`;

    let state = {
        open: false,
        loading: false,
        history: [] // { role: 'user' | 'bot', content, time }
    };

    let els = {};

    // ---------- Bootstrapping ----------
    function init() {
        injectMarkup();
        cacheEls();
        bindEvents();
        renderWelcome();
    }

    function injectMarkup() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="git-chat-widget" id="gitChatWidget">
                <div class="git-chat-tooltip" id="gitChatTooltip">
                    <span>👋 Need help with Git?</span>
                    <button class="git-chat-tooltip-close" id="gitChatTooltipClose" aria-label="Dismiss">&times;</button>
                </div>
                <button class="git-chat-btn" id="gitChatBtn" aria-label="Open chat with Edi">
                    <span class="git-chat-badge"></span>
                    <span class="git-chat-avatar-icon">${AVATAR_SVG}</span>
                    <span class="git-chat-close-icon">${CLOSE_SVG}</span>
                </button>
            </div>

            <div class="git-chat-window" id="gitChatWindow">
                <div class="git-chat-header">
                    <div class="git-chat-header-info">
                        <div class="git-chat-header-avatar">
                            ${AVATAR_SVG}
                            <span class="git-chat-status-dot"></span>
                        </div>
                        <div>
                            <div class="git-chat-header-title">Edi</div>
                            <div class="git-chat-header-subtitle">Online</div>
                        </div>
                    </div>
                    <div class="git-chat-header-actions">
                        <button class="git-chat-hdr-btn" id="gitChatMinimize" aria-label="Minimize">${MINIMIZE_SVG}</button>
                        <button class="git-chat-hdr-btn" id="gitChatClose" aria-label="Close">${CLOSE_SVG}</button>
                    </div>
                </div>

                <div class="git-chat-messages" id="gitChatMessages"></div>

                <div class="git-chat-footer">
                    <form class="git-chat-form" id="gitChatForm">
                        <input
                            type="text"
                            class="git-chat-input"
                            id="gitChatInput"
                            placeholder="Ask about Git or GitHub..."
                            autocomplete="off"
                        />
                        <button type="submit" class="git-chat-send-btn" id="gitChatSendBtn" disabled aria-label="Send">
                            ${SEND_SVG}
                        </button>
                    </form>
                    <div class="git-chat-hint">Edi can make mistakes. Verify important commands.</div>
                </div>
            </div>
        `;
        document.body.appendChild(wrapper);
    }

    function cacheEls() {
        els.widget = document.getElementById('gitChatWidget');
        els.tooltip = document.getElementById('gitChatTooltip');
        els.tooltipClose = document.getElementById('gitChatTooltipClose');
        els.btn = document.getElementById('gitChatBtn');
        els.window = document.getElementById('gitChatWindow');
        els.minimize = document.getElementById('gitChatMinimize');
        els.close = document.getElementById('gitChatClose');
        els.messages = document.getElementById('gitChatMessages');
        els.form = document.getElementById('gitChatForm');
        els.input = document.getElementById('gitChatInput');
        els.sendBtn = document.getElementById('gitChatSendBtn');
    }

    // ---------- Events ----------
    function bindEvents() {
        els.btn.addEventListener('click', toggleWindow);
        els.tooltipClose.addEventListener('click', (e) => {
            e.stopPropagation();
            els.tooltip.style.display = 'none';
        });
        els.minimize.addEventListener('click', () => setOpen(false));
        els.close.addEventListener('click', () => setOpen(false));

        els.input.addEventListener('input', () => {
            els.sendBtn.disabled = !els.input.value.trim() || state.loading;
        });

        els.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const value = els.input.value.trim();
            if (!value || state.loading) return;
            els.input.value = '';
            els.sendBtn.disabled = true;
            sendQuery(value);
        });
    }

    function toggleWindow() {
        setOpen(!state.open);
    }

    function setOpen(open) {
        state.open = open;
        els.widget.classList.toggle('is-open', open);
        els.window.classList.toggle('is-open', open);
        if (open) {
            els.tooltip.style.display = 'none';
            els.input.focus();
        }
    }

    // ---------- Rendering ----------
    function renderWelcome() {
        appendBotBubble(
            "Hi! I'm **Edi**, your Git & GitHub assistant. Ask me anything, or pick a topic below to get started.",
            { categories: true }
        );
    }

    function appendUserBubble(text) {
        const row = document.createElement('div');
        row.className = 'git-msg-row user';
        row.innerHTML = `
            <div class="git-msg-bubble">
                ${escapeHtml(text)}
                <div class="git-msg-time">${formatTime()}</div>
            </div>
        `;
        els.messages.appendChild(row);
        scrollToBottom();
    }

    function appendBotBubble(markdown, opts = {}) {
        const row = document.createElement('div');
        row.className = 'git-msg-row bot';
        const bubble = document.createElement('div');
        bubble.className = 'git-msg-bubble';
        bubble.innerHTML = renderMarkdown(markdown);

        if (opts.categories) {
            bubble.appendChild(buildCategoriesList());
        }
        if (opts.suggestions && opts.suggestions.length) {
            bubble.appendChild(buildChips(opts.suggestions));
        }

        const time = document.createElement('div');
        time.className = 'git-msg-time';
        time.textContent = formatTime();
        bubble.appendChild(time);

        row.appendChild(bubble);
        els.messages.appendChild(row);
        scrollToBottom();
    }

    function buildCategoriesList() {
        const container = document.createElement('div');
        container.className = 'git-categories-container';
        QUICK_CATEGORIES.forEach((cat) => {
            const pill = document.createElement('button');
            pill.type = 'button';
            pill.className = 'git-category-pill';
            pill.innerHTML = `
                <span class="git-cat-icon">${cat.icon}</span>
                <span class="git-cat-text">${escapeHtml(cat.label)}</span>
                <span class="git-cat-arrow">›</span>
            `;
            pill.addEventListener('click', () => {
                const query = `Give me an overview of ${cat.label}`;
                appendUserBubble(cat.label);
                sendQuery(query, cat.id, /*renderUserBubble=*/ false);
            });
            container.appendChild(pill);
        });
        return container;
    }

    function buildChips(suggestions) {
        const row = document.createElement('div');
        row.className = 'git-chips-row';
        suggestions.forEach((q) => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'git-chip-btn';
            chip.textContent = q;
            chip.addEventListener('click', () => {
                appendUserBubble(q);
                sendQuery(q);
            });
            row.appendChild(chip);
        });
        return row;
    }

    function showTyping() {
        const row = document.createElement('div');
        row.className = 'git-msg-row bot';
        row.id = 'gitChatTypingRow';
        row.innerHTML = `
            <div class="git-msg-bubble git-typing-indicator">
                <span class="git-typing-dot"></span>
                <span class="git-typing-dot"></span>
                <span class="git-typing-dot"></span>
            </div>
        `;
        els.messages.appendChild(row);
        scrollToBottom();
    }

    function hideTyping() {
        const row = document.getElementById('gitChatTypingRow');
        if (row) row.remove();
    }

    function scrollToBottom() {
        els.messages.scrollTop = els.messages.scrollHeight;
    }

    function formatTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // ---------- API ----------
    async function sendQuery(query, categoryId, renderUserBubble = true) {
        if (renderUserBubble) appendUserBubble(query);

        state.loading = true;
        els.sendBtn.disabled = true;
        showTyping();

        try {
            const res = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, categoryId })
            });

            const data = await res.json();
            hideTyping();

            if (!res.ok || !data.success) {
                appendBotBubble(data.message || 'Sorry, something went wrong. Please try again.');
                return;
            }

            appendBotBubble(data.message, { suggestions: data.suggestedQuestions });
        } catch (err) {
            console.error('Chatbot request failed:', err);
            hideTyping();
            appendBotBubble("Sorry, I couldn't reach the server. Please check your connection and try again.");
        } finally {
            state.loading = false;
            els.sendBtn.disabled = !els.input.value.trim();
        }
    }

    // ---------- Minimal Markdown Renderer ----------
    // Supports: ```bash code blocks, **bold**, ### headers, - bullet lists, paragraphs, inline `code`
    function renderMarkdown(raw) {
        const escaped = escapeHtml(raw);
        const codeBlocks = [];

        // Extract fenced code blocks first so their contents aren't touched by other rules
        let text = escaped.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
            const idx = codeBlocks.length;
            codeBlocks.push({ lang: lang || 'bash', code: code.replace(/\n$/, '') });
            return `\u0000CODEBLOCK${idx}\u0000`;
        });

        // Headers
        text = text.replace(/^### (.*)$/gm, '<h3>$1</h3>');

        // Bold
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // Inline code
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Bullet lists
        text = text.replace(/(^|\n)((?:- .*(?:\n|$))+)/g, (match, lead, block) => {
            const items = block.trim().split('\n').map((l) => `<li>${l.replace(/^- /, '')}</li>`).join('');
            return `${lead}<ul>${items}</ul>`;
        });

        // Paragraphs: wrap remaining plain lines, skip lines that are already tags or placeholders
        text = text
            .split(/\n{2,}/)
            .map((block) => {
                const trimmed = block.trim();
                if (!trimmed) return '';
                if (/^<h3>|^<ul>|^\u0000CODEBLOCK/.test(trimmed)) return trimmed;
                return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
            })
            .join('');

        // Re-insert code blocks as styled blocks with a copy button
        text = text.replace(/\u0000CODEBLOCK(\d+)\u0000/g, (match, idx) => {
            const block = codeBlocks[Number(idx)];
            const blockId = `code-${Date.now()}-${idx}`;
            return `
                <div class="git-code-block">
                    <div class="git-code-header">
                        <span>${escapeHtml(block.lang)}</span>
                        <button type="button" class="git-code-copy-btn" data-copy-target="${blockId}">Copy</button>
                    </div>
                    <div class="git-code-content" id="${blockId}">${block.code}</div>
                </div>
            `;
        });

        return text;
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Delegate copy-button clicks (bubbles are created dynamically)
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.git-code-copy-btn');
        if (!btn) return;
        const target = document.getElementById(btn.dataset.copyTarget);
        if (!target) return;
        navigator.clipboard.writeText(target.textContent).then(() => {
            const original = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = original; }, 1500);
        });
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();