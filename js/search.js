// ============================================================
// GitGuide – Search Page JavaScript (Full-Stack Integrated & Fully Responsive)
// ============================================================
// Handles search filtering by keyword, category, and difficulty
// with live backend REST API queries, mobile filter drawer toggle,
// instant popular pills, active filter counters, and smooth rendering.
// ============================================================

document.addEventListener('DOMContentLoaded', async function () {
    initSearchControls();

    // Build the category filter checkboxes
    await renderCategoryFilters();

    // Read URL parameters (e.g., search.html?q=merge&category=Branching)
    var urlParams = new URLSearchParams(window.location.search);
    var queryParam = urlParams.get('q') || '';
    var categoryParam = urlParams.get('category') || '';

    // Pre-fill search input
    var searchInput = document.getElementById('searchInput');
    if (searchInput && queryParam) {
        searchInput.value = queryParam;
        updateClearButtonVisibility();
    }

    // Pre-select category filter if passed in URL
    if (categoryParam) {
        var categoryCheckboxes = document.querySelectorAll('#categoryFilters input[type="radio"]');
        categoryCheckboxes.forEach(function (checkbox) {
            if (checkbox.value.toLowerCase() === categoryParam.toLowerCase()) {
                checkbox.checked = true;
            }
        });
    }

    updateActiveFilterCount();

    // Run initial search
    await performSearch();
});

// ---- INITIALIZE CONTROLS & LISTENERS ----

function initSearchControls() {
    var searchInput = document.getElementById('searchInput');
    var clearSearchBtn = document.getElementById('clearSearchBtn');
    var mobileFilterToggle = document.getElementById('mobileFilterToggle');
    var searchSidebar = document.getElementById('searchSidebar');
    var clearFiltersBtn = document.getElementById('clearFiltersBtn');
    var emptyResetBtn = document.getElementById('emptyResetBtn');
    var popularSearches = document.getElementById('popularSearches');

    // Search Input listeners
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            updateClearButtonVisibility();
            debounce(performSearch, 300)();
        });

        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }

    // Clear Search Input Button
    if (clearSearchBtn && searchInput) {
        clearSearchBtn.addEventListener('click', function () {
            searchInput.value = '';
            updateClearButtonVisibility();
            searchInput.focus();
            performSearch();
        });
    }

    // Mobile Filter Drawer Toggle
    if (mobileFilterToggle && searchSidebar) {
        mobileFilterToggle.addEventListener('click', function () {
            var isExpanded = searchSidebar.classList.toggle('active');
            mobileFilterToggle.classList.toggle('active', isExpanded);
            mobileFilterToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            
            var chevron = document.getElementById('filterChevron');
            if (chevron) {
                chevron.textContent = isExpanded ? '▴' : '▾';
            }
        });
    }

    // Reset Filters Buttons
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', resetAllFilters);
    }
    if (emptyResetBtn) {
        emptyResetBtn.addEventListener('click', function () {
            if (searchInput) searchInput.value = '';
            updateClearButtonVisibility();
            resetAllFilters();
        });
    }

    // Popular Search Pills
    if (popularSearches) {
        popularSearches.addEventListener('click', function (e) {
            var target = e.target.closest('.search-pill');
            if (target && searchInput) {
                e.preventDefault();
                var query = target.getAttribute('data-query') || target.textContent.trim();
                searchInput.value = query;
                updateClearButtonVisibility();
                performSearch();

                // On mobile, smoothly scroll down to results
                if (window.innerWidth <= 768) {
                    var resultsSection = document.querySelector('.search-results-section');
                    if (resultsSection) {
                        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            }
        });
    }

    // Difficulty filter listener
    var difficultyInputs = document.querySelectorAll('#difficultyFilters input');
    difficultyInputs.forEach(function (input) {
        input.addEventListener('change', function () {
            updateActiveFilterCount();
            performSearch();
        });
    });
}

function updateClearButtonVisibility() {
    var searchInput = document.getElementById('searchInput');
    var clearSearchBtn = document.getElementById('clearSearchBtn');
    if (clearSearchBtn && searchInput) {
        clearSearchBtn.style.display = searchInput.value.trim().length > 0 ? 'flex' : 'none';
    }
}

function resetAllFilters() {
    var allCatRadio = document.querySelector('#categoryFilters input[value="all"]');
    if (allCatRadio) allCatRadio.checked = true;

    var allDiffRadio = document.querySelector('#difficultyFilters input[value="all"]');
    if (allDiffRadio) allDiffRadio.checked = true;

    updateActiveFilterCount();
    performSearch();
}

function updateActiveFilterCount() {
    var categoryRadio = document.querySelector('#categoryFilters input[type="radio"]:checked');
    var difficultyRadio = document.querySelector('#difficultyFilters input[type="radio"]:checked');

    var activeCount = 0;
    if (categoryRadio && categoryRadio.value !== 'all') activeCount++;
    if (difficultyRadio && difficultyRadio.value !== 'all') activeCount++;

    var badge = document.getElementById('filterActiveCount');
    var clearBtn = document.getElementById('clearFiltersBtn');

    if (badge) {
        if (activeCount > 0) {
            badge.textContent = activeCount;
            badge.style.display = 'inline-flex';
        } else {
            badge.style.display = 'none';
        }
    }

    if (clearBtn) {
        clearBtn.style.display = activeCount > 0 ? 'inline-block' : 'none';
    }
}

// ---- RENDER CATEGORY FILTERS ----

async function renderCategoryFilters() {
    var container = document.getElementById('categoryFilters');
    if (!container) return;

    var catList = typeof categories !== 'undefined' ? categories : [];

    if (typeof API !== 'undefined' && API.categories) {
        var res = await API.categories.getAll();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            catList = res.data;
        }
    }

    var html = '<label class="checkbox-label">';
    html += '<input type="radio" name="category" value="all" checked>';
    html += '<span>All</span>';
    html += '</label>';

    catList.forEach(function (cat) {
        var icon = cat.icon || '📁';
        html += '<label class="checkbox-label">';
        html += '<input type="radio" name="category" value="' + escapeHtml(cat.name) + '">';
        html += '<span>' + icon + ' ' + escapeHtml(cat.name) + '</span>';
        html += '</label>';
    });

    container.innerHTML = html;

    var urlParams = new URLSearchParams(window.location.search);
    var categoryParam = urlParams.get('category') || '';
    if (categoryParam) {
        var radios = container.querySelectorAll('input[type="radio"]');
        radios.forEach(function (radio) {
            if (radio.value.toLowerCase() === categoryParam.toLowerCase()) {
                radio.checked = true;
            }
        });
    }

    var newInputs = container.querySelectorAll('input');
    newInputs.forEach(function (input) {
        input.addEventListener('change', function () {
            updateActiveFilterCount();
            performSearch();
        });
    });
}

// ---- PERFORM SEARCH ----

var searchDebounceTimer = null;
function debounce(func, wait) {
    return function () {
        var context = this;
        var args = arguments;
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(function () {
            func.apply(context, args);
        }, wait);
    };
}

async function performSearch() {
    var searchInput = document.getElementById('searchInput');
    var query = searchInput ? searchInput.value.trim() : '';

    var categoryRadio = document.querySelector('#categoryFilters input[type="radio"]:checked');
    var selectedCategory = categoryRadio ? categoryRadio.value : 'all';

    var difficultyRadio = document.querySelector('#difficultyFilters input[type="radio"]:checked');
    var selectedDifficulty = difficultyRadio ? difficultyRadio.value : 'all';

    // Update URL query state without reload
    var url = new URL(window.location);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');

    if (selectedCategory !== 'all') url.searchParams.set('category', selectedCategory);
    else url.searchParams.delete('category');

    window.history.replaceState({}, '', url);

    // Show skeleton loaders while fetching
    var grid = document.getElementById('resultsGrid');
    var resultCount = document.getElementById('resultCount');
    var emptyState = document.getElementById('emptyState');
    
    if (grid) {
        grid.style.display = 'grid';
        if (emptyState) emptyState.style.display = 'none';
        if (resultCount) resultCount.innerHTML = 'Searching guides...';
        
        var skeletons = '';
        for (var i = 0; i < 4; i++) {
            skeletons += '<div class="skeleton-card">';
            skeletons += '  <div class="skeleton-line skeleton-title"></div>';
            skeletons += '  <div class="skeleton-line skeleton-desc"></div>';
            skeletons += '  <div class="skeleton-line skeleton-desc short"></div>';
            skeletons += '  <div class="skeleton-badges">';
            skeletons += '    <div class="skeleton-line skeleton-badge"></div>';
            skeletons += '    <div class="skeleton-line skeleton-badge"></div>';
            skeletons += '  </div>';
            skeletons += '</div>';
        }
        grid.innerHTML = skeletons;
    }

    var results = [];

    if (typeof API !== 'undefined' && API.articles) {
        var filters = {};
        if (query) filters.q = query;
        if (selectedCategory !== 'all') filters.category = selectedCategory;
        if (selectedDifficulty !== 'all') filters.difficulty = selectedDifficulty;

        var res = await API.articles.getAll(filters);
        if (res.success && Array.isArray(res.data)) {
            results = res.data;
        }
    }

    // Fallback to local filtering if server offline
    if (results.length === 0 && (!res || !res.success) && typeof articles !== 'undefined') {
        results = articles.filter(function (article) {
            if (selectedCategory !== 'all' && article.category !== selectedCategory) return false;
            if (selectedDifficulty !== 'all' && article.difficulty !== selectedDifficulty) return false;
            if (query) {
                var qLower = query.toLowerCase();
                var titleMatch = (article.title || '').toLowerCase().includes(qLower);
                var descMatch = (article.description || '').toLowerCase().includes(qLower);
                var catMatch = (article.category || '').toLowerCase().includes(qLower);
                var kwMatch = (article.keywords || []).some(function (k) { return k.toLowerCase().includes(qLower); });
                var cmdMatch = (article.commands || []).some(function (c) { return c.toLowerCase().includes(qLower); });
                if (!titleMatch && !descMatch && !catMatch && !kwMatch && !cmdMatch) return false;
            }
            return true;
        });
    }

    renderResults(results, query);
}

// ---- RENDER SEARCH RESULTS ----

function renderResults(results, query) {
    var grid = document.getElementById('resultsGrid');
    var resultCount = document.getElementById('resultCount');
    var emptyState = document.getElementById('emptyState');

    if (!grid) return;

    if (resultCount) {
        if (query) {
            resultCount.innerHTML = 'Showing <span>' + results.length + '</span> result' + (results.length !== 1 ? 's' : '') + ' for "' + escapeHtml(query) + '"';
        } else {
            resultCount.innerHTML = 'Showing <span>' + results.length + '</span> guide' + (results.length !== 1 ? 's' : '');
        }
    }

    if (results.length === 0) {
        grid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    grid.style.display = 'flex';
    grid.style.flexDirection = 'column';
    grid.style.gap = '1rem';
    if (emptyState) emptyState.style.display = 'none';

    var html = '';
    results.forEach(function (article, index) {
        var delay = (index % 6) * 40;
        var num = (index + 1).toString().padStart(2, '0');
        var diffClass = typeof getDifficultyClass === 'function' ? getDifficultyClass(article.difficulty) : 'badge-beginner';
        
        html += '<a href="article.html?id=' + article.id + '" class="trending-feed-item reveal" style="transition-delay: ' + delay + 'ms;">';
        html += '  <div class="feed-number">' + num + '</div>';
        html += '  <div class="feed-content">';
        html += '    <h3 class="feed-title">' + escapeHtml(article.title) + '</h3>';
        html += '    <p class="feed-description">' + escapeHtml(article.description || '') + '</p>';
        html += '    <div class="feed-meta">';
        html += '      <span class="badge badge-category">' + escapeHtml(article.category || 'General') + '</span>';
        html += '      <span class="badge ' + diffClass + '">' + escapeHtml(article.difficulty || 'Beginner') + '</span>';
        if (article.readingTime) {
            html += '      <span class="meta-dot">&middot;</span>';
            html += '      <span class="meta-read-time">' + escapeHtml(article.readingTime) + '</span>';
        }
        html += '    </div>';
        html += '  </div>';
        html += '  <div class="feed-arrow">→</div>';
        html += '</a>';
    });

    grid.innerHTML = html;
    if (typeof initScrollObserver === 'function') {
        initScrollObserver();
    }
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}
