// ============================================================
// GitGuide – Article Page JavaScript (Full-Stack Integrated)
// ============================================================
// Renders a single article based on URL parameter ?id=X.
// Handles: live backend loading, bookmarking, ratings, comments,
// FAQ accordion, and code block copy-to-clipboard.
// ============================================================

var currentArticleData = null;

// ---- INITIALIZE ARTICLE PAGE ----

document.addEventListener('DOMContentLoaded', async function () {
    var urlParams = new URLSearchParams(window.location.search);
    var articleId = parseInt(urlParams.get('id'));

    if (!articleId) {
        document.getElementById('articleNotFound').style.display = 'block';
        return;
    }

    var article = null;

    // Fetch live from API if available
    if (typeof API !== 'undefined' && API.articles) {
        var res = await API.articles.getById(articleId);
        if (res.success && res.data) {
            article = res.data;
        }
    }

    // Fallback to local data if offline
    if (!article && typeof articles !== 'undefined') {
        article = articles.find(function (a) { return a.id === articleId; });
    }

    if (!article) {
        document.getElementById('articleNotFound').style.display = 'block';
        return;
    }

    currentArticleData = article;
    document.title = article.title + ' – GitGuide';

    renderArticle(article);
    initReadingProgress();

    // Load media sidebar for this article (non-blocking)
    loadAndRenderArticleMedia(articleId);
});

// ---- READING PROGRESS ----
function initReadingProgress() {
    window.addEventListener('scroll', function () {
        var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var scrolled = (winScroll / height) * 100;
        var progressBar = document.getElementById('readingProgressBar');
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    });
}

// ============================================================
// LIGHTBOX FUNCTIONALITY
// ============================================================
window.openMediaLightbox = function(url, title) {
    var lightbox = document.getElementById('articleImageLightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'articleImageLightbox';
        lightbox.className = 'article-image-lightbox';
        
        var closeBtn = document.createElement('button');
        closeBtn.className = 'article-lightbox-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Close');
        
        var content = document.createElement('div');
        content.className = 'article-lightbox-content';
        
        var img = document.createElement('img');
        img.id = 'articleLightboxImage';
        
        content.appendChild(img);
        lightbox.appendChild(closeBtn);
        lightbox.appendChild(content);
        document.body.appendChild(lightbox);
        
        closeBtn.addEventListener('click', closeMediaLightbox);
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target === content) {
                closeMediaLightbox();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.style.display !== 'none') {
                closeMediaLightbox();
            }
        });
    }
    
    var imgEl = document.getElementById('articleLightboxImage');
    imgEl.src = url;
    imgEl.alt = title || 'Enlarged article image';
    
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

window.closeMediaLightbox = function() {
    var lightbox = document.getElementById('articleImageLightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
        var imgEl = document.getElementById('articleLightboxImage');
        if (imgEl) imgEl.src = '';
        document.body.style.overflow = '';
    }
};

// ---- RENDER ARTICLE ----

function renderArticle(article) {
    var page = document.getElementById('articlePage');
    if (!page) return;

    var html = '';

    html += '<div class="article-page-container">';
    html += '<div class="article-layout">';
    html += '<main class="article-main-content">';
    
    // Header
    html += '<div class="article-header">';
    html += '  <a href="search.html?category=' + encodeURIComponent(article.category) + '" class="article-back-btn">← Back to ' + article.category + '</a>';
    html += '  <h1 class="article-title">' + escapeHtml(article.title) + '</h1>';
    html += '  <div class="article-meta">';
    html += '    <span class="meta-item">📖 ' + (article.readingTime || '5 min') + '</span>';
    html += '    <span class="meta-item">✍️ ' + (article.author || 'GitGuide Team') + '</span>';
    html += '    <span class="meta-item">' + article.difficulty + '</span>';
    html += '  </div>';
    html += '</div>';

    // Steps
    if (article.steps && article.steps.length > 0) {
        article.steps.forEach(function (step) {
            html += '<div class="article-section" style="margin-bottom: 4rem; font-size: 1.15rem; line-height: 1.8;">';
            html += '  <h2 style="margin-bottom: 1.5rem; font-size: 2rem;">' + step.title + '</h2>';

            var paragraphs = (step.content || '').split('\n');
            paragraphs.forEach(function (para) {
                if (para.trim()) {
                    html += '  <p style="margin-bottom: 1.5rem; color: var(--text);">' + para + '</p>';
                }
            });

            if (step.command) {
                html += '  <div class="code-block" style="position: relative; background: var(--code-bg); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; margin-top: 2rem; margin-bottom: 2rem;">';
                html += '    <div class="panel-header dark"><div class="dots"><span></span><span></span><span></span></div><div class="panel-title">bash</div></div>';
                html += '    <button class="copy-btn-overlay" onclick="copyToClipboard(\'' + escapeForJs(step.command) + '\', this)" aria-label="Copy code" style="position:absolute; right:1rem; top:3.5rem; background:var(--surface); border:1px solid var(--border); border-radius:4px; padding:0.4rem; color:var(--text); cursor:pointer;">';
                html += '      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
                html += '        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>';
                html += '        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>';
                html += '      </svg>';
                html += '    </button>';
                html += '    <pre style="color: var(--code-text); padding: 1.5rem; font-family: monospace; font-size: 1rem; overflow-x: auto;"><span class="token-prompt">$</span> ' + escapeHtml(step.command) + '</pre>';
                html += '  </div>';
            }
            html += '</div>';
        });
    }

    // Article Tools (Bookmark, Rating, Commands Used)
    html += '<div class="article-tools" style="display:flex; flex-wrap:wrap; gap: 2rem; justify-content: space-between; margin: 4rem 0; padding: 3rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg);">';
    
    // Bookmark
    var bookmarked = article.isBookmarked !== undefined ? article.isBookmarked : isBookmarked(article.id);
    html += '  <div class="tool-box" style="flex:1; min-width: 200px; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">';
    html += '    <div style="font-size:0.9rem; color:var(--text-muted); margin-bottom: 1rem; text-transform:uppercase; letter-spacing:0.05em; font-weight:700;">Save for later</div>';
    html += '    <button class="btn ' + (bookmarked ? 'btn-primary' : 'btn-secondary') + '" id="bookmarkBtn" style="width: 100%; max-width: 250px; justify-content: center;">';
    html += bookmarked 
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:0.5rem;"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg> Bookmarked' 
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:0.5rem;"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg> Bookmark Guide';
    html += '    </button>';
    html += '  </div>';

    // Rating
    var currentRating = article.ratings ? (article.ratings.userRating || 0) : getRating(article.id);
    var avgRating = article.ratings ? article.ratings.average : 0;
    var totalRatings = article.ratings ? article.ratings.total : 0;

    html += '  <div class="tool-box" style="flex:1; min-width: 200px; border-left: 1px solid var(--border); border-right: 1px solid var(--border); padding: 0 2rem; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">';
    html += '    <div style="font-size:0.9rem; color:var(--text-muted); margin-bottom: 1rem; text-transform:uppercase; letter-spacing:0.05em; font-weight:700;">Rate this guide</div>';
    html += '    <div class="star-rating" id="starRating" style="display:flex; justify-content:center; gap:0.25rem; font-size:1.75rem; margin-bottom: 0.5rem;">';
    for (var i = 1; i <= 5; i++) {
        var filled = i <= currentRating ? 'filled' : '';
        html += '      <button class="star ' + filled + '" data-rating="' + i + '" style="background:none; border:none; cursor:pointer; color: ' + (i <= currentRating ? '#FFBD2E' : 'var(--border)') + '; transition:color 0.2s;">★</button>';
    }
    html += '    </div>';
    html += '    <div class="rating-text" id="ratingText" style="font-size:0.85rem; color:var(--text-muted);">';
    if (currentRating > 0) {
        html += 'Your rating: ' + currentRating + '/5 (Avg: ' + avgRating + ' ★)';
    } else if (totalRatings > 0) {
        html += 'Community: ' + avgRating + '/5 ★ (' + totalRatings + ' votes)';
    } else {
        html += 'Select a rating';
    }
    html += '    </div>';
    html += '  </div>';

    // Related Commands
    html += '  <div class="tool-box" style="flex:1; min-width: 200px; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">';
    if (article.commands && article.commands.length > 0) {
        html += '    <div style="font-size:0.9rem; color:var(--text-muted); margin-bottom: 1rem; text-transform:uppercase; letter-spacing:0.05em; font-weight:700;">Commands Used</div>';
        html += '    <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:0.5rem;">';
        article.commands.forEach(function (cmd) {
            html += '      <a href="commands.html" class="search-pill">' + cmd + '</a>';
        });
        html += '    </div>';
    } else {
        html += '    <div style="font-size:0.9rem; color:var(--text-muted); margin-bottom: 1rem; text-transform:uppercase; letter-spacing:0.05em; font-weight:700;">Commands Used</div>';
        html += '    <span style="color: var(--text-lighter); font-size: 0.9rem;">None</span>';
    }
    html += '  </div>';
    html += '</div>';

    // FAQ Section
    if (article.faqs && article.faqs.length > 0) {
        html += '<div class="faq-section" style="margin-bottom: 4rem;">';
        html += '  <h2 style="margin-bottom:2rem; font-size: 2rem;">Frequently Asked Questions</h2>';
        article.faqs.forEach(function (faq, index) {
            html += '<div class="faq-item" id="faq-' + index + '" style="border-bottom: 1px solid var(--border); padding-bottom: 1.5rem; margin-bottom: 1.5rem;">';
            html += '  <button class="faq-question" onclick="toggleFaq(' + index + ')" style="width:100%; display:flex; justify-content:space-between; align-items:center; background:none; border:none; color:var(--text); font-weight:600; font-size:1.15rem; cursor:pointer; padding:0.5rem 0;">';
            html += '    <span style="text-align:left;">' + faq.question + '</span>';
            html += '    <span class="faq-icon" style="color:var(--primary); transition:transform 0.3s;">▼</span>';
            html += '  </button>';
            html += '  <div class="faq-answer" style="display:none; padding-top:1rem; color:var(--text-muted); line-height:1.7; font-size: 1.05rem;">';
            html += '    <div class="faq-answer-inner">' + faq.answer + '</div>';
            html += '  </div>';
            html += '</div>';
        });
        html += '</div>';
    }

    // Comments Section
    html += '<div class="comments-section" style="padding-top: 4rem; border-top: 1px solid var(--border); margin-bottom: 6rem;">';
    html += '  <h2 style="margin-bottom:2rem; font-size: 2rem;">Comments</h2>';

    html += '  <div class="comment-form" style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:2rem; margin-bottom:3rem;">';
    html += '    <div class="form-group" style="margin-bottom:1.5rem;">';
    html += '      <label for="commentName" style="display:block; margin-bottom:0.5rem; font-weight:600;">Your Name</label>';
    html += '      <input type="text" class="form-input" id="commentName" placeholder="Enter your name" style="width:100%; padding:0.75rem; background:var(--background); border:1px solid var(--border); border-radius:4px; color:var(--text);">';
    html += '    </div>';
    html += '    <div class="form-group" style="margin-bottom:1.5rem;">';
    html += '      <label for="commentText" style="display:block; margin-bottom:0.5rem; font-weight:600;">Your Comment</label>';
    html += '      <textarea class="form-textarea" id="commentText" placeholder="Share your thoughts or questions..." style="width:100%; padding:0.75rem; background:var(--background); border:1px solid var(--border); border-radius:4px; color:var(--text); min-height:120px;"></textarea>';
    html += '    </div>';
    html += '    <button class="btn btn-primary" id="submitComment">Submit Comment</button>';
    html += '  </div>';

    html += '  <div class="comment-list" id="commentList"></div>';
    html += '</div>';

    html += '</main>'; // close .article-main-content
    // Media sidebar placeholder (populated async)
    html += '<aside class="article-media-sidebar" id="articleMediaSidebar"></aside>';

    html += '</div>'; // close .article-layout
    html += '</div>'; // close .container

    page.innerHTML = html;


    // Prefill name if user logged in
    var loggedUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    if (loggedUser) {
        var nameInput = document.getElementById('commentName');
        if (nameInput) {
            nameInput.value = loggedUser.username;
        }
    }

    // Attach Event Listeners
    attachArticleEventListeners(article);

    // Render Comments
    renderComments(article.id, article.comments);
}

// ---- ATTACH EVENT LISTENERS ----

function attachArticleEventListeners(article) {
    // Bookmark button
    var bookmarkBtn = document.getElementById('bookmarkBtn');
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', async function () {
            var user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
            if (!user) {
                showToast('Please login to bookmark articles.', 'error');
                return;
            }

            var nowBookmarked = false;
            if (typeof API !== 'undefined' && API.bookmarks && API.getToken()) {
                var res = await API.bookmarks.toggle(article.id);
                if (res.success) {
                    nowBookmarked = res.bookmarked;
                } else {
                    nowBookmarked = toggleBookmark(article.id);
                }
            } else {
                nowBookmarked = toggleBookmark(article.id);
            }

            if (nowBookmarked) {
                bookmarkBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:0.5rem;"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg> Bookmarked';
                bookmarkBtn.className = 'btn btn-primary';
                showToast('Article bookmarked!', 'success');
            } else {
                bookmarkBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:0.5rem;"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg> Bookmark Guide';
                bookmarkBtn.className = 'btn btn-secondary';
                showToast('Bookmark removed.', 'success');
            }
        });
    }

    // Star rating
    var stars = document.querySelectorAll('#starRating .star');
    stars.forEach(function (star) {
        star.addEventListener('click', async function () {
            var user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
            if (!user) {
                showToast('Please login to rate articles.', 'error');
                return;
            }
            var rating = parseInt(star.getAttribute('data-rating'));

            if (typeof API !== 'undefined' && API.ratings && API.getToken()) {
                var res = await API.ratings.set(article.id, rating);
                if (res.success && res.data) {
                    var ratingText = document.getElementById('ratingText');
                    if (ratingText) {
                        ratingText.textContent = 'Your rating: ' + rating + '/5 (Avg: ' + res.data.averageRating + ' ★)';
                    }
                }
            } else {
                setRating(article.id, rating);
                var ratingText = document.getElementById('ratingText');
                if (ratingText) {
                    ratingText.textContent = 'Your rating: ' + rating + '/5';
                }
            }

            stars.forEach(function (s) {
                var sRating = parseInt(s.getAttribute('data-rating'));
                if (sRating <= rating) {
                    s.classList.add('filled');
                    s.style.color = '#FFBD2E';
                } else {
                    s.classList.remove('filled');
                    s.style.color = 'var(--border)';
                }
            });

            showToast('Rated ' + rating + '/5 stars!', 'success');
        });
    });

    // Comment submission
    var submitBtn = document.getElementById('submitComment');
    if (submitBtn) {
        submitBtn.addEventListener('click', async function () {
            var user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
            if (!user) {
                showToast('Please login to post a comment.', 'error');
                return;
            }
            var nameInput = document.getElementById('commentName');
            var textInput = document.getElementById('commentText');
            var name = nameInput.value.trim() || user.username;
            var text = textInput.value.trim();

            if (!name) {
                showToast('Please enter your name.', 'error');
                return;
            }
            if (!text) {
                showToast('Please enter a comment.', 'error');
                return;
            }

            if (typeof API !== 'undefined' && API.comments) {
                var res = await API.comments.add(article.id, text, name);
                if (res.success) {
                    textInput.value = '';
                    showToast('Comment added successfully!', 'success');
                    await renderComments(article.id);
                    return;
                }
            }

            // Fallback
            addComment(article.id, name, text);
            textInput.value = '';
            showToast('Comment added successfully!', 'success');
            renderComments(article.id);
        });
    }
}

// ---- RENDER COMMENTS ----

async function renderComments(articleId, preloadedComments) {
    var list = document.getElementById('commentList');
    if (!list) return;

    var comments = preloadedComments || [];

    if (!preloadedComments && typeof API !== 'undefined' && API.comments) {
        var res = await API.comments.getByArticle(articleId);
        if (res.success && Array.isArray(res.data)) {
            comments = res.data;
        }
    }

    if (comments.length === 0) {
        comments = getComments(articleId);
    }

    if (comments.length === 0) {
        list.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 1rem;">No comments yet. Be the first to share your thoughts!</p>';
        return;
    }

    var html = '';
    var reversed = comments.slice().reverse();

    reversed.forEach(function (comment) {
        html += '<div class="comment-item">';
        html += '  <div class="comment-header">';
        html += '    <span class="comment-author">' + escapeHtml(comment.name) + '</span>';
        html += '    <span class="comment-date">' + (comment.date || 'Recently') + '</span>';
        html += '  </div>';
        html += '  <p class="comment-text">' + escapeHtml(comment.text) + '</p>';
        html += '</div>';
    });

    list.innerHTML = html;
}

// ---- FAQ ACCORDION ----

function toggleFaq(index) {
    var faqItem = document.getElementById('faq-' + index);
    if (!faqItem) return;

    var answer = faqItem.querySelector('.faq-answer');
    var isOpen = faqItem.classList.contains('open');

    if (isOpen) {
        faqItem.classList.remove('open');
        answer.style.display = 'none';
    } else {
        faqItem.classList.add('open');
        answer.style.display = 'block';
    }
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

function escapeForJs(text) {
    return (text || '')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '');
}

// ============================================================
// MEDIA SIDEBAR – Load & Render article-specific media
// ============================================================

async function loadAndRenderArticleMedia(articleId) {
    var sidebar = document.getElementById('articleMediaSidebar');
    if (!sidebar) return;

    try {
        var res = null;
        if (typeof API !== 'undefined' && API.media) {
            res = await API.media.getByArticle(articleId);
        }

        if (!res || !res.success || !Array.isArray(res.data) || res.data.length === 0) {
            sidebar.style.display = 'block';
            var layout = document.querySelector('.article-layout');
            if (layout) layout.classList.remove('no-sidebar');
            sidebar.innerHTML = '<div class="article-media-section"><h3>Attached Media</h3><p style="color:var(--text-muted); font-size:0.9rem;">No media available for this article yet.</p></div>';
            return;
        }
        var media = res.data;

        var videos = media.filter(function (m) { return m.media_type === 'video'; });
        var images = media.filter(function (m) { return m.media_type === 'image'; });
        var urls   = media.filter(function (m) { return m.media_type === 'url'; });

        if (videos.length === 0 && images.length === 0 && urls.length === 0) {
            sidebar.style.display = 'block';
            var layout = document.querySelector('.article-layout');
            if (layout) layout.classList.remove('no-sidebar');
            sidebar.innerHTML = '<div class="article-media-section"><h3>Attached Media</h3><p style="color:var(--text-muted); font-size:0.9rem;">No media available for this article yet.</p></div>';
            return;
        }
        var shtml = '';

        // ---- Featured Videos ----
        if (videos.length > 0) {
            shtml += '<div class="article-media-section video-section">';
            shtml += '  <h3>Featured Videos</h3>';
            videos.forEach(function (v) {
                shtml += '  <div class="featured-video-card">';
                shtml += '    <video controls preload="metadata" playsinline>';
                shtml += '      <source src="' + escapeHtml(v.media_url) + '"' + (v.mime_type ? ' type="' + escapeHtml(v.mime_type) + '"' : '') + '>';
                shtml += '      Your browser does not support the video tag.';
                shtml += '    </video>';
                if (v.file_name) {
                    shtml += '    <div class="featured-video-label">' + escapeHtml(v.file_name) + '</div>';
                }
                shtml += '  </div>';
            });
            shtml += '</div>';
        }

        // ---- Featured Images ----
        if (images.length > 0) {
            shtml += '<div class="article-media-section image-section">';
            shtml += '  <h3>Featured Images</h3>';
            shtml += '  <div class="article-image-list">';
            images.forEach(function (img) {
                shtml += '    <div class="featured-image-card" onclick="openMediaLightbox(\'' + escapeForJs(img.media_url) + '\', \'' + escapeForJs(img.file_name || '') + '\')">';
                shtml += '      <img src="' + escapeHtml(img.media_url) + '" alt="' + escapeHtml(img.file_name || 'Article image') + '" loading="lazy">';
                shtml += '      <div class="image-card-overlay"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg></div>';
                shtml += '    </div>';
            });
            shtml += '  </div>';
            shtml += '</div>';
        }

        // ---- Useful Links ----
        if (urls.length > 0) {
            shtml += '<div class="article-media-section links-section">';
            shtml += '  <h3>Useful Links</h3>';
            urls.forEach(function (u) {
                var displayUrl = u.media_url || '';
                var shortLabel = displayUrl;
                try {
                    var parsed = new URL(displayUrl);
                    shortLabel = parsed.hostname + (parsed.pathname !== '/' ? parsed.pathname : '');
                    if (shortLabel.length > 45) shortLabel = shortLabel.substring(0, 42) + '...';
                } catch (e) { /* keep raw */ }

                shtml += '  <a href="' + escapeHtml(u.media_url) + '" target="_blank" rel="noopener noreferrer" class="featured-link-card">';
                shtml += '    <span class="featured-link-text">' + escapeHtml(shortLabel) + '</span>';
                shtml += '    <svg class="featured-link-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>';
                shtml += '  </a>';
            });
            shtml += '</div>';
        }

        sidebar.innerHTML = shtml;

    } catch (err) {
        console.warn('[ArticleMedia] Failed to load media sidebar:', err);
        if (sidebar) {
            sidebar.style.display = 'block';
            var layout = document.querySelector('.article-layout');
            if (layout) layout.classList.remove('no-sidebar');
            sidebar.innerHTML = '<div class="article-media-section"><h3>Attached Media</h3><p style="color:var(--text-muted); font-size:0.9rem;">No media available for this article yet.</p></div>';
        }
    }
}

// ---- LIGHTBOX ----

function openMediaLightbox(src, caption) {
    // Remove existing lightbox if any
    var existing = document.getElementById('mediaLightbox');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = 'mediaLightbox';
    overlay.className = 'media-lightbox-overlay';
    overlay.innerHTML =
        '<div class="media-lightbox-content">' +
        '  <button class="media-lightbox-close" aria-label="Close lightbox">&times;</button>' +
        '  <img src="' + src + '" alt="' + (caption || 'Image') + '">' +
        (caption ? '  <div class="media-lightbox-caption">' + escapeHtml(caption) + '</div>' : '') +
        '</div>';

    document.body.appendChild(overlay);

    // Trigger reflow for animation
    requestAnimationFrame(function () {
        overlay.classList.add('active');
    });

    // Close handlers
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeMediaLightbox();
    });
    overlay.querySelector('.media-lightbox-close').addEventListener('click', closeMediaLightbox);

    document.addEventListener('keydown', lightboxEscHandler);
}

function closeMediaLightbox() {
    var overlay = document.getElementById('mediaLightbox');
    if (!overlay) return;
    overlay.classList.remove('active');
    setTimeout(function () { overlay.remove(); }, 250);
    document.removeEventListener('keydown', lightboxEscHandler);
}

function lightboxEscHandler(e) {
    if (e.key === 'Escape') closeMediaLightbox();
}
