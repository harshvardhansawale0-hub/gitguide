// ============================================================
// GitGuide – Frontend API Client Service
// ============================================================
// Unified API service for seamless full-stack communication
// with Express backend, including JWT management and offline fallback.
// ============================================================

(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.API = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {

    var API_BASE = (function () {
        if (typeof window !== 'undefined') {
            if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
                return window.location.origin + '/api';
            }
        }
        return 'http://localhost:5000/api';
    })();

    var TOKEN_KEY = 'gitguide_auth_token';
    var USER_KEY = 'gitguide_current_user';

    function getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    function setToken(token) {
        if (token) {
            localStorage.setItem(TOKEN_KEY, token);
        } else {
            localStorage.removeItem(TOKEN_KEY);
        }
    }

    function getCurrentUser() {
        var user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    }

    function setCurrentUser(user) {
        if (user) {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(USER_KEY);
        }
    }

    function removeSession() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }

    // Base HTTP request wrapper
    async function request(endpoint, options) {
        options = options || {};
        var headers = options.headers || {};
        headers['Content-Type'] = 'application/json';

        var token = getToken();
        if (token) {
            headers['Authorization'] = 'Bearer ' + token;
        }

        var config = {
            method: options.method || 'GET',
            headers: headers
        };

        if (options.body) {
            config.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
        }

        try {
            var response = await fetch(API_BASE + endpoint, config);
            var data = await response.json().catch(function () { return {}; });

            if (!response.ok) {
                return {
                    success: false,
                    status: response.status,
                    message: data.message || 'Request failed with status ' + response.status,
                    data: null
                };
            }

            return data;
        } catch (error) {
            console.warn('[API Client] Backend request error:', error.message);
            return {
                success: false,
                isNetworkError: true,
                message: 'Unable to connect to GitGuide backend server.',
                data: null
            };
        }
    }

    return {
        baseURL: API_BASE,
        getToken: getToken,
        setToken: setToken,
        getCurrentUser: getCurrentUser,
        setCurrentUser: setCurrentUser,
        removeSession: removeSession,

        // --- AUTH API ---
        auth: {
            register: async function (name, contact, username, password) {
                var res = await request('/auth/register', {
                    method: 'POST',
                    body: { name: name, contact: contact, username: username, password: password }
                });
                if (res.success && res.token && res.user) {
                    setToken(res.token);
                    setCurrentUser(res.user);
                }
                return res;
            },
            login: async function (username, password) {
                var res = await request('/auth/login', {
                    method: 'POST',
                    body: { username: username, password: password }
                });
                if (res.success && res.token && res.user) {
                    setToken(res.token);
                    setCurrentUser(res.user);
                }
                return res;
            },
            logout: function () {
                removeSession();
            },
            getProfile: async function () {
                return await request('/auth/me');
            }
        },

        // --- CATEGORIES API ---
        categories: {
            getAll: async function () {
                return await request('/categories');
            },
            getById: async function (id) {
                return await request('/categories/' + id);
            },
            create: async function (data) {
                return await request('/categories', { method: 'POST', body: data });
            },
            update: async function (id, data) {
                return await request('/categories/' + id, { method: 'PUT', body: data });
            },
            delete: async function (id) {
                return await request('/categories/' + id, { method: 'DELETE' });
            }
        },

        // --- ARTICLES API ---
        articles: {
            getAll: async function (filters) {
                filters = filters || {};
                var queryParams = new URLSearchParams();
                if (filters.q) queryParams.append('q', filters.q);
                if (filters.category) queryParams.append('category', filters.category);
                if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
                if (filters.status) queryParams.append('status', filters.status);

                var qs = queryParams.toString();
                return await request('/articles' + (qs ? '?' + qs : ''));
            },
            getTrending: async function () {
                return await request('/articles/trending');
            },
            getSuggestions: async function (query) {
                return await request('/articles/suggestions?q=' + encodeURIComponent(query || ''));
            },
            getById: async function (id) {
                return await request('/articles/' + id);
            },
            create: async function (data) {
                return await request('/articles', { method: 'POST', body: data });
            },
            update: async function (id, data) {
                return await request('/articles/' + id, { method: 'PUT', body: data });
            },
            delete: async function (id) {
                return await request('/articles/' + id, { method: 'DELETE' });
            }
        },

        // --- MEDIA API ---
        media: {
            getByArticle: async function (articleId) {
                return await request('/media/' + articleId);
            },
            upload: async function (articleId, data) {
                // data contains: media_type, data_base64, file_name, mime_type, file_size, media_url
                return await request('/media/' + articleId, {
                    method: 'POST',
                    body: data
                });
            },
            delete: async function (mediaId) {
                return await request('/media/' + mediaId, { method: 'DELETE' });
            }
        },

        // --- COMMENTS API ---
        comments: {
            getByArticle: async function (articleId) {
                return await request('/comments/article/' + articleId);
            },
            add: async function (articleId, text, name) {
                return await request('/comments/article/' + articleId, {
                    method: 'POST',
                    body: { text: text, name: name }
                });
            },
            getAll: async function () {
                return await request('/comments');
            },
            delete: async function (commentId) {
                return await request('/comments/' + commentId, { method: 'DELETE' });
            }
        },

        // --- RATINGS API ---
        ratings: {
            get: async function (articleId) {
                return await request('/ratings/' + articleId);
            },
            set: async function (articleId, rating) {
                return await request('/ratings/' + articleId, {
                    method: 'POST',
                    body: { rating: rating }
                });
            }
        },

        // --- BOOKMARKS API ---
        bookmarks: {
            getAll: async function () {
                return await request('/bookmarks');
            },
            getIds: async function () {
                return await request('/bookmarks/ids');
            },
            toggle: async function (articleId) {
                return await request('/bookmarks/toggle', {
                    method: 'POST',
                    body: { articleId: articleId }
                });
            }
        },

        // --- COMMANDS API ---
        commands: {
            getAll: async function () {
                return await request('/commands');
            },
            synthesize: async function (commandName, selectedFlags, argument) {
                return await request('/commands/synthesize', {
                    method: 'POST',
                    body: { commandName: commandName, selectedFlags: selectedFlags, argument: argument }
                });
            }
        },

        // --- TROUBLESHOOTING API ---
        troubleshooting: {
            getPatterns: async function () {
                return await request('/troubleshooting/patterns');
            },
            analyze: async function (errorText) {
                return await request('/troubleshooting/analyze', {
                    method: 'POST',
                    body: { errorText: errorText }
                });
            }
        },

        // --- DASHBOARD API ---
        dashboard: {
            getStats: async function () {
                return await request('/dashboard/stats');
            },
            getAuditLogs: async function () {
                return await request('/dashboard/audit-logs');
            },
            getUserDashboard: async function () {
                return await request('/dashboard/user');
            }
        }
    };
});
