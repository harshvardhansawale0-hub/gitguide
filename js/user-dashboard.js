// ============================================================
// GitGuide – User Dashboard JavaScript (Full-Stack Integrated)
// ============================================================
// Displays the authenticated user's bookmarked guides,
// comment history, and account metrics from the backend API.
// ============================================================

document.addEventListener('DOMContentLoaded', async function () {
    var user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

    // Secure the page - redirect guests to login
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Redirect admins to the admin dashboard
    if (user.role === 'admin') {
        window.location.href = 'dashboard.html';
        return;
    }

    // Set Welcome Name
    var welcomeEl = document.getElementById('welcomeName');
    if (welcomeEl) {
        welcomeEl.textContent = 'Welcome, ' + (user.name || user.username) + '!';
    }

    var dashboardData = null;
    if (typeof API !== 'undefined' && API.dashboard && API.getToken()) {
        var res = await API.dashboard.getUserDashboard();
        if (res.success && res.data) {
            dashboardData = res.data;
        }
    }

    renderUserBookmarks(dashboardData ? dashboardData.bookmarks : null);
    renderUserComments(user.username, dashboardData ? dashboardData.comments : null);
});

// Render the user's bookmarked articles
function renderUserBookmarks(preloadedBookmarks) {
    var grid = document.getElementById('userBookmarksGrid');
    if (!grid) return;

    var bookmarksList = preloadedBookmarks || [];

    if (!preloadedBookmarks) {
        var bookmarkIds = getBookmarks();
        if (typeof articles !== 'undefined') {
            bookmarkIds.forEach(function (id) {
                var art = articles.find(function (a) { return a.id === id; });
                if (art) bookmarksList.push(art);
            });
        }
    }

    if (bookmarksList.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1 / -1; color: var(--text-light); text-align: center; padding: 2rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg);">You have not bookmarked any guides yet.</div>';
        return;
    }

    var html = '';
    bookmarksList.forEach(function (article) {
        html += '<div class="article-card" style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:1.5rem; display:flex; flex-direction:column; justify-content:space-between;">';
        html += '  <div>';
        html += '    <h3 style="margin-bottom:0.75rem;"><a href="article.html?id=' + article.id + '" style="color:var(--text); text-decoration:none;">' + article.title + '</a></h3>';
        html += '    <p class="card-description" style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1rem; line-height:1.5;">' + article.description + '</p>';
        html += '    <div class="card-meta" style="margin-bottom:1.5rem; display:flex; gap:0.5rem;">';
        html += '      <span class="badge badge-category">' + article.category + '</span>';
        html += '      <span class="badge ' + getDifficultyClass(article.difficulty) + '">' + article.difficulty + '</span>';
        html += '    </div>';
        html += '  </div>';
        html += '  <div class="card-footer" style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border); padding-top:1rem;">';
        html += '    <span class="read-time" style="color:var(--text-muted); font-size:0.85rem;">📖 ' + (article.readingTime || '5 min') + '</span>';
        html += '    <a href="article.html?id=' + article.id + '" class="btn btn-primary btn-sm">Read Guide</a>';
        html += '  </div>';
        html += '</div>';
    });

    grid.innerHTML = html;
}

// Render the user's comments across all articles
function renderUserComments(username, preloadedComments) {
    var container = document.getElementById('userCommentsList');
    if (!container) return;

    var myComments = preloadedComments || [];

    if (!preloadedComments) {
        var commentsData = localStorage.getItem('gitguide_comments');
        if (commentsData && typeof articles !== 'undefined') {
            var parsed = JSON.parse(commentsData);
            for (var articleId in parsed) {
                parsed[articleId].forEach(function (comment) {
                    if (comment.name.toLowerCase() === username.toLowerCase()) {
                        var article = articles.find(function (a) { return a.id === parseInt(articleId); });
                        myComments.push({
                            articleTitle: article ? article.title : 'Article #' + articleId,
                            articleId: articleId,
                            text: comment.text,
                            date: comment.date
                        });
                    }
                });
            }
        }
    }

    if (myComments.length === 0) {
        container.innerHTML = '<div style="color: var(--text-light); text-align: center; padding: 2rem; background: var(--surface); border:1px solid var(--border); border-radius: var(--radius-lg);">You haven\'t posted any comments yet.</div>';
        return;
    }

    var html = '';
    myComments.forEach(function (comment) {
        html += '<div class="comment-item" style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:1.25rem; margin-bottom:1rem;">';
        html += '  <div class="comment-header" style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">';
        html += '    <span class="comment-author" style="font-weight:600;">On <a href="article.html?id=' + comment.articleId + '" style="color:var(--primary);">' + comment.articleTitle + '</a></span>';
        html += '    <span class="comment-date" style="color:var(--text-muted); font-size:0.85rem;">' + (comment.date || 'Recently') + '</span>';
        html += '  </div>';
        html += '  <p class="comment-text" style="color:var(--text); margin:0; line-height:1.5;">' + escapeHtml(comment.text) + '</p>';
        html += '</div>';
    });

    container.innerHTML = html;
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}
