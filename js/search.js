// ============================================================
// GitGuide – Search Page JavaScript (Full-Stack Integrated)
// ============================================================
// Handles search filtering by keyword, category, and difficulty
// with live backend REST API queries and instant results.
// ============================================================

// ---- INITIALIZE SEARCH PAGE ----

document.addEventListener('DOMContentLoaded', async function () {
    // Build the category filter checkboxes
    await renderCategoryFilters();

    // Read URL parameters (e.g., search.html?q=merge&category=Branching)
    var urlParams = new URLSearchParams(window.location.search);
    var queryParam = urlParams.get('q') || '';
    var categoryParam = urlParams.get('category') || '';

    // Pre-fill the search input with the URL query
    var searchInput = document.getElementById('searchInput');
    if (searchInput && queryParam) {
        searchInput.value = queryParam;
    }

    // Pre-select the category filter if passed in URL
    if (categoryParam) {
        var categoryCheckboxes = document.querySelectorAll('#categoryFilters input[type="radio"]');
        categoryCheckboxes.forEach(function (checkbox) {
            if (checkbox.value.toLowerCase() === categoryParam.toLowerCase()) {
                checkbox.checked = true;
            }
        });
    }

    // Run the initial search
    await performSearch();

    // Add event listeners
    var searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    var filterInputs = document.querySelectorAll('#categoryFilters input, #difficultyFilters input');
    filterInputs.forEach(function (input) {
        input.addEventListener('change', performSearch);
    });
});

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
    html += 'All';
    html += '</label>';

    catList.forEach(function (cat) {
        var icon = cat.icon || '📁';
        html += '<label class="checkbox-label">';
        html += '<input type="radio" name="category" value="' + cat.name + '">';
        html += icon + ' ' + cat.name;
        html += '</label>';
    });

    container.innerHTML = html;

    var urlParams = new URLSearchParams(window.location.search);
    var categoryParam = urlParams.get('category') || '';
    if (categoryParam) {
        var radios = container.querySelectorAll('input[type="radio"]');
        radios.forEach(function (radio) {
            radio.checked = (radio.value.toLowerCase() === categoryParam.toLowerCase());
        });
    }

    var newInputs = container.querySelectorAll('input');
    newInputs.forEach(function (input) {
        input.addEventListener('change', performSearch);
    });
}

// ---- PERFORM SEARCH ----

async function performSearch() {
    var searchInput = document.getElementById('searchInput');
    var query = searchInput ? searchInput.value.trim() : '';

    var categoryRadio = document.querySelector('#categoryFilters input[type="radio"]:checked');
    var selectedCategory = categoryRadio ? categoryRadio.value : 'all';

    var difficultyRadio = document.querySelector('#difficultyFilters input[type="radio"]:checked');
    var selectedDifficulty = difficultyRadio ? difficultyRadio.value : 'all';

    // Show skeleton loaders first
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
                var titleMatch = article.title.toLowerCase().includes(qLower);
                var descMatch = article.description.toLowerCase().includes(qLower);
                var catMatch = article.category.toLowerCase().includes(qLower);
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
        var delay = (index % 6) * 50;
        var num = (index + 1).toString().padStart(2, '0');
        
        html += '<a href="article.html?id=' + article.id + '" class="trending-feed-item reveal" style="transition-delay: ' + delay + 'ms;">';
        html += '  <div class="feed-number">' + num + '</div>';
        html += '  <div class="feed-content">';
        html += '    <h3 style="font-size: 1.15rem; margin-bottom: 0.25rem;">' + article.title + '</h3>';
        html += '    <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.5rem; line-height: 1.5;">' + article.description + '</p>';
        html += '    <div class="feed-meta" style="display:flex; gap:0.75rem; align-items:center;">';
        html += '      <span class="badge badge-category" style="font-size: 0.75rem;">' + article.category + '</span>';
        html += '      <span class="badge ' + getDifficultyClass(article.difficulty) + '" style="font-size: 0.75rem;">' + article.difficulty + '</span>';
        html += '      <span>&middot;</span>';
        html += '      <span>' + article.readingTime + '</span>';
        html += '    </div>';
        html += '  </div>';
        html += '  <div class="feed-arrow">→</div>';
        html += '</a>';
    });

    grid.innerHTML = html;
    initScrollObserver();
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}
