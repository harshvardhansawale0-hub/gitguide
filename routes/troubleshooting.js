// ============================================================
// GitGuide – Troubleshooting & Error Analyzer API Routes (Groq AI Powered)
// ============================================================
const express = require('express');
const Groq = require('groq-sdk');
const db = require('../config/db');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Initialize Groq client
const groqApiKey = process.env.GROQ_API_KEY;
let groqClient = null;
if (groqApiKey) {
    try {
        groqClient = new Groq({ apiKey: groqApiKey });
    } catch (err) {
        console.warn('[Troubleshooting] Failed to initialize Groq client:', err.message);
    }
}

const SYSTEM_ANALYZER_PROMPT = `You are an elite Git and GitHub Troubleshooting AI specialist for the GitGuide platform.
Analyze the developer's terminal error and return a valid JSON object with the following schema:
{
  "title": "Short, clear title of the error or issue (e.g., 'GitHub Authentication Failed (Password Deprecated)')",
  "category": "One of: Authentication, Merge Conflict, Branching & History, Remote & Push, Staging & Commits, Configuration, Network & Permissions",
  "rootCause": "Clear, concise 1-2 sentence explanation of why this error occurred.",
  "quickFix": "A single direct terminal command if an immediate fix exists (or null if it requires multiple steps)",
  "solution": "Step-by-step resolution written in clean Markdown with numbered steps, \`\`\`bash code blocks for commands, and clear explanations.",
  "preventionTip": "Pro-tip or best practice on how to prevent this issue from happening again.",
  "relatedCommands": ["git push", "git pull", "ssh-keygen"]
}
Respond ONLY with the raw JSON object. Do not include markdown code fences around the JSON.`;

// Helper: Query database for related articles based on error text and keywords
async function findRelatedDatabaseArticles(errorText, aiKeywords = []) {
    try {
        const normalizedInput = (errorText + ' ' + aiKeywords.join(' ')).toLowerCase();
        const [articles] = await db.query(`
            SELECT 
                a.id, 
                a.title, 
                a.description, 
                a.difficulty, 
                a.reading_time AS readingTime,
                c.name AS category
            FROM articles a
            LEFT JOIN categories c ON c.id = a.category_id
            WHERE a.status = 'Published'
        `);

        const matches = [];
        articles.forEach(art => {
            const artTitle = art.title.toLowerCase();
            const artDesc = (art.description || '').toLowerCase();
            let score = 0;

            if (normalizedInput.includes(artTitle)) score += 10;
            aiKeywords.forEach(kw => {
                if (kw && (artTitle.includes(kw.toLowerCase()) || artDesc.includes(kw.toLowerCase()))) {
                    score += 5;
                }
            });

            if (score > 0) {
                matches.push({ ...art, score });
            }
        });

        matches.sort((a, b) => b.score - a.score);
        return matches.slice(0, 3).map(({ score, ...rest }) => rest);
    } catch (err) {
        console.warn('[Troubleshooting] Database lookup error:', err.message);
        return [];
    }
}

// GET /api/troubleshooting/patterns – Get all error pattern definitions (legacy support)
router.get('/patterns', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                ep.id,
                ep.title,
                ep.keywords,
                ep.solution,
                ep.article_id AS articleId,
                a.title AS articleTitle
            FROM error_patterns ep
            LEFT JOIN articles a ON a.id = ep.article_id
            ORDER BY ep.id ASC
        `);

        const patterns = rows.map(r => ({
            id: r.id,
            title: r.title,
            keywords: typeof r.keywords === 'string' ? JSON.parse(r.keywords) : (r.keywords || []),
            solution: r.solution,
            articleId: r.articleId,
            articleTitle: r.articleTitle
        }));

        return res.json({ success: true, count: patterns.length, data: patterns });
    } catch (err) {
        console.error('Error fetching error patterns:', err);
        return res.status(500).json({ success: false, message: 'Server error fetching error patterns.' });
    }
});

// POST /api/troubleshooting/analyze – Terminal error log analyzer (Groq AI powered)
router.post('/analyze', optionalAuth, async (req, res) => {
    try {
        const { errorText } = req.body;

        if (!errorText || !errorText.trim()) {
            return res.status(400).json({ success: false, message: 'Please provide an error message to analyze.' });
        }

        const trimmedError = errorText.trim();

        // 1. Try Groq AI Analysis first
        if (groqClient) {
            try {
                const completion = await groqClient.chat.completions.create({
                    model: 'openai/gpt-oss-120b',
                    messages: [
                        { role: 'system', content: SYSTEM_ANALYZER_PROMPT },
                        { role: 'user', content: `Analyze this Git error:\n\n${trimmedError}` }
                    ],
                    response_format: { type: 'json_object' },
                    temperature: 0.2,
                    max_tokens: 1000
                });

                const rawContent = completion.choices[0]?.message?.content || '{}';
                const aiResult = JSON.parse(rawContent);

                const relatedArticles = await findRelatedDatabaseArticles(
                    trimmedError,
                    [aiResult.category, ...(aiResult.relatedCommands || []), aiResult.title]
                );

                return res.json({
                    success: true,
                    matched: true,
                    source: 'groq-ai',
                    model: 'openai/gpt-oss-120b',
                    analysis: {
                        title: aiResult.title || 'Git Error Diagnosis',
                        category: aiResult.category || 'Troubleshooting',
                        rootCause: aiResult.rootCause || 'An unexpected Git operation failure occurred.',
                        quickFix: aiResult.quickFix || null,
                        solution: aiResult.solution || 'Please follow the recommended steps below to resolve this error.',
                        preventionTip: aiResult.preventionTip || 'Keep your branch up to date and verify permissions before executing operations.',
                        relatedCommands: aiResult.relatedCommands || []
                    },
                    matchedArticles: relatedArticles,
                    data: [
                        {
                            id: 'ai-solution',
                            title: aiResult.title || 'AI Error Diagnosis',
                            solution: aiResult.solution,
                            rootCause: aiResult.rootCause,
                            category: aiResult.category
                        }
                    ]
                });
            } catch (groqErr) {
                console.error('[Troubleshooting] Groq API call error, attempting fallback:', groqErr.message);
            }
        }

        // 2. Fallback to Database Pattern Matching if Groq is unavailable or fails
        const normalizedInput = trimmedError.toLowerCase();
        const [rows] = await db.query(`
            SELECT 
                ep.id,
                ep.title,
                ep.keywords,
                ep.solution,
                ep.article_id AS articleId,
                a.title AS articleTitle,
                a.description AS articleDescription,
                c.name AS articleCategory
            FROM error_patterns ep
            LEFT JOIN articles a ON a.id = ep.article_id
            LEFT JOIN categories c ON c.id = a.category_id
        `);

        const dbMatches = [];
        rows.forEach(r => {
            const keywords = typeof r.keywords === 'string' ? JSON.parse(r.keywords) : (r.keywords || []);
            let score = 0;
            const matchedKeywords = [];

            keywords.forEach(kw => {
                const kwLower = kw.toLowerCase();
                if (normalizedInput.includes(kwLower)) {
                    score += kwLower.length * 2;
                    matchedKeywords.push(kw);
                }
            });

            if (score > 0) {
                dbMatches.push({
                    id: r.id,
                    title: r.title,
                    solution: r.solution,
                    articleId: r.articleId,
                    articleTitle: r.articleTitle,
                    articleCategory: r.articleCategory,
                    score,
                    matchedKeywords
                });
            }
        });

        dbMatches.sort((a, b) => b.score - a.score);

        if (dbMatches.length > 0) {
            const bestMatch = dbMatches[0];
            return res.json({
                success: true,
                matched: true,
                source: 'database-fallback',
                analysis: {
                    title: bestMatch.title,
                    category: bestMatch.articleCategory || 'Troubleshooting',
                    rootCause: 'Matched pattern from GitGuide database for known common Git errors.',
                    quickFix: null,
                    solution: bestMatch.solution,
                    preventionTip: 'Review your Git commands and repository state before making remote changes.',
                    relatedCommands: []
                },
                matchedArticles: bestMatch.articleId ? [{
                    id: bestMatch.articleId,
                    title: bestMatch.articleTitle,
                    category: bestMatch.articleCategory,
                    description: 'Read the full guide in our knowledge base.'
                }] : [],
                count: dbMatches.length,
                data: dbMatches
            });
        }

        // 3. No match found
        return res.json({
            success: true,
            matched: false,
            source: 'none',
            count: 0,
            data: [],
            message: 'No matching solution could be generated for this error.'
        });

    } catch (err) {
        console.error('Error analyzing error text:', err);
        return res.status(500).json({ success: false, message: 'Server error analyzing error message.' });
    }
});

module.exports = router;
