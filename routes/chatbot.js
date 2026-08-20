// ============================================================
// GitGuide – AI Chatbot API Route
// ============================================================
const express = require('express');
const db = require('../config/db');

const router = express.Router();

// Curated Category suggestions for quick access (matches reference design)
const QUICK_CATEGORIES = [
    {
        id: 'basics',
        icon: '🌱',
        title: 'Git Basics & Setup',
        prompt: 'How do I initialize and set up a new Git repository?',
        description: 'Initialize repos, first commits, status & staging'
    },
    {
        id: 'config',
        icon: '👤',
        title: 'Profile & Config',
        prompt: 'How to configure Git username, email, and SSH keys?',
        description: 'Set user.name, user.email, SSH keys & PAT'
    },
    {
        id: 'branching',
        icon: '🌿',
        title: 'Branching & Merging',
        prompt: 'How do I create, switch, and merge Git branches?',
        description: 'Create branches, checkout, merge, switch'
    },
    {
        id: 'conflicts',
        icon: '💥',
        title: 'Resolving Merge Conflicts',
        prompt: 'How to safely resolve merge conflicts step-by-step?',
        description: 'Conflict markers, aborting, merging & rebasing'
    },
    {
        id: 'push-pull',
        icon: '🚀',
        title: 'Push, Pull & Remote Errors',
        prompt: 'How do I fix rejected push and non-fast-forward errors?',
        description: 'Git push, pull, remote origin, fetch'
    },
    {
        id: 'undo',
        icon: '⏪',
        title: 'Undo Changes & Reset Commits',
        prompt: 'How to undo my last commit or discard unwanted changes?',
        description: 'Reset, restore, revert, reflog recovery'
    },
    {
        id: 'auth',
        icon: '🔑',
        title: 'Authentication & GitHub Tokens',
        prompt: 'How to fix GitHub Authentication Failed and setup Personal Access Tokens?',
        description: 'PAT tokens, SSH keys, credential helper'
    },
    {
        id: 'stash',
        icon: '🗄️',
        title: 'Stash & Discard Work',
        prompt: 'How to temporarily save uncommitted work using git stash?',
        description: 'Stash save, pop, list, drop, clean'
    }
];

// Rich Knowledge Base for Git & GitHub Queries
const KNOWLEDGE_BASE = [
    {
        id: 'basics',
        keywords: ['init', 'initialize', 'new repo', 'setup repo', 'start git', 'basics', 'first commit', 'setup'],
        topic: 'Git Repository Initialization',
        answer: `Here is how to initialize and configure a fresh Git repository:

### 1. Initialize the repository
\`\`\`bash
git init
\`\`\`

### 2. Configure your identity (if not already done)
\`\`\`bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
\`\`\`

### 3. Add and commit files
\`\`\`bash
git add .
git commit -m "feat: initial commit"
\`\`\`

### 4. Connect to GitHub remote repository
\`\`\`bash
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
\`\`\`

💡 **Pro Tip**: Use \`git status\` frequently to see unstaged changes and track your workflow state.`,
        relatedArticleId: 1
    },
    {
        id: 'config',
        keywords: ['username', 'email', 'profile', 'config', 'user.name', 'user.email', 'whoami', 'global config', 'set name', 'set email'],
        topic: 'Git User Configuration',
        answer: `To view or set your Git identity and configuration:

### Set your Global Name & Email
\`\`\`bash
git config --global user.name "John Doe"
git config --global user.email "john@example.com"
\`\`\`

### Verify Current Configuration
\`\`\`bash
git config --list --show-origin
git config user.name
git config user.email
\`\`\`

### Set Config for Only One Repository
If you are inside a specific project folder, omit the \`--global\` flag:
\`\`\`bash
git config user.email "work-email@company.com"
\`\`\``,
        relatedArticleId: 1
    },
    {
        id: 'branching',
        keywords: ['branch', 'branches', 'checkout', 'switch', 'create branch', 'new branch', 'list branch', 'delete branch', 'merge branch'],
        topic: 'Git Branching & Switching',
        answer: `Working with branches in Git:

### Create and switch to a new branch
\`\`\`bash
git checkout -b feature/my-new-feature
# Or using modern Git switch:
git switch -c feature/my-new-feature
\`\`\`

### View all branches
\`\`\`bash
git branch -a
\`\`\`

### Switch to an existing branch
\`\`\`bash
git checkout main
# Or:
git switch main
\`\`\`

### Delete a branch
\`\`\`bash
# Safe delete (only if merged)
git branch -d feature/old-branch

# Force delete unmerged branch
git branch -D feature/old-branch
\`\`\``,
        relatedArticleId: 2
    },
    {
        id: 'conflicts',
        keywords: ['conflict', 'conflicts', 'merge conflict', 'conflict marker', 'head', 'abort merge', 'rebase conflict', 'both modified'],
        topic: 'Resolving Merge Conflicts',
        answer: `When Git cannot automatically combine changes, follow these steps to resolve conflicts safely:

### 1. Identify conflicted files
\`\`\`bash
git status
\`\`\`
Look for files marked as **"both modified"**.

### 2. Open the file and inspect markers
Git marks the differences:
\`\`\`text
<<<<<<< HEAD (Your changes)
console.log("Current branch feature");
=======
console.log("Incoming branch main");
>>>>>>> main (Incoming changes)
\`\`\`
Edit the file to keep the desired code and remove all conflict markers.

### 3. Stage the resolved files & finalize
\`\`\`bash
git add <conflicted-file>
git commit -m "fix: resolve merge conflicts"
\`\`\`

### Need to cancel the merge?
\`\`\`bash
git merge --abort
# Or if rebasing:
git rebase --abort
\`\`\``,
        relatedArticleId: 1
    },
    {
        id: 'push-pull',
        keywords: ['rejected', 'push rejected', 'failed to push', 'non-fast-forward', 'updates were rejected', 'fetch first', 'push origin', 'push some refs'],
        topic: 'Fixing Push Rejected / Non-Fast-Forward Errors',
        answer: `This error occurs when the remote branch on GitHub contains commits that you don't have locally yet.

### Recommended Fix (Safe Pull & Merge/Rebase)
\`\`\`bash
# Pull remote updates first
git pull --rebase origin main

# If no conflicts, push your changes
git push origin main
\`\`\`

### If you intentionally want to overwrite remote (⚠️ Be careful):
\`\`\`bash
# Safest force push (protects teamwork)
git push origin main --force-with-lease
\`\`\`

⚠️ **Warning**: Never use plain \`git push --force\` on shared team branches like \`main\`!`,
        relatedArticleId: 3
    },
    {
        id: 'undo',
        keywords: ['undo', 'undo commit', 'reset', 'soft reset', 'hard reset', 'uncommit', 'wrong commit', 'amend', 'change commit message', 'discard changes', 'revert commit', 'undo last commit'],
        topic: 'Undoing Commits & Changes',
        answer: `Here are the best ways to undo commits depending on what you want to keep:

### 1. Undo last commit BUT keep your changed files (Safe)
\`\`\`bash
git reset --soft HEAD~1
\`\`\`
*Your changes remain staged and ready to re-commit.*

### 2. Undo commit and unstage files (Safe)
\`\`\`bash
git reset HEAD~1
\`\`\`
*Your changes remain in your working directory.*

### 3. Fix the message of the last commit
\`\`\`bash
git commit --amend -m "new: updated commit message"
\`\`\`

### 4. Completely discard the last commit AND all changes (⚠️ Destructive)
\`\`\`bash
git reset --hard HEAD~1
\`\`\`

💡 **Accidentally deleted a commit?** Use \`git reflog\` to find the commit hash and restore it with \`git reset --hard <hash>\`!`,
        relatedArticleId: 4
    },
    {
        id: 'auth',
        keywords: ['auth', 'authentication', 'authentication failed', 'token', 'pat', 'password', 'support for password authentication was removed', 'ssh', 'personal access token', 'permission denied'],
        topic: 'GitHub Authentication & Tokens',
        answer: `GitHub no longer accepts account passwords for Git operations. You must use a **Personal Access Token (PAT)** or **SSH Keys**.

### Option A: Using Personal Access Token (PAT)
1. Go to GitHub → **Settings** → **Developer Settings** → **Personal Access Tokens** → **Tokens (classic)**.
2. Click **Generate new token (classic)** and select \`repo\` and \`workflow\` scopes.
3. Copy the token (starts with \`ghp_\`).
4. When Git asks for password in terminal, paste the token instead.

### Cache Credentials so you don't type it again
\`\`\`bash
# On Windows:
git config --global credential.helper wincred

# On Mac:
git config --global credential.helper osxkeychain
\`\`\`

### Option B: Set Up SSH Key
\`\`\`bash
ssh-keygen -t ed25519 -C "your.email@example.com"
# Copy public key:
cat ~/.ssh/id_ed25519.pub
\`\`\`
Add this key to GitHub → **Settings** → **SSH and GPG keys**.`,
        relatedArticleId: 5
    },
    {
        id: 'stash',
        keywords: ['stash', 'save work', 'stash pop', 'stash apply', 'stash list', 'temporary save', 'clean', 'uncommitted'],
        topic: 'Git Stash & Work in Progress',
        answer: `Use \`git stash\` when you need to switch branches quickly without committing incomplete work:

### Save your current uncommitted changes
\`\`\`bash
git stash push -m "WIP: login form validation"
\`\`\`

### See saved stashes
\`\`\`bash
git stash list
\`\`\`

### Restore your saved changes and remove from stash list
\`\`\`bash
git stash pop
\`\`\`

### Restore changes but keep them in stash
\`\`\`bash
git stash apply
\`\`\`

### Discard all untracked files
\`\`\`bash
git clean -fd
\`\`\``,
        relatedArticleId: 6
    },
    {
        id: 'rebase',
        keywords: ['rebase', 'merge vs rebase', 'rebase interactive', 'squash', 'rebase main', 'interactive rebase', 'squash commits'],
        topic: 'Git Rebase vs Merge & Squashing',
        answer: `### Merge vs Rebase
- **\`git merge\`**: Creates a new merge commit. Preserves exact history chronologically.
- **\`git rebase\`**: Moves your entire feature branch to begin on the tip of the target branch. Creates a clean linear history.

### How to Rebase onto Main
\`\`\`bash
git checkout feature-branch
git fetch origin
git rebase origin/main
\`\`\`

### Squash multiple commits into one
\`\`\`bash
# Squash the last 3 commits
git rebase -i HEAD~3
\`\`\`
In the editor, keep the first commit as \`pick\` and change the others to \`squash\` (or \`s\`). Save and exit!`,
        relatedArticleId: 7
    },
    {
        id: 'cherry-pick',
        keywords: ['cherry-pick', 'cherrypick', 'copy commit', 'apply commit', 'cherry pick'],
        topic: 'Git Cherry-Pick',
        answer: `\`git cherry-pick\` allows you to pick an individual commit from another branch and apply it to your current branch.

### How to use:
\`\`\`bash
# 1. Switch to target branch
git checkout main

# 2. Apply specific commit hash
git cherry-pick 7b3e21a
\`\`\`

### If there are conflicts:
\`\`\`bash
# Resolve files, then:
git add .
git cherry-pick --continue

# Or abort:
git cherry-pick --abort
\`\`\``,
        relatedArticleId: 8
    },
    {
        id: 'unrelated-histories',
        keywords: ['unrelated histories', 'fatal: refusing to merge unrelated histories', 'unrelated history', 'refusing to merge'],
        topic: 'Fixing "refusing to merge unrelated histories"',
        answer: `This happens when merging two repositories that were started independently (common when pulling a newly created GitHub repo with a README).

### Solution:
\`\`\`bash
git pull origin main --allow-unrelated-histories
\`\`\`
Then resolve any conflicts, stage, and commit:
\`\`\`bash
git add .
git commit -m "merge: allow unrelated histories"
git push origin main
\`\`\``,
        relatedArticleId: 3
    },
    {
        id: 'detached-head',
        keywords: ['detached head', 'you are in detached head state', 'detached', 'detached head state'],
        topic: 'Fixing Detached HEAD State',
        answer: `A "Detached HEAD" means you checked out a specific commit hash or tag rather than a branch. Commits made here won't belong to any branch.

### How to fix:
### 1. If you made new commits you want to keep:
\`\`\`bash
git switch -c new-feature-branch
\`\`\`
*This saves all your work into a new branch!*

### 2. If you just want to return to main branch without saving:
\`\`\`bash
git switch main
# Or:
git checkout main
\`\`\``,
        relatedArticleId: 2
    },
    {
        id: 'clone-pr',
        keywords: ['clone', 'fork', 'download repo', 'git clone', 'pull request', 'pr', 'contribute', 'upstream'],
        topic: 'Cloning, Forking & Open Source PRs',
        answer: `Standard workflow for contributing to open source:

### 1. Fork repository on GitHub, then clone your fork:
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/PROJECT.git
cd PROJECT
\`\`\`

### 2. Add upstream repository to stay updated:
\`\`\`bash
git remote add upstream https://github.com/ORIGINAL_OWNER/PROJECT.git
\`\`\`

### 3. Sync changes from upstream:
\`\`\`bash
git fetch upstream
git checkout main
git merge upstream/main
\`\`\`

### 4. Create branch, commit, and push to make a PR:
\`\`\`bash
git checkout -b fix/issue-123
git commit -am "fix: correct typo in docs"
git push origin fix/issue-123
\`\`\`
Go to GitHub and click **"Compare & Pull Request"**!`,
        relatedArticleId: 9
    }
];

// Helper: Match best knowledge response or database records
function findBestKnowledgeMatch(query) {
    const q = query.toLowerCase().trim();
    const queryTokens = q.split(/\s+/).filter(t => t.length > 2);
    let bestMatch = null;
    let highestScore = 0;

    // Check knowledge base
    for (const item of KNOWLEDGE_BASE) {
        let score = 0;
        for (const kw of item.keywords) {
            const kwLower = kw.toLowerCase();
            // Exact phrase match
            if (q.includes(kwLower)) {
                score += kwLower.length * 4;
            } else {
                // Token matches
                const kwTokens = kwLower.split(/\s+/);
                for (const qt of queryTokens) {
                    if (kwTokens.includes(qt)) {
                        score += qt.length * 2.5;
                    }
                }
            }
        }
        if (score > highestScore) {
            highestScore = score;
            bestMatch = item;
        }
    }

    // Also check SQLite database error patterns and articles
    let dbArticleMatch = null;
    try {
        const errorPatterns = db.prepare(`
            SELECT ep.id, ep.title, ep.keywords, ep.solution, ep.article_id, a.title AS articleTitle
            FROM error_patterns ep
            LEFT JOIN articles a ON a.id = ep.article_id
        `).all();

        for (const ep of errorPatterns) {
            const keywords = ep.keywords ? JSON.parse(ep.keywords) : [];
            let score = 0;
            for (const kw of keywords) {
                const kwLower = kw.toLowerCase();
                if (q.includes(kwLower)) {
                    score += kwLower.length * 3.5;
                } else {
                    for (const qt of queryTokens) {
                        if (kwLower.includes(qt)) {
                            score += qt.length * 2;
                        }
                    }
                }
            }
            if (score > highestScore) {
                highestScore = score;
                bestMatch = {
                    topic: ep.title,
                    answer: `### Solution for "${ep.title}":\n\n${ep.solution}\n\n💡 Need full step-by-step guidance? Check out the guide linked below!`,
                    relatedArticleId: ep.article_id
                };
            }
        }

        // Search articles table
        const articles = db.prepare(`
            SELECT id, title, description, keywords, commands FROM articles
        `).all();

        for (const art of articles) {
            let score = 0;
            const titleLower = art.title.toLowerCase();
            if (q.includes(titleLower) || titleLower.includes(q)) {
                score += 25;
            }
            if (art.keywords) {
                try {
                    const tags = JSON.parse(art.keywords);
                    for (const tag of tags) {
                        if (q.includes(tag.toLowerCase())) {
                            score += 10;
                        }
                    }
                } catch(e) {}
            }
            if (score > 15 && (!bestMatch || score > highestScore)) {
                dbArticleMatch = art;
            }
        }
    } catch (err) {
        console.warn('[Chatbot] SQLite search warning:', err.message);
    }

    return { bestMatch, dbArticleMatch, score: highestScore };
}

// GET /api/chatbot/categories – List curated quick category prompts
router.get('/categories', (req, res) => {
    return res.json({
        success: true,
        data: QUICK_CATEGORIES
    });
});

// POST /api/chatbot/query – Handle user queries with AI & Knowledge Engine
router.post('/query', async (req, res) => {
    try {
        const { query, categoryId } = req.body;

        if (!query || !query.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a question or command to ask GitCat.'
            });
        }

        const cleanQuery = query.trim();

        // Check if categoryId is passed directly
        if (categoryId) {
            const cat = QUICK_CATEGORIES.find(c => c.id === categoryId);
            const kbItem = KNOWLEDGE_BASE.find(k => k.id === categoryId);
            if (kbItem) {
                let articleLink = null;
                if (kbItem.relatedArticleId) {
                    try {
                        const row = db.prepare('SELECT id, title FROM articles WHERE id = ?').get(kbItem.relatedArticleId);
                        if (row) articleLink = { id: row.id, title: row.title };
                    } catch (e) { }
                }

                return res.json({
                    success: true,
                    topic: kbItem.topic,
                    message: kbItem.answer,
                    relatedArticle: articleLink,
                    suggestedQuestions: QUICK_CATEGORIES.filter(c => c.id !== categoryId).slice(0, 3).map(c => c.prompt)
                });
            }
        }

        // Search Knowledge Engine
        const { bestMatch, dbArticleMatch, score } = findBestKnowledgeMatch(cleanQuery);

        if (bestMatch && score >= 5) {
            let articleLink = null;
            if (bestMatch.relatedArticleId) {
                try {
                    const row = db.prepare('SELECT id, title FROM articles WHERE id = ?').get(bestMatch.relatedArticleId);
                    if (row) {
                        articleLink = { id: row.id, title: row.title };
                    }
                } catch (e) { }
            }

            return res.json({
                success: true,
                topic: bestMatch.topic,
                message: bestMatch.answer,
                relatedArticle: articleLink,
                suggestedQuestions: [
                    'How to resolve merge conflicts?',
                    'How to undo last commit safely?',
                    'How to fix push rejected non-fast-forward?'
                ]
            });
        }

        // If article was matched in DB
        if (dbArticleMatch) {
            return res.json({
                success: true,
                topic: dbArticleMatch.title,
                message: `### ${dbArticleMatch.title}\n\n${dbArticleMatch.description}\n\nHere is what you need to know:\n\n\`\`\`bash\n# Inspect your repository state\ngit status\n\`\`\`\n\n💡 I found an in-depth GitGuide article for this topic. Click below to read the complete guide!`,
                relatedArticle: {
                    id: dbArticleMatch.id,
                    title: dbArticleMatch.title
                },
                suggestedQuestions: [
                    'Show basic Git setup steps',
                    'How to switch branches',
                    'Explain Git rebase vs merge'
                ]
            });
        }

        // Generic intelligent answer for any other Git question
        return res.json({
            success: true,
            topic: 'Git Assistance',
            message: `I'm happy to help with **"${cleanQuery}"**! 

Here are the key diagnostic commands to inspect your current state:

\`\`\`bash
# 1. Check current repository status
git status

# 2. View commit history
git log --oneline -n 5

# 3. Check active branches & remote
git branch -vv
git remote -v
\`\`\`

💡 **Try one of the quick categories** like *Resolving Merge Conflicts*, *Branching*, or *Undo Changes*, or paste your exact terminal error message for instant diagnosis!`,
            suggestedQuestions: [
                'How to resolve merge conflicts?',
                'How to undo last commit?',
                'How to set user.name and user.email?'
            ]
        });

    } catch (err) {
        console.error('Chatbot API error:', err);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while generating the AI answer.'
        });
    }
});

module.exports = router;
