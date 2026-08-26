// ============================================================
// GitGuide – Chatbot Route (Groq-powered)
// ============================================================
const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const { optionalAuth } = require('../middleware/auth');

const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are Edi, a friendly Git & GitHub AI assistant for the GitGuide app.
Answer clearly and concisely using Markdown formatting:
- Use \`\`\`bash code blocks for commands
- Use **bold** for emphasis
- Use ### headers for sections when helpful
- When explaining push rejections or remote divergence, mention 'git pull --rebase' or 'git rebase'
Keep answers focused and practical, aimed at developers learning Git.`;

const CATEGORIES = [
    { id: 'basics', icon: '📘', label: 'Git Basics', description: 'Core commands, init, add, commit, status' },
    { id: 'branching', icon: '🌿', label: 'Branching & Merging', description: 'Switch, checkout, merge, rebase' },
    { id: 'conflicts', icon: '⚔️', label: 'Merge Conflicts', description: 'Resolving conflict markers and rebasing' },
    { id: 'github', icon: '🐙', label: 'GitHub Workflow', description: 'Remotes, PRs, PAT tokens, SSH setup' },
    { id: 'undo', icon: '⏪', label: 'Undoing Changes', description: 'Reset, restore, revert, reflog' }
];

// GET /api/chatbot/categories
router.get('/categories', (req, res) => {
    res.json({ success: true, count: CATEGORIES.length, data: CATEGORIES });
});

router.post('/query', optionalAuth, async (req, res) => {
    try {
        const { query, categoryId } = req.body;

        if (!query || !query.trim()) {
            return res.status(400).json({ success: false, message: 'Query is required.' });
        }

        const completion = await groqClient.chat.completions.create({
           model: 'openai/gpt-oss-120b',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: query }
            ],
            temperature: 0.6,
            max_tokens: 800,
        });

        const message = completion.choices[0].message.content;

        res.json({
            success: true,
            topic: categoryId || 'General',
            message: message,
            suggestedQuestions: [
                'How do I undo my last commit?',
                'How do I fix a merge conflict?'
            ]
        });

    } catch (err) {
        console.error('Groq chatbot error:', err);
        res.status(500).json({
            success: false,
            message: 'Sorry, I had trouble reaching the AI service. Please try again.'
        });
    }
});

module.exports = router;