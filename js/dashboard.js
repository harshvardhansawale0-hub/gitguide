// ============================================================
// GitGuide – Admin Dashboard JavaScript (Full-Stack Integrated)
// ============================================================
// Full admin management dashboard connected to Express REST API:
// - Live real-time stats & KPIs
// - Article CRUD (create, edit, delete, publish/draft)
// - Dynamic category metrics
// - Comment moderation
// - System audit log trail
// ============================================================

var dashboardArticles = [];
var dashboardCategories = [];
var dashboardComments = [];
var dashboardAuditLogs = [];

// ---- INITIALIZE DASHBOARD ----

document.addEventListener('DOMContentLoaded', async function () {
    // Secure the page - redirect if not admin
    var user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    if (!user || user.role !== 'admin') {
        window.location.href = user ? 'user-dashboard.html' : 'login.html';
        return;
    }

    // Load live data from backend API
    await loadAllDashboardData();

    // Render all dashboard sections
    renderStats();
    renderArticleTable();
    renderCategoryTable();
    renderAllComments();
    renderAuditLog();
    renderRecentActivity();

    // Populate modal category dropdown
    populateModalCategories();

    // Attach event listeners to sidebar items
    initSidebarListeners();

    // Modal event listeners are handled by inline onclick attributes in HTML

    // Close modal when clicking overlay
    var overlay = document.getElementById('modalOverlay');
    if (overlay) {
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }

    var mediaOverlay = document.getElementById('mediaModalOverlay');
    if (mediaOverlay) {
        mediaOverlay.addEventListener('click', function (e) {
            if (e.target === mediaOverlay) {
                closeMediaModal();
            }
        });
    }
});

// ---- SIDEBAR TAB LISTENERS ----

function initSidebarListeners() {
    var sidebarLinks = document.querySelectorAll('.dashboard-sidebar a[data-tab]');
    sidebarLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var tabName = this.getAttribute('data-tab');
            switchTab(tabName, this, e);
        });
    });
}

// ---- LOAD LIVE DASHBOARD DATA ----

async function loadAllDashboardData() {
    if (typeof API !== 'undefined') {
        try {
            // 1. Articles
            var artRes = await API.articles.getAll({ status: 'all' });
            if (artRes.success && Array.isArray(artRes.data)) {
                dashboardArticles = artRes.data;
            }

            // 2. Categories
            var catRes = await API.categories.getAll();
            if (catRes.success && Array.isArray(catRes.data)) {
                dashboardCategories = catRes.data;
            }

            // 3. Comments
            var comRes = await API.comments.getAll();
            if (comRes.success && Array.isArray(comRes.data)) {
                dashboardComments = comRes.data;
            }

            // 4. Audit Logs
            var logRes = await API.dashboard.getAuditLogs();
            if (logRes.success && Array.isArray(logRes.data)) {
                dashboardAuditLogs = logRes.data;
            }
        } catch (e) {
            console.warn('Could not load data from API, using fallback:', e);
        }
    }

    // Fallbacks if offline
    if (dashboardArticles.length === 0 && typeof articles !== 'undefined') {
        dashboardArticles = articles.map(function (a) {
            return {
                id: a.id,
                title: a.title,
                category: a.category,
                difficulty: a.difficulty,
                description: a.description,
                status: 'Published'
            };
        });
    }

    if (dashboardCategories.length === 0 && typeof categories !== 'undefined') {
        dashboardCategories = categories;
    }
}

// ---- TAB SWITCHING ----

function switchTab(tabName, clickedLink, e) {
    if (e && e.preventDefault) e.preventDefault();

    // Map any alias tab names
    if (tabName === 'guides') tabName = 'articles';

    // Hide all sections
    var sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(function (section) {
        section.classList.remove('active');
        section.style.display = 'none';
    });

    // Show the selected section
    var targetSection = document.getElementById('tab-' + tabName);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
    }

    // Update sidebar active state
    var sidebarLinks = document.querySelectorAll('.dashboard-sidebar a');
    sidebarLinks.forEach(function (link) {
        link.classList.remove('active');
        var tabAttr = link.getAttribute('data-tab');
        if (tabAttr === tabName) {
            link.classList.add('active');
        }
    });

    if (clickedLink && clickedLink.classList) {
        clickedLink.classList.add('active');
    }
}

// ---- RENDER STATS ----

async function renderStats() {
    var statGrid = document.getElementById('statGrid');
    if (!statGrid) return;

    var stats = {
        totalArticles: dashboardArticles.length,
        totalCategories: dashboardCategories.length,
        totalComments: dashboardComments.length,
        avgRating: '4.8'
    };

    if (typeof API !== 'undefined' && API.dashboard && API.getToken()) {
        var res = await API.dashboard.getStats();
        if (res.success && res.data) {
            stats.totalArticles = res.data.totalArticles;
            stats.totalCategories = res.data.totalCategories;
            stats.totalComments = res.data.totalComments;
            stats.avgRating = res.data.averageRating || '5.0';
        }
    }

    var html = '';

    html += '<div class="stat-card" onclick="switchTab(\'articles\', null, event)" title="Click to view Guides">';
    html += '  <div class="stat-icon">📄</div>';
    html += '  <div class="stat-number">' + stats.totalArticles + '</div>';
    html += '  <div class="stat-label">Total Articles</div>';
    html += '</div>';

    html += '<div class="stat-card" onclick="switchTab(\'categories\', null, event)" title="Click to view Categories">';
    html += '  <div class="stat-icon">📁</div>';
    html += '  <div class="stat-number">' + stats.totalCategories + '</div>';
    html += '  <div class="stat-label">Categories</div>';
    html += '</div>';

    html += '<div class="stat-card" onclick="switchTab(\'comments\', null, event)" title="Click to view Comments">';
    html += '  <div class="stat-icon">💬</div>';
    html += '  <div class="stat-number">' + stats.totalComments + '</div>';
    html += '  <div class="stat-label">Total Comments</div>';
    html += '</div>';

    html += '<div class="stat-card" onclick="switchTab(\'audit\', null, event)" title="Click to view Audit Logs">';
    html += '  <div class="stat-icon">⭐</div>';
    html += '  <div class="stat-number">' + stats.avgRating + '</div>';
    html += '  <div class="stat-label">Avg. Rating</div>';
    html += '</div>';

    statGrid.innerHTML = html;
}

// ---- RENDER ARTICLE TABLE ----

function renderArticleTable() {
    var tbody = document.getElementById('articleTableBody');
    if (!tbody) return;

    var html = '';

    dashboardArticles.forEach(function (article) {
        html += '<tr>';
        html += '  <td data-label="ID">#' + article.id + '</td>';
        html += '  <td data-label="Article"><strong>' + escapeHtml(article.title) + '</strong></td>';
        html += '  <td data-label="Category"><span class="badge badge-category">' + escapeHtml(article.category) + '</span></td>';
        html += '  <td data-label="Difficulty"><span class="badge ' + getDifficultyClass(article.difficulty) + '">' + escapeHtml(article.difficulty) + '</span></td>';
        html += '  <td data-label="Status"><span class="' + (article.status === 'Published' ? 'status-published' : 'status-draft') + '">' + (article.status || 'Published') + '</span></td>';
        html += '  <td data-label="Actions">';
        html += '    <div class="table-actions">';
        html += '      <button class="btn btn-secondary btn-sm" onclick="openEditModal(' + article.id + ')">✏️ Edit</button>';
        html += '      <button type="button" class="article-upload-btn" onclick="openMediaModal(' + article.id + ')">';
        html += '          <svg class="article-upload-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';
        html += '              <path d="M12 15V4M12 4L8 8M12 4L16 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>';
        html += '              <path d="M5 14V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>';
        html += '          </svg>';
        html += '          <span>Upload</span>';
        html += '      </button>';
        html += '      <button class="btn btn-danger btn-sm" onclick="deleteArticle(' + article.id + ')">🗑️ Delete</button>';
        html += '    </div>';
        html += '  </td>';
        html += '</tr>';
    });

    tbody.innerHTML = html;
}

// ---- RENDER CATEGORY TABLE ----

function renderCategoryTable() {
    var tbody = document.getElementById('categoryTableBody');
    if (!tbody) return;

    var html = '';

    dashboardCategories.forEach(function (cat) {
        var icon = cat.icon || '📁';
        html += '<tr>';
        html += '  <td data-label="ID">#' + cat.id + '</td>';
        html += '  <td data-label="Icon">' + icon + '</td>';
        html += '  <td data-label="Category"><strong>' + escapeHtml(cat.name) + '</strong></td>';
        html += '  <td data-label="Description">' + escapeHtml(cat.description || '') + '</td>';
        html += '  <td data-label="Guides"><span class="badge badge-category">' + (cat.guideCount || 0) + ' guides</span></td>';
        html += '</tr>';
    });

    tbody.innerHTML = html;
}

// ---- RENDER ALL COMMENTS ----

function renderAllComments() {
    var container = document.getElementById('allComments');
    if (!container) return;

    if (dashboardComments.length === 0) {
        container.innerHTML = '<div class="empty-state" style="text-align:center; padding:2rem;"><div class="empty-icon" style="font-size:2.5rem; margin-bottom:0.5rem;">💬</div><h3>No comments yet</h3><p style="color:var(--text-muted);">Comments submitted by users will appear here.</p></div>';
        return;
    }

    var html = '<div class="comment-list">';

    dashboardComments.forEach(function (comment) {
        html += '<div class="comment-item" style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:1.25rem; margin-bottom:1rem;">';
        html += '  <div class="comment-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">';
        html += '    <span class="comment-author"><strong>' + escapeHtml(comment.name) + '</strong> on <a href="article.html?id=' + comment.articleId + '" style="color:var(--primary);">' + escapeHtml(comment.articleTitle || ('Article #' + comment.articleId)) + '</a></span>';
        html += '    <div style="display:flex; align-items:center; gap:1rem;">';
        html += '      <span class="comment-date" style="color:var(--text-muted); font-size:0.85rem;">' + (comment.date || 'Recently') + '</span>';
        html += '      <button class="btn btn-danger btn-sm" style="padding:0.25rem 0.6rem; font-size:0.75rem;" onclick="deleteComment(' + comment.id + ')">Delete</button>';
        html += '    </div>';
        html += '  </div>';
        html += '  <p class="comment-text" style="margin:0; color:var(--text); line-height:1.5;">' + escapeHtml(comment.text) + '</p>';
        html += '</div>';
    });

    html += '</div>';
    container.innerHTML = html;
}

// ---- RENDER AUDIT LOG ----

function renderAuditLog() {
    var container = document.getElementById('auditLog');
    if (!container) return;

    var logs = dashboardAuditLogs.length > 0 ? dashboardAuditLogs : [
        { icon: '🚀', message: 'System database initialized and connected', formattedTime: 'Just now' },
        { icon: '📄', message: 'Articles loaded from SQLite database', formattedTime: '5 minutes ago' },
        { icon: '⭐', message: 'Ratings service online', formattedTime: '15 minutes ago' }
    ];

    var html = '';
    logs.forEach(function (entry) {
        html += '<div class="audit-log-item" style="display:flex; align-items:center; gap:1rem; padding:1rem; border-bottom:1px solid var(--border);">';
        html += '  <span class="audit-icon" style="font-size:1.25rem;">' + (entry.icon || '📌') + '</span>';
        html += '  <div class="audit-text" style="flex:1;">';
        html += '    <p class="audit-message" style="margin:0; color:var(--text); font-weight:500;">' + escapeHtml(entry.message) + '</p>';
        html += '    <span class="audit-time" style="font-size:0.8rem; color:var(--text-muted);">' + (entry.formattedTime || 'Recently') + (entry.triggeredBy ? ' by ' + entry.triggeredBy : '') + '</span>';
        html += '  </div>';
        html += '</div>';
    });

    container.innerHTML = html;
}

// ---- RENDER RECENT ACTIVITY (Overview Tab) ----

function renderRecentActivity() {
    var container = document.getElementById('recentActivity');
    if (!container) return;

    var recentLogs = dashboardAuditLogs.slice(0, 5);
    if (recentLogs.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted); margin:0;">No recent activity recorded.</p>';
        return;
    }

    var html = '';
    recentLogs.forEach(function (entry) {
        html += '<div class="activity-item" style="display:flex; gap:1rem; align-items:center; padding:0.75rem 0; border-bottom:1px solid var(--border);">';
        html += '  <span style="font-size:1.2rem;">' + (entry.icon || '📌') + '</span>';
        html += '  <div style="flex:1;">';
        html += '    <div style="color:var(--text); font-size:0.95rem;">' + escapeHtml(entry.message) + '</div>';
        html += '    <div style="color:var(--text-muted); font-size:0.8rem;">' + (entry.formattedTime || 'Recently') + '</div>';
        html += '  </div>';
        html += '</div>';
    });

    container.innerHTML = html;
}

// ---- POPULATE MODAL CATEGORIES ----

function populateModalCategories() {
    var select = document.getElementById('modalArticleCategory');
    if (!select) return;

    select.innerHTML = '';
    dashboardCategories.forEach(function (cat) {
        var option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        select.appendChild(option);
    });
}

// ---- MODAL CONTROLS ----

function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Add New Article';
    document.getElementById('modalArticleId').value = '';
    document.getElementById('modalArticleTitle').value = '';
    document.getElementById('modalArticleDesc').value = '';
    document.getElementById('modalArticleDifficulty').value = 'Beginner';
    var statusEl = document.getElementById('modalArticleStatus');
    if (statusEl) statusEl.value = 'Published';

    // Show steps editor with one empty section
    var stepsEditor = document.getElementById('articleStepsEditor');
    if (stepsEditor) stepsEditor.style.display = 'block';
    var stepsContainer = document.getElementById('stepsContainer');
    if (stepsContainer) stepsContainer.innerHTML = '';
    addStepCard(); // Start with one empty section

    var modal = document.getElementById('articleModal');
    if (modal) modal.classList.add('modal-wide');

    document.getElementById('modalOverlay').classList.add('active');
}

async function openEditModal(articleId) {
    // Set basic fields from local cache first
    var article = dashboardArticles.find(function (a) { return a.id === articleId; });
    if (!article) return;

    document.getElementById('modalTitle').textContent = 'Edit Article';
    document.getElementById('modalArticleId').value = article.id;
    document.getElementById('modalArticleTitle').value = article.title;
    document.getElementById('modalArticleCategory').value = article.category;
    document.getElementById('modalArticleDifficulty').value = article.difficulty;
    document.getElementById('modalArticleDesc').value = article.description || '';
    var statusEl = document.getElementById('modalArticleStatus');
    if (statusEl) statusEl.value = article.status || 'Published';

    // Widen modal for steps editor
    var modal = document.getElementById('articleModal');
    if (modal) modal.classList.add('modal-wide');

    // Show steps editor
    var stepsEditor = document.getElementById('articleStepsEditor');
    if (stepsEditor) stepsEditor.style.display = 'block';
    var stepsContainer = document.getElementById('stepsContainer');
    if (stepsContainer) stepsContainer.innerHTML = '<p style="color:var(--text-muted); font-size:0.9rem;">Loading article sections...</p>';

    document.getElementById('modalOverlay').classList.add('active');

    // Fetch full article data (with steps) from the API
    var steps = [];
    if (typeof API !== 'undefined' && API.articles && API.getToken()) {
        try {
            var res = await API.articles.getById(articleId);
            if (res.success && res.data && Array.isArray(res.data.steps)) {
                steps = res.data.steps;
            }
        } catch (e) {
            console.warn('Could not fetch article steps:', e);
        }
    }

    // Render step cards
    if (stepsContainer) {
        stepsContainer.innerHTML = '';
        if (steps.length === 0) {
            // No steps yet — show one empty card
            addStepCard();
        } else {
            steps.forEach(function (step, idx) {
                renderStepCard(stepsContainer, idx + 1, step.title || '', step.content || '', step.command || '');
            });
        }
    }
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    // Clean up steps editor
    var stepsEditor = document.getElementById('articleStepsEditor');
    if (stepsEditor) stepsEditor.style.display = 'none';
    var stepsContainer = document.getElementById('stepsContainer');
    if (stepsContainer) stepsContainer.innerHTML = '';
    var modal = document.getElementById('articleModal');
    if (modal) modal.classList.remove('modal-wide');
}

// ---- SAVE ARTICLE (Add or Edit) ----

// ---- STEP CARD HELPERS ----

function renderStepCard(container, stepNum, title, content, command) {
    var card = document.createElement('div');
    card.className = 'step-card';
    card.setAttribute('data-step-index', stepNum);

    card.innerHTML = '<div class="step-card-header">' +
        '<span class="step-number-badge">Section ' + stepNum + '</span>' +
        '<button type="button" class="remove-step-btn" onclick="removeStepCard(this)" title="Remove this section">✕ Remove</button>' +
        '</div>' +
        '<div class="step-field">' +
        '<label>Section Title</label>' +
        '<input type="text" class="step-title-input" value="' + escapeAttr(title) + '" placeholder="e.g. What is Git?">' +
        '</div>' +
        '<div class="step-field">' +
        '<label>Section Content</label>' +
        '<textarea class="step-content-input" placeholder="Content for this section...">' + escapeHtml(content) + '</textarea>' +
        '</div>' +
        '<div class="step-field">' +
        '<label>Command / Code Block</label>' +
        '<textarea class="step-command step-command-input" placeholder="Leave empty if no command for this section">' + escapeHtml(command) + '</textarea>' +
        '</div>';

    container.appendChild(card);
}

function addStepCard() {
    var container = document.getElementById('stepsContainer');
    if (!container) return;
    var currentCards = container.querySelectorAll('.step-card');
    var nextNum = currentCards.length + 1;
    renderStepCard(container, nextNum, '', '', '');
    // Scroll the new card into view within the modal
    var lastCard = container.lastElementChild;
    if (lastCard) lastCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function removeStepCard(btn) {
    var card = btn.closest('.step-card');
    if (!card) return;
    var container = document.getElementById('stepsContainer');
    var cards = container.querySelectorAll('.step-card');
    if (cards.length <= 1) {
        showToast('An article must have at least one section.', 'error');
        return;
    }
    card.remove();
    renumberStepCards();
}

function renumberStepCards() {
    var container = document.getElementById('stepsContainer');
    if (!container) return;
    var cards = container.querySelectorAll('.step-card');
    cards.forEach(function (card, idx) {
        card.setAttribute('data-step-index', idx + 1);
        var badge = card.querySelector('.step-number-badge');
        if (badge) badge.textContent = 'Section ' + (idx + 1);
    });
}

function collectStepsFromForm() {
    var container = document.getElementById('stepsContainer');
    if (!container) return [];
    var cards = container.querySelectorAll('.step-card');
    var steps = [];
    cards.forEach(function (card, idx) {
        var title = card.querySelector('.step-title-input');
        var content = card.querySelector('.step-content-input');
        var command = card.querySelector('.step-command-input');
        steps.push({
            title: title ? title.value.trim() : '',
            content: content ? content.value.trim() : '',
            command: command ? command.value.trim() : ''
        });
    });
    return steps;
}

function escapeAttr(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---- SAVE ARTICLE (Add or Edit) ----

async function saveArticle() {
    var saveBtn = document.getElementById('modalSaveBtn');
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
    }

    var idInput = document.getElementById('modalArticleId').value;
    var title = document.getElementById('modalArticleTitle').value.trim();
    var category = document.getElementById('modalArticleCategory').value;
    var difficulty = document.getElementById('modalArticleDifficulty').value;
    var description = document.getElementById('modalArticleDesc').value.trim();
    var statusEl = document.getElementById('modalArticleStatus');
    var status = statusEl ? statusEl.value : 'Published';

    if (!title || !description) {
        showToast('Please fill in all required fields.', 'error');
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Guide';
        }
        return;
    }

    // Collect steps from the form
    var steps = collectStepsFromForm();

    if (idInput) {
        // Edit existing
        var articleId = parseInt(idInput);

        if (typeof API !== 'undefined' && API.articles && API.getToken()) {
            var res = await API.articles.update(articleId, {
                title: title,
                categoryName: category,
                difficulty: difficulty,
                description: description,
                status: status,
                steps: steps
            });
            if (res.success) {
                showToast('Article updated on server!', 'success');
            } else {
                showToast(res.message || 'Failed to update article.', 'error');
            }
        }

        var index = dashboardArticles.findIndex(function (a) { return a.id === articleId; });
        if (index > -1) {
            dashboardArticles[index].title = title;
            dashboardArticles[index].category = category;
            dashboardArticles[index].difficulty = difficulty;
            dashboardArticles[index].description = description;
            dashboardArticles[index].status = status;
        }
    } else {
        // Add new
        var newArticleId = Date.now();

        if (typeof API !== 'undefined' && API.articles && API.getToken()) {
            var createRes = await API.articles.create({
                title: title,
                categoryName: category,
                difficulty: difficulty,
                description: description,
                status: status,
                readingTime: '5 min',
                steps: steps
            });
            if (createRes.success && createRes.id) {
                newArticleId = createRes.id;
                showToast('New article created on server!', 'success');
            } else {
                showToast(createRes.message || 'Failed to create article.', 'error');
            }
        }

        dashboardArticles.push({
            id: newArticleId,
            title: title,
            category: category,
            difficulty: difficulty,
            description: description,
            status: status
        });
    }

    closeModal();
    await loadAllDashboardData();
    renderStats();
    renderArticleTable();
    renderAuditLog();
    renderRecentActivity();

    if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Guide';
    }
}

// ---- DELETE ARTICLE ----

async function deleteArticle(articleId) {
    if (!confirm('Are you sure you want to delete this article?')) return;

    if (typeof API !== 'undefined' && API.articles && API.getToken()) {
        var res = await API.articles.delete(articleId);
        if (res.success) {
            showToast('Article deleted from database.', 'success');
        }
    }

    dashboardArticles = dashboardArticles.filter(function (a) { return a.id !== articleId; });
    renderStats();
    renderArticleTable();
    renderAuditLog();
    renderRecentActivity();
}

// ---- DELETE COMMENT ----

async function deleteComment(commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    if (typeof API !== 'undefined' && API.comments && API.getToken()) {
        var res = await API.comments.delete(commentId);
        if (res.success) {
            showToast('Comment deleted.', 'success');
        }
    }

    dashboardComments = dashboardComments.filter(function (c) { return c.id !== commentId; });
    renderAllComments();
    renderStats();
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

// ==========================================
// MEDIA UPLOAD MODAL LOGIC
// ==========================================

let currentMediaTab = 'file';
let currentUploadArticleId = null;

async function openMediaModal(articleId) {
    // 1. Clear any previous selected article ID.
    currentUploadArticleId = null;
    document.getElementById('mediaModalArticleId').value = '';

    // 2. Set the hidden input and state to the NEW article ID.
    currentUploadArticleId = parseInt(articleId, 10);
    document.getElementById('mediaModalArticleId').value = currentUploadArticleId;
    
    document.getElementById('mediaModalOverlay').classList.add('active');
    document.getElementById('mediaFileInput').value = '';
    document.getElementById('mediaUrlInput').value = '';

    // Load existing media
    renderAttachedMedia(currentUploadArticleId);
}

function closeMediaModal() {
    currentUploadArticleId = null;
    document.getElementById('mediaModalArticleId').value = '';
    document.getElementById('mediaModalOverlay').classList.remove('active');
}

function switchMediaTab(tabName) {
    currentMediaTab = tabName;

    // Reset tabs
    document.getElementById('mediaTabBtnFile').className = 'tab-btn';
    document.getElementById('mediaTabBtnFile').style.borderBottom = '2px solid transparent';
    document.getElementById('mediaTabBtnFile').style.color = 'var(--text-muted)';

    document.getElementById('mediaTabBtnUrl').className = 'tab-btn';
    document.getElementById('mediaTabBtnUrl').style.borderBottom = '2px solid transparent';
    document.getElementById('mediaTabBtnUrl').style.color = 'var(--text-muted)';

    document.getElementById('mediaTabFile').style.display = 'none';
    document.getElementById('mediaTabUrl').style.display = 'none';

    // Set active
    if (tabName === 'file') {
        document.getElementById('mediaTabBtnFile').className = 'tab-btn active';
        document.getElementById('mediaTabBtnFile').style.borderBottom = '2px solid var(--primary)';
        document.getElementById('mediaTabBtnFile').style.color = 'var(--text)';
        document.getElementById('mediaTabFile').style.display = 'block';
    } else {
        document.getElementById('mediaTabBtnUrl').className = 'tab-btn active';
        document.getElementById('mediaTabBtnUrl').style.borderBottom = '2px solid var(--primary)';
        document.getElementById('mediaTabBtnUrl').style.color = 'var(--text)';
        document.getElementById('mediaTabUrl').style.display = 'block';
    }
}

async function uploadMedia() {
    // Get the article ID from the CURRENT modal state immediately before making the request.
    const hiddenInputValue = document.getElementById('mediaModalArticleId').value;
    const articleId = currentUploadArticleId || parseInt(hiddenInputValue, 10);
    
    if (!Number.isInteger(articleId) || articleId <= 0) {
        showToast('Invalid selected article ID', 'error');
        throw new Error('Invalid selected article ID');
    }

    const btn = document.getElementById('uploadMediaBtn');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span style="pointer-events:none;">Uploading...</span>';

    try {
        let payload = {};

        if (currentMediaTab === 'file') {
            const fileInput = document.getElementById('mediaFileInput');
            if (fileInput.files.length === 0) {
                showToast('Please select a file to upload.', 'error');
                return;
            }

            const file = fileInput.files[0];
            const MAX_SIZE = 50 * 1024 * 1024; // 50MB
            if (file.size > MAX_SIZE) {
                showToast('File size must be less than 50MB.', 'error');
                return;
            }

            // Convert to Base64
            const dataBase64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
                reader.readAsDataURL(file);
            });

            payload = {
                media_type: file.type.startsWith('video') ? 'video' : 'image',
                file_name: file.name,
                mime_type: file.type,
                file_size: file.size,
                data_base64: dataBase64
            };

        } else if (currentMediaTab === 'url') {
            const urlInput = document.getElementById('mediaUrlInput').value.trim();
            if (!urlInput) {
                showToast('Please enter a valid URL.', 'error');
                return;
            }

            payload = {
                media_type: 'url',
                media_url: urlInput
            };
        }

        const res = await API.media.upload(articleId, payload);
        if (res.success) {
            showToast('Media uploaded successfully!', 'success');
            document.getElementById('mediaFileInput').value = '';
            document.getElementById('mediaUrlInput').value = '';
            renderAttachedMedia(articleId);
            loadAllDashboardData();
        } else {
            console.error('Backend upload failed for article:', articleId, 'URL:', `/api/media/${articleId}`, 'Response:', res);
            showToast(res.message || 'Upload failed.', 'error');
        }
    } catch (err) {
        console.error('Network or frontend error uploading media for article:', articleId, 'URL:', `/api/media/${articleId}`, 'Error:', err);
        showToast('Error during upload.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
    }
}


async function renderAttachedMedia(articleId) {
    const listDiv = document.getElementById('attachedMediaList');
    listDiv.innerHTML = '<p>Loading media...</p>';

    try {
        const res = await API.media.getByArticle(articleId);
        if (res.success) {
            if (res.data.length === 0) {
                listDiv.innerHTML = '<p style="color:var(--text-muted); font-size:0.9rem;">No media attached to this article.</p>';
                return;
            }

            let html = '';
            res.data.forEach(media => {
                html += '<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding:0.5rem 0;">';
                html += '  <div style="display:flex; flex-direction:column;">';
                html += '    <strong>' + (media.media_type.toUpperCase()) + '</strong>';
                html += '    <a href="' + escapeHtml(media.media_url) + '" target="_blank" style="font-size:0.85rem; color:var(--primary); word-break:break-all;">' + escapeHtml(media.media_url) + '</a>';
                html += '  </div>';
                html += '  <button class="btn btn-danger btn-sm" onclick="deleteMedia(' + media.id + ', ' + articleId + ')">Delete</button>';
                html += '</div>';
            });
            listDiv.innerHTML = html;
        } else {
            listDiv.innerHTML = '<p style="color:red;">Failed to load media.</p>';
        }
    } catch (err) {
        console.error(err);
        listDiv.innerHTML = '<p style="color:red;">Error loading media.</p>';
    }
}

async function deleteMedia(mediaId, articleId) {
    if (!confirm('Are you sure you want to delete this media?')) return;

    try {
        const res = await API.media.delete(mediaId);
        if (res.success) {
            showToast('Media deleted.', 'success');
            renderAttachedMedia(articleId);
            loadAllDashboardData();
        } else {
            showToast(res.message || 'Deletion failed.', 'error');
        }
    } catch (err) {
        console.error(err);
        showToast('Error during deletion.', 'error');
    }
}


// Attach all interactive handlers to window for inline onclick compatibility
window.switchTab = switchTab;
window.openAddModal = openAddModal;
window.openEditModal = openEditModal;
window.closeModal = closeModal;
window.saveArticle = saveArticle;
window.deleteArticle = deleteArticle;
window.deleteComment = deleteComment;
window.addStepCard = addStepCard;
window.removeStepCard = removeStepCard;

// Media Window functions
window.openMediaModal = openMediaModal;
window.closeMediaModal = closeMediaModal;
window.switchMediaTab = switchMediaTab;
window.uploadMedia = uploadMedia;
window.deleteMedia = deleteMedia;
