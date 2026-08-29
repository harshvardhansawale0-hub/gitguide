// ============================================================
// GitGuide – Shared JavaScript
// ============================================================
// This file contains functionality used across ALL pages:
// - Navigation (hamburger menu, active page)
// - Toast notifications
// - localStorage helpers for bookmarks, ratings, comments
// - Home page rendering (categories, trending articles)
// - Search suggestions
// ============================================================

// ---- NAVIGATION ----

// Initialize the mobile hamburger menu and highlight the active page link.
function initNavigation() {
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('navLinks');

    if (navLinks) {
        // Build dynamic navigation based on auth state
        var user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
        var html = '<a href="index.html">Home</a>' +
                   '<a href="search.html">Search</a>' +
                   '<a href="commands.html">Commands</a>' +
                   '<a href="troubleshooting.html">Troubleshooting</a>';

        if (user) {
            if (user.role === 'admin') {
                html += '<a href="dashboard.html">Admin Dashboard</a>';
            } else {
                html += '<a href="user-dashboard.html">User Dashboard</a>';
            }
            html += '<a href="#" onclick="if(typeof logoutUser === \'function\') logoutUser(); return false;">Logout</a>';
        } else {
            html += '<a href="login.html">Login</a>';
        }
        
        // Add theme toggle button
        html += '<button class="theme-toggle" id="themeToggle" aria-label="Toggle Dark Mode" title="Toggle Dark Mode">☾</button>';

        navLinks.innerHTML = html;
    }

    // Toggle the mobile menu when hamburger is clicked
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        var links = navLinks.querySelectorAll('a');
        links.forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // Highlight the current page in the navigation
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var allNavLinks = document.querySelectorAll('.navbar-links a');
    allNavLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// ---- TOAST NOTIFICATIONS ----

// Show a small notification message at the bottom-right corner.
function showToast(message, type) {
    // type can be 'success' or 'error' (default: success)
    type = type || 'success';

    // Create the toast container if it doesn't exist
    var container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Create the toast element
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = message;
    container.appendChild(toast);

    // Remove the toast after 3 seconds
    setTimeout(function () {
        toast.classList.add('toast-out');
        setTimeout(function () {
            toast.remove();
        }, 300);
    }, 3000);
}

// ---- LOCALSTORAGE & API HELPERS ----

// -- Bookmarks --
function getBookmarks() {
    var bookmarks = localStorage.getItem('gitguide_bookmarks');
    if (bookmarks) {
        return JSON.parse(bookmarks);
    }
    return [];
}

async function toggleBookmarkAsync(articleId) {
    if (typeof API !== 'undefined' && API.bookmarks && API.getToken()) {
        var res = await API.bookmarks.toggle(articleId);
        if (res.success) {
            return res.bookmarked;
        }
    }
    return toggleBookmark(articleId);
}

function toggleBookmark(articleId) {
    var bookmarks = getBookmarks();
    var index = bookmarks.indexOf(articleId);

    if (index > -1) {
        bookmarks.splice(index, 1);
        localStorage.setItem('gitguide_bookmarks', JSON.stringify(bookmarks));
        return false;
    } else {
        bookmarks.push(articleId);
        localStorage.setItem('gitguide_bookmarks', JSON.stringify(bookmarks));
        return true;
    }
}

function isBookmarked(articleId) {
    var bookmarks = getBookmarks();
    return bookmarks.indexOf(articleId) > -1;
}

// -- Ratings --
function getRating(articleId) {
    var ratings = localStorage.getItem('gitguide_ratings');
    if (ratings) {
        var parsed = JSON.parse(ratings);
        return parsed[articleId] || 0;
    }
    return 0;
}

async function setRatingAsync(articleId, rating) {
    if (typeof API !== 'undefined' && API.ratings && API.getToken()) {
        var res = await API.ratings.set(articleId, rating);
        if (res.success) {
            setRating(articleId, rating);
            return res.data;
        }
    }
    setRating(articleId, rating);
    return null;
}

function setRating(articleId, rating) {
    var ratings = localStorage.getItem('gitguide_ratings');
    var parsed = ratings ? JSON.parse(ratings) : {};
    parsed[articleId] = rating;
    localStorage.setItem('gitguide_ratings', JSON.stringify(parsed));
}

// -- Comments --
function getComments(articleId) {
    var comments = localStorage.getItem('gitguide_comments');
    if (comments) {
        var parsed = JSON.parse(comments);
        return parsed[articleId] || [];
    }
    return [];
}

async function addCommentAsync(articleId, name, text) {
    if (typeof API !== 'undefined' && API.comments) {
        var res = await API.comments.add(articleId, text, name);
        if (res.success) {
            addComment(articleId, name, text);
            return res.data;
        }
    }
    addComment(articleId, name, text);
    return null;
}

function addComment(articleId, name, text) {
    var comments = localStorage.getItem('gitguide_comments');
    var parsed = comments ? JSON.parse(comments) : {};

    if (!parsed[articleId]) {
        parsed[articleId] = [];
    }

    parsed[articleId].push({
        name: name,
        text: text,
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    });

    localStorage.setItem('gitguide_comments', JSON.stringify(parsed));
}

// ---- COPY TO CLIPBOARD ----

function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(function () {
        if (button) {
            var originalText = button.textContent;
            button.textContent = 'Copied!';
            button.classList.add('copied');
            setTimeout(function () {
                button.textContent = originalText;
                button.classList.remove('copied');
            }, 2000);
        }
        showToast('Copied to clipboard!', 'success');
    }).catch(function () {
        showToast('Failed to copy. Please copy manually.', 'error');
    });
}

// ---- DIFFICULTY BADGE HELPER ----

function getDifficultyClass(difficulty) {
    switch ((difficulty || '').toLowerCase()) {
        case 'beginner': return 'badge-beginner';
        case 'intermediate': return 'badge-intermediate';
        case 'advanced': return 'badge-advanced';
        default: return 'badge-beginner';
    }
}

// ---- HOME PAGE FUNCTIONS ----

async function renderCategories() {
    var grid = document.getElementById('categoryGrid');
    if (!grid) return;

    var catList = typeof categories !== 'undefined' ? categories : [];

    if (typeof API !== 'undefined' && API.categories) {
        var res = await API.categories.getAll();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            catList = res.data;
        }
    }

    var html = '';
    catList.forEach(function (cat, index) {
        var num = (index + 1).toString().padStart(2, '0');
        var iconHtml = cat.icon || '📁';
        html += '<a href="search.html?category=' + encodeURIComponent(cat.name) + '" class="category-editorial-item reveal">';
        html += '  <div class="cat-number">' + num + '</div>';
        html += '  <div class="cat-content">';
        html += '    <div class="cat-icon">' + iconHtml + '</div>';
        html += '    <div class="cat-text">';
        html += '      <h3>' + cat.name + '</h3>';
        html += '      <p>' + (cat.description || '') + '</p>';
        html += '    </div>';
        html += '  </div>';
        html += '  <div class="cat-arrow">→</div>';
        html += '</a>';
    });

    grid.innerHTML = html;
    initScrollObserver();
}

async function renderTrendingArticles() {
    var feed = document.getElementById('trendingFeed') || document.getElementById('trendingGrid');
    if (!feed) return;

    var trendingList = [];

    if (typeof API !== 'undefined' && API.articles) {
        var res = await API.articles.getTrending();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            trendingList = res.data;
        }
    }

    if (trendingList.length === 0 && typeof articles !== 'undefined') {
        var ids = typeof trendingArticleIds !== 'undefined' ? trendingArticleIds : [1, 2, 3, 4, 5, 6];
        ids.forEach(function (id) {
            var art = articles.find(function (a) { return a.id === id; });
            if (art) trendingList.push(art);
        });
    }

    var html = '';
    trendingList.forEach(function (article, index) {
        var num = (index + 1).toString().padStart(2, '0');
        html += '<a href="article.html?id=' + article.id + '" class="trending-feed-item reveal">';
        html += '  <div class="feed-number">' + num + '</div>';
        html += '  <div class="feed-content">';
        html += '    <h3>' + article.title + '</h3>';
        html += '    <div class="feed-meta">' + article.category + ' &middot; ' + article.difficulty + ' &middot; ' + article.readingTime + '</div>';
        html += '  </div>';
        html += '  <div class="feed-arrow">→</div>';
        html += '</a>';
    });

    feed.innerHTML = html;
    initScrollObserver();
}

// ---- SEARCH SUGGESTIONS (Home Page Hero) ----

function initSearchSuggestions() {
    var searchInput = document.getElementById('heroSearch');
    var suggestionsBox = document.getElementById('searchSuggestions');

    if (!searchInput || !suggestionsBox) return;

    var debounceTimer = null;

    searchInput.addEventListener('input', function () {
        var query = searchInput.value.trim().toLowerCase();

        if (query.length < 2) {
            suggestionsBox.classList.remove('active');
            return;
        }

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async function () {
            var matches = [];

            if (typeof API !== 'undefined' && API.articles) {
                var res = await API.articles.getSuggestions(query);
                if (res.success && Array.isArray(res.data) && res.data.length > 0) {
                    matches = res.data;
                }
            }

            if (matches.length === 0 && typeof articles !== 'undefined') {
                matches = articles.filter(function (article) {
                    return article.title.toLowerCase().includes(query) ||
                           article.category.toLowerCase().includes(query) ||
                           article.description.toLowerCase().includes(query);
                }).slice(0, 5);
            }

            if (matches.length === 0) {
                suggestionsBox.classList.remove('active');
                return;
            }

            var html = '';
            matches.forEach(function (article) {
                html += '<a href="article.html?id=' + article.id + '">' + article.title + '</a>';
            });
            suggestionsBox.innerHTML = html;
            suggestionsBox.classList.add('active');
        }, 150);
    });

    document.addEventListener('click', function (e) {
        if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.classList.remove('active');
        }
    });
}

// ---- HERO SEARCH FORM ----

function initHeroSearch() {
    var form = document.getElementById('heroSearchForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var query = document.getElementById('heroSearch').value.trim();
        if (query) {
            window.location.href = 'search.html?q=' + encodeURIComponent(query);
        }
    });
}

// ---- DARK MODE ----
function initTheme() {
    var toggleBtn = document.getElementById('themeToggle');
    var currentTheme = localStorage.getItem('gitguide_theme') || 'light';
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (toggleBtn) toggleBtn.textContent = '☀';
    } else {
        document.documentElement.removeAttribute('data-theme');
        if (toggleBtn) toggleBtn.textContent = '☾';
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            var theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('gitguide_theme', 'light');
                toggleBtn.textContent = '☾';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('gitguide_theme', 'dark');
                toggleBtn.textContent = '☀';
            }
        });
    }
}

// ---- SCROLL ANIMATIONS (Intersection Observer) ----
function initScrollObserver() {
    var observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    var observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    var revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(function(el, index) {
        observer.observe(el);
    });
}

// ---- THEME TOGGLE ----
function initTheme() {
    var toggleBtn = document.getElementById('themeToggle');
    var currentTheme = localStorage.getItem('gitguide_theme') || 'dark';

    // Apply the saved theme immediately
    if (currentTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        if(toggleBtn) toggleBtn.textContent = '☀';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        if(toggleBtn) toggleBtn.textContent = '☾';
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            var theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('gitguide_theme', 'light');
                toggleBtn.textContent = '☀';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('gitguide_theme', 'dark');
                toggleBtn.textContent = '☾';
            }
        });
    }
}

// ---- NAVBAR SCROLL SHADOW ----
function initNavbarScroll() {
    var navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 10) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// ---- KEYBOARD SHORTCUTS ----
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl + K to focus search
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            var heroSearch = document.getElementById('heroSearch');
            if (heroSearch) {
                heroSearch.focus();
            } else {
                window.location.href = 'search.html';
            }
        }
    });
}

// ---- HOME PARALLAX & ANIMATIONS ----
function initHeroParallax() {
    var heroSection = document.querySelector('.hero-editorial');
    var mainPanel = document.querySelector('.main-panel');
    var secondaryPanel = document.querySelector('.secondary-panel');
    
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (heroSection && mainPanel && secondaryPanel && !prefersReducedMotion) {
        if (window.innerWidth <= 768) return;
        
        heroSection.addEventListener('mousemove', function(e) {
            var x = (e.clientX / window.innerWidth) - 0.5;
            // The floatUI animation uses translateY, so we animate translateX
            // But combining transforms can conflict. Instead, we use marginLeft or left for parallax to avoid CSS transform conflicts.
            mainPanel.style.marginLeft = (x * -20) + 'px';
            secondaryPanel.style.marginLeft = (x * 10) + 'px';
        });
        
        heroSection.addEventListener('mouseleave', function() {
            mainPanel.style.marginLeft = '0px';
            secondaryPanel.style.marginLeft = '0px';
        });
    }
}

function initHomeCommandBuilder() {
    var select = document.getElementById('homeCommandSelect');
    var preview = document.getElementById('homeCommandPreview');
    
    if (select && preview) {
        select.addEventListener('change', function() {
            var newValue = this.value;
            
            preview.style.opacity = '0';
            preview.style.transform = 'translateY(6px)';
            
            setTimeout(function() {
                preview.textContent = newValue;
                preview.style.opacity = '1';
                preview.style.transform = 'translateY(0)';
            }, 200);
        });
    }
}

// ---- INITIALIZE ON PAGE LOAD ----

// Run shared initialization when the page loads.
document.addEventListener('DOMContentLoaded', function () {
    // Add page load animations
    var navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.animation = 'fadeDown 0.5s ease forwards';
    }
    
    initNavigation();
    initTheme();
    initNavbarScroll();
    initKeyboardShortcuts();

    // Home page specific initialization (Must be before initScrollObserver)
    if (document.getElementById('categoryGrid')) {
        renderCategories();
    }
    
    var trendingFeed = document.getElementById('trendingFeed') || document.getElementById('trendingGrid');
    if (trendingFeed) {
        renderTrendingArticles();
    }
    
    if (document.querySelector('.hero-editorial')) {
        initHeroParallax();
        initHomeCommandBuilder();
    }

    // Initialize IntersectionObserver last so all dynamic content is observed
    initScrollObserver();
});


async function sendMessage(message) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  const data = await res.json();
  return data.reply;
}