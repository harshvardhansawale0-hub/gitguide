// ============================================================
// GitGuide – User Dashboard JavaScript (Full-Stack Integrated)
// ============================================================

document.addEventListener('DOMContentLoaded', async function () {
    var user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    if (user.role === 'admin') {
        window.location.href = 'dashboard.html';
        return;
    }

    var dashboardData = null;
    if (typeof API !== 'undefined' && API.dashboard && API.getToken()) {
        var res = await API.dashboard.getUserDashboard();
        if (res.success && res.data) {
            dashboardData = res.data;
            user = dashboardData.user;
        }
    }

    var welcomeEl = document.getElementById('welcomeName');
    if (welcomeEl) {
        welcomeEl.textContent = 'Welcome, ' + (user.name || user.username) + '!';
    }

    // 1. Dashboard Statistics
    function renderStats() {
        var grid = document.getElementById('statsGrid');
        if (!grid || !dashboardData) return;
        var stats = dashboardData.stats;
        
        grid.innerHTML = `
            <div style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:1.5rem; text-align:center;">
                <div style="font-size:2rem; font-weight:bold; color:var(--primary); margin-bottom:0.5rem;">${stats.articlesRead || 0}</div>
                <div style="color:var(--text-muted); font-size:0.9rem; text-transform:uppercase; letter-spacing:1px;">Articles Read</div>
            </div>
            <div style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:1.5rem; text-align:center;">
                <div style="font-size:2rem; font-weight:bold; color:var(--primary); margin-bottom:0.5rem;" id="statBookmarksCount">${stats.bookmarksCount || 0}</div>
                <div style="color:var(--text-muted); font-size:0.9rem; text-transform:uppercase; letter-spacing:1px;">Bookmarks</div>
            </div>
            <div style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:1.5rem; text-align:center;">
                <div style="font-size:2rem; font-weight:bold; color:var(--primary); margin-bottom:0.5rem;" id="statCommentsCount">${stats.commentsCount || 0}</div>
                <div style="color:var(--text-muted); font-size:0.9rem; text-transform:uppercase; letter-spacing:1px;">Comments</div>
            </div>
            <div style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:1.5rem; text-align:center;">
                <div style="font-size:2rem; font-weight:bold; color:var(--primary); margin-bottom:0.5rem;">${stats.ratingsCount || 0}</div>
                <div style="color:var(--text-muted); font-size:0.9rem; text-transform:uppercase; letter-spacing:1px;">Ratings Given</div>
            </div>
        `;
    }

    // 2. My Activity
    function renderActivity() {
        var timeline = document.getElementById('activityTimeline');
        if (!timeline || !dashboardData) return;
        var activity = dashboardData.activity || [];

        if (activity.length === 0) {
            timeline.innerHTML = '<div style="color:var(--text-light); text-align:center;">No recent activity found.</div>';
            return;
        }

        var html = '<div style="display:flex; flex-direction:column; gap:1rem;">';
        activity.forEach(function(item) {
            html += `
                <div style="display:flex; align-items:center; gap:1rem; padding:1rem; background:var(--background); border-radius:var(--radius);">
                    <div style="font-size:1.5rem; width:40px; height:40px; display:flex; align-items:center; justify-content:center; background:var(--surface); border-radius:50%;">${item.icon}</div>
                    <div style="flex:1;">
                        <div style="color:var(--text); font-weight:500;">${escapeHtml(item.message)}</div>
                        <div style="color:var(--text-muted); font-size:0.85rem; margin-top:0.25rem;">${item.formattedTime}</div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        timeline.innerHTML = html;
    }

    // 3. Recently Viewed Articles
    function renderRecentlyViewed() {
        var grid = document.getElementById('recentlyViewedGrid');
        if (!grid || !dashboardData) return;
        var viewed = dashboardData.recentlyViewed || [];

        if (viewed.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1 / -1; color:var(--text-light); text-align:center; padding:2rem; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg);">You have not viewed any articles recently.</div>';
            return;
        }

        var html = '';
        viewed.forEach(function(article) {
            html += `
                <div class="article-card" style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:1.5rem; display:flex; flex-direction:column; justify-content:space-between;">
                    <div>
                        <h3 style="margin-bottom:0.75rem; font-size:1.2rem;"><a href="article.html?id=${article.articleId}" style="color:var(--text); text-decoration:none;">${escapeHtml(article.title)}</a></h3>
                        <div class="card-meta" style="margin-bottom:1.5rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
                            <span class="badge badge-category">${escapeHtml(article.category)}</span>
                            <span class="badge ${getDifficultyClass(article.difficulty)}">${escapeHtml(article.difficulty)}</span>
                        </div>
                    </div>
                    <div class="card-footer" style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:1rem;">
                        <span style="color:var(--text-muted); font-size:0.85rem;">Last viewed: ${article.date}</span>
                        <a href="article.html?id=${article.articleId}" class="btn btn-primary btn-sm" style="padding:0.4rem 0.8rem;">Read</a>
                    </div>
                </div>
            `;
        });
        grid.innerHTML = html;
    }

    // 4. Reading Progress
    function renderReadingProgress() {
        var list = document.getElementById('readingProgressList');
        if (!list || !dashboardData) return;
        var progress = dashboardData.readingProgress || [];

        if (progress.length === 0) {
            list.innerHTML = '<div style="color:var(--text-light); text-align:center; padding:2rem; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg);">No reading progress recorded yet.</div>';
            return;
        }

        var html = '';
        progress.forEach(function(p) {
            html += `
                <div style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:1.5rem; display:flex; flex-direction:column; gap:0.75rem;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <a href="article.html?id=${p.articleId}" style="color:var(--text); font-weight:600; text-decoration:none;">${escapeHtml(p.title)}</a>
                        <span style="color:var(--primary); font-weight:bold; font-size:0.9rem;">${p.progress}%</span>
                    </div>
                    <div style="width:100%; height:8px; background:var(--background); border-radius:4px; overflow:hidden;">
                        <div style="height:100%; width:${p.progress}%; background:var(--primary); border-radius:4px; transition:width 0.3s ease;"></div>
                    </div>
                </div>
            `;
        });
        list.innerHTML = html;
    }

    // 5. Account Security
    function renderAccountSecurity() {
        var info = document.getElementById('accountSecurityInfo');
        if (!info || !dashboardData) return;
        
        var u = dashboardData.user;
        var created = u.createdAt ? new Date(u.createdAt).toLocaleString() : 'Unknown';
        var login = u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Unknown';

        info.innerHTML = `
            <div style="display:flex; justify-content:space-between; padding-bottom:1rem; border-bottom:1px solid var(--border);">
                <span style="font-weight:600;">Account Created</span>
                <span>${created}</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding-bottom:1rem; border-bottom:1px solid var(--border);">
                <span style="font-weight:600;">Last Successful Login</span>
                <span>${login}</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding-bottom:1rem; border-bottom:1px solid var(--border);">
                <span style="font-weight:600;">Account Role</span>
                <span style="text-transform:capitalize;">${u.role}</span>
            </div>
        `;
    }

    // 6. Bookmarks (with Search, Filter, Sort)
    var currentBookmarks = dashboardData ? (dashboardData.bookmarks || []) : [];
    
    function populateBookmarkFilters() {
        var filter = document.getElementById('bookmarkFilter');
        if (!filter) return;
        var categories = new Set(currentBookmarks.map(b => b.category));
        
        var options = '<option value="">All Categories</option>';
        categories.forEach(c => {
            options += `<option value="${c}">${c}</option>`;
        });
        filter.innerHTML = options;
    }

    function renderUserBookmarks() {
        var grid = document.getElementById('userBookmarksGrid');
        if (!grid) return;

        var searchQuery = (document.getElementById('bookmarkSearch')?.value || '').toLowerCase();
        var categoryFilter = document.getElementById('bookmarkFilter')?.value || '';
        var sortOrder = document.getElementById('bookmarkSort')?.value || 'newest';

        var filtered = currentBookmarks.filter(b => {
            var matchesSearch = b.title.toLowerCase().includes(searchQuery) || (b.description && b.description.toLowerCase().includes(searchQuery));
            var matchesCat = categoryFilter === '' || b.category === categoryFilter;
            return matchesSearch && matchesCat;
        });

        filtered.sort((a, b) => {
            if (sortOrder === 'newest') return new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt);
            if (sortOrder === 'oldest') return new Date(a.bookmarkedAt) - new Date(b.bookmarkedAt);
            if (sortOrder === 'az') return a.title.localeCompare(b.title);
            return 0;
        });

        if (filtered.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1 / -1; color:var(--text-light); text-align:center; padding:2rem; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg);">No bookmarks match your criteria.</div>';
            return;
        }

        var html = '';
        filtered.forEach(function (article) {
            html += `
                <div class="article-card" id="bookmark-card-${article.articleId}" style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:1.5rem; display:flex; flex-direction:column; justify-content:space-between;">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
                            <h3 style="margin:0;"><a href="article.html?id=${article.articleId}" style="color:var(--text); text-decoration:none;">${escapeHtml(article.title)}</a></h3>
                            <button class="remove-bookmark-btn" data-id="${article.articleId}" style="background:transparent; border:none; color:var(--error); cursor:pointer; font-size:1.2rem;" title="Remove Bookmark">×</button>
                        </div>
                        <p class="card-description" style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1rem; line-height:1.5;">${escapeHtml(article.description)}</p>
                        <div class="card-meta" style="margin-bottom:1.5rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
                            <span class="badge badge-category">${escapeHtml(article.category)}</span>
                            <span class="badge ${getDifficultyClass(article.difficulty)}">${escapeHtml(article.difficulty)}</span>
                        </div>
                    </div>
                    <div class="card-footer" style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:1rem;">
                        <span class="read-time" style="color:var(--text-muted); font-size:0.85rem;">📖 ${article.readingTime || '5 min'}</span>
                        <a href="article.html?id=${article.articleId}" class="btn btn-primary btn-sm" style="padding:0.4rem 0.8rem;">Read</a>
                    </div>
                </div>
            `;
        });
        grid.innerHTML = html;

        // Attach delete listeners
        grid.querySelectorAll('.remove-bookmark-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                var artId = this.getAttribute('data-id');
                var res = await request('/bookmarks/toggle', { method: 'POST', body: { articleId: artId }});
                if (res.success) {
                    showToast('Bookmark removed', 'success');
                    currentBookmarks = currentBookmarks.filter(b => b.articleId != artId);
                    // Update stat
                    var statEl = document.getElementById('statBookmarksCount');
                    if (statEl) statEl.textContent = currentBookmarks.length;
                    renderUserBookmarks();
                } else {
                    showToast(res.message || 'Error removing bookmark', 'error');
                }
            });
        });
    }

    // Attach bookmark filter listeners
    var bSearch = document.getElementById('bookmarkSearch');
    var bFilter = document.getElementById('bookmarkFilter');
    var bSort = document.getElementById('bookmarkSort');
    if (bSearch) bSearch.addEventListener('input', renderUserBookmarks);
    if (bFilter) bFilter.addEventListener('change', renderUserBookmarks);
    if (bSort) bSort.addEventListener('change', renderUserBookmarks);

    // 7. My Comments (with Secure Delete)
    var currentComments = dashboardData ? (dashboardData.comments || []) : [];

    function renderUserComments() {
        var container = document.getElementById('userCommentsList');
        if (!container) return;

        if (currentComments.length === 0) {
            container.innerHTML = '<div style="color:var(--text-light); text-align:center; padding:2rem;">You haven\'t posted any comments yet.</div>';
            return;
        }

        var html = '';
        currentComments.forEach(function (comment) {
            html += `
                <div class="comment-item" id="comment-item-${comment.id}" style="background:var(--background); border:1px solid var(--border); border-radius:var(--radius); padding:1.25rem; margin-bottom:1rem;">
                    <div class="comment-header" style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
                        <div>
                            <span class="comment-author" style="font-weight:600;">On <a href="article.html?id=${comment.articleId}" style="color:var(--primary);">${escapeHtml(comment.articleTitle)}</a></span>
                            <div class="comment-date" style="color:var(--text-muted); font-size:0.85rem; margin-top:0.25rem;">${comment.date || 'Recently'}</div>
                        </div>
                        <button class="delete-comment-btn btn btn-sm btn-secondary" data-id="${comment.id}" style="padding:0.25rem 0.5rem; color:var(--error); border-color:var(--error);">Delete</button>
                    </div>
                    <p class="comment-text" style="color:var(--text); margin:0; line-height:1.5;">${escapeHtml(comment.text)}</p>
                </div>
            `;
        });
        container.innerHTML = html;

        // Attach delete listeners
        container.querySelectorAll('.delete-comment-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                if (!confirm("Are you sure you want to delete this comment?")) return;
                var commentId = this.getAttribute('data-id');
                var res = await request('/comments/' + commentId, { method: 'DELETE' });
                if (res.success) {
                    showToast('Comment deleted', 'success');
                    currentComments = currentComments.filter(c => c.id != commentId);
                    // Update stat
                    var statEl = document.getElementById('statCommentsCount');
                    if (statEl) statEl.textContent = currentComments.length;
                    renderUserComments();
                } else {
                    showToast(res.message || 'Error deleting comment', 'error');
                }
            });
        });
    }

    // 8. Account Settings (Profile & Password)
    async function initAccountSettings() {
        if (typeof API === 'undefined' || !API.auth) return;

        var nameInput = document.getElementById('profileName');
        var usernameInput = document.getElementById('profileUsername');
        var contactInput = document.getElementById('profileContact');

        if (nameInput) nameInput.value = user.name || '';
        if (usernameInput) usernameInput.value = user.username || '';
        if (contactInput) contactInput.value = user.contact || '';

        var profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                var btn = document.getElementById('btnUpdateProfile');
                var originalText = btn.textContent;
                btn.textContent = 'Saving...';
                btn.disabled = true;

                var name = nameInput.value.trim();
                var username = usernameInput.value.trim();
                var contact = contactInput.value.trim();

                if (!name || !username) {
                    showToast('Name and username are required.', 'error');
                    btn.textContent = originalText;
                    btn.disabled = false;
                    return;
                }

                var updateRes = await API.auth.updateProfile(name, contact, username);
                if (updateRes.success) {
                    showToast(updateRes.message, 'success');
                    if (welcomeEl) welcomeEl.textContent = 'Welcome, ' + (updateRes.user.name || updateRes.user.username) + '!';
                } else {
                    showToast(updateRes.message || 'Error updating profile', 'error');
                }
                
                btn.textContent = originalText;
                btn.disabled = false;
            });
        }

        var passwordForm = document.getElementById('passwordForm');
        if (passwordForm) {
            passwordForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                var btn = document.getElementById('btnUpdatePassword');
                var originalText = btn.textContent;
                btn.textContent = 'Updating...';
                btn.disabled = true;

                var currentPassword = document.getElementById('currentPassword').value;
                var newPassword = document.getElementById('newPassword').value;
                var confirmPassword = document.getElementById('confirmPassword').value;

                if (!currentPassword || !newPassword || !confirmPassword) {
                    showToast('All password fields are required.', 'error');
                    btn.textContent = originalText;
                    btn.disabled = false;
                    return;
                }

                if (newPassword !== confirmPassword) {
                    showToast('New passwords do not match.', 'error');
                    btn.textContent = originalText;
                    btn.disabled = false;
                    return;
                }

                var passRes = await API.auth.updatePassword(currentPassword, newPassword, confirmPassword);
                if (passRes.success) {
                    showToast(passRes.message, 'success');
                    passwordForm.reset();
                } else {
                    showToast(passRes.message || 'Error updating password', 'error');
                }

                btn.textContent = originalText;
                btn.disabled = false;
            });
        }
    }

    // Execute renders
    if (dashboardData) {
        renderStats();
        renderActivity();
        renderRecentlyViewed();
        renderReadingProgress();
        renderAccountSecurity();
        populateBookmarkFilters();
        renderUserBookmarks();
        renderUserComments();
        initAccountSettings();
    }

});

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}
