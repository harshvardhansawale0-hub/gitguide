// ============================================================
// GitGuide – Git Commands Catalog & Groq AI Synthesizer API Routes
// ============================================================
const express = require('express');
const Groq = require('groq-sdk');
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Initialize Groq client
const groqApiKey = process.env.GROQ_API_KEY;
let groqClient = null;
if (groqApiKey) {
    try {
        groqClient = new Groq({ apiKey: groqApiKey });
    } catch (err) {
        console.warn('[Commands] Failed to initialize Groq client:', err.message);
    }
}

// System prompts for Groq AI
const SYSTEM_SYNTHESIZER_PROMPT = `You are an elite Git CLI Architect and Command Synthesizer AI for the GitGuide platform.
Your task is to take a developer's natural language request and synthesize the most accurate, effective, and safe Git command (or multi-command workflow) to accomplish their goal.

Return a valid JSON object matching this schema exactly:
{
  "command": "The complete, ready-to-run Git command string (e.g. 'git reset --soft HEAD~2' or 'git checkout -b feature/login origin/main')",
  "explanation": "Clear, concise 1-2 sentence explanation of what this synthesized command accomplishes.",
  "breakdown": [
    { "part": "git checkout -b <branch>", "meaning": "Creates and immediately switches to the new branch." },
    { "part": "origin/main", "meaning": "Sets the starting point to the latest tracked upstream branch." }
  ],
  "dangerLevel": "safe", // One of: "safe", "caution", "danger"
  "isDangerous": false, // boolean: true if dangerLevel is "danger"
  "warningMessage": "Detailed warning if dangerous/cautionary (e.g. data loss, branch overwrite) or null if safe",
  "bestPractice": "Industry pro-tip or best practice recommendation related to this operation",
  "undoCommand": "Exact command(s) or explanation to safely revert/undo this operation if possible (or null if irreversible)",
  "category": "One of: Branching & Merging, History & Commits, Staging & Working Tree, Remote & Sync, Undoing Changes, Stashing, Advanced Plumbing"
}

Safety classification rules:
- "danger": Permanent data loss or unrecoverable history destruction (e.g. 'git reset --hard', 'git clean -fd', 'git push --force', 'git branch -D', 'git stash drop/clear'). isDangerous MUST be true.
- "caution": Rewrites local history or modifies uncommitted files (e.g. 'git rebase', 'git commit --amend', 'git restore .', 'git reset --mixed'). isDangerous MUST be false or true depending on risk.
- "safe": Read-only, additive, or fully non-destructive operations (e.g. 'git status', 'git log', 'git branch', 'git checkout -b', 'git add', 'git stash', 'git diff', 'git fetch'). isDangerous MUST be false.

Respond ONLY with the raw JSON object. Do not include markdown code fences around the JSON.`;

const SYSTEM_EXPLAIN_PROMPT = `You are an elite Git CLI Architect and Command Analyzer for the GitGuide platform.
Analyze the user's provided Git command, breaking down every flag, argument, side-effects, and potential safety risks.

Return a valid JSON object matching this schema exactly:
{
  "command": "The analyzed Git command",
  "explanation": "Clear explanation of what this exact command does.",
  "breakdown": [
    { "part": "--flag or argument", "meaning": "Explanation of what this specific flag or argument does in this context" }
  ],
  "dangerLevel": "safe", // One of: "safe", "caution", "danger"
  "isDangerous": false,
  "warningMessage": "Specific warning message if this command is dangerous or destructive, else null",
  "bestPractice": "Pro-tip or safer alternative (e.g., using --force-with-lease instead of --force)",
  "undoCommand": "How to undo this command if applicable (or null)",
  "category": "One of: Branching & Merging, History & Commits, Staging & Working Tree, Remote & Sync, Undoing Changes, Stashing, Advanced Plumbing"
}

Respond ONLY with the raw JSON object. Do not include markdown code fences around the JSON.`;

// Helper: Find matching database articles for a given command/keyword
async function findRelatedArticlesForCommand(commandStr, keywords = []) {
    try {
        const queryText = (commandStr + ' ' + keywords.join(' ')).toLowerCase();
        const [articles] = await db.query(`
            SELECT 
                a.id, 
                a.title, 
                a.description, 
                a.difficulty, 
                a.reading_time AS readingTime,
                c.name AS category,
                a.commands
            FROM articles a
            LEFT JOIN categories c ON c.id = a.category_id
            WHERE a.status = 'Published'
        `);

        const matches = [];
        articles.forEach(art => {
            const artTitle = art.title.toLowerCase();
            const artDesc = (art.description || '').toLowerCase();
            let score = 0;

            if (queryText.includes(artTitle)) score += 10;
            keywords.forEach(kw => {
                if (kw && (artTitle.includes(kw.toLowerCase()) || artDesc.includes(kw.toLowerCase()))) {
                    score += 5;
                }
            });

            // Check if article commands match
            if (art.commands) {
                try {
                    const cmdList = typeof art.commands === 'string' ? JSON.parse(art.commands) : art.commands;
                    cmdList.forEach(c => {
                        if (queryText.includes(c.toLowerCase())) score += 6;
                    });
                } catch (e) {}
            }

            if (score > 0) {
                matches.push({ ...art, relevanceScore: score });
            }
        });

        return matches.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 3);
    } catch (e) {
        console.warn('[Commands] Article lookup error:', e.message);
        return [];
    }
}

// Helper: Heuristic offline fallback synthesis
function generateFallbackSynthesis(prompt) {
    const p = prompt.toLowerCase();
    let command = 'git status';
    let explanation = 'Shows the working tree status and staging area.';
    let dangerLevel = 'safe';
    let isDangerous = false;
    let warningMessage = null;
    let breakdown = [{ part: 'git status', meaning: 'Displays paths that have differences between index file and current HEAD commit.' }];
    let bestPractice = 'Run git status frequently to verify the state of your working directory.';
    let undoCommand = null;
    let category = 'Staging & Working Tree';

    if (p.includes('undo') && (p.includes('commit') || p.includes('last commit'))) {
        if (p.includes('keep') || p.includes('soft') || p.includes('staged')) {
            command = 'git reset --soft HEAD~1';
            explanation = 'Undoes the most recent commit while preserving all your changes in the staging area.';
            breakdown = [
                { part: 'git reset', meaning: 'Resets the current HEAD to specified state' },
                { part: '--soft', meaning: 'Keeps modified files staged in index' },
                { part: 'HEAD~1', meaning: 'Targets 1 commit before current HEAD' }
            ];
            undoCommand = 'git commit -C ORIG_HEAD (or git reset "HEAD@{1}")';
            bestPractice = 'Use --soft when you made a commit prematurely and want to add more changes or edit the commit message.';
            category = 'Undoing Changes';
        } else if (p.includes('hard') || p.includes('discard') || p.includes('delete')) {
            command = 'git reset --hard HEAD~1';
            explanation = 'Completely obliterates the last commit and discards all modified files.';
            dangerLevel = 'danger';
            isDangerous = true;
            warningMessage = 'This permanently erases uncommitted changes and drops the last commit from branch history.';
            breakdown = [
                { part: 'git reset', meaning: 'Resets HEAD and working tree' },
                { part: '--hard', meaning: 'Resets index and working tree; any changes since commit are discarded' },
                { part: 'HEAD~1', meaning: 'Targets the parent commit' }
            ];
            undoCommand = 'git reset --hard HEAD@{1} (via git reflog if commit was previously committed)';
            bestPractice = 'Consider git stash or git branch backup-before-reset before running hard reset.';
            category = 'Undoing Changes';
        } else {
            command = 'git reset --soft HEAD~1';
            explanation = 'Safely undoes the last commit keeping your files staged and ready to edit.';
            category = 'Undoing Changes';
        }
    } else if (p.includes('branch') && (p.includes('create') || p.includes('new') || p.includes('switch'))) {
        const branchMatch = prompt.match(/(?:branch|named?|to)\s+([a-zA-Z0-9_\-\/]+)/i);
        const branchName = branchMatch ? branchMatch[1] : 'feature-branch';
        command = `git switch -c ${branchName}`;
        explanation = `Creates a new branch '${branchName}' and immediately switches your working tree to it.`;
        breakdown = [
            { part: 'git switch -c', meaning: 'Create and switch to a new branch in one atomic step' },
            { part: branchName, meaning: 'The name of your new branch' }
        ];
        undoCommand = 'git switch - && git branch -d ' + branchName;
        bestPractice = 'git switch -c is the modern replacement for git checkout -b in Git 2.23+.';
        category = 'Branching & Merging';
    } else if (p.includes('squash') || p.includes('combine commit')) {
        command = 'git reset --soft HEAD~3 && git commit -m "Squashed commit message"';
        explanation = 'Squashes the last 3 commits into a single clean commit with all changes preserved.';
        category = 'History & Commits';
    } else if (p.includes('discard') || p.includes('clean') || p.includes('untracked')) {
        command = 'git clean -fd';
        explanation = 'Removes untracked files and directories from the working tree.';
        dangerLevel = 'danger';
        isDangerous = true;
        warningMessage = 'Untracked files will be permanently deleted and cannot be recovered.';
        category = 'Staging & Working Tree';
    } else if (p.includes('force') && p.includes('push')) {
        command = 'git push --force-with-lease origin main';
        explanation = 'Safely force-pushes changes only if nobody else has updated the remote branch in the meantime.';
        dangerLevel = 'caution';
        isDangerous = false;
        warningMessage = 'Overwrites remote history, but --force-with-lease prevents accidentally wiping teammates\' pushes.';
        bestPractice = 'Always prefer --force-with-lease over raw --force in collaborative repositories.';
        category = 'Remote & Sync';
    }

    return {
        command,
        explanation,
        breakdown,
        dangerLevel,
        isDangerous,
        warningMessage,
        bestPractice,
        undoCommand,
        category
    };
}

// ============================================================
// 1. GET /api/commands – List all Git commands catalog
// ============================================================
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM git_commands ORDER BY id ASC');
        const commands = rows.map(r => ({
            id: r.id,
            name: r.name,
            description: r.description,
            flags: typeof r.flags === 'string' ? JSON.parse(r.flags) : (r.flags || []),
            requiresArg: Boolean(r.requires_arg),
            argPlaceholder: r.arg_placeholder || ''
        }));

        return res.json({ success: true, count: commands.length, data: commands });
    } catch (err) {
        console.error('Error fetching git commands:', err);
        return res.status(500).json({ success: false, message: 'Server error fetching commands.' });
    }
});

// ============================================================
// 2. POST /api/commands/synthesize – Backend command safety analyzer & formatter
// ============================================================
router.post('/synthesize', authenticateToken, async (req, res) => {
    try {
        const { commandName, selectedFlags = [], argument = '' } = req.body;

        if (!commandName) {
            return res.status(400).json({ success: false, message: 'commandName is required.' });
        }

        const [cmds] = await db.query('SELECT * FROM git_commands WHERE name = ?', [commandName]);
        if (cmds.length === 0) {
            return res.status(404).json({ success: false, message: 'Command not recognized.' });
        }
        const cmd = cmds[0];

        const allFlags = typeof cmd.flags === 'string' ? JSON.parse(cmd.flags) : (cmd.flags || []);
        const parts = [commandName];
        let isDangerous = false;
        let dangerLevel = 'safe';
        let warningMessage = null;

        selectedFlags.forEach(f => {
            const flagObj = allFlags.find(item => item.flag === f.flag);
            if (flagObj && flagObj.dangerous) {
                isDangerous = true;
                dangerLevel = 'danger';
            }

            if (f.value) {
                parts.push(`${f.flag} ${f.value}`);
            } else {
                parts.push(f.flag);
            }
        });

        if (argument && argument.trim()) {
            parts.push(argument.trim());
        }

        const synthesized = parts.join(' ');

        if (isDangerous) {
            if (synthesized.includes('--hard')) {
                warningMessage = 'git reset --hard will permanently discard all uncommitted changes in your working directory. This cannot be undone.';
            } else if (synthesized.includes('clean')) {
                warningMessage = 'git clean will permanently delete untracked files from your working directory. These files cannot be recovered.';
            } else if (synthesized.includes('--force')) {
                warningMessage = 'Force pushing will overwrite remote branch history and may cause loss of work for collaborators.';
            } else {
                warningMessage = 'This command can permanently modify or discard local changes. Use with caution.';
            }
        }

        const matchedArticles = await findRelatedArticlesForCommand(synthesized, [commandName]);

        return res.json({
            success: true,
            data: {
                command: synthesized,
                isDangerous,
                dangerLevel,
                warningMessage,
                matchedArticles
            }
        });
    } catch (err) {
        console.error('Error synthesizing command:', err);
        return res.status(500).json({ success: false, message: 'Server error synthesizing command.' });
    }
});

// ============================================================
// 3. POST /api/commands/ai-synthesize – Natural Language to Git Command (Groq AI)
// ============================================================
router.post('/ai-synthesize', authenticateToken, async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({ success: false, message: 'Please provide a prompt describing what you want to achieve.' });
        }

        const trimmedPrompt = prompt.trim();

        // 1. Try Groq AI Synthesis
        if (groqClient) {
            try {
                const completion = await groqClient.chat.completions.create({
                    model: 'openai/gpt-oss-120b',
                    messages: [
                        { role: 'system', content: SYSTEM_SYNTHESIZER_PROMPT },
                        { role: 'user', content: `Developer request:\n"${trimmedPrompt}"\nSynthesize the exact Git command and return the JSON response.` }
                    ],
                    response_format: { type: 'json_object' },
                    temperature: 0.2,
                    max_tokens: 900
                });

                const rawContent = completion.choices[0]?.message?.content || '{}';
                const aiResult = JSON.parse(rawContent);

                const matchedArticles = await findRelatedArticlesForCommand(
                    aiResult.command || trimmedPrompt,
                    [aiResult.category, ...(aiResult.breakdown?.map(b => b.part) || [])]
                );

                const dangerLevel = aiResult.dangerLevel || (aiResult.isDangerous ? 'danger' : 'safe');
                const isDangerous = dangerLevel === 'danger' || Boolean(aiResult.isDangerous);

                return res.json({
                    success: true,
                    source: 'groq-ai',
                    model: 'openai/gpt-oss-120b',
                    data: {
                        command: aiResult.command || 'git status',
                        explanation: aiResult.explanation || 'Executes the requested Git action.',
                        breakdown: Array.isArray(aiResult.breakdown) ? aiResult.breakdown : [],
                        dangerLevel: dangerLevel,
                        isDangerous: isDangerous,
                        warningMessage: aiResult.warningMessage || (isDangerous ? 'This command performs destructive operations. Proceed with care.' : null),
                        bestPractice: aiResult.bestPractice || 'Verify branch state with git status before running.',
                        undoCommand: aiResult.undoCommand || null,
                        category: aiResult.category || 'Git Command',
                        matchedArticles: matchedArticles
                    }
                });
            } catch (groqErr) {
                console.error('[Commands] Groq AI synthesize error, falling back:', groqErr.message);
            }
        }

        // 2. Fallback Heuristic Synthesis
        const fallback = generateFallbackSynthesis(trimmedPrompt);
        const matchedArticles = await findRelatedArticlesForCommand(fallback.command, [fallback.category]);

        return res.json({
            success: true,
            source: 'fallback-engine',
            model: 'gitguide-rule-engine',
            data: {
                ...fallback,
                matchedArticles
            }
        });

    } catch (err) {
        console.error('Unhandled AI synthesize error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error synthesizing command.' });
    }
});

// ============================================================
// 4. POST /api/commands/ai-explain – Deep Command Breakdown & Risk Audit (Groq AI)
// ============================================================
router.post('/ai-explain', authenticateToken, async (req, res) => {
    try {
        const { command } = req.body;

        if (!command || !command.trim()) {
            return res.status(400).json({ success: false, message: 'Please provide a Git command to explain.' });
        }

        const trimmedCmd = command.trim();

        // 1. Try Groq AI Explanation
        if (groqClient) {
            try {
                const completion = await groqClient.chat.completions.create({
                    model: 'openai/gpt-oss-120b',
                    messages: [
                        { role: 'system', content: SYSTEM_EXPLAIN_PROMPT },
                        { role: 'user', content: `Explain and audit this Git command:\n"${trimmedCmd}"` }
                    ],
                    response_format: { type: 'json_object' },
                    temperature: 0.2,
                    max_tokens: 900
                });

                const rawContent = completion.choices[0]?.message?.content || '{}';
                const aiResult = JSON.parse(rawContent);

                const matchedArticles = await findRelatedArticlesForCommand(
                    trimmedCmd,
                    [aiResult.category, ...(aiResult.breakdown?.map(b => b.part) || [])]
                );

                const dangerLevel = aiResult.dangerLevel || (aiResult.isDangerous ? 'danger' : 'safe');
                const isDangerous = dangerLevel === 'danger' || Boolean(aiResult.isDangerous);

                return res.json({
                    success: true,
                    source: 'groq-ai',
                    model: 'openai/gpt-oss-120b',
                    data: {
                        command: aiResult.command || trimmedCmd,
                        explanation: aiResult.explanation || 'Explains the provided Git command.',
                        breakdown: Array.isArray(aiResult.breakdown) ? aiResult.breakdown : [],
                        dangerLevel: dangerLevel,
                        isDangerous: isDangerous,
                        warningMessage: aiResult.warningMessage || (isDangerous ? 'Destructive operation warning.' : null),
                        bestPractice: aiResult.bestPractice || 'Ensure working tree is committed or stashed before running.',
                        undoCommand: aiResult.undoCommand || null,
                        category: aiResult.category || 'Git Command',
                        matchedArticles: matchedArticles
                    }
                });
            } catch (groqErr) {
                console.error('[Commands] Groq AI explain error, falling back:', groqErr.message);
            }
        }

        // 2. Local Fallback Heuristic
        const parts = trimmedCmd.split(' ');
        const isDangerous = trimmedCmd.includes('--hard') || trimmedCmd.includes('clean') || trimmedCmd.includes('--force') || trimmedCmd.includes('-D');
        const dangerLevel = isDangerous ? 'danger' : 'safe';
        const warningMessage = isDangerous ? 'This command can permanently discard uncommitted changes or overwrite remote history.' : null;

        const breakdown = parts.map(p => ({
            part: p,
            meaning: p.startsWith('-') ? `Flag option: ${p}` : `Command token: ${p}`
        }));

        const matchedArticles = await findRelatedArticlesForCommand(trimmedCmd, parts);

        return res.json({
            success: true,
            source: 'fallback-engine',
            model: 'gitguide-rule-engine',
            data: {
                command: trimmedCmd,
                explanation: `Executes '${trimmedCmd}' in the Git repository workspace.`,
                breakdown,
                dangerLevel,
                isDangerous,
                warningMessage,
                bestPractice: 'Always verify branch status with git status beforehand.',
                undoCommand: null,
                category: 'Git Command',
                matchedArticles
            }
        });

    } catch (err) {
        console.error('Unhandled AI explain error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error analyzing command.' });
    }
});

module.exports = router;
