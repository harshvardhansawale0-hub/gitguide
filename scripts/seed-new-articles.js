// ============================================================
// GitGuide – New Articles Seed Script
// Adds ~91 new articles WITHOUT modifying existing ones
// ============================================================
const db = require('../config/db');

// All new articles starting from ID 25
const newArticles = [

// ================================================================
// GIT BASICS (category_id: 1) – 12 new articles
// ================================================================
{
    id: 25, title: "Git Diff Explained", category_id: 1, difficulty: "Beginner",
    description: "Learn how to compare changes in your working directory, staging area, and commits using git diff.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["diff", "compare", "changes", "difference", "staged", "unstaged"]),
    commands: JSON.stringify(["git diff", "git diff --staged", "git diff HEAD"]),
    steps: [
        { title: "What is Git Diff?", content: "Git diff shows the differences between various states of your repository. It compares file contents line by line and shows exactly what was added, modified, or removed. Lines prefixed with '+' are additions and lines prefixed with '-' are deletions." },
        { title: "Compare Working Directory to Staging", content: "See changes you have made but not yet staged:", command: "git diff" },
        { title: "Compare Staging Area to Last Commit", content: "See changes that are staged and ready to be committed:", command: "git diff --staged\n# or the older synonym:\ngit diff --cached" },
        { title: "Compare Working Directory to Last Commit", content: "See all changes since the last commit, whether staged or not:", command: "git diff HEAD" },
        { title: "Compare Two Branches", content: "See the differences between two branches:", command: "git diff main..feature-branch\n# Or see just the file names:\ngit diff --name-only main..feature-branch" },
        { title: "Compare a Specific File", content: "Limit the diff output to a single file:", command: "git diff -- path/to/file.txt" }
    ],
    faqs: [
        { question: "How do I read diff output?", answer: "Lines starting with '-' (red) are removed lines. Lines starting with '+' (green) are added lines. The @@ markers show the line numbers where changes occur." },
        { question: "Can I get a summary instead of full diff?", answer: "Yes, use 'git diff --stat' to see a summary of how many files changed and how many lines were added/removed in each file." }
    ]
},
{
    id: 26, title: "Git Status Deep Dive", category_id: 1, difficulty: "Beginner",
    description: "Master the git status command to understand the state of your working directory and staging area.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["status", "tracked", "untracked", "modified", "staged", "working directory"]),
    commands: JSON.stringify(["git status", "git status -s"]),
    steps: [
        { title: "What Does Git Status Show?", content: "Git status displays the state of your working directory and staging area. It tells you which changes have been staged, which haven't, and which files aren't being tracked by Git." },
        { title: "Basic Status", content: "Run git status to see the full status report:", command: "git status" },
        { title: "Understanding the Output", content: "Git status groups files into three categories:\n\n1. Changes to be committed (staged) – shown in green\n2. Changes not staged for commit (modified but unstaged) – shown in red\n3. Untracked files (new files Git doesn't know about) – shown in red" },
        { title: "Short Status Format", content: "Get a compact one-line-per-file view:", command: "git status -s\n# Output codes: M = modified, A = added, D = deleted, ?? = untracked\n# Left column = staged, Right column = unstaged" },
        { title: "Show Branch Info", content: "Include tracking branch information:", command: "git status -b\n# Shows how many commits ahead/behind your tracking branch" }
    ],
    faqs: [
        { question: "What does 'nothing to commit, working tree clean' mean?", answer: "It means all your changes have been committed. There are no modified, staged, or untracked files in your working directory." }
    ]
},
{
    id: 27, title: "Git Config Advanced Settings", category_id: 1, difficulty: "Intermediate",
    description: "Go beyond basic setup and configure Git for maximum productivity with advanced configuration options.",
    reading_time: "6 min", author: "GitGuide Team",
    keywords: JSON.stringify(["config", "configuration", "settings", "global", "local", "editor", "default branch"]),
    commands: JSON.stringify(["git config", "git config --global", "git config --list"]),
    steps: [
        { title: "Config Levels", content: "Git has three configuration levels:\n\n1. System (/etc/gitconfig) – applies to all users\n2. Global (~/.gitconfig) – applies to your user account\n3. Local (.git/config) – applies to the current repository only\n\nLocal overrides global, which overrides system." },
        { title: "Set Your Default Editor", content: "Change the default text editor Git uses for commit messages:", command: "# Use VS Code:\ngit config --global core.editor \"code --wait\"\n\n# Use Nano:\ngit config --global core.editor \"nano\"\n\n# Use Vim:\ngit config --global core.editor \"vim\"" },
        { title: "Set Default Branch Name", content: "Change the default branch name for new repositories from 'master' to 'main':", command: "git config --global init.defaultBranch main" },
        { title: "Enable Auto-Coloring", content: "Make Git output colorful and easier to read:", command: "git config --global color.ui auto" },
        { title: "Configure Line Endings", content: "Handle line endings correctly across different operating systems:", command: "# On Windows:\ngit config --global core.autocrlf true\n\n# On Mac/Linux:\ngit config --global core.autocrlf input" },
        { title: "View All Configuration", content: "List all your current Git configuration settings:", command: "git config --list --show-origin" }
    ],
    faqs: [
        { question: "How do I remove a config setting?", answer: "Use 'git config --global --unset setting.name' to remove a specific setting. For example: git config --global --unset core.editor" },
        { question: "Where is the global config file stored?", answer: "On Mac/Linux it's at ~/.gitconfig. On Windows it's at C:\\Users\\YourName\\.gitconfig. You can also edit it directly with 'git config --global --edit'." }
    ]
},
{
    id: 28, title: "Understanding HEAD in Git", category_id: 1, difficulty: "Intermediate",
    description: "Learn what HEAD means in Git, how it works, and why it matters for your daily workflow.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["HEAD", "pointer", "reference", "current commit", "branch pointer"]),
    commands: JSON.stringify(["git log", "git rev-parse HEAD"]),
    steps: [
        { title: "What is HEAD?", content: "HEAD is a pointer that tells Git which commit you are currently working on. Think of it as 'you are here' on a map. Usually, HEAD points to a branch name (like 'main'), and that branch points to the latest commit." },
        { title: "See Where HEAD Points", content: "Check what HEAD currently references:", command: "git log --oneline -1\n# Or see the raw reference:\ncat .git/HEAD" },
        { title: "HEAD vs Branch vs Commit", content: "HEAD → points to a branch (e.g., main)\nBranch → points to a commit (e.g., abc1234)\n\nWhen you make a new commit, the branch moves forward and HEAD follows because it points to the branch." },
        { title: "HEAD Relatives", content: "You can reference previous commits relative to HEAD:", command: "# One commit before HEAD:\ngit show HEAD~1\n\n# Two commits before HEAD:\ngit show HEAD~2\n\n# The parent of a merge commit (second parent):\ngit show HEAD^2" },
        { title: "What is Detached HEAD?", content: "When HEAD points directly to a commit instead of a branch, you are in 'detached HEAD' state. This happens when you checkout a specific commit hash. Any commits you make won't belong to any branch unless you create one." }
    ],
    faqs: [
        { question: "Is HEAD always on the latest commit?", answer: "HEAD points to whatever commit you have checked out. Usually that is the latest commit on your current branch, but you can move HEAD to any commit using checkout or reset." }
    ]
},
{
    id: 29, title: "Git Aliases for Productivity", category_id: 1, difficulty: "Beginner",
    description: "Create custom shortcut commands in Git to speed up your daily workflow.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["alias", "shortcut", "productivity", "custom command", "abbreviation"]),
    commands: JSON.stringify(["git config --global alias"]),
    steps: [
        { title: "What are Git Aliases?", content: "Git aliases are custom shortcuts for frequently used commands. Instead of typing long commands every time, you can create short abbreviations that expand automatically." },
        { title: "Create Basic Aliases", content: "Set up common aliases to save time:", command: "git config --global alias.co checkout\ngit config --global alias.br branch\ngit config --global alias.ci commit\ngit config --global alias.st status" },
        { title: "Use Your Aliases", content: "Now you can use shorter commands:", command: "# Instead of 'git status':\ngit st\n\n# Instead of 'git checkout main':\ngit co main\n\n# Instead of 'git branch':\ngit br" },
        { title: "Create Advanced Aliases", content: "Create aliases for complex commands you use frequently:", command: "# Pretty log graph:\ngit config --global alias.lg \"log --oneline --graph --all --decorate\"\n\n# Undo last commit (keep changes):\ngit config --global alias.undo \"reset --soft HEAD~1\"\n\n# Show last commit:\ngit config --global alias.last \"log -1 HEAD\"" },
        { title: "List All Aliases", content: "View all your configured aliases:", command: "git config --get-regexp alias" }
    ],
    faqs: [
        { question: "Can I delete an alias?", answer: "Yes, use 'git config --global --unset alias.name'. For example: git config --global --unset alias.co" }
    ]
},
{
    id: 30, title: "Working with Git Tags", category_id: 1, difficulty: "Intermediate",
    description: "Learn how to create, list, and manage Git tags to mark important points in your project history like releases.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["tag", "version", "release", "annotated", "lightweight", "semantic versioning"]),
    commands: JSON.stringify(["git tag", "git tag -a", "git push --tags"]),
    steps: [
        { title: "What are Git Tags?", content: "Tags are references that point to specific commits, typically used to mark release versions (v1.0.0, v2.1.3). Unlike branches, tags don't move when new commits are made. There are two types: lightweight tags (just a pointer) and annotated tags (full objects with metadata)." },
        { title: "Create a Lightweight Tag", content: "Create a simple tag pointing to the current commit:", command: "git tag v1.0.0" },
        { title: "Create an Annotated Tag", content: "Create a tag with a message, tagger name, and date (recommended for releases):", command: "git tag -a v1.0.0 -m \"First stable release\"" },
        { title: "List and View Tags", content: "See all tags and inspect a specific one:", command: "# List all tags:\ngit tag\n\n# List tags matching a pattern:\ngit tag -l \"v1.*\"\n\n# Show tag details:\ngit show v1.0.0" },
        { title: "Push Tags to Remote", content: "Tags are not pushed automatically. Push them explicitly:", command: "# Push a specific tag:\ngit push origin v1.0.0\n\n# Push all tags:\ngit push --tags" },
        { title: "Delete a Tag", content: "Remove a tag locally and from the remote:", command: "# Delete locally:\ngit tag -d v1.0.0\n\n# Delete from remote:\ngit push origin --delete v1.0.0" }
    ],
    faqs: [
        { question: "What is semantic versioning?", answer: "Semantic versioning uses the format MAJOR.MINOR.PATCH (e.g., v2.1.3). MAJOR for breaking changes, MINOR for new features, PATCH for bug fixes." },
        { question: "Can I tag an older commit?", answer: "Yes, specify the commit hash: git tag -a v0.9.0 -m \"Beta release\" abc1234" }
    ]
},
{
    id: 31, title: "Git Blame – Track Line Changes", category_id: 1, difficulty: "Intermediate",
    description: "Use git blame to find out who last modified each line of a file and when the change was made.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["blame", "annotate", "who changed", "line history", "author", "track"]),
    commands: JSON.stringify(["git blame", "git log"]),
    steps: [
        { title: "What is Git Blame?", content: "Git blame shows the revision and author that last modified each line of a file. It is invaluable for understanding why a line of code exists and who to ask about it. Despite the name, it is not about assigning blame — it is about understanding history." },
        { title: "Blame a File", content: "See who last changed each line:", command: "git blame filename.js" },
        { title: "Blame Specific Lines", content: "Focus on a range of lines to reduce output:", command: "git blame -L 10,20 filename.js\n# Shows blame for lines 10 through 20" },
        { title: "Ignore Whitespace Changes", content: "Skip cosmetic changes like reformatting:", command: "git blame -w filename.js" },
        { title: "Show the Commit That Changed a Line", content: "Once you have a commit hash from blame, inspect it:", command: "git show abc1234" }
    ],
    faqs: [
        { question: "Is there a way to ignore specific commits in blame?", answer: "Yes, use 'git blame --ignore-rev <commit-hash>' to skip a specific commit (useful for large formatting changes). You can also create a .git-blame-ignore-revs file." }
    ]
},
{
    id: 32, title: "Git Show – Inspect Commits", category_id: 1, difficulty: "Beginner",
    description: "Learn how to use git show to inspect the details of any commit, tag, or object in your repository.",
    reading_time: "3 min", author: "GitGuide Team",
    keywords: JSON.stringify(["show", "inspect", "commit details", "view", "object"]),
    commands: JSON.stringify(["git show", "git log"]),
    steps: [
        { title: "What is Git Show?", content: "Git show displays detailed information about a Git object — usually a commit. It shows the commit message, author, date, and the full diff of changes introduced by that commit." },
        { title: "Show the Latest Commit", content: "View the most recent commit with its diff:", command: "git show" },
        { title: "Show a Specific Commit", content: "Inspect any commit by its hash:", command: "git show abc1234" },
        { title: "Show Only the Files Changed", content: "List only the file names without the diff:", command: "git show --stat abc1234" },
        { title: "Show a File at a Specific Commit", content: "View the contents of a file as it was at a particular commit:", command: "git show abc1234:path/to/file.js" }
    ],
    faqs: [
        { question: "What is the difference between git show and git log?", answer: "Git log shows a list of commits. Git show displays the full details (including diff) of a single commit. Use log to find commits, then show to inspect one." }
    ]
},
{
    id: 33, title: "Staging Partial Changes with git add -p", category_id: 1, difficulty: "Intermediate",
    description: "Learn how to selectively stage parts of a file using interactive patch mode for cleaner commits.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["add", "patch", "partial", "hunk", "interactive", "selective staging"]),
    commands: JSON.stringify(["git add -p", "git add --patch"]),
    steps: [
        { title: "Why Stage Partially?", content: "Sometimes you make multiple changes to a single file but want to split them into separate commits. Git add -p lets you review each change (called a 'hunk') and choose which ones to stage." },
        { title: "Start Interactive Staging", content: "Enter patch mode for a file:", command: "git add -p filename.js\n# Or for all files:\ngit add -p" },
        { title: "Understanding the Options", content: "For each hunk, Git asks what to do:\n\ny = stage this hunk\nn = skip this hunk\nq = quit (don't stage remaining hunks)\na = stage this and all remaining hunks\nd = skip this and all remaining hunks\ns = split this hunk into smaller pieces\ne = manually edit this hunk" },
        { title: "Verify What Was Staged", content: "After selecting hunks, verify your staging area:", command: "git diff --staged\n# This shows only the parts you staged" },
        { title: "Commit the Staged Changes", content: "Commit just the selected changes:", command: "git commit -m \"Fix validation logic\"\n# The remaining unstaged changes stay in your working directory" }
    ],
    faqs: [
        { question: "What if a hunk is too large?", answer: "Press 's' to split the hunk into smaller pieces. If it still cannot be split further, press 'e' to manually edit the hunk and choose exactly which lines to stage." }
    ]
},
{
    id: 34, title: "Understanding Git Workflow Models", category_id: 1, difficulty: "Intermediate",
    description: "Compare popular Git workflows including Centralized, Feature Branch, Gitflow, and Trunk-Based Development.",
    reading_time: "6 min", author: "GitGuide Team",
    keywords: JSON.stringify(["workflow", "gitflow", "trunk-based", "feature branch", "centralized", "strategy"]),
    commands: JSON.stringify(["git branch", "git merge", "git switch"]),
    steps: [
        { title: "Why Workflows Matter", content: "A Git workflow defines how your team uses branches, merges, and releases. Choosing the right workflow reduces conflicts, speeds up development, and keeps your repository organized." },
        { title: "Centralized Workflow", content: "Everyone works on a single branch (usually main). Simple but risky for teams because one broken commit affects everyone. Best for solo developers or very small teams." },
        { title: "Feature Branch Workflow", content: "Each new feature gets its own branch. Developers work in isolation and merge back into main when ready. This is the most common workflow for small-to-medium teams.", command: "git switch -c feature/user-auth\n# Work, commit, then merge:\ngit switch main\ngit merge feature/user-auth" },
        { title: "Gitflow Workflow", content: "A structured workflow with specific branch types:\n- main: production-ready code\n- develop: integration branch\n- feature/*: new features\n- release/*: release preparation\n- hotfix/*: urgent production fixes\n\nBest for projects with scheduled releases." },
        { title: "Trunk-Based Development", content: "Developers commit directly to main (or merge very short-lived branches). Relies on feature flags and continuous integration. Used by companies like Google and Facebook for rapid deployment." },
        { title: "Choosing a Workflow", content: "Small team, simple project → Feature Branch\nLarger team, scheduled releases → Gitflow\nContinuous deployment, experienced team → Trunk-Based\nSolo developer → Centralized or Feature Branch" }
    ],
    faqs: [
        { question: "Can I switch workflows later?", answer: "Yes, workflows are conventions, not Git features. You can evolve your workflow as your team grows. Many teams start with Feature Branch and move to Gitflow or Trunk-Based as needed." }
    ]
},
{
    id: 35, title: "Git Init vs Git Clone", category_id: 1, difficulty: "Beginner",
    description: "Understand the difference between starting a new repository with git init and copying an existing one with git clone.",
    reading_time: "3 min", author: "GitGuide Team",
    keywords: JSON.stringify(["init", "clone", "new repository", "start", "difference", "create"]),
    commands: JSON.stringify(["git init", "git clone"]),
    steps: [
        { title: "Git Init – Create from Scratch", content: "Use git init when you are starting a brand new project that does not exist on any remote server yet:", command: "mkdir my-new-project\ncd my-new-project\ngit init" },
        { title: "Git Clone – Copy Existing", content: "Use git clone when a repository already exists on GitHub or another server and you want a local copy:", command: "git clone https://github.com/username/existing-repo.git" },
        { title: "Key Differences", content: "git init:\n- Creates an empty repository\n- No remote configured\n- No existing history\n- You must add a remote manually\n\ngit clone:\n- Copies entire repository with full history\n- Remote 'origin' automatically configured\n- All branches available\n- Ready to push/pull immediately" },
        { title: "After Git Init – Connect to Remote", content: "If you used init and want to push to GitHub, add a remote:", command: "git remote add origin https://github.com/username/repo.git\ngit push -u origin main" }
    ],
    faqs: [
        { question: "Can I run git init in a folder that already has files?", answer: "Yes. Git init will create the .git directory and start tracking. Your existing files will appear as untracked until you add and commit them." }
    ]
},
{
    id: 36, title: "Introduction to Git Hooks", category_id: 1, difficulty: "Advanced",
    description: "Automate tasks by running custom scripts at key points in the Git workflow using hooks.",
    reading_time: "6 min", author: "GitGuide Team",
    keywords: JSON.stringify(["hooks", "pre-commit", "post-commit", "automation", "scripts", "husky"]),
    commands: JSON.stringify(["git commit", "chmod"]),
    steps: [
        { title: "What are Git Hooks?", content: "Git hooks are scripts that run automatically before or after Git events like commit, push, and merge. They live in the .git/hooks directory and can be used to enforce coding standards, run tests, or send notifications." },
        { title: "Available Hooks", content: "Common hooks include:\n\npre-commit: Runs before a commit is created (lint code, run tests)\ncommit-msg: Validate or modify commit messages\npre-push: Runs before pushing (run test suite)\npost-merge: Runs after a successful merge (install dependencies)\npre-rebase: Runs before a rebase starts" },
        { title: "Create a Pre-Commit Hook", content: "Create a hook that runs linting before every commit:", command: "# Create the hook file:\ncat > .git/hooks/pre-commit << 'EOF'\n#!/bin/sh\necho \"Running linter...\"\nnpm run lint\nif [ $? -ne 0 ]; then\n  echo \"Linting failed. Commit aborted.\"\n  exit 1\nfi\nEOF\n\n# Make it executable:\nchmod +x .git/hooks/pre-commit" },
        { title: "Important Notes", content: "Hooks in .git/hooks are NOT version-controlled (the .git directory is not pushed). To share hooks with your team, use tools like Husky (for Node.js projects) or store them in a separate directory and symlink them." },
        { title: "Using Husky for Team Hooks", content: "Husky makes it easy to share Git hooks through your package.json:", command: "npx husky-init && npm install\n# This creates a .husky directory with a pre-commit hook" }
    ],
    faqs: [
        { question: "Can I skip a hook temporarily?", answer: "Yes, use the --no-verify flag: git commit --no-verify -m \"Emergency fix\". This skips pre-commit and commit-msg hooks. Use sparingly." },
        { question: "Do hooks run on the server?", answer: "Server-side hooks (pre-receive, post-receive) run on the Git server. Client-side hooks run on developer machines. GitHub/GitLab provide their own CI/CD instead of server-side hooks." }
    ]
},

// ================================================================
// BRANCHING (category_id: 2) – 10 new articles
// ================================================================
{
    id: 37, title: "Git Rebase – Rewriting Branch History", category_id: 2, difficulty: "Advanced",
    description: "Learn how to use git rebase to create a linear commit history by replaying your changes on top of another branch.",
    reading_time: "7 min", author: "GitGuide Team",
    keywords: JSON.stringify(["rebase", "linear history", "replay", "rewrite", "onto", "squash"]),
    commands: JSON.stringify(["git rebase", "git rebase --abort", "git rebase --continue"]),
    steps: [
        { title: "What is Rebase?", content: "Rebase takes the commits from your current branch and replays them on top of another branch. Unlike merge, which creates a merge commit, rebase creates a linear history as if you wrote your changes after the latest commit on the target branch." },
        { title: "Basic Rebase", content: "Move your feature branch commits on top of the latest main:", command: "git switch feature-branch\ngit rebase main" },
        { title: "Handle Rebase Conflicts", content: "If conflicts arise during rebase, Git pauses and asks you to resolve them:", command: "# Fix the conflicting files, then:\ngit add .\ngit rebase --continue\n\n# Or abort the rebase entirely:\ngit rebase --abort" },
        { title: "The Golden Rule of Rebase", content: "WARNING: Never rebase commits that have been pushed to a shared branch. Rebase rewrites commit history, which creates problems for anyone who has already based work on those commits. Only rebase your own local, unpushed commits." },
        { title: "Rebase vs Merge", content: "Use rebase for:\n- Cleaning up local commits before merging\n- Keeping a linear project history\n- Feature branches before creating a pull request\n\nUse merge for:\n- Shared branches (main, develop)\n- Preserving the exact history of how features were integrated" },
        { title: "Rebase onto a Specific Branch", content: "Rebase a branch onto a different base:", command: "git rebase --onto main feature-a feature-b\n# Replays feature-b commits that are not in feature-a onto main" }
    ],
    faqs: [
        { question: "What happens if I rebase after pushing?", answer: "Your local and remote histories will diverge. You would need to force push (git push --force-with-lease), which can cause problems for teammates. Always coordinate with your team before force pushing." }
    ]
},
{
    id: 38, title: "Interactive Rebase Guide", category_id: 2, difficulty: "Advanced",
    description: "Use interactive rebase to squash, reorder, edit, and clean up your commit history before merging.",
    reading_time: "6 min", author: "GitGuide Team",
    keywords: JSON.stringify(["interactive rebase", "squash", "fixup", "reorder", "edit", "reword"]),
    commands: JSON.stringify(["git rebase -i", "git rebase --interactive"]),
    steps: [
        { title: "What is Interactive Rebase?", content: "Interactive rebase opens an editor showing your recent commits and lets you choose what to do with each one: keep, edit, squash, reorder, or drop. It is the most powerful tool for cleaning up your commit history." },
        { title: "Start an Interactive Rebase", content: "Rebase the last N commits interactively:", command: "# Edit the last 4 commits:\ngit rebase -i HEAD~4" },
        { title: "Understanding the Commands", content: "In the editor, each line shows a commit with a command prefix:\n\npick = use the commit as-is\nreword = use the commit but edit the message\nedit = pause at this commit to amend it\nsquash = combine with previous commit (keep both messages)\nfixup = combine with previous commit (discard this message)\ndrop = remove the commit entirely" },
        { title: "Squash Commits Together", content: "Combine multiple commits into one clean commit. Change 'pick' to 'squash' for the commits you want to fold in:", command: "# In the editor, change:\npick abc1234 Add login form\npick def5678 Fix typo in login\npick ghi9012 Update login styles\n\n# To:\npick abc1234 Add login form\nsquash def5678 Fix typo in login\nsquash ghi9012 Update login styles" },
        { title: "Reorder Commits", content: "Simply rearrange the lines in the editor to change the order of commits. Be careful — reordering can cause conflicts if commits depend on each other." },
        { title: "Abort if Something Goes Wrong", content: "If the rebase gets complicated, you can always abort:", command: "git rebase --abort\n# Returns everything to the state before the rebase" }
    ],
    faqs: [
        { question: "Should I squash before merging a pull request?", answer: "Many teams prefer squashing feature branch commits into one clean commit before merging. GitHub and GitLab offer 'Squash and merge' buttons that do this automatically." }
    ]
},
{
    id: 39, title: "Branch Protection Rules", category_id: 2, difficulty: "Intermediate",
    description: "Set up branch protection rules to prevent direct pushes to important branches and enforce code review.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["protection", "rules", "prevent push", "require review", "main branch", "enforce"]),
    commands: JSON.stringify(["git push"]),
    steps: [
        { title: "Why Protect Branches?", content: "Branch protection rules prevent accidental or unauthorized changes to critical branches like main or production. They enforce best practices like code review and passing tests before changes can be merged." },
        { title: "Common Protection Rules", content: "Popular rules to enable:\n\n1. Require pull request reviews before merging\n2. Require status checks to pass (CI/CD tests)\n3. Prevent force pushes\n4. Prevent branch deletion\n5. Require signed commits\n6. Require linear history (no merge commits)" },
        { title: "Set Up on GitHub", content: "Go to your repository → Settings → Branches → Add branch protection rule. Enter 'main' as the branch name pattern, then select the rules you want to enforce." },
        { title: "What Happens When Rules Are Active", content: "When protection is enabled:\n- Direct pushes to the protected branch are rejected\n- Merges require approved pull requests\n- Force pushes are blocked\n- The branch cannot be deleted\n\nAdmins can optionally bypass these rules." },
        { title: "Working with Protected Branches", content: "The standard workflow with protected branches:", command: "# Create a feature branch:\ngit switch -c feature/new-feature\n\n# Make changes and push:\ngit push -u origin feature/new-feature\n\n# Then create a Pull Request on GitHub for review" }
    ],
    faqs: [
        { question: "Can admins bypass protection rules?", answer: "Yes, there is an option to 'Include administrators' in the protection settings. If unchecked, admins can push directly or force push. For maximum safety, include admins." }
    ]
},
{
    id: 40, title: "Git Branch Strategies – Gitflow Explained", category_id: 2, difficulty: "Intermediate",
    description: "Deep dive into the Gitflow branching model with its structured approach to development, releases, and hotfixes.",
    reading_time: "7 min", author: "GitGuide Team",
    keywords: JSON.stringify(["gitflow", "strategy", "develop", "release", "hotfix", "feature branch"]),
    commands: JSON.stringify(["git switch -c", "git merge --no-ff"]),
    steps: [
        { title: "What is Gitflow?", content: "Gitflow is a branching model designed by Vincent Driessen. It defines a strict branching structure with specific roles for different branch types. It works well for projects with scheduled release cycles." },
        { title: "Branch Types in Gitflow", content: "main – always contains production-ready code\ndevelop – integration branch for features\nfeature/* – individual feature development\nrelease/* – preparing a new production release\nhotfix/* – urgent fixes for production bugs" },
        { title: "Feature Development", content: "Create feature branches from develop:", command: "git switch develop\ngit switch -c feature/shopping-cart\n\n# Work on the feature, then merge back:\ngit switch develop\ngit merge --no-ff feature/shopping-cart\ngit branch -d feature/shopping-cart" },
        { title: "Release Process", content: "When develop has enough features for a release:", command: "git switch develop\ngit switch -c release/1.2.0\n\n# Fix bugs, update version numbers, then:\ngit switch main\ngit merge --no-ff release/1.2.0\ngit tag -a v1.2.0 -m \"Release 1.2.0\"\n\n# Also merge back into develop:\ngit switch develop\ngit merge --no-ff release/1.2.0\ngit branch -d release/1.2.0" },
        { title: "Hotfix Process", content: "For urgent production fixes:", command: "git switch main\ngit switch -c hotfix/fix-payment-bug\n\n# Fix the bug, then merge into both main and develop:\ngit switch main\ngit merge --no-ff hotfix/fix-payment-bug\ngit tag -a v1.2.1 -m \"Hotfix 1.2.1\"\n\ngit switch develop\ngit merge --no-ff hotfix/fix-payment-bug\ngit branch -d hotfix/fix-payment-bug" }
    ],
    faqs: [
        { question: "Is Gitflow still recommended?", answer: "Gitflow is excellent for projects with scheduled releases. However, for continuous deployment, many teams prefer simpler workflows like GitHub Flow or Trunk-Based Development. Choose based on your release cadence." }
    ]
},
{
    id: 41, title: "Renaming Git Branches", category_id: 2, difficulty: "Beginner",
    description: "Learn how to rename local and remote Git branches safely without losing any history.",
    reading_time: "3 min", author: "GitGuide Team",
    keywords: JSON.stringify(["rename", "branch", "change name", "move", "local", "remote"]),
    commands: JSON.stringify(["git branch -m", "git push origin --delete"]),
    steps: [
        { title: "Rename the Current Branch", content: "If you are already on the branch you want to rename:", command: "git branch -m new-name" },
        { title: "Rename a Different Branch", content: "Rename a branch you are NOT currently on:", command: "git branch -m old-name new-name" },
        { title: "Update the Remote", content: "After renaming locally, update the remote by deleting the old name and pushing the new one:", command: "# Delete the old remote branch:\ngit push origin --delete old-name\n\n# Push the renamed branch:\ngit push -u origin new-name" },
        { title: "Notify Your Team", content: "Other developers will need to update their local references. They should run:", command: "git fetch --all --prune\ngit switch new-name" }
    ],
    faqs: [
        { question: "Will renaming a branch lose my commits?", answer: "No. Renaming a branch only changes the label. All commits, history, and file changes are preserved exactly as they were." }
    ]
},
{
    id: 42, title: "Tracking Remote Branches", category_id: 2, difficulty: "Intermediate",
    description: "Understand how local branches track remote branches and how to set up or change tracking relationships.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["tracking", "upstream", "remote branch", "set-upstream", "origin"]),
    commands: JSON.stringify(["git branch -vv", "git branch --set-upstream-to"]),
    steps: [
        { title: "What is a Tracking Branch?", content: "A tracking branch is a local branch that has a direct relationship to a remote branch. When you clone a repository, your local 'main' automatically tracks 'origin/main'. This lets you use git push and git pull without specifying the remote each time." },
        { title: "View Tracking Relationships", content: "See which local branches track which remote branches:", command: "git branch -vv\n# Output shows: branch hash [upstream] message" },
        { title: "Set Up Tracking", content: "Link a local branch to a remote branch:", command: "# When pushing a new branch for the first time:\ngit push -u origin feature-branch\n\n# Or set tracking explicitly:\ngit branch --set-upstream-to=origin/feature-branch feature-branch" },
        { title: "Change Tracking Branch", content: "Point your local branch to a different remote branch:", command: "git branch --set-upstream-to=origin/new-remote-branch" },
        { title: "Check Ahead/Behind Status", content: "After setting tracking, git status tells you how many commits ahead or behind you are:", command: "git status\n# Output: Your branch is ahead of 'origin/main' by 3 commits" }
    ],
    faqs: [
        { question: "What happens if the remote branch is deleted?", answer: "Your local branch keeps working but loses its tracking reference. Run 'git fetch --prune' to clean up references to deleted remote branches, then set a new upstream if needed." }
    ]
},
{
    id: 43, title: "Working with Long-Lived Branches", category_id: 2, difficulty: "Intermediate",
    description: "Best practices for managing branches that exist for extended periods alongside the main branch.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["long-lived", "persistent", "develop", "staging", "environment", "sync"]),
    commands: JSON.stringify(["git merge", "git rebase", "git switch"]),
    steps: [
        { title: "What are Long-Lived Branches?", content: "Long-lived branches exist alongside main for extended periods. Common examples include 'develop', 'staging', and 'production'. Unlike feature branches that are merged and deleted, these branches persist throughout the project lifecycle." },
        { title: "Keep Them in Sync", content: "Regularly merge main into long-lived branches to prevent massive drift:", command: "git switch develop\ngit merge main\n# Resolve any conflicts and commit" },
        { title: "Common Long-Lived Branch Setup", content: "A typical setup:\n\nmain → production-ready code (deployed to production)\nstaging → pre-production testing (deployed to staging server)\ndevelop → active development (deployed to dev server)\n\nCode flows: feature → develop → staging → main" },
        { title: "Avoid Divergence", content: "The longer a branch lives without syncing, the harder merges become. Best practices:\n\n1. Merge or rebase from main at least weekly\n2. Keep the number of long-lived branches minimal\n3. Use CI/CD to test each branch independently\n4. Never let branches diverge for more than a sprint" },
        { title: "Promoting Changes Between Branches", content: "Move code through your branch hierarchy:", command: "# Feature complete, merge into develop:\ngit switch develop\ngit merge --no-ff feature/new-api\n\n# Ready for testing, merge into staging:\ngit switch staging\ngit merge develop\n\n# Tested and approved, merge into main:\ngit switch main\ngit merge staging\ngit tag -a v2.0.0 -m \"Release 2.0\"" }
    ],
    faqs: [
        { question: "How many long-lived branches should I have?", answer: "As few as possible. Most projects need only main. Larger teams may add develop and staging. Each additional branch increases maintenance overhead." }
    ]
},
{
    id: 44, title: "Comparing Branches with Git Diff", category_id: 2, difficulty: "Beginner",
    description: "Learn how to compare two branches to see what changes exist between them before merging.",
    reading_time: "3 min", author: "GitGuide Team",
    keywords: JSON.stringify(["compare", "branches", "diff", "difference", "before merge"]),
    commands: JSON.stringify(["git diff", "git log"]),
    steps: [
        { title: "Why Compare Branches?", content: "Before merging, it is helpful to see exactly what changes a branch introduces. This helps you anticipate merge conflicts and review the scope of changes." },
        { title: "See All Differences", content: "Compare the full diff between two branches:", command: "git diff main..feature-branch" },
        { title: "See Only Changed File Names", content: "Get a quick overview of which files were modified:", command: "git diff --name-only main..feature-branch\n# Or with status indicators (A/M/D):\ngit diff --name-status main..feature-branch" },
        { title: "See Commits Unique to a Branch", content: "List commits that exist in feature but not in main:", command: "git log main..feature-branch --oneline" },
        { title: "Statistical Summary", content: "Get a summary of additions and deletions per file:", command: "git diff --stat main..feature-branch" }
    ],
    faqs: [
        { question: "What does the '..' notation mean?", answer: "The double-dot notation (main..feature) means 'show changes that are in feature but not in main'. Triple-dot (main...feature) shows changes on both sides since the branches diverged." }
    ]
},
{
    id: 45, title: "Feature Branch Workflow", category_id: 2, difficulty: "Beginner",
    description: "Master the most popular Git workflow where each feature gets its own dedicated branch.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["feature branch", "workflow", "pull request", "code review", "team"]),
    commands: JSON.stringify(["git switch -c", "git push -u", "git merge"]),
    steps: [
        { title: "How It Works", content: "In the Feature Branch workflow, no work happens directly on main. Every new feature, bug fix, or improvement gets its own branch. When the work is complete, it is merged back into main through a pull request." },
        { title: "Step 1: Create a Feature Branch", content: "Start from an up-to-date main branch:", command: "git switch main\ngit pull origin main\ngit switch -c feature/user-profile" },
        { title: "Step 2: Work and Commit", content: "Make changes on your feature branch with regular commits:", command: "# Make changes...\ngit add .\ngit commit -m \"Add user profile page layout\"\n\n# Continue working...\ngit add .\ngit commit -m \"Add profile photo upload\"" },
        { title: "Step 3: Push and Create Pull Request", content: "Push your branch and open a pull request for review:", command: "git push -u origin feature/user-profile\n# Go to GitHub and create a Pull Request" },
        { title: "Step 4: Review, Merge, and Clean Up", content: "After the pull request is approved and merged:", command: "git switch main\ngit pull origin main\n\n# Delete the feature branch:\ngit branch -d feature/user-profile\ngit push origin --delete feature/user-profile" }
    ],
    faqs: [
        { question: "How long should a feature branch live?", answer: "Ideally, a few days to two weeks maximum. Long-lived feature branches increase the risk of merge conflicts. Break large features into smaller, mergeable pieces." }
    ]
},
{
    id: 46, title: "Release Branch Workflow", category_id: 2, difficulty: "Intermediate",
    description: "Learn how to use release branches to prepare, stabilize, and ship new versions of your software.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["release", "branch", "version", "stabilize", "ship", "deploy"]),
    commands: JSON.stringify(["git switch -c", "git merge", "git tag"]),
    steps: [
        { title: "What is a Release Branch?", content: "A release branch is created when you want to prepare a new production release. It allows the team to stabilize the release (fix bugs, update docs) while other developers continue working on new features in develop." },
        { title: "Create a Release Branch", content: "Branch off from develop when features are complete:", command: "git switch develop\ngit switch -c release/2.0.0" },
        { title: "Stabilize the Release", content: "On the release branch, only fix bugs and update version numbers. No new features.\n\nTypical activities:\n- Fix bugs found during QA testing\n- Update version numbers in package.json\n- Update changelog and documentation\n- Final performance testing" },
        { title: "Finish the Release", content: "Merge into main and tag, then merge back into develop:", command: "# Merge into main:\ngit switch main\ngit merge --no-ff release/2.0.0\ngit tag -a v2.0.0 -m \"Release 2.0.0\"\ngit push origin main --tags\n\n# Merge back into develop:\ngit switch develop\ngit merge --no-ff release/2.0.0\ngit push origin develop\n\n# Delete the release branch:\ngit branch -d release/2.0.0" },
        { title: "When to Use Release Branches", content: "Release branches are valuable when:\n- Multiple features need to be bundled into a release\n- QA testing takes time\n- You need to support multiple production versions\n- You want a clear separation between development and release preparation" }
    ],
    faqs: [
        { question: "Should every release have its own branch?", answer: "If your team deploys continuously, you may not need release branches. They are most useful when releases are batched and need a stabilization period." }
    ]
},

// ================================================================
// MERGING (category_id: 3) – 10 new articles
// ================================================================
{
    id: 47, title: "Merge vs Rebase – A Decision Guide", category_id: 3, difficulty: "Intermediate",
    description: "Understand when to use merge and when to use rebase with clear scenarios and trade-offs.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["merge vs rebase", "decision", "comparison", "trade-offs", "when to use"]),
    commands: JSON.stringify(["git merge", "git rebase"]),
    steps: [
        { title: "The Core Difference", content: "Merge combines two branches by creating a new merge commit. It preserves the exact history.\n\nRebase replays your commits on top of another branch. It creates a linear history as if you worked sequentially." },
        { title: "When to Use Merge", content: "Use merge when:\n- Working on shared branches (main, develop)\n- You want to preserve the complete history\n- Multiple people are working on the same branch\n- You want a clear record of when features were integrated", command: "git switch main\ngit merge feature-branch" },
        { title: "When to Use Rebase", content: "Use rebase when:\n- Cleaning up local commits before a pull request\n- You want a clean, linear history\n- Pulling upstream changes into your feature branch\n- Your commits have not been pushed yet", command: "git switch feature-branch\ngit rebase main" },
        { title: "The Danger of Rebase", content: "WARNING: Never rebase commits that have been pushed to a shared remote branch. Rebase rewrites commit hashes, which causes divergence for anyone who has copies of those commits." },
        { title: "A Practical Compromise", content: "Many teams use this approach:\n1. Rebase your feature branch on main before creating a PR (clean history)\n2. Use merge (or squash merge) to merge the PR into main (preserve integration points)\n\nThis gives you the best of both worlds: clean feature history and clear merge points." }
    ],
    faqs: [
        { question: "Does GitHub's 'Rebase and merge' button rewrite history?", answer: "Yes, it rebases your PR commits onto the target branch with new commit hashes. The original commits on your feature branch are unaffected, but the commits on main will have different hashes." }
    ]
},
{
    id: 48, title: "Three-Way Merge Explained", category_id: 3, difficulty: "Intermediate",
    description: "Understand how Git's three-way merge algorithm works and why it is the default merge strategy.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["three-way merge", "algorithm", "common ancestor", "merge base", "strategy"]),
    commands: JSON.stringify(["git merge", "git merge-base"]),
    steps: [
        { title: "What is a Three-Way Merge?", content: "A three-way merge uses three reference points to combine changes:\n1. The common ancestor commit (merge base)\n2. The tip of your current branch\n3. The tip of the branch being merged\n\nGit compares both branches against the ancestor to determine what changed on each side." },
        { title: "Find the Merge Base", content: "See the common ancestor of two branches:", command: "git merge-base main feature-branch" },
        { title: "How It Resolves Changes", content: "For each part of a file, Git checks:\n- Only branch A changed it → use branch A's version\n- Only branch B changed it → use branch B's version\n- Neither branch changed it → keep the ancestor's version\n- Both branches changed it the same way → use either (they agree)\n- Both branches changed it differently → CONFLICT (manual resolution needed)" },
        { title: "When Three-Way Merge Happens", content: "A three-way merge occurs when both branches have new commits since they diverged. If only one branch has new commits, Git does a fast-forward merge instead.", command: "# This creates a merge commit (three-way merge):\ngit switch main\ngit merge feature-branch\n# If both main and feature-branch have new commits" }
    ],
    faqs: [
        { question: "Why is it called 'three-way' and not 'two-way'?", answer: "A two-way merge would only compare the two branch tips, making it impossible to know which side introduced a change. The third point (common ancestor) tells Git what the original state was, so it can determine what each branch modified." }
    ]
},
{
    id: 49, title: "Octopus Merges in Git", category_id: 3, difficulty: "Advanced",
    description: "Learn about octopus merges that combine more than two branches simultaneously in a single merge commit.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["octopus", "multiple branches", "simultaneous", "merge many"]),
    commands: JSON.stringify(["git merge"]),
    steps: [
        { title: "What is an Octopus Merge?", content: "An octopus merge combines three or more branches into one merge commit. Git uses the 'octopus' merge strategy automatically when you specify multiple branches. It is useful when integrating several independent feature branches at once." },
        { title: "Perform an Octopus Merge", content: "Merge multiple branches at once:", command: "git switch main\ngit merge feature-a feature-b feature-c" },
        { title: "When to Use", content: "Octopus merges work well when:\n- Multiple independent features need to be integrated simultaneously\n- The branches don't have conflicting changes\n- You want a single merge point in history\n\nThey do NOT work when there are conflicts — Git will refuse and ask you to merge branches one at a time." },
        { title: "Limitations", content: "The octopus strategy cannot resolve conflicts. If any two branches modify the same lines, the merge will fail. In practice, octopus merges are rare. Most teams merge branches one at a time through pull requests." }
    ],
    faqs: [
        { question: "Why is it called 'octopus'?", answer: "Like an octopus with many arms, this merge strategy can handle multiple branches at once. The Linux kernel project occasionally uses octopus merges to integrate many subsystem branches." }
    ]
},
{
    id: 50, title: "Merge Strategies in Git", category_id: 3, difficulty: "Advanced",
    description: "Explore the different merge strategies Git offers and when each one is most appropriate.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["strategy", "recursive", "resolve", "ours", "theirs", "subtree"]),
    commands: JSON.stringify(["git merge -s", "git merge -X"]),
    steps: [
        { title: "Available Merge Strategies", content: "Git offers several merge strategies:\n\n- ort (default since Git 2.34, replaces recursive)\n- recursive (previous default for two-branch merges)\n- resolve (simpler alternative to recursive)\n- octopus (for merging multiple branches)\n- ours (keep our version, discard theirs)\n- subtree (merge a subdirectory)" },
        { title: "Specifying a Strategy", content: "Choose a specific merge strategy:", command: "git merge -s resolve feature-branch\n# Or:\ngit merge -s ours feature-branch" },
        { title: "Strategy Options (ours/theirs)", content: "When using the default strategy, you can specify how conflicts should be resolved:", command: "# Always prefer our changes on conflict:\ngit merge -X ours feature-branch\n\n# Always prefer their changes on conflict:\ngit merge -X theirs feature-branch" },
        { title: "The 'ours' Strategy vs 'ours' Option", content: "These are different things:\n\n-s ours (strategy): Completely ignores the other branch's changes. The merge commit exists but the tree is identical to the current branch. Used to record a merge without taking changes.\n\n-X ours (option): Uses the default strategy but prefers our side when conflicts arise. Non-conflicting changes from both sides are still merged." },
        { title: "When to Change Strategy", content: "Most of the time, the default strategy works perfectly. Change it only when:\n- You need to discard an entire branch's changes (-s ours)\n- You want automatic conflict resolution (-X theirs)\n- You are merging many branches simultaneously (octopus)" }
    ],
    faqs: [
        { question: "What is the 'ort' strategy?", answer: "ORT (Ostensibly Recursive's Twin) is the new default merge strategy since Git 2.34. It replaces 'recursive' with better performance and correctness. It handles the same cases but is significantly faster for large repositories." }
    ]
},
{
    id: 51, title: "Resolving Binary File Conflicts", category_id: 3, difficulty: "Intermediate",
    description: "Learn how to handle merge conflicts in binary files like images, PDFs, and compiled assets.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["binary", "conflict", "image", "pdf", "resolve", "checkout"]),
    commands: JSON.stringify(["git checkout --ours", "git checkout --theirs"]),
    steps: [
        { title: "Why Binary Conflicts are Different", content: "Git cannot show line-by-line diffs for binary files (images, PDFs, compiled files). When both branches modify the same binary file, Git cannot merge them automatically. You must choose one version or the other." },
        { title: "Identify Binary Conflicts", content: "Git will report the conflict:", command: "git merge feature-branch\n# Output: warning: Cannot merge binary files: logo.png" },
        { title: "Keep Our Version", content: "Keep the version from your current branch:", command: "git checkout --ours -- path/to/logo.png\ngit add path/to/logo.png" },
        { title: "Keep Their Version", content: "Keep the version from the branch being merged:", command: "git checkout --theirs -- path/to/logo.png\ngit add path/to/logo.png" },
        { title: "Complete the Merge", content: "After resolving all binary conflicts, commit:", command: "git commit -m \"Resolved binary file conflicts\"" }
    ],
    faqs: [
        { question: "Can I prevent binary file conflicts?", answer: "Minimize binary files in your repository. Use Git LFS (Large File Storage) for large binaries. Coordinate with your team so two people don't modify the same binary file simultaneously." }
    ]
},
{
    id: 52, title: "Using Merge Tools – VS Code and Beyond", category_id: 3, difficulty: "Intermediate",
    description: "Set up and use visual merge tools to resolve Git conflicts more easily with a graphical interface.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["merge tool", "VS Code", "meld", "kdiff3", "visual", "GUI"]),
    commands: JSON.stringify(["git mergetool", "git config"]),
    steps: [
        { title: "Why Use a Merge Tool?", content: "Resolving conflicts in a text editor with conflict markers can be confusing. Merge tools provide a visual side-by-side (or three-way) view showing the base, local, and remote versions, making it much easier to choose the right changes." },
        { title: "Configure VS Code as Merge Tool", content: "Set VS Code as your default merge tool:", command: "git config --global merge.tool vscode\ngit config --global mergetool.vscode.cmd \"code --wait $MERGED\"" },
        { title: "Configure Other Merge Tools", content: "Set up popular alternatives:", command: "# Meld (cross-platform, free):\ngit config --global merge.tool meld\n\n# KDiff3 (cross-platform, free):\ngit config --global merge.tool kdiff3\n\n# Beyond Compare (commercial):\ngit config --global merge.tool bc3" },
        { title: "Launch the Merge Tool", content: "When you have conflicts, launch the configured tool:", command: "git mergetool\n# Git opens each conflicting file in your merge tool" },
        { title: "Clean Up After Merging", content: "Merge tools create .orig backup files. Clean them up:", command: "# Remove .orig files:\nfind . -name \"*.orig\" -delete\n\n# Or prevent them from being created:\ngit config --global mergetool.keepBackup false" }
    ],
    faqs: [
        { question: "Do I need to install a merge tool separately?", answer: "VS Code works if you already have it installed. Other tools like Meld need to be downloaded and installed separately. Git does not include any visual merge tool by default." }
    ]
},
{
    id: 53, title: "Recursive vs Resolve Merge Strategy", category_id: 3, difficulty: "Advanced",
    description: "Compare Git's recursive and resolve merge strategies and understand when each is applied.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["recursive", "resolve", "strategy", "merge base", "criss-cross"]),
    commands: JSON.stringify(["git merge -s recursive", "git merge -s resolve"]),
    steps: [
        { title: "The Resolve Strategy", content: "The resolve strategy is the simplest three-way merge. It finds a single common ancestor (merge base) and performs a straightforward three-way merge. It works well when there is only one merge base." },
        { title: "The Recursive Strategy", content: "The recursive strategy handles cases where there are multiple common ancestors (criss-cross merges). It creates a temporary virtual merge base by merging the common ancestors first, then uses that as the base for the final merge." },
        { title: "When Multiple Merge Bases Exist", content: "Criss-cross merges happen when two branches have been merged into each other in both directions. The recursive strategy handles this correctly by recursively merging the bases. The resolve strategy picks one arbitrarily." },
        { title: "Using Each Strategy", content: "Specify the strategy explicitly:", command: "# Recursive (was default before Git 2.34):\ngit merge -s recursive feature-branch\n\n# Resolve (simpler, sometimes faster):\ngit merge -s resolve feature-branch\n\n# ORT (current default, successor to recursive):\ngit merge -s ort feature-branch" },
        { title: "Practical Advice", content: "In practice, you almost never need to specify a merge strategy. The default (ort/recursive) handles 99.9% of cases correctly. Only consider alternatives if you encounter unusual merge problems or need specific behavior." }
    ],
    faqs: [
        { question: "Can the wrong strategy cause data loss?", answer: "No. If a merge strategy cannot resolve conflicts, it will stop and ask you to resolve them manually. No strategy will silently discard your changes (except -s ours, which is intentional)." }
    ]
},
{
    id: 54, title: "Handling Large Merge Conflicts", category_id: 3, difficulty: "Advanced",
    description: "Strategies and techniques for resolving massive merge conflicts that span many files.",
    reading_time: "6 min", author: "GitGuide Team",
    keywords: JSON.stringify(["large conflict", "many files", "strategy", "approach", "massive merge"]),
    commands: JSON.stringify(["git merge", "git diff", "git checkout"]),
    steps: [
        { title: "Assess the Scope", content: "Before diving in, understand the scale of the conflict:", command: "# See how many files have conflicts:\ngit diff --name-only --diff-filter=U\n\n# Count conflicting files:\ngit diff --name-only --diff-filter=U | wc -l" },
        { title: "Resolve File by File", content: "Work through conflicts systematically:\n\n1. Start with the simplest files (fewer conflict markers)\n2. Use a merge tool for visual comparison\n3. Test after resolving each critical file\n4. Stage resolved files as you go", command: "# Check remaining unresolved files:\ngit diff --name-only --diff-filter=U\n\n# After resolving a file:\ngit add resolved-file.js" },
        { title: "Use ours/theirs for Bulk Resolution", content: "If you know one side is correct for entire files:", command: "# Accept our version for specific files:\ngit checkout --ours -- src/generated/*.js\ngit add src/generated/\n\n# Accept their version for specific files:\ngit checkout --theirs -- config/*.json\ngit add config/" },
        { title: "Take Breaks and Test", content: "For massive conflicts:\n\n1. Resolve conflicts in logical groups (by feature or directory)\n2. Run tests after each group\n3. Commit partial progress if possible\n4. Don't try to resolve everything in one sitting" },
        { title: "Prevention is Better", content: "To avoid large merge conflicts in the future:\n\n1. Merge main into your branch frequently\n2. Keep feature branches small and short-lived\n3. Coordinate with teammates on shared files\n4. Use feature flags instead of long-lived branches\n5. Do regular code reviews to catch divergence early" }
    ],
    faqs: [
        { question: "Can I abort and try a different approach?", answer: "Yes. Use 'git merge --abort' to return to the state before the merge. You can then try rebasing, breaking the merge into smaller steps, or merging intermediate commits." }
    ]
},
{
    id: 55, title: "Pre-Merge Checklist", category_id: 3, difficulty: "Beginner",
    description: "A practical checklist of things to verify before merging a branch to avoid common problems.",
    reading_time: "3 min", author: "GitGuide Team",
    keywords: JSON.stringify(["checklist", "before merge", "preparation", "verify", "review"]),
    commands: JSON.stringify(["git fetch", "git diff", "git log"]),
    steps: [
        { title: "1. Update Your Branches", content: "Make sure both branches are up to date with the remote:", command: "git fetch origin\ngit switch main\ngit pull origin main\ngit switch feature-branch\ngit pull origin feature-branch" },
        { title: "2. Review the Changes", content: "Inspect what will be merged:", command: "# See changed files:\ngit diff --name-only main..feature-branch\n\n# See the full diff:\ngit diff main..feature-branch\n\n# See commit list:\ngit log main..feature-branch --oneline" },
        { title: "3. Run Tests", content: "Before merging, ensure all tests pass on both branches. Run your project's test suite on the feature branch to catch any issues before they reach main." },
        { title: "4. Check for Conflicts", content: "Do a dry run to check for conflicts without actually merging:", command: "git switch main\ngit merge --no-commit --no-ff feature-branch\n# Check the result, then abort:\ngit merge --abort" },
        { title: "5. Merge with Confidence", content: "After verifying everything, perform the merge:", command: "git switch main\ngit merge --no-ff feature-branch -m \"Merge feature-branch: Add user authentication\"" }
    ],
    faqs: [
        { question: "Should I always use --no-ff?", answer: "Not always, but --no-ff (no fast-forward) creates a merge commit even when not necessary, making it clear in the history when a branch was integrated. Many teams prefer this for main branch merges." }
    ]
},
{
    id: 56, title: "Merge Commit Best Practices", category_id: 3, difficulty: "Beginner",
    description: "Write meaningful merge commit messages and understand when merge commits are helpful.",
    reading_time: "3 min", author: "GitGuide Team",
    keywords: JSON.stringify(["merge commit", "message", "best practice", "meaningful", "history"]),
    commands: JSON.stringify(["git merge --no-ff", "git log"]),
    steps: [
        { title: "Why Merge Commits Matter", content: "Merge commits mark integration points in your history. A good merge commit message explains what was merged and why, making it easy to understand the project timeline later." },
        { title: "Write a Good Merge Message", content: "Include the purpose, not just the branch name:", command: "# Bad:\ngit merge feature-branch\n\n# Good:\ngit merge --no-ff feature-branch -m \"Merge 'feature-branch': Add OAuth2 login with Google and GitHub providers\"" },
        { title: "Merge Commit Format", content: "A clear format for merge messages:\n\nMerge 'branch-name': Brief summary of what was added\n\nOptional body with:\n- Key features or changes introduced\n- Any breaking changes\n- Related issue numbers" },
        { title: "Viewing Merge History", content: "Filter your log to show only merge commits:", command: "git log --merges --oneline\n# Shows only merge commits, making it easy to see integration points" },
        { title: "Squash Merge Alternative", content: "If you prefer a single clean commit instead of a merge commit:", command: "git merge --squash feature-branch\ngit commit -m \"Add OAuth2 login with Google and GitHub providers\"\n# Creates a single commit with all the branch's changes" }
    ],
    faqs: [
        { question: "Should I squash or merge?", answer: "Squash when the branch has many small, messy commits (WIP, fixup). Merge when the individual commits are meaningful and you want to preserve the detailed history." }
    ]
},

// ================================================================
// GITHUB (category_id: 4) – 14 new articles
// ================================================================
{
    id: 57, title: "GitHub Issues – Tracking Work", category_id: 4, difficulty: "Beginner",
    description: "Learn how to create, label, assign, and manage GitHub Issues to track bugs, features, and tasks.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["issues", "bug", "feature request", "label", "assign", "milestone"]),
    commands: JSON.stringify(["gh issue create", "gh issue list"]),
    steps: [
        { title: "What are GitHub Issues?", content: "Issues are GitHub's built-in project tracking tool. They can represent bugs, feature requests, tasks, or any work item. Each issue gets a unique number and can be labeled, assigned, and linked to pull requests." },
        { title: "Create an Issue", content: "Click 'New Issue' on the Issues tab. Include:\n\n1. Clear, descriptive title\n2. Steps to reproduce (for bugs)\n3. Expected vs actual behavior\n4. Screenshots if applicable\n5. Environment details (OS, browser, version)" },
        { title: "Using Labels", content: "Labels categorize issues:\n\nbug – something is broken\nenhancement – new feature request\ndocumentation – docs need updating\ngood first issue – beginner-friendly task\nhelp wanted – looking for contributors\npriority: high – needs immediate attention" },
        { title: "Reference Issues in Commits", content: "Link commits to issues by including the issue number:", command: "git commit -m \"Fix login timeout error (fixes #42)\"" },
        { title: "Close Issues Automatically", content: "Using keywords in commit messages or PR descriptions automatically closes issues when merged:\n\nKeywords: fixes, closes, resolves\n\nExample: 'This PR resolves #42 and fixes #55'" }
    ],
    faqs: [
        { question: "Can I reopen a closed issue?", answer: "Yes, scroll to the bottom of the closed issue and click 'Reopen issue'. All previous comments and history are preserved." }
    ]
},
{
    id: 58, title: "GitHub Actions – CI/CD Basics", category_id: 4, difficulty: "Intermediate",
    description: "Set up automated workflows with GitHub Actions to test, build, and deploy your code automatically.",
    reading_time: "7 min", author: "GitGuide Team",
    keywords: JSON.stringify(["actions", "CI/CD", "workflow", "automation", "pipeline", "test"]),
    commands: JSON.stringify(["git push"]),
    steps: [
        { title: "What are GitHub Actions?", content: "GitHub Actions is a CI/CD platform built into GitHub. It lets you create automated workflows that run when events happen in your repository (push, pull request, schedule). Workflows are defined in YAML files." },
        { title: "Create Your First Workflow", content: "Create a workflow file in your repository:", command: "mkdir -p .github/workflows\n# Create .github/workflows/ci.yml" },
        { title: "Basic CI Workflow Example", content: "A simple workflow that runs tests on every push:\n\nname: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n      - run: npm install\n      - run: npm test" },
        { title: "Key Concepts", content: "Workflow: Automated process defined in YAML\nEvent: Trigger that starts a workflow (push, PR, schedule)\nJob: Set of steps that run on the same runner\nStep: Individual task (run a script or use an action)\nAction: Reusable component from the GitHub Marketplace\nRunner: Server that runs the workflow (ubuntu, windows, macos)" },
        { title: "Trigger on Pull Requests Only", content: "Run workflows only on pull requests to specific branches:\n\non:\n  pull_request:\n    branches: [main, develop]\n\nThis saves CI minutes by only running when PRs target important branches." },
        { title: "View Workflow Results", content: "Go to the Actions tab in your repository to see workflow runs. Each run shows the status (success/failure), logs, and which commit triggered it." }
    ],
    faqs: [
        { question: "Is GitHub Actions free?", answer: "GitHub Actions is free for public repositories. Private repositories get 2,000 free minutes per month on the free plan. Additional minutes can be purchased." },
        { question: "Can I run Actions locally?", answer: "Use the 'act' tool (github.com/nektos/act) to run GitHub Actions locally for testing before pushing." }
    ]
},
{
    id: 59, title: "GitHub Pages – Deploy Your Website", category_id: 4, difficulty: "Beginner",
    description: "Deploy a static website for free using GitHub Pages directly from your repository.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["pages", "deploy", "website", "static site", "hosting", "free"]),
    commands: JSON.stringify(["git push"]),
    steps: [
        { title: "What is GitHub Pages?", content: "GitHub Pages is a free static site hosting service that serves HTML, CSS, and JavaScript files directly from a GitHub repository. It is perfect for personal websites, project documentation, and portfolios." },
        { title: "Enable GitHub Pages", content: "Go to your repository → Settings → Pages. Select the source branch (usually 'main') and the folder (root or /docs). Click Save." },
        { title: "Create Your Site", content: "Add an index.html file to your repository:", command: "echo '<!DOCTYPE html><html><head><title>My Site</title></head><body><h1>Hello World</h1></body></html>' > index.html\ngit add index.html\ngit commit -m \"Add GitHub Pages site\"\ngit push" },
        { title: "Access Your Site", content: "Your site will be available at:\nhttps://username.github.io/repository-name/\n\nIt may take a few minutes for the first deployment to complete." },
        { title: "Custom Domain", content: "You can use a custom domain instead of the github.io URL:\n\n1. Add a CNAME file to your repo containing your domain name\n2. Configure DNS records with your domain provider to point to GitHub's servers\n3. Enable 'Enforce HTTPS' in repository settings" }
    ],
    faqs: [
        { question: "Can I use a static site generator?", answer: "Yes. GitHub Pages natively supports Jekyll. You can also use any generator (Hugo, Gatsby, Next.js static export) by building locally and pushing the output, or by using GitHub Actions to build automatically." }
    ]
},
{
    id: 60, title: "Creating Pull Request Templates", category_id: 4, difficulty: "Intermediate",
    description: "Standardize your team's pull requests with templates that guide contributors to provide useful information.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["pull request", "template", "PR", "standardize", "checklist"]),
    commands: JSON.stringify(["git add", "git commit"]),
    steps: [
        { title: "Why Use PR Templates?", content: "PR templates pre-fill the description when someone opens a new pull request. They ensure contributors provide the right information: what changed, why, how to test it, and any related issues." },
        { title: "Create a Template", content: "Create a pull request template file:", command: "# Option 1: Root directory\ntouch PULL_REQUEST_TEMPLATE.md\n\n# Option 2: .github directory (cleaner)\nmkdir -p .github\ntouch .github/PULL_REQUEST_TEMPLATE.md" },
        { title: "Template Content Example", content: "A practical template:\n\n## Description\nBrief description of what this PR does.\n\n## Type of Change\n- [ ] Bug fix\n- [ ] New feature\n- [ ] Breaking change\n- [ ] Documentation update\n\n## How Has This Been Tested?\nDescribe the tests you ran.\n\n## Checklist\n- [ ] My code follows the project's style guidelines\n- [ ] I have performed a self-review\n- [ ] I have added tests for my changes\n- [ ] All new and existing tests pass\n\n## Related Issues\nCloses #(issue number)" },
        { title: "Commit and Push", content: "Add the template to your repository:", command: "git add .github/PULL_REQUEST_TEMPLATE.md\ngit commit -m \"Add pull request template\"\ngit push" }
    ],
    faqs: [
        { question: "Can I have multiple PR templates?", answer: "Yes. Create a PULL_REQUEST_TEMPLATE directory with multiple .md files. Contributors can choose which template to use by adding ?template=filename.md to the PR URL." }
    ]
},
{
    id: 61, title: "GitHub Releases and Versioning", category_id: 4, difficulty: "Intermediate",
    description: "Create GitHub Releases to package your software with release notes and downloadable assets.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["release", "version", "tag", "changelog", "assets", "download"]),
    commands: JSON.stringify(["git tag", "git push --tags", "gh release create"]),
    steps: [
        { title: "What are GitHub Releases?", content: "Releases are GitHub's way of packaging software versions. They combine Git tags with release notes, binary downloads, and changelogs. Users can download specific versions of your software from the Releases page." },
        { title: "Create a Tag First", content: "Releases are based on Git tags:", command: "git tag -a v1.0.0 -m \"First stable release\"\ngit push origin v1.0.0" },
        { title: "Create a Release on GitHub", content: "Go to your repository → Releases → Draft a new release:\n\n1. Choose the tag you created\n2. Set the release title (e.g., 'v1.0.0 – Initial Release')\n3. Write release notes describing changes\n4. Upload binary assets if applicable\n5. Mark as pre-release if not production-ready\n6. Click 'Publish release'" },
        { title: "Write Good Release Notes", content: "Structure your release notes:\n\n## What's New\n- Feature A: Brief description\n- Feature B: Brief description\n\n## Bug Fixes\n- Fixed issue #42: Description\n\n## Breaking Changes\n- API endpoint changed from /v1 to /v2\n\n## Contributors\n@username1, @username2" },
        { title: "Auto-Generate Release Notes", content: "GitHub can auto-generate notes from merged PRs. Click 'Generate release notes' when creating a release. It lists all PRs merged since the last release, grouped by label." }
    ],
    faqs: [
        { question: "Should I use releases for every version?", answer: "Create releases for versions that users should know about: major releases, important bug fixes, and security patches. You don't need a release for every internal commit." }
    ]
},
{
    id: 62, title: "GitHub CLI – Getting Started with gh", category_id: 4, difficulty: "Intermediate",
    description: "Use the GitHub CLI tool to manage repositories, issues, PRs, and more from your terminal.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["gh", "CLI", "command line", "terminal", "GitHub tool"]),
    commands: JSON.stringify(["gh auth login", "gh repo", "gh pr", "gh issue"]),
    steps: [
        { title: "What is GitHub CLI?", content: "GitHub CLI (gh) is an official command-line tool for GitHub. It lets you create repos, manage issues, review PRs, and run Actions — all from your terminal without opening a browser." },
        { title: "Install and Authenticate", content: "Install GitHub CLI and log in:", command: "# Install (varies by OS):\n# Mac: brew install gh\n# Windows: winget install GitHub.cli\n# Linux: See cli.github.com for instructions\n\n# Authenticate:\ngh auth login" },
        { title: "Work with Repositories", content: "Common repository operations:", command: "# Create a new repo:\ngh repo create my-project --public\n\n# Clone a repo:\ngh repo clone username/repo-name\n\n# View repo in browser:\ngh repo view --web" },
        { title: "Work with Pull Requests", content: "Manage PRs from the terminal:", command: "# Create a PR:\ngh pr create --title \"Add login feature\" --body \"Implements user login\"\n\n# List open PRs:\ngh pr list\n\n# Checkout a PR locally:\ngh pr checkout 42\n\n# Merge a PR:\ngh pr merge 42" },
        { title: "Work with Issues", content: "Manage issues from the terminal:", command: "# Create an issue:\ngh issue create --title \"Bug: Login fails\" --body \"Steps to reproduce...\"\n\n# List open issues:\ngh issue list\n\n# Close an issue:\ngh issue close 42" }
    ],
    faqs: [
        { question: "Is GitHub CLI the same as git?", answer: "No. Git manages version control (commits, branches, merges). GitHub CLI (gh) manages GitHub-specific features (PRs, issues, Actions, repos). They complement each other." }
    ]
},
{
    id: 63, title: "GitHub Codespaces Overview", category_id: 4, difficulty: "Intermediate",
    description: "Develop in cloud-hosted VS Code environments with GitHub Codespaces – no local setup required.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["codespaces", "cloud", "development environment", "VS Code", "remote"]),
    commands: JSON.stringify(["gh codespace"]),
    steps: [
        { title: "What are Codespaces?", content: "GitHub Codespaces provides cloud-hosted development environments. You get a full VS Code editor running in the cloud with your repository pre-loaded. No local setup needed — everything runs in a container." },
        { title: "Create a Codespace", content: "From any repository on GitHub, click the green 'Code' button, then the 'Codespaces' tab, and click 'Create codespace on main'. VS Code opens in your browser with the project ready." },
        { title: "Configure with devcontainer.json", content: "Customize your codespace environment by adding a configuration file:\n\n.devcontainer/devcontainer.json:\n{\n  \"name\": \"My Project\",\n  \"image\": \"mcr.microsoft.com/devcontainers/javascript-node:20\",\n  \"postCreateCommand\": \"npm install\",\n  \"forwardPorts\": [3000]\n}" },
        { title: "Using the Terminal", content: "Codespaces include a full Linux terminal. Use it like any development machine:", command: "# All tools are available:\nnpm install\nnpm run dev\ngit commit -m \"Made changes in codespace\"" },
        { title: "Manage Codespaces", content: "View and manage your codespaces from the command line:", command: "# List your codespaces:\ngh codespace list\n\n# Stop a running codespace:\ngh codespace stop\n\n# Delete a codespace:\ngh codespace delete" }
    ],
    faqs: [
        { question: "Are Codespaces free?", answer: "GitHub Free users get 120 core-hours per month and 15 GB storage. Pro users get 180 core-hours. Additional usage is billed. Public repos get unlimited codespace hours." }
    ]
},
{
    id: 64, title: "Managing GitHub Notifications", category_id: 4, difficulty: "Beginner",
    description: "Control and organize GitHub notifications to stay informed without being overwhelmed.",
    reading_time: "3 min", author: "GitGuide Team",
    keywords: JSON.stringify(["notifications", "watch", "subscribe", "unsubscribe", "inbox", "filter"]),
    commands: JSON.stringify([]),
    steps: [
        { title: "How Notifications Work", content: "GitHub sends notifications when:\n- You are mentioned (@username)\n- You are assigned to an issue or PR\n- You are a reviewer on a PR\n- You are watching a repository\n- A thread you participated in is updated" },
        { title: "Watch Settings", content: "For each repository, choose your notification level:\n\nAll Activity – every event (very noisy)\nParticipating and @mentions – only when you are involved (recommended)\nIgnore – no notifications from this repo\nCustom – choose specific event types" },
        { title: "Filter Your Inbox", content: "Use the notification inbox at github.com/notifications to:\n\n1. Filter by reason (assigned, mentioned, review requested)\n2. Filter by repository\n3. Mark as read/unread\n4. Save important notifications for later\n5. Unsubscribe from threads you don't need" },
        { title: "Email Notifications", content: "Configure email preferences at Settings → Notifications. You can:\n- Receive email for all notifications or only participating\n- Route different repos to different email addresses\n- Disable email entirely and use only the web inbox" }
    ],
    faqs: [
        { question: "How do I stop getting emails from a specific repository?", answer: "Go to the repository, click 'Unwatch' at the top, and select 'Participating and @mentions' or 'Ignore'." }
    ]
},
{
    id: 65, title: "GitHub Repository Templates", category_id: 4, difficulty: "Beginner",
    description: "Create template repositories to standardize new project setups with pre-configured files and structure.",
    reading_time: "3 min", author: "GitGuide Team",
    keywords: JSON.stringify(["template", "repository", "boilerplate", "starter", "scaffold"]),
    commands: JSON.stringify(["gh repo create"]),
    steps: [
        { title: "What is a Template Repository?", content: "A template repository serves as a blueprint for new projects. Unlike forking, using a template creates a fresh repository with no Git history. It includes your pre-configured files, directory structure, and documentation." },
        { title: "Create a Template", content: "Set up your template repository:\n\n1. Create a new repository with your standard files\n2. Add common configurations (CI/CD, linting, .gitignore)\n3. Go to Settings → check 'Template repository'\n4. The repo now shows a 'Use this template' button" },
        { title: "Use a Template", content: "Create a new repository from a template:\n\n1. Go to the template repository on GitHub\n2. Click 'Use this template' → 'Create a new repository'\n3. Name your new repo and click 'Create repository'\n4. Clone and start coding — no inherited history" },
        { title: "Use Templates from CLI", content: "Create a repo from a template using GitHub CLI:", command: "gh repo create my-new-project --template username/template-repo --public --clone" },
        { title: "What to Include in Templates", content: "Good template contents:\n- README.md with setup instructions\n- .gitignore for the tech stack\n- CI/CD workflow files (.github/workflows/)\n- Linter configurations (.eslintrc, .prettierrc)\n- PR and issue templates\n- LICENSE file\n- Basic project structure (src/, tests/, docs/)" }
    ],
    faqs: [
        { question: "What is the difference between a template and a fork?", answer: "Templates create a clean repo with no history and no link to the original. Forks create a copy with full history and maintain a connection to the original repo for pull requests." }
    ]
},
{
    id: 66, title: "Code Review Best Practices on GitHub", category_id: 4, difficulty: "Intermediate",
    description: "Learn how to conduct effective code reviews on GitHub pull requests that improve code quality.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["code review", "pull request", "feedback", "approve", "request changes"]),
    commands: JSON.stringify(["gh pr review"]),
    steps: [
        { title: "Why Code Review Matters", content: "Code reviews catch bugs, improve code quality, share knowledge across the team, and ensure consistency. Studies show that code review is one of the most effective ways to find and prevent defects." },
        { title: "Reviewing a Pull Request", content: "When reviewing a PR on GitHub:\n\n1. Read the PR description and linked issues\n2. Go to the 'Files changed' tab\n3. Review each file's changes\n4. Click the '+' icon next to a line to add a comment\n5. Submit your review as 'Approve', 'Request Changes', or 'Comment'" },
        { title: "Writing Good Review Comments", content: "Effective review comments:\n\n- Be specific: Point to the exact line and explain the issue\n- Be constructive: Suggest solutions, not just problems\n- Be kind: Use 'nit:' for minor suggestions, 'suggestion:' for improvements\n- Ask questions when unsure: 'Is this intentional?'\n- Praise good code: Positive feedback encourages best practices" },
        { title: "Using Suggested Changes", content: "GitHub lets you suggest specific code changes inline. Click the file diff icon when commenting and edit the code. The PR author can accept your suggestion with one click." },
        { title: "Review from the CLI", content: "Review PRs from your terminal:", command: "# View PR diff:\ngh pr diff 42\n\n# Approve a PR:\ngh pr review 42 --approve\n\n# Request changes:\ngh pr review 42 --request-changes --body \"Please fix the SQL injection vulnerability\"" }
    ],
    faqs: [
        { question: "How long should a code review take?", answer: "Reviews should take 30-60 minutes maximum. If a PR is too large to review in that time, ask the author to break it into smaller PRs. Research shows review quality drops significantly after 60 minutes." }
    ]
},
{
    id: 67, title: "GitHub Secrets and Environment Variables", category_id: 4, difficulty: "Intermediate",
    description: "Securely store API keys and sensitive configuration using GitHub Secrets for Actions workflows.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["secrets", "environment variables", "API key", "secure", "encrypted"]),
    commands: JSON.stringify(["gh secret set"]),
    steps: [
        { title: "What are GitHub Secrets?", content: "Secrets are encrypted environment variables stored in your GitHub repository. They are used in GitHub Actions workflows to safely access sensitive data like API keys, database passwords, and deployment credentials without exposing them in code." },
        { title: "Add a Secret", content: "Go to repository Settings → Secrets and variables → Actions → New repository secret. Enter a name (e.g., API_KEY) and the value. Secrets are encrypted and cannot be viewed after saving." },
        { title: "Use Secrets in Workflows", content: "Reference secrets in your GitHub Actions workflow:\n\nsteps:\n  - name: Deploy\n    env:\n      API_KEY: ${{ secrets.API_KEY }}\n      DB_PASSWORD: ${{ secrets.DB_PASSWORD }}\n    run: npm run deploy" },
        { title: "Set Secrets via CLI", content: "Add secrets from your terminal:", command: "# Set a secret:\ngh secret set API_KEY --body \"your-secret-value\"\n\n# Set from a file:\ngh secret set DEPLOY_KEY < deploy_key.pem\n\n# List secrets:\ngh secret list" },
        { title: "Security Notes", content: "Important security practices:\n\n- Secrets are not passed to workflows triggered by forks (prevents secret theft)\n- Secrets are masked in workflow logs (replaced with ***)\n- Use environment-specific secrets for staging vs production\n- Rotate secrets regularly\n- Never hardcode secrets in your repository files" }
    ],
    faqs: [
        { question: "Can I use secrets in pull requests from forks?", answer: "No. For security, secrets are not available in workflows triggered by pull requests from forks. This prevents malicious PRs from stealing your secrets." }
    ]
},
{
    id: 68, title: "Protected Branches on GitHub", category_id: 4, difficulty: "Intermediate",
    description: "Configure branch protection rules to enforce code review, CI checks, and prevent force pushes.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["protected", "branch", "rules", "enforce", "require review", "status checks"]),
    commands: JSON.stringify([]),
    steps: [
        { title: "Why Protect Branches?", content: "Protected branches prevent accidental or unauthorized changes to critical branches like main. They enforce team workflows by requiring reviews and passing tests before code can be merged." },
        { title: "Set Up Protection", content: "Go to Settings → Branches → Add branch protection rule:\n\n1. Enter the branch name pattern (e.g., 'main')\n2. Select your desired rules\n3. Click 'Create' to save" },
        { title: "Key Protection Options", content: "Require a pull request before merging – no direct pushes\nRequire approvals – specify minimum number of reviewers\nDismiss stale reviews – require re-review after new commits\nRequire status checks – CI must pass before merging\nRequire branches to be up to date – must be current with base\nRestrict who can push – limit to specific people or teams\nBlock force pushes – prevent history rewriting\nRequire linear history – no merge commits (rebase only)" },
        { title: "Rulesets (Newer Feature)", content: "GitHub Rulesets are a newer, more flexible alternative to branch protection rules. They can target multiple branches, be applied at the organization level, and include additional rule types. Find them under Settings → Rules → Rulesets." }
    ],
    faqs: [
        { question: "Can I temporarily disable protection for an emergency fix?", answer: "Admins can bypass rules if 'Do not allow bypassing the above settings' is unchecked. For rulesets, you can define specific bypass actors. However, it is better to create a hotfix branch and fast-track the review process." }
    ]
},
{
    id: 69, title: "GitHub Discussions for Teams", category_id: 4, difficulty: "Beginner",
    description: "Use GitHub Discussions for Q&A, brainstorming, and community engagement alongside your code.",
    reading_time: "3 min", author: "GitGuide Team",
    keywords: JSON.stringify(["discussions", "Q&A", "community", "forum", "conversations"]),
    commands: JSON.stringify([]),
    steps: [
        { title: "What are GitHub Discussions?", content: "Discussions provide a forum-like space within your repository for conversations that don't fit into Issues or PRs. They are threaded, categorized, and searchable — ideal for Q&A, announcements, and brainstorming." },
        { title: "Enable Discussions", content: "Go to Settings → Features → check 'Discussions'. A new Discussions tab appears in your repository." },
        { title: "Discussion Categories", content: "Default categories include:\n\nAnnouncements – project news and updates\nGeneral – open-ended conversations\nIdeas – feature suggestions and brainstorming\nPolls – community voting\nQ&A – questions with accepted answers\nShow and tell – share projects and achievements" },
        { title: "Best Practices", content: "Use Discussions for:\n- Design decisions and RFC (Request for Comments)\n- Q&A where the community can help\n- Announcements about releases and changes\n- Gathering feedback on proposed features\n\nUse Issues for:\n- Actionable bug reports\n- Specific feature requests\n- Tasks that need to be tracked and closed" }
    ],
    faqs: [
        { question: "Can I convert an issue to a discussion?", answer: "Yes. Open the issue, scroll to the bottom, and click 'Convert to discussion'. The issue will be closed and a new discussion will be created with the same content." }
    ]
},
{
    id: 70, title: "GitHub Projects for Task Management", category_id: 4, difficulty: "Intermediate",
    description: "Organize and track work using GitHub Projects with Kanban boards and custom views.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["projects", "kanban", "board", "task management", "planning", "sprint"]),
    commands: JSON.stringify([]),
    steps: [
        { title: "What are GitHub Projects?", content: "GitHub Projects (v2) is a flexible project management tool integrated with your repositories. It provides spreadsheet-like tables, Kanban boards, and timeline views to organize issues, PRs, and custom items." },
        { title: "Create a Project", content: "Go to your profile or organization → Projects → New project. Choose a template:\n\n- Board: Kanban-style columns\n- Table: Spreadsheet-style rows\n- Roadmap: Timeline view\n- Blank: Start from scratch" },
        { title: "Add Items", content: "Add items to your project:\n\n1. Convert existing Issues and PRs into project items\n2. Create new draft items directly in the project\n3. Items automatically inherit fields from their linked issues" },
        { title: "Custom Fields", content: "Add custom fields to track additional data:\n\n- Status: Todo, In Progress, Done\n- Priority: High, Medium, Low\n- Sprint: Sprint 1, Sprint 2\n- Estimate: Story points or hours\n- Custom text, number, or date fields" },
        { title: "Automate Your Board", content: "Set up automations:\n\n- When an issue is opened → set status to 'Todo'\n- When a PR is merged → set status to 'Done'\n- When an item is added → set default fields\n\nConfigure these under Project Settings → Workflows." }
    ],
    faqs: [
        { question: "What is the difference between GitHub Projects and Jira?", answer: "GitHub Projects is simpler and tightly integrated with GitHub repos. Jira is more feature-rich but requires a separate tool. For teams already using GitHub, Projects eliminates tool-switching overhead." }
    ]
},

// ================================================================
// AUTHENTICATION (category_id: 5) – 8 new articles
// ================================================================
{
    id: 71, title: "GPG Key Signing for Git Commits", category_id: 5, difficulty: "Advanced",
    description: "Sign your Git commits with GPG keys to prove they came from you and show as 'Verified' on GitHub.",
    reading_time: "6 min", author: "GitGuide Team",
    keywords: JSON.stringify(["GPG", "sign", "verify", "commit signing", "trust", "verified"]),
    commands: JSON.stringify(["gpg --gen-key", "git config", "git commit -S"]),
    steps: [
        { title: "Why Sign Commits?", content: "Anyone can set any name and email in git config. Commit signing uses GPG (GNU Privacy Guard) cryptography to prove that a commit actually came from you. GitHub shows a 'Verified' badge next to signed commits." },
        { title: "Generate a GPG Key", content: "Create a new GPG key pair:", command: "gpg --full-generate-key\n# Choose RSA and RSA, 4096 bits, no expiration (or set one)\n# Enter your name and the email associated with your GitHub account" },
        { title: "Find Your Key ID", content: "List your GPG keys and note the key ID:", command: "gpg --list-secret-keys --keyid-format=long\n# The key ID is the string after 'sec rsa4096/' (e.g., 3AA5C34371567BD2)" },
        { title: "Configure Git to Sign", content: "Tell Git to use your GPG key:", command: "git config --global user.signingkey 3AA5C34371567BD2\n\n# Sign all commits by default:\ngit config --global commit.gpgsign true" },
        { title: "Add GPG Key to GitHub", content: "Export your public key and add it to GitHub:", command: "gpg --armor --export 3AA5C34371567BD2\n# Copy the output (including BEGIN/END lines)\n# Go to GitHub → Settings → SSH and GPG keys → New GPG key → paste" },
        { title: "Sign a Commit", content: "Create a signed commit:", command: "git commit -S -m \"This commit is signed\"\n\n# Verify signatures on existing commits:\ngit log --show-signature" }
    ],
    faqs: [
        { question: "Is commit signing mandatory?", answer: "No, but some organizations require it. GitHub can enforce signed commits through branch protection rules. It is a best practice for security-sensitive projects." }
    ]
},
{
    id: 72, title: "Git Credential Manager Setup", category_id: 5, difficulty: "Beginner",
    description: "Set up Git Credential Manager to securely store and manage your Git passwords and tokens.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["credential", "manager", "store", "cache", "password", "token"]),
    commands: JSON.stringify(["git credential-manager", "git config"]),
    steps: [
        { title: "What is Git Credential Manager?", content: "Git Credential Manager (GCM) securely stores your Git credentials (passwords, tokens) so you don't have to enter them every time. It uses your operating system's secure storage (Windows Credential Manager, macOS Keychain, Linux Secret Service)." },
        { title: "Install GCM", content: "GCM comes bundled with Git for Windows. On other platforms:", command: "# macOS (with Homebrew):\nbrew install git-credential-manager\n\n# Linux:\n# Download from github.com/git-ecosystem/git-credential-manager/releases\n# Then configure:\ngit-credential-manager configure" },
        { title: "Verify It is Working", content: "Check that GCM is configured:", command: "git config --global credential.helper\n# Should output: manager-core (or manager)" },
        { title: "Clear Stored Credentials", content: "If you need to re-authenticate (e.g., after changing your token):", command: "# Remove credentials for a specific host:\ngit credential-manager erase\nprotocol=https\nhost=github.com\n# Press Enter twice\n\n# Or use the OS credential manager directly" },
        { title: "Alternative: Simple Credential Cache", content: "If you prefer a lighter solution, cache credentials temporarily:", command: "# Cache credentials in memory for 1 hour:\ngit config --global credential.helper 'cache --timeout=3600'" }
    ],
    faqs: [
        { question: "Is it safe to store credentials on my computer?", answer: "Yes. GCM uses your OS's encrypted credential store. On Windows, it uses the Windows Credential Manager. On macOS, it uses the Keychain. These are encrypted and protected by your system login." }
    ]
},
{
    id: 73, title: "Two-Factor Authentication for GitHub", category_id: 5, difficulty: "Beginner",
    description: "Enable two-factor authentication (2FA) on your GitHub account and configure Git for 2FA access.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["2FA", "two-factor", "security", "authenticator", "TOTP", "recovery codes"]),
    commands: JSON.stringify([]),
    steps: [
        { title: "Why Enable 2FA?", content: "Two-factor authentication adds an extra layer of security to your GitHub account. Even if someone steals your password, they cannot access your account without the second factor (your phone or security key). GitHub now requires 2FA for all contributors to public repositories." },
        { title: "Set Up 2FA", content: "Go to Settings → Password and authentication → Enable two-factor authentication.\n\nChoose your method:\n1. Authenticator app (recommended) – Google Authenticator, Authy, 1Password\n2. SMS text message (less secure)\n3. Security key (hardware key like YubiKey)" },
        { title: "Save Recovery Codes", content: "GitHub gives you recovery codes during setup. These are one-time codes you can use if you lose your 2FA device. Store them securely:\n\n1. Save in a password manager\n2. Print and store in a safe place\n3. Do NOT put them in your repository" },
        { title: "Git Access with 2FA", content: "After enabling 2FA, you CANNOT use your GitHub password for Git operations. You must use:\n\n1. Personal Access Token (PAT) instead of password for HTTPS\n2. SSH key authentication (recommended)\n3. GitHub CLI (gh auth login)" },
        { title: "Verify 2FA is Active", content: "Go to Settings → Password and authentication. You should see 'Two-factor authentication' marked as enabled, with your configured methods listed." }
    ],
    faqs: [
        { question: "What if I lose my phone?", answer: "Use one of your saved recovery codes to log in. Then go to Settings to reconfigure 2FA with a new device. If you lost your recovery codes too, contact GitHub Support." }
    ]
},
{
    id: 74, title: "OAuth Apps on GitHub", category_id: 5, difficulty: "Advanced",
    description: "Understand how OAuth applications work on GitHub and how to authorize third-party tools.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["OAuth", "app", "authorization", "third-party", "permissions", "scope"]),
    commands: JSON.stringify([]),
    steps: [
        { title: "What are OAuth Apps?", content: "OAuth apps are third-party applications that request access to your GitHub account. When you 'Sign in with GitHub' on another website, that site is using OAuth to access your GitHub data with your permission." },
        { title: "How OAuth Works", content: "The flow:\n1. App redirects you to GitHub\n2. GitHub shows what permissions the app is requesting\n3. You authorize (or deny) the request\n4. GitHub sends the app a temporary access token\n5. The app uses the token to access your data within the granted scope" },
        { title: "Understanding Scopes", content: "Apps request specific permissions (scopes):\n\nrepo – full access to repositories\nread:user – read your profile\nuser:email – access your email\nworkflow – manage GitHub Actions\ndelete_repo – delete repositories (dangerous!)\n\nOnly authorize apps that request reasonable scopes for their function." },
        { title: "Review Authorized Apps", content: "Check what apps have access to your account:\n\nGo to Settings → Applications → Authorized OAuth Apps.\n\nReview the list and revoke access for any apps you no longer use or trust." },
        { title: "Revoke Access", content: "To remove an app's access:\n\n1. Go to Settings → Applications → Authorized OAuth Apps\n2. Click the app name\n3. Click 'Revoke access'\n\nThe app will immediately lose access to your GitHub data." }
    ],
    faqs: [
        { question: "Are OAuth apps safe?", answer: "Only authorize apps from trusted developers. Review the requested permissions carefully. An app with 'repo' scope can read and modify all your repositories. Regularly audit and revoke unused authorizations." }
    ]
},
{
    id: 75, title: "Managing Multiple GitHub Accounts", category_id: 5, difficulty: "Advanced",
    description: "Configure Git to work with multiple GitHub accounts (personal and work) on the same machine.",
    reading_time: "6 min", author: "GitGuide Team",
    keywords: JSON.stringify(["multiple accounts", "personal", "work", "SSH config", "conditional", "identity"]),
    commands: JSON.stringify(["ssh-keygen", "git config"]),
    steps: [
        { title: "The Challenge", content: "If you have both a personal and work GitHub account, Git needs to know which identity to use for each repository. This requires separate SSH keys and conditional Git configuration." },
        { title: "Generate Separate SSH Keys", content: "Create a different key for each account:", command: "# Personal account:\nssh-keygen -t ed25519 -C \"personal@email.com\" -f ~/.ssh/id_ed25519_personal\n\n# Work account:\nssh-keygen -t ed25519 -C \"work@company.com\" -f ~/.ssh/id_ed25519_work" },
        { title: "Configure SSH", content: "Create or edit ~/.ssh/config to map hosts to keys:", command: "# ~/.ssh/config\nHost github-personal\n  HostName github.com\n  User git\n  IdentityFile ~/.ssh/id_ed25519_personal\n\nHost github-work\n  HostName github.com\n  User git\n  IdentityFile ~/.ssh/id_ed25519_work" },
        { title: "Clone with the Right Identity", content: "Use the SSH host alias when cloning:", command: "# Personal repo:\ngit clone git@github-personal:personal-user/repo.git\n\n# Work repo:\ngit clone git@github-work:work-user/repo.git" },
        { title: "Conditional Git Config", content: "Set different name and email based on the directory:", command: "# In ~/.gitconfig:\n[user]\n  name = Personal Name\n  email = personal@email.com\n\n[includeIf \"gitdir:~/work/\"]\n  path = ~/.gitconfig-work\n\n# In ~/.gitconfig-work:\n[user]\n  name = Work Name\n  email = work@company.com" }
    ],
    faqs: [
        { question: "Can I add both SSH keys to the SSH agent?", answer: "Yes, add both keys: ssh-add ~/.ssh/id_ed25519_personal && ssh-add ~/.ssh/id_ed25519_work. The SSH config file determines which key is used for each host alias." }
    ]
},
{
    id: 76, title: "GitHub Deploy Keys", category_id: 5, difficulty: "Intermediate",
    description: "Set up deploy keys for server-based access to specific GitHub repositories without personal credentials.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["deploy key", "server", "read-only", "repository access", "CI/CD"]),
    commands: JSON.stringify(["ssh-keygen"]),
    steps: [
        { title: "What are Deploy Keys?", content: "Deploy keys are SSH keys that grant access to a single repository. Unlike personal SSH keys (which access all your repos), deploy keys are scoped to one repo. They are ideal for servers and CI/CD systems that need repository access." },
        { title: "Generate a Deploy Key", content: "Create an SSH key on your server:", command: "ssh-keygen -t ed25519 -C \"deploy-key-production\" -f ~/.ssh/deploy_key\n# Do NOT set a passphrase if using in automated systems" },
        { title: "Add to GitHub", content: "Go to the repository → Settings → Deploy keys → Add deploy key:\n\n1. Title: 'Production Server'\n2. Key: paste the contents of deploy_key.pub\n3. Allow write access: check only if the server needs to push\n4. Click 'Add key'" },
        { title: "Use the Deploy Key", content: "Configure the server to use the deploy key:", command: "# Clone using the deploy key:\nGIT_SSH_COMMAND='ssh -i ~/.ssh/deploy_key' git clone git@github.com:user/repo.git\n\n# Or configure in ~/.ssh/config:\n# Host github-deploy\n#   HostName github.com\n#   IdentityFile ~/.ssh/deploy_key" },
        { title: "Security Best Practices", content: "1. Use read-only access unless write is truly needed\n2. Each deploy key can only be used for ONE repository\n3. Rotate deploy keys periodically\n4. Remove deploy keys when servers are decommissioned\n5. Never share deploy keys between servers" }
    ],
    faqs: [
        { question: "Can I use the same deploy key for multiple repositories?", answer: "No. Each deploy key must be unique to a single repository. If you need access to multiple repos, generate a separate key for each one or use a machine user account." }
    ]
},
{
    id: 77, title: "Fine-Grained Personal Access Tokens", category_id: 5, difficulty: "Intermediate",
    description: "Create fine-grained tokens with minimal permissions for secure API and Git access to specific repositories.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["fine-grained", "token", "PAT", "permissions", "scoped", "minimal access"]),
    commands: JSON.stringify(["git remote set-url"]),
    steps: [
        { title: "Classic vs Fine-Grained Tokens", content: "Classic PATs have broad scopes (repo, user, etc.) that apply to ALL your repositories. Fine-grained tokens let you specify exact permissions for specific repositories, following the principle of least privilege." },
        { title: "Create a Fine-Grained Token", content: "Go to Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token:\n\n1. Set a descriptive name\n2. Set an expiration date (required)\n3. Select 'Only select repositories' and choose specific repos\n4. Under 'Permissions', enable only what you need\n5. Click 'Generate token'" },
        { title: "Available Permission Categories", content: "Fine-grained permissions include:\n\nRepository permissions:\n- Contents: read/write to repository files\n- Issues: manage issues\n- Pull requests: manage PRs\n- Metadata: read-only repo info (always granted)\n\nAccount permissions:\n- Email addresses: read your emails\n- Followers: manage followers" },
        { title: "Use the Token", content: "Use the fine-grained token for HTTPS Git operations:", command: "# Clone with token:\ngit clone https://oauth2:YOUR_TOKEN@github.com/user/repo.git\n\n# Or update existing remote:\ngit remote set-url origin https://oauth2:YOUR_TOKEN@github.com/user/repo.git" },
        { title: "Token Expiration", content: "Fine-grained tokens require an expiration date (maximum 1 year). When a token expires:\n\n1. Git operations using that token will fail\n2. Go to Settings → Developer settings to regenerate\n3. Update the token wherever it is used (servers, CI/CD)" }
    ],
    faqs: [
        { question: "Should I use fine-grained or classic tokens?", answer: "Fine-grained tokens are recommended for new use cases. They offer better security through repository-scoped access and granular permissions. Classic tokens still work but give broader access than usually needed." }
    ]
},
{
    id: 78, title: "Verifying Signed Commits on GitHub", category_id: 5, difficulty: "Intermediate",
    description: "Understand how GitHub verifies signed commits and what the Verified badge means.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["verify", "signed", "badge", "GPG", "SSH signing", "vigilant mode"]),
    commands: JSON.stringify(["git log --show-signature", "git verify-commit"]),
    steps: [
        { title: "What is the Verified Badge?", content: "When you see a 'Verified' badge next to a commit on GitHub, it means the commit was cryptographically signed and GitHub confirmed the signature matches a key associated with the committer's account." },
        { title: "Verification Statuses", content: "GitHub shows three statuses:\n\nVerified (green): Signature is valid and matches the committer's GitHub account\nPartially Verified: Signed but the key is not linked to a GitHub account\nUnverified: No signature, or the signature could not be verified" },
        { title: "Verify Commits Locally", content: "Check commit signatures from your terminal:", command: "# Show signature for recent commits:\ngit log --show-signature -5\n\n# Verify a specific commit:\ngit verify-commit abc1234" },
        { title: "SSH Signing (Modern Alternative)", content: "Since Git 2.34, you can sign commits with SSH keys instead of GPG:", command: "# Configure SSH signing:\ngit config --global gpg.format ssh\ngit config --global user.signingkey ~/.ssh/id_ed25519.pub\ngit config --global commit.gpgsign true\n\n# Add the SSH key as a signing key on GitHub:\n# Settings → SSH and GPG keys → New SSH key → Key type: Signing Key" },
        { title: "Vigilant Mode", content: "Enable vigilant mode in GitHub Settings → SSH and GPG keys → check 'Flag unsigned commits as unverified'. This marks ALL your unsigned commits as 'Unverified', making it obvious when a commit claiming to be from you is not actually signed." }
    ],
    faqs: [
        { question: "Should I use GPG or SSH for signing?", answer: "SSH signing is simpler if you already have SSH keys set up. GPG is more established and supports additional features like key expiration and revocation. Both produce the same 'Verified' badge on GitHub." }
    ]
},

// ================================================================
// REMOTE REPOSITORIES (category_id: 6) – 10 new articles
// ================================================================
{
    id: 79, title: "Git Push to Multiple Remotes", category_id: 6, difficulty: "Intermediate",
    description: "Configure Git to push to multiple remote repositories simultaneously for backup or mirroring.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["multiple remotes", "push", "mirror", "backup", "simultaneous"]),
    commands: JSON.stringify(["git remote set-url --add", "git push"]),
    steps: [
        { title: "Why Push to Multiple Remotes?", content: "You might want to push to multiple remotes for:\n- Backup: Mirror your code to GitHub and GitLab\n- Migration: Gradually move from one platform to another\n- CI/CD: Different remotes trigger different pipelines\n- Open source: Maintain public and private copies" },
        { title: "Add Multiple Push URLs", content: "Add an additional push URL to your origin remote:", command: "# Add a second push URL to origin:\ngit remote set-url --add --push origin https://gitlab.com/user/repo.git\n\n# Verify:\ngit remote -v" },
        { title: "Add a Separate Remote", content: "Or add a completely separate remote:", command: "git remote add gitlab https://gitlab.com/user/repo.git\ngit remote add bitbucket https://bitbucket.org/user/repo.git" },
        { title: "Push to All Remotes", content: "Push to all remotes at once:", command: "# Push to origin (includes all push URLs):\ngit push origin main\n\n# Or push to specific remotes:\ngit push gitlab main\ngit push bitbucket main" },
        { title: "Create a Push-All Alias", content: "Create a convenient alias to push everywhere:", command: "git config --global alias.pushall '!git remote | xargs -I{} git push {} --all'" }
    ],
    faqs: [
        { question: "Will I have merge conflicts between remotes?", answer: "No. Remotes are independent. Conflicts only happen when you try to merge or pull changes. If different people push to different remotes, you will need to sync manually." }
    ]
},
{
    id: 80, title: "Setting Up a Bare Repository", category_id: 6, difficulty: "Advanced",
    description: "Create a bare Git repository for use as a central remote on a server or shared filesystem.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["bare", "repository", "server", "central", "shared", "remote"]),
    commands: JSON.stringify(["git init --bare", "git clone"]),
    steps: [
        { title: "What is a Bare Repository?", content: "A bare repository contains only the Git metadata (the contents of the .git directory) without a working directory. It is designed to be a central repository that developers push to and pull from. You never edit files directly in a bare repo." },
        { title: "Create a Bare Repository", content: "Initialize a bare repository on your server:", command: "git init --bare /path/to/project.git\n# Convention: bare repos end with .git" },
        { title: "Clone from the Bare Repo", content: "Developers clone from the bare repo to get a working copy:", command: "git clone user@server:/path/to/project.git\n# Or over SSH:\ngit clone ssh://user@server/path/to/project.git" },
        { title: "Push to the Bare Repo", content: "Push changes to the central bare repository:", command: "git remote add origin user@server:/path/to/project.git\ngit push -u origin main" },
        { title: "When to Use Bare Repos", content: "Use bare repos when:\n- Setting up a self-hosted Git server\n- Creating a shared repository on a network drive\n- Building a Git-based deployment system\n- You need a central repo without GitHub/GitLab\n\nDo NOT use bare repos for development work — they have no working directory." }
    ],
    faqs: [
        { question: "Can I convert a regular repo to bare?", answer: "Yes. Clone the repo as bare: git clone --bare /path/to/regular-repo /path/to/bare-repo.git" }
    ]
},
{
    id: 81, title: "Mirroring a Git Repository", category_id: 6, difficulty: "Intermediate",
    description: "Create an exact mirror of a repository including all branches, tags, and refs.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["mirror", "exact copy", "clone", "all branches", "backup"]),
    commands: JSON.stringify(["git clone --mirror", "git push --mirror"]),
    steps: [
        { title: "What is Mirroring?", content: "Mirroring creates an exact copy of a repository including all branches, tags, remote-tracking branches, and other refs. It is different from cloning, which only copies branches you check out." },
        { title: "Create a Mirror", content: "Clone a repository as a mirror:", command: "git clone --mirror https://github.com/original/repo.git\ncd repo.git" },
        { title: "Push Mirror to Another Remote", content: "Push the mirror to a different hosting platform:", command: "cd repo.git\ngit push --mirror https://gitlab.com/user/repo.git" },
        { title: "Keep the Mirror Updated", content: "Regularly sync the mirror with the source:", command: "cd repo.git\ngit remote update\ngit push --mirror https://gitlab.com/user/repo.git" },
        { title: "Mirror vs Clone", content: "Clone:\n- Gets all branches but only checks out default\n- Sets up origin remote for normal push/pull\n- Used for development\n\nMirror:\n- Gets ALL refs (branches, tags, remote refs, notes)\n- Exact byte-for-byte copy of the source\n- Used for backup, migration, or archival" }
    ],
    faqs: [
        { question: "Will mirroring copy issues and PRs?", answer: "No. Git only tracks code, branches, and tags. Issues, PRs, and wiki content are platform-specific. Use GitHub's import tool or APIs to migrate those." }
    ]
},
{
    id: 82, title: "Shallow Clones and Partial Clones", category_id: 6, difficulty: "Intermediate",
    description: "Speed up repository downloads by cloning only recent history or specific directories.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["shallow", "partial", "depth", "sparse", "large repo", "fast clone"]),
    commands: JSON.stringify(["git clone --depth", "git clone --filter"]),
    steps: [
        { title: "Why Use Shallow Clones?", content: "Large repositories with thousands of commits can take a long time to clone. Shallow clones download only recent history, dramatically reducing clone time and disk space. Partial clones download objects on demand." },
        { title: "Shallow Clone", content: "Clone with limited history:", command: "# Clone only the latest commit:\ngit clone --depth 1 https://github.com/user/large-repo.git\n\n# Clone the last 10 commits:\ngit clone --depth 10 https://github.com/user/large-repo.git" },
        { title: "Unshallow Later", content: "If you need the full history later, fetch it:", command: "git fetch --unshallow\n# Downloads all remaining history" },
        { title: "Partial Clone (Blobless)", content: "Clone without downloading file contents immediately:", command: "# Blobless clone (downloads blobs on demand):\ngit clone --filter=blob:none https://github.com/user/large-repo.git\n\n# Treeless clone (downloads trees and blobs on demand):\ngit clone --filter=tree:0 https://github.com/user/large-repo.git" },
        { title: "Sparse Checkout", content: "Check out only specific directories from a large repo:", command: "git clone --filter=blob:none --sparse https://github.com/user/monorepo.git\ncd monorepo\ngit sparse-checkout set src/frontend docs/\n# Only src/frontend and docs/ are downloaded" }
    ],
    faqs: [
        { question: "Can I push from a shallow clone?", answer: "Yes, you can push new commits from a shallow clone. However, some operations like rebasing onto commits not in your shallow history will require unshallowing first." }
    ]
},
{
    id: 83, title: "Working with Git Submodules", category_id: 6, difficulty: "Advanced",
    description: "Include external Git repositories inside your project as submodules for shared dependencies.",
    reading_time: "6 min", author: "GitGuide Team",
    keywords: JSON.stringify(["submodule", "dependency", "external repo", "nested", "shared library"]),
    commands: JSON.stringify(["git submodule add", "git submodule update", "git submodule init"]),
    steps: [
        { title: "What are Submodules?", content: "Submodules let you include one Git repository inside another. The outer (parent) repo tracks a specific commit of the inner (submodule) repo. This is useful for shared libraries, vendor dependencies, or multi-repo projects." },
        { title: "Add a Submodule", content: "Add an external repository as a submodule:", command: "git submodule add https://github.com/user/shared-lib.git libs/shared-lib\ngit commit -m \"Add shared-lib as submodule\"" },
        { title: "Clone a Repo with Submodules", content: "When cloning a repo that uses submodules:", command: "# Clone and initialize submodules in one command:\ngit clone --recurse-submodules https://github.com/user/project.git\n\n# Or after cloning:\ngit submodule init\ngit submodule update" },
        { title: "Update Submodules", content: "Pull the latest changes in submodules:", command: "# Update all submodules to their latest commits:\ngit submodule update --remote\n\n# Then commit the updated references:\ngit add .\ngit commit -m \"Update submodules to latest versions\"" },
        { title: "Remove a Submodule", content: "Removing a submodule requires several steps:", command: "# 1. Remove from .gitmodules and .git/config:\ngit submodule deinit -f libs/shared-lib\n\n# 2. Remove from the working tree and index:\ngit rm -f libs/shared-lib\n\n# 3. Remove the submodule's .git directory:\nrm -rf .git/modules/libs/shared-lib\n\ngit commit -m \"Remove shared-lib submodule\"" }
    ],
    faqs: [
        { question: "Are submodules difficult to work with?", answer: "Submodules add complexity. Team members must remember to init and update submodules. They can cause confusion during merges. Consider alternatives like npm packages, Go modules, or git subtree before using submodules." }
    ]
},
{
    id: 84, title: "Git Subtree – Alternative to Submodules", category_id: 6, difficulty: "Advanced",
    description: "Use git subtree to include external repositories without the complexity of submodules.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["subtree", "alternative", "include", "merge", "split", "embed"]),
    commands: JSON.stringify(["git subtree add", "git subtree pull", "git subtree push"]),
    steps: [
        { title: "Subtree vs Submodule", content: "Git subtree embeds another repository's files directly into your project tree. Unlike submodules, the files are actually committed to your repository. No special clone commands needed — it just works for anyone who clones your repo." },
        { title: "Add a Subtree", content: "Pull an external repository into a subdirectory:", command: "git subtree add --prefix=libs/shared-lib https://github.com/user/shared-lib.git main --squash" },
        { title: "Update from Upstream", content: "Pull the latest changes from the external repo:", command: "git subtree pull --prefix=libs/shared-lib https://github.com/user/shared-lib.git main --squash" },
        { title: "Push Changes Upstream", content: "If you modify the subtree files, you can push changes back:", command: "git subtree push --prefix=libs/shared-lib https://github.com/user/shared-lib.git main" },
        { title: "Subtree Pros and Cons", content: "Pros:\n- No special setup for cloners\n- Files are directly in the repo\n- Works with standard Git commands\n- No .gitmodules file to manage\n\nCons:\n- Repository size grows (includes all subtree files)\n- History can become cluttered\n- Updates from upstream require explicit pulls" }
    ],
    faqs: [
        { question: "When should I use subtree instead of submodule?", answer: "Use subtree when you want simplicity and don't need frequent upstream updates. Use submodule when the dependency is large, frequently updated, or shared across many projects." }
    ]
},
{
    id: 85, title: "Configuring Upstream Branches", category_id: 6, difficulty: "Beginner",
    description: "Set up upstream tracking so git pull and git push work without specifying the remote and branch each time.",
    reading_time: "3 min", author: "GitGuide Team",
    keywords: JSON.stringify(["upstream", "tracking", "set-upstream", "push default", "pull default"]),
    commands: JSON.stringify(["git push -u", "git branch --set-upstream-to"]),
    steps: [
        { title: "What is an Upstream Branch?", content: "An upstream (tracking) branch is the remote branch that your local branch is linked to. When configured, you can simply type 'git push' or 'git pull' without specifying origin and branch name each time." },
        { title: "Set Upstream When Pushing", content: "The most common way to set upstream is with your first push:", command: "git push -u origin feature-branch\n# -u is short for --set-upstream\n# After this, 'git push' and 'git pull' work without arguments" },
        { title: "Set Upstream Explicitly", content: "Link a local branch to a remote branch:", command: "git branch --set-upstream-to=origin/main main\n# Or the shorter form:\ngit branch -u origin/main" },
        { title: "Check Upstream Configuration", content: "See the upstream configuration for all branches:", command: "git branch -vv\n# Shows [origin/main] next to branches that have upstream set" },
        { title: "Configure Auto-Setup", content: "Make Git automatically set up tracking for new branches:", command: "git config --global push.autoSetupRemote true\n# Now 'git push' on a new branch automatically sets upstream" }
    ],
    faqs: [
        { question: "What error do I get without upstream?", answer: "You'll see 'fatal: The current branch has no upstream branch' when running 'git push' without arguments. Git helpfully suggests the command to set it up." }
    ]
},
{
    id: 86, title: "Force Push Safety with --force-with-lease", category_id: 6, difficulty: "Intermediate",
    description: "Use git push --force-with-lease as a safer alternative to force push that prevents overwriting others' work.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["force push", "force-with-lease", "safe push", "overwrite", "protection"]),
    commands: JSON.stringify(["git push --force-with-lease", "git push --force"]),
    steps: [
        { title: "The Problem with --force", content: "git push --force overwrites the remote branch unconditionally. If a teammate pushed commits after your last fetch, their work is lost. This is one of the most dangerous Git operations." },
        { title: "What --force-with-lease Does", content: "Force-with-lease only force pushes if the remote branch is exactly where you think it is. If someone else has pushed new commits since your last fetch, the push is rejected, protecting their work.", command: "git push --force-with-lease origin feature-branch" },
        { title: "When You Need to Force Push", content: "Force pushing is necessary after:\n- Rebasing a branch (commits have new hashes)\n- Amending a pushed commit\n- Squashing commits that were already pushed\n- Using interactive rebase on a pushed branch" },
        { title: "Always Use --force-with-lease", content: "Make force-with-lease your default by creating an alias:", command: "git config --global alias.fpush \"push --force-with-lease\"\n# Now use:\ngit fpush origin feature-branch" },
        { title: "WARNING: Know the Limitations", content: "Force-with-lease checks against your local remote-tracking ref. If you run 'git fetch' before force pushing, your local ref updates and force-with-lease won't protect against the new commits. Always verify before force pushing:\n\n1. Communicate with your team\n2. Check the remote branch log\n3. Only force push to branches you own" }
    ],
    faqs: [
        { question: "Can I force push to main?", answer: "Technically yes, but you should NEVER force push to main or any shared branch. Use branch protection rules to block force pushes on critical branches. Only force push to your own feature branches." }
    ]
},
{
    id: 87, title: "Pruning Stale Remote Branches", category_id: 6, difficulty: "Beginner",
    description: "Clean up local references to remote branches that have been deleted on the server.",
    reading_time: "3 min", author: "GitGuide Team",
    keywords: JSON.stringify(["prune", "stale", "cleanup", "remote branches", "deleted", "obsolete"]),
    commands: JSON.stringify(["git fetch --prune", "git remote prune"]),
    steps: [
        { title: "The Problem", content: "When remote branches are deleted (after merging PRs), your local Git still keeps references to them. Over time, 'git branch -r' shows many stale branches that no longer exist on the server." },
        { title: "See Stale Branches", content: "List remote branches that no longer exist:", command: "git remote prune origin --dry-run\n# Shows what would be pruned without actually doing it" },
        { title: "Prune Stale References", content: "Remove references to deleted remote branches:", command: "git fetch --prune\n# Or specifically:\ngit remote prune origin" },
        { title: "Auto-Prune on Fetch", content: "Configure Git to prune automatically every time you fetch:", command: "git config --global fetch.prune true\n# Now 'git fetch' always cleans up stale references" },
        { title: "Clean Up Local Branches Too", content: "Delete local branches whose remote counterpart is gone:", command: "# List merged branches (safe to delete):\ngit branch --merged main\n\n# Delete them:\ngit branch --merged main | grep -v main | xargs git branch -d" }
    ],
    faqs: [
        { question: "Will pruning delete my local branches?", answer: "No. Pruning only removes remote-tracking references (origin/branch-name). Your local branches are unaffected. You must delete local branches separately." }
    ]
},
{
    id: 88, title: "Fetching Specific Branches", category_id: 6, difficulty: "Intermediate",
    description: "Learn how to fetch only specific branches from a remote instead of downloading everything.",
    reading_time: "3 min", author: "GitGuide Team",
    keywords: JSON.stringify(["fetch", "specific branch", "selective", "single branch", "refspec"]),
    commands: JSON.stringify(["git fetch origin", "git clone --single-branch"]),
    steps: [
        { title: "Why Fetch Selectively?", content: "In large repositories with many branches, fetching everything can be slow and waste bandwidth. You might only need one or two branches for your current work." },
        { title: "Fetch a Specific Branch", content: "Download just one branch from the remote:", command: "git fetch origin feature-branch\n# Only fetches the specified branch" },
        { title: "Clone a Single Branch", content: "Clone only one branch from the start:", command: "git clone --single-branch --branch main https://github.com/user/repo.git\n# Only main is downloaded" },
        { title: "Fetch a Branch That Was Not Cloned", content: "If you used --single-branch and need another branch later:", command: "# Add the branch to your fetch configuration:\ngit remote set-branches --add origin other-branch\ngit fetch origin other-branch\ngit switch other-branch" },
        { title: "Use Refspecs for Advanced Control", content: "Refspecs define exactly what to fetch:", command: "# Fetch a specific remote branch to a local name:\ngit fetch origin feature-branch:my-local-name\n\n# Fetch all branches matching a pattern:\ngit fetch origin 'refs/heads/release/*:refs/remotes/origin/release/*'" }
    ],
    faqs: [
        { question: "Does fetching a specific branch save disk space?", answer: "It saves bandwidth during the fetch but Git still stores objects efficiently. For significant space savings, combine with --depth (shallow fetch) or --filter (partial clone)." }
    ]
},

// ================================================================
// UNDO & RECOVERY (category_id: 7) – 12 new articles
// ================================================================
{
    id: 89, title: "Recover Deleted Files with Git", category_id: 7, difficulty: "Beginner",
    description: "Restore accidentally deleted files using Git's version history – even if they were removed long ago.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["recover", "deleted file", "restore", "lost file", "bring back"]),
    commands: JSON.stringify(["git checkout", "git restore", "git log"]),
    steps: [
        { title: "File Deleted but Not Committed", content: "If you deleted a file but have not committed yet, restore it from the index:", command: "git restore filename.txt\n# or older syntax:\ngit checkout -- filename.txt" },
        { title: "File Deleted and Committed", content: "If the deletion was committed, restore from the commit before the deletion:", command: "# Find when the file was deleted:\ngit log --diff-filter=D --summary -- path/to/file.txt\n\n# Restore from the commit just before deletion:\ngit checkout abc1234^ -- path/to/file.txt\n# The ^ means 'parent of that commit'" },
        { title: "Find a Deleted File by Name", content: "If you don't remember the exact path:", command: "# Search for the file name in history:\ngit log --all --full-history -- \"**/filename.txt\"\n\n# Or search for any file matching a pattern:\ngit log --diff-filter=D --name-only --pretty=format: | grep \"pattern\"" },
        { title: "Restore and Commit", content: "After restoring, commit the recovered file:", command: "git add restored-file.txt\ngit commit -m \"Restore accidentally deleted file\"" }
    ],
    faqs: [
        { question: "Can I recover a file that was never committed?", answer: "No. Git can only restore files that were tracked (added and committed) at some point. If a file was never added to Git, it cannot be recovered through Git. Use OS-level recovery tools instead." }
    ]
},
{
    id: 90, title: "Git Bisect – Find Bug-Introducing Commits", category_id: 7, difficulty: "Advanced",
    description: "Use binary search through your commit history to efficiently find the exact commit that introduced a bug.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["bisect", "binary search", "find bug", "debug", "regression", "identify"]),
    commands: JSON.stringify(["git bisect start", "git bisect good", "git bisect bad"]),
    steps: [
        { title: "What is Git Bisect?", content: "Git bisect uses binary search to find which commit introduced a bug. Instead of checking every commit one by one, it repeatedly halves the range of suspect commits. For 1000 commits, bisect needs only about 10 steps." },
        { title: "Start Bisecting", content: "Begin the bisect session:", command: "git bisect start\n\n# Mark the current commit as bad (has the bug):\ngit bisect bad\n\n# Mark a known good commit (before the bug existed):\ngit bisect good abc1234" },
        { title: "Test and Mark Each Checkpoint", content: "Git checks out a commit in the middle. Test your code, then tell Git the result:", command: "# If this commit has the bug:\ngit bisect bad\n\n# If this commit does NOT have the bug:\ngit bisect good\n\n# Git automatically checks out the next commit to test" },
        { title: "Find the Guilty Commit", content: "After several steps, Git identifies the exact commit:\n\nabc1234 is the first bad commit\ncommit abc1234\nAuthor: John Doe\nDate: Mon Aug 1\n\n    Add payment processing module" },
        { title: "End the Bisect Session", content: "Return to your original branch:", command: "git bisect reset\n# Returns you to the branch you were on before bisecting" },
        { title: "Automate with a Script", content: "If you have a test script, automate the entire process:", command: "git bisect start HEAD abc1234\ngit bisect run npm test\n# Git automatically runs the test at each step and marks good/bad" }
    ],
    faqs: [
        { question: "What if I cannot test a particular commit?", answer: "Use 'git bisect skip' to skip the current commit. Git will choose a nearby commit instead. Too many skips can make bisect less efficient." }
    ]
},
{
    id: 91, title: "Undo a Pushed Commit Safely", category_id: 7, difficulty: "Intermediate",
    description: "Safely undo a commit that has already been pushed to a shared remote branch without rewriting history.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["undo", "pushed", "revert", "safe", "shared branch", "without force push"]),
    commands: JSON.stringify(["git revert", "git push"]),
    steps: [
        { title: "Why Not Just Reset?", content: "If a commit has been pushed to a shared branch, using 'git reset' and force pushing would rewrite history and break things for everyone who has pulled those commits. The safe approach is 'git revert'." },
        { title: "Revert the Last Pushed Commit", content: "Create a new commit that undoes the changes:", command: "git revert HEAD\n# This creates a new commit that reverses the changes\n# Then push the revert:\ngit push origin main" },
        { title: "Revert a Specific Commit", content: "Undo any commit, not just the last one:", command: "git revert abc1234\ngit push origin main" },
        { title: "Revert Without Auto-Committing", content: "If you want to review or modify the revert before committing:", command: "git revert --no-commit abc1234\n# Changes are staged but not committed\n# Review, modify if needed, then:\ngit commit -m \"Revert: remove broken payment feature\"" },
        { title: "Verify the Revert", content: "Confirm the revert worked correctly:", command: "# See the revert commit:\ngit log --oneline -3\n\n# Verify the code is back to the expected state:\ngit diff HEAD~2..HEAD\n# Should show the inverse of the original commit's changes" }
    ],
    faqs: [
        { question: "Can I undo a revert?", answer: "Yes. Revert the revert commit: git revert <revert-commit-hash>. This effectively re-applies the original changes. It sounds strange but it is a legitimate and common technique." }
    ]
},
{
    id: 92, title: "Reverting Multiple Commits", category_id: 7, difficulty: "Intermediate",
    description: "Learn how to revert a range of commits or multiple specific commits in one operation.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["revert", "multiple", "range", "batch", "several commits"]),
    commands: JSON.stringify(["git revert"]),
    steps: [
        { title: "Revert a Range of Commits", content: "Revert multiple consecutive commits in one go:", command: "# Revert commits from abc1234 to def5678 (exclusive..inclusive):\ngit revert abc1234..def5678\n\n# This creates one revert commit per original commit" },
        { title: "Revert Into a Single Commit", content: "Combine multiple reverts into one clean commit:", command: "git revert --no-commit abc1234..def5678\n# All reverts are staged but not committed\ngit commit -m \"Revert: remove feature X (commits abc1234 to def5678)\"" },
        { title: "Revert Specific Non-Consecutive Commits", content: "Cherry-pick which commits to revert:", command: "git revert --no-commit abc1234\ngit revert --no-commit ghi9012\ngit revert --no-commit mno3456\ngit commit -m \"Revert three specific commits\"" },
        { title: "Handle Conflicts During Multi-Revert", content: "If conflicts arise while reverting multiple commits:", command: "# Fix the conflict, then continue:\ngit add .\ngit revert --continue\n\n# Or abort the entire operation:\ngit revert --abort" }
    ],
    faqs: [
        { question: "Should I revert in forward or reverse order?", answer: "When reverting a range, revert in reverse chronological order (newest first). Git does this automatically with the range syntax. Reverting in forward order can cause unnecessary conflicts." }
    ]
},
{
    id: 93, title: "Restoring Files from a Specific Commit", category_id: 7, difficulty: "Beginner",
    description: "Bring back a file's contents from any point in history without changing other files.",
    reading_time: "3 min", author: "GitGuide Team",
    keywords: JSON.stringify(["restore", "specific commit", "checkout file", "historical version", "bring back"]),
    commands: JSON.stringify(["git restore", "git checkout", "git show"]),
    steps: [
        { title: "View a File at a Specific Commit", content: "See what a file looked like at any point in history:", command: "git show abc1234:path/to/file.js" },
        { title: "Restore a File from a Specific Commit", content: "Replace the current version with a historical version:", command: "# Modern syntax (Git 2.23+):\ngit restore --source=abc1234 -- path/to/file.js\n\n# Traditional syntax:\ngit checkout abc1234 -- path/to/file.js" },
        { title: "Restore from a Branch", content: "Get a file from another branch:", command: "git restore --source=feature-branch -- path/to/file.js\n# The file is now in your working directory with the other branch's version" },
        { title: "Commit the Restored File", content: "After restoring, commit the change:", command: "git add path/to/file.js\ngit commit -m \"Restore file.js from commit abc1234\"" }
    ],
    faqs: [
        { question: "Does this affect other files?", answer: "No. Restoring a file from a specific commit only changes that one file. All other files remain at their current state." }
    ]
},
{
    id: 94, title: "Cleaning Untracked Files with Git Clean", category_id: 7, difficulty: "Intermediate",
    description: "Remove untracked files and directories from your working tree to get a clean state.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["clean", "untracked", "remove", "delete", "working directory", "pristine"]),
    commands: JSON.stringify(["git clean -fd", "git clean -n"]),
    steps: [
        { title: "What Does Git Clean Do?", content: "Git clean removes files that are not tracked by Git — files that have never been added or committed. This is useful for removing build artifacts, temporary files, or generated code that is cluttering your working directory." },
        { title: "Preview What Would Be Deleted", content: "Always do a dry run first:", command: "git clean -n\n# Shows what WOULD be removed without actually deleting anything" },
        { title: "Remove Untracked Files", content: "WARNING: This permanently deletes files. They cannot be recovered through Git.", command: "# Remove untracked files:\ngit clean -f\n\n# Remove untracked files AND directories:\ngit clean -fd" },
        { title: "Remove Ignored Files Too", content: "Also remove files matched by .gitignore:", command: "# Remove only ignored files (like build artifacts):\ngit clean -fX\n\n# Remove both untracked and ignored files:\ngit clean -fdx" },
        { title: "Interactive Mode", content: "Select which files to clean interactively:", command: "git clean -i\n# Shows a menu to select specific files to remove" }
    ],
    faqs: [
        { question: "Can I undo git clean?", answer: "No. Git clean permanently deletes files that were never tracked. Unlike tracked files, they cannot be recovered from Git history. Always use 'git clean -n' (dry run) first to review what will be deleted." }
    ]
},
{
    id: 95, title: "Recovering from a Bad Rebase", category_id: 7, difficulty: "Advanced",
    description: "Fix a rebase that went wrong by using reflog to return to the pre-rebase state.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["rebase", "recover", "undo rebase", "reflog", "bad rebase", "fix"]),
    commands: JSON.stringify(["git reflog", "git reset --hard"]),
    steps: [
        { title: "How Rebase Can Go Wrong", content: "A rebase can go wrong when:\n- You accidentally rebase onto the wrong branch\n- Conflicts were resolved incorrectly\n- The rebase introduced subtle bugs\n- You rebased commits that were already pushed" },
        { title: "Find the Pre-Rebase State", content: "Use reflog to find where your branch was before the rebase:", command: "git reflog\n# Look for the entry just before 'rebase (start)':\n# abc1234 HEAD@{5}: rebase (start): checkout main\n# def5678 HEAD@{6}: commit: Your last commit before rebase  <-- this one" },
        { title: "Reset to Pre-Rebase State", content: "Move your branch back to where it was:", command: "git reset --hard def5678\n# Or using the reflog reference:\ngit reset --hard HEAD@{6}" },
        { title: "If You Already Pushed the Bad Rebase", content: "If the rebased commits were force-pushed, you need to force push the recovery:", command: "# After resetting locally:\ngit push --force-with-lease origin feature-branch\n# Warn teammates to re-fetch" },
        { title: "Prevent Future Issues", content: "Before rebasing, create a backup branch:", command: "git branch backup-before-rebase\ngit rebase main\n# If something goes wrong:\ngit reset --hard backup-before-rebase" }
    ],
    faqs: [
        { question: "How long does reflog keep entries?", answer: "By default, 90 days for reachable entries and 30 days for unreachable ones. You have plenty of time to recover from a bad rebase." }
    ]
},
{
    id: 96, title: "Fixing the Wrong Branch Commit", category_id: 7, difficulty: "Beginner",
    description: "Accidentally committed to the wrong branch? Learn how to move your commit to the correct branch.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["wrong branch", "move commit", "mistake", "cherry-pick", "fix"]),
    commands: JSON.stringify(["git cherry-pick", "git reset"]),
    steps: [
        { title: "The Problem", content: "You were working and made a commit, then realized you are on 'main' instead of your feature branch. The commit needs to be moved to the correct branch." },
        { title: "Method 1: Cherry-Pick and Reset", content: "Copy the commit to the right branch, then remove it from the wrong one:", command: "# Note the commit hash:\ngit log --oneline -1\n# Output: abc1234 Add login feature\n\n# Switch to the correct branch:\ngit switch feature-branch\n\n# Copy the commit:\ngit cherry-pick abc1234\n\n# Go back and remove from wrong branch:\ngit switch main\ngit reset --hard HEAD~1" },
        { title: "Method 2: Create New Branch (if not pushed)", content: "If you need a new branch for this commit:", command: "# Create a branch from the current state:\ngit switch -c feature-login\n\n# The new branch has your commit\n# Now fix the original branch:\ngit switch main\ngit reset --hard HEAD~1" },
        { title: "If Already Pushed to Wrong Branch", content: "If the commit was pushed to the remote wrong branch, revert it instead of resetting:", command: "# Copy to correct branch:\ngit switch feature-branch\ngit cherry-pick abc1234\ngit push origin feature-branch\n\n# Revert on wrong branch:\ngit switch main\ngit revert HEAD\ngit push origin main" }
    ],
    faqs: [
        { question: "What if I made multiple commits on the wrong branch?", answer: "Cherry-pick each commit in order: git cherry-pick abc1234 def5678 ghi9012. Then reset the wrong branch back: git reset --hard HEAD~3." }
    ]
},
{
    id: 97, title: "Undoing git add Before Commit", category_id: 7, difficulty: "Beginner",
    description: "Learn how to unstage files after running git add but before committing.",
    reading_time: "3 min", author: "GitGuide Team",
    keywords: JSON.stringify(["unstage", "undo add", "remove staging", "before commit"]),
    commands: JSON.stringify(["git restore --staged", "git reset HEAD"]),
    steps: [
        { title: "The Situation", content: "You ran 'git add' to stage files but realized you don't want to include all of them in the next commit. You need to unstage some files without losing your changes." },
        { title: "Unstage a Specific File", content: "Remove a file from the staging area (keeps changes in working directory):", command: "# Modern syntax (Git 2.23+):\ngit restore --staged filename.txt\n\n# Traditional syntax:\ngit reset HEAD filename.txt" },
        { title: "Unstage All Files", content: "Remove everything from staging:", command: "# Modern syntax:\ngit restore --staged .\n\n# Traditional syntax:\ngit reset HEAD" },
        { title: "Verify the Unstaging", content: "Check that files are back to 'modified but unstaged':", command: "git status\n# Files should now appear under 'Changes not staged for commit'" },
        { title: "Important: Your Changes are Safe", content: "Unstaging does NOT delete your changes. It only moves files from the 'staged' area back to the 'modified' state. Your actual file contents remain exactly as they are." }
    ],
    faqs: [
        { question: "What is the difference between unstaging and discarding?", answer: "'git restore --staged file' unstages the file (keeps your edits). 'git restore file' discards your edits entirely (reverts to the last commit). Be careful not to confuse them." }
    ]
},
{
    id: 98, title: "Amending Older Commits with Interactive Rebase", category_id: 7, difficulty: "Advanced",
    description: "Edit, rewrite, or fix commits that are not the most recent one using interactive rebase.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["amend", "older commit", "edit", "rewrite", "interactive rebase", "fixup"]),
    commands: JSON.stringify(["git rebase -i", "git commit --amend"]),
    steps: [
        { title: "When git commit --amend Is Not Enough", content: "The --amend flag only works on the most recent commit. To edit older commits, you need interactive rebase." },
        { title: "Start Interactive Rebase", content: "Go back to the commit you want to edit:", command: "# To edit a commit 5 commits ago:\ngit rebase -i HEAD~5" },
        { title: "Mark the Commit for Editing", content: "In the editor, change 'pick' to 'edit' for the commit you want to modify:\n\npick abc1234 Add authentication\nedit def5678 Add payment module    ← change this line\npick ghi9012 Update README" },
        { title: "Make Your Changes", content: "Git pauses at the marked commit. Make your changes:", command: "# Edit files as needed...\n\n# Stage the changes:\ngit add .\n\n# Amend the commit:\ngit commit --amend -m \"Add payment module with validation\"\n\n# Continue the rebase:\ngit rebase --continue" },
        { title: "Using Fixup (Automated Approach)", content: "If you just need to add forgotten changes to an older commit:", command: "# Make the fix and commit it:\ngit add forgotten-file.js\ngit commit --fixup=def5678\n\n# Then auto-squash:\ngit rebase -i --autosquash HEAD~5\n# The fixup commit is automatically placed and squashed" }
    ],
    faqs: [
        { question: "Is this safe if I already pushed?", answer: "No. Editing older commits rewrites history. If the commits were already pushed, you would need to force push, which affects other collaborators. Only do this for local, unpushed commits." }
    ]
},
{
    id: 99, title: "Git Worktrees for Parallel Work", category_id: 7, difficulty: "Advanced",
    description: "Use Git worktrees to work on multiple branches simultaneously without switching or stashing.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["worktree", "parallel", "multiple branches", "simultaneous", "workspace"]),
    commands: JSON.stringify(["git worktree add", "git worktree list", "git worktree remove"]),
    steps: [
        { title: "What are Worktrees?", content: "A worktree is a linked working directory attached to your repository. Each worktree checks out a different branch, letting you work on multiple branches simultaneously in separate folders without switching branches or stashing changes." },
        { title: "Add a Worktree", content: "Create a new worktree for a different branch:", command: "# Create a worktree for the hotfix branch:\ngit worktree add ../project-hotfix hotfix-branch\n\n# Create a worktree with a new branch:\ngit worktree add ../project-feature -b new-feature" },
        { title: "Work in Multiple Branches", content: "Now you have two directories, each on a different branch:\n\n/project/ → main branch (your primary worktree)\n/project-hotfix/ → hotfix-branch\n/project-feature/ → new-feature\n\nEdit files in any directory independently. Commits, pulls, and pushes work normally in each." },
        { title: "List and Remove Worktrees", content: "Manage your worktrees:", command: "# List all worktrees:\ngit worktree list\n\n# Remove a worktree when done:\ngit worktree remove ../project-hotfix\n\n# Force remove (if there are changes):\ngit worktree remove --force ../project-hotfix" },
        { title: "Use Cases", content: "Worktrees are great for:\n- Working on a hotfix while a feature is in progress\n- Running tests on one branch while coding on another\n- Reviewing a PR locally without disrupting your work\n- Comparing behavior between two branches side by side" }
    ],
    faqs: [
        { question: "Can two worktrees have the same branch?", answer: "No. Each branch can only be checked out in one worktree at a time. This prevents conflicting changes. If you try, Git will give an error." }
    ]
},
{
    id: 100, title: "Reverting a Merge Commit", category_id: 7, difficulty: "Advanced",
    description: "Learn the special syntax required to revert a merge commit and understand its implications.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["revert merge", "undo merge", "mainline", "parent", "re-merge"]),
    commands: JSON.stringify(["git revert -m"]),
    steps: [
        { title: "Why Merge Reverts Are Special", content: "A regular commit has one parent. A merge commit has two parents. When reverting, Git needs to know which parent to revert to — the mainline or the merged branch. You must specify this with the -m flag." },
        { title: "Revert a Merge Commit", content: "Use -m 1 to keep the mainline (usually main branch) and undo the merged changes:", command: "git revert -m 1 abc1234\n# -m 1 means 'keep parent 1 (main branch)'\n# -m 2 would keep parent 2 (the merged branch)" },
        { title: "Understanding -m 1 vs -m 2", content: "For a merge commit created by 'git merge feature into main':\n\n-m 1: Undo the feature changes, keep main as it was\n-m 2: Undo the main changes, keep feature as it was\n\nYou almost always want -m 1." },
        { title: "The Re-Merge Problem", content: "WARNING: After reverting a merge, you cannot simply re-merge the same branch later. Git thinks those changes are already integrated. To re-merge, you must first revert the revert:", command: "# Step 1: Revert the merge\ngit revert -m 1 abc1234\n\n# Step 2: Later, to re-merge the branch,\n# first revert the revert:\ngit revert def5678  # hash of the revert commit\n\n# Step 3: Now merge the branch again:\ngit merge feature-branch" },
        { title: "Verify the Revert", content: "Confirm the merge revert worked:", command: "git log --oneline -5\n# Should show the revert commit\n\ngit diff HEAD~1\n# Should show the inverse of the merged changes" }
    ],
    faqs: [
        { question: "Should I reset instead of reverting a merge?", answer: "Only if the merge has not been pushed. 'git reset --hard HEAD~1' removes the merge commit locally. If it was pushed, use revert to avoid rewriting shared history." }
    ]
},

// ================================================================
// TROUBLESHOOTING (category_id: 8) – 15 new articles
// ================================================================
{
    id: 101, title: "Fixing 'refusing to merge unrelated histories'", category_id: 8, difficulty: "Intermediate",
    description: "Solve the 'fatal: refusing to merge unrelated histories' error when merging or pulling branches with no common ancestor.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["unrelated histories", "refusing to merge", "no common ancestor", "allow-unrelated"]),
    commands: JSON.stringify(["git pull --allow-unrelated-histories", "git merge --allow-unrelated-histories"]),
    steps: [
        { title: "What Causes This Error", content: "This error occurs when two branches have completely independent histories with no common ancestor commit. Common scenarios:\n\n1. You created a new repo on GitHub with a README, then tried to push a local repo\n2. You are merging two separate repositories\n3. You are pulling from a different project entirely" },
        { title: "The Fix", content: "Allow Git to merge the unrelated histories:", command: "# For pull:\ngit pull origin main --allow-unrelated-histories\n\n# For merge:\ngit merge other-branch --allow-unrelated-histories" },
        { title: "Resolve Any Conflicts", content: "After allowing unrelated histories, you may have conflicts (especially in README.md or other common files). Resolve them normally:", command: "# Check for conflicts:\ngit status\n\n# Fix conflicts, then:\ngit add .\ngit commit -m \"Merge unrelated histories\"" },
        { title: "Prevention", content: "To avoid this in the future:\n- When creating a GitHub repo, do NOT initialize with README if you already have a local repo\n- Clone the empty repo first, then add your files\n- Or create the repo without any files, then push your local code" }
    ],
    faqs: [
        { question: "Is it safe to merge unrelated histories?", answer: "Yes, if you understand what you are doing. It simply combines two independent project histories. Make sure you resolve any file conflicts correctly." }
    ]
},
{
    id: 102, title: "Resolving 'Your local changes would be overwritten'", category_id: 8, difficulty: "Beginner",
    description: "Fix the error when Git refuses to switch branches or pull because it would overwrite your uncommitted changes.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["local changes", "overwritten", "checkout", "switch branch", "uncommitted"]),
    commands: JSON.stringify(["git stash", "git commit", "git checkout"]),
    steps: [
        { title: "Why This Happens", content: "Git refuses to switch branches or pull when you have uncommitted changes that would conflict with files in the target branch. Git is protecting your work from being lost." },
        { title: "Option 1: Stash Your Changes", content: "Temporarily save your changes, perform the operation, then restore:", command: "git stash\ngit switch other-branch\n# Do your work on the other branch\ngit switch original-branch\ngit stash pop" },
        { title: "Option 2: Commit Your Changes", content: "If your changes are ready, commit them first:", command: "git add .\ngit commit -m \"Work in progress: save current state\"\ngit switch other-branch" },
        { title: "Option 3: Discard Your Changes", content: "WARNING: This permanently loses your uncommitted work:", command: "# Discard changes in specific files:\ngit restore file1.js file2.js\n\n# Discard ALL uncommitted changes:\ngit restore .\ngit clean -fd" },
        { title: "Option 4: Force Checkout (Dangerous)", content: "Force switch branches and discard conflicting changes:", command: "git checkout -f other-branch\n# WARNING: Permanently discards conflicting uncommitted changes" }
    ],
    faqs: [
        { question: "Why doesn't this happen with all branch switches?", answer: "Git only blocks the switch when your uncommitted changes conflict with files that differ between branches. If the changed files are identical on both branches, Git switches cleanly and keeps your changes." }
    ]
},
{
    id: 103, title: "Fixing 'HEAD detached at' Warnings", category_id: 8, difficulty: "Intermediate",
    description: "Understand and resolve the 'You are in detached HEAD state' warning that appears after checking out a tag or commit.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["detached HEAD", "warning", "tag checkout", "commit checkout", "reattach"]),
    commands: JSON.stringify(["git switch", "git checkout", "git switch -c"]),
    steps: [
        { title: "What Triggers This Warning", content: "You enter detached HEAD state when you check out:\n- A specific commit hash: git checkout abc1234\n- A tag: git checkout v1.0.0\n- A remote branch directly: git checkout origin/main\n\nIn this state, HEAD points to a commit, not a branch." },
        { title: "Is It Dangerous?", content: "Not immediately. You can look around, run tests, and even make commits. The risk is that commits made in detached HEAD are not on any branch and can be lost when you switch away." },
        { title: "Return to a Branch", content: "Simply switch to an existing branch:", command: "git switch main\n# or:\ngit checkout main" },
        { title: "Save Your Detached HEAD Work", content: "If you made valuable commits in detached HEAD, save them:", command: "# Create a new branch at the current position:\ngit switch -c rescue-branch\n# All your commits are now safely on this branch" },
        { title: "Checkout a Tag Without Detaching", content: "If you want to work on a tag, create a branch from it:", command: "# Instead of:\ngit checkout v1.0.0\n\n# Do this:\ngit switch -c fix-v1.0.0 v1.0.0\n# Now you're on a branch based on the tag" }
    ],
    faqs: [
        { question: "I lost commits after leaving detached HEAD. Can I recover them?", answer: "Yes. Use 'git reflog' to find the lost commit hashes, then create a branch: git branch rescue-branch abc1234" }
    ]
},
{
    id: 104, title: "Git LFS Troubleshooting", category_id: 8, difficulty: "Advanced",
    description: "Diagnose and fix common issues with Git Large File Storage for managing binary assets.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["LFS", "large file", "storage", "binary", "assets", "bandwidth"]),
    commands: JSON.stringify(["git lfs install", "git lfs track", "git lfs ls-files"]),
    steps: [
        { title: "What is Git LFS?", content: "Git LFS (Large File Storage) replaces large files (images, videos, datasets) with lightweight pointers in your repository. The actual file contents are stored on a separate LFS server, keeping your repo fast." },
        { title: "Install and Configure LFS", content: "Set up Git LFS in your repository:", command: "# Install LFS:\ngit lfs install\n\n# Track specific file types:\ngit lfs track \"*.psd\"\ngit lfs track \"*.mp4\"\ngit lfs track \"*.zip\"\n\n# Make sure .gitattributes is tracked:\ngit add .gitattributes" },
        { title: "Common Issue: Files Not Being Tracked", content: "If LFS is not tracking files as expected:", command: "# Check which files are tracked by LFS:\ngit lfs ls-files\n\n# Check tracking rules:\ncat .gitattributes\n\n# If a file was committed before LFS was set up, migrate it:\ngit lfs migrate import --include=\"*.psd\"" },
        { title: "Common Issue: Smudge/Clean Errors", content: "If you see 'smudge filter lfs failed':", command: "# Re-install LFS hooks:\ngit lfs install --force\n\n# Pull LFS objects:\ngit lfs pull\n\n# If still failing, check your LFS server:\ngit lfs env" },
        { title: "Bandwidth and Storage Limits", content: "GitHub Free includes 1 GB LFS storage and 1 GB/month bandwidth.\n\nIf you hit limits:\n- Purchase additional LFS data packs\n- Move large files to external storage (S3, CDN)\n- Use .gitattributes carefully to track only necessary files\n\nCheck usage:", command: "git lfs env\n# Shows your LFS endpoint and configuration" }
    ],
    faqs: [
        { question: "Do all team members need LFS installed?", answer: "Yes. Without LFS installed, team members will see pointer files instead of actual content. Run 'git lfs install' on every machine that will work with the repository." }
    ]
},
{
    id: 105, title: "Fixing Slow Git Performance", category_id: 8, difficulty: "Intermediate",
    description: "Diagnose and fix slow Git operations in large repositories with optimization techniques.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["slow", "performance", "optimization", "large repo", "speed", "gc"]),
    commands: JSON.stringify(["git gc", "git maintenance", "git config"]),
    steps: [
        { title: "Common Causes of Slow Git", content: "Git can slow down due to:\n- Very large number of files (100,000+)\n- Large file sizes in history\n- Too many pack files\n- Unoptimized configuration\n- Network issues with remote operations" },
        { title: "Run Garbage Collection", content: "Clean up and optimize your repository:", command: "# Basic garbage collection:\ngit gc\n\n# Aggressive optimization (takes longer):\ngit gc --aggressive --prune=now" },
        { title: "Enable Background Maintenance", content: "Let Git optimize itself automatically:", command: "git maintenance start\n# Sets up automatic background tasks:\n# - Prefetch: fetch remotes hourly\n# - Commit-graph: optimize commit lookups\n# - Pack-refs: compress references\n# - Loose-objects: clean up loose objects" },
        { title: "Optimize for Large Repos", content: "Configure Git for better performance with many files:", command: "# Enable filesystem monitor (speeds up status/diff):\ngit config core.fsmonitor true\n\n# Enable untracked cache:\ngit config core.untrackedCache true\n\n# Use commit graph for faster log operations:\ngit config fetch.writeCommitGraph true" },
        { title: "Check Repository Size", content: "Understand what is taking up space:", command: "# Check total repo size:\ndu -sh .git\n\n# Find the largest objects:\ngit rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sort -k3 -n -r | head -20" }
    ],
    faqs: [
        { question: "Does cloning with --depth help performance?", answer: "Yes. Shallow clones with --depth 1 are much faster to clone and take less disk space. But some operations (blame, log) will have limited history. You can unshallow later if needed." }
    ]
},
{
    id: 106, title: "Resolving Line Ending Issues (CRLF vs LF)", category_id: 8, difficulty: "Intermediate",
    description: "Fix cross-platform line ending problems that cause unnecessary diffs and merge conflicts.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["line ending", "CRLF", "LF", "autocrlf", "cross-platform", "whitespace"]),
    commands: JSON.stringify(["git config", "git add --renormalize"]),
    steps: [
        { title: "The Problem", content: "Windows uses CRLF (\\r\\n) line endings. Mac/Linux use LF (\\n). When team members use different operating systems, Git may show entire files as changed even though only line endings differ." },
        { title: "Configure Git for Your OS", content: "Set the appropriate autocrlf setting:", command: "# On Windows (converts LF to CRLF on checkout, CRLF to LF on commit):\ngit config --global core.autocrlf true\n\n# On Mac/Linux (converts CRLF to LF on commit, no conversion on checkout):\ngit config --global core.autocrlf input" },
        { title: "Use .gitattributes (Recommended)", content: "Create a .gitattributes file for consistent behavior across all developers:", command: "# .gitattributes\n* text=auto\n*.sh text eol=lf\n*.bat text eol=crlf\n*.png binary\n*.jpg binary" },
        { title: "Fix Existing Files", content: "Renormalize all files to apply the new settings:", command: "git add --renormalize .\ngit commit -m \"Fix line endings\"" },
        { title: "Verify Line Endings", content: "Check what line endings a file uses:", command: "# On Mac/Linux:\nfile filename.txt\n# Shows 'ASCII text' (LF) or 'ASCII text, with CRLF line terminators'\n\n# Check Git's stored endings:\ngit ls-files --eol" }
    ],
    faqs: [
        { question: "Should I use LF or CRLF in my repository?", answer: "Store LF in the repository (Git default). Let each developer's OS handle conversion through autocrlf or .gitattributes. This is the most compatible approach." }
    ]
},
{
    id: 107, title: "Recovering from Corrupted Git Repository", category_id: 8, difficulty: "Advanced",
    description: "Diagnose and repair a corrupted Git repository when Git reports missing or broken objects.",
    reading_time: "6 min", author: "GitGuide Team",
    keywords: JSON.stringify(["corrupted", "broken", "repair", "fsck", "missing object", "recover"]),
    commands: JSON.stringify(["git fsck", "git reflog"]),
    steps: [
        { title: "Signs of Corruption", content: "A corrupted repository may show errors like:\n- 'fatal: bad object HEAD'\n- 'error: object file is empty'\n- 'fatal: loose object is corrupt'\n- 'error: unable to read sha1 file'\n\nCorruption can be caused by disk failures, power outages, or interrupted Git operations." },
        { title: "Run File System Check", content: "Diagnose corruption with git fsck:", command: "git fsck --full\n# Reports missing objects, dangling commits, and corruption" },
        { title: "Try Simple Fixes First", content: "Sometimes simple steps resolve the issue:", command: "# Rebuild the index:\nrm .git/index\ngit reset\n\n# Fix HEAD reference:\necho 'ref: refs/heads/main' > .git/HEAD\n\n# Fetch from remote to get missing objects:\ngit fetch origin" },
        { title: "Recover from Remote", content: "If you have a remote copy, the easiest fix is often:", command: "# Back up your current work:\ncp -r . ../project-backup\n\n# Re-clone from remote:\ncd ..\ngit clone https://github.com/user/project.git project-recovered\n\n# Copy uncommitted changes from backup:\ncp -r project-backup/src/* project-recovered/src/" },
        { title: "Prevention", content: "Prevent corruption:\n\n1. Never kill Git processes forcefully\n2. Use a UPS or reliable power supply\n3. Keep regular remote backups (push frequently)\n4. Avoid using Git on network-mounted filesystems\n5. Run 'git fsck' periodically as a health check" }
    ],
    faqs: [
        { question: "Can I always recover a corrupted repo?", answer: "If you have a remote copy, almost always. Without a remote, it depends on the extent of corruption. Git fsck and reflog can recover many scenarios, but severe disk corruption may result in data loss." }
    ]
},
{
    id: 108, title: "Fixing 'fatal: bad object' Errors", category_id: 8, difficulty: "Intermediate",
    description: "Resolve 'bad object' and 'missing object' errors that occur when Git cannot find referenced data.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["bad object", "missing object", "fatal", "sha1", "broken reference"]),
    commands: JSON.stringify(["git fsck", "git fetch"]),
    steps: [
        { title: "What Causes Bad Object Errors", content: "These errors occur when Git references an object (commit, tree, blob) that doesn't exist or is corrupted. Common causes:\n\n- Interrupted Git operations (force quit during rebase)\n- Disk corruption\n- Manual editing of .git directory\n- Failed garbage collection" },
        { title: "Diagnose the Problem", content: "Find which objects are missing or broken:", command: "git fsck --full --no-dangling 2>&1 | head -20" },
        { title: "Fetch Missing Objects", content: "If the objects exist on the remote, fetch them:", command: "git fetch --all\n# This downloads any objects that exist remotely but are missing locally" },
        { title: "Remove Bad References", content: "If a branch or tag points to a bad object:", command: "# For a bad branch reference:\ngit branch -D bad-branch\n\n# For a bad tag:\ngit tag -d bad-tag\n\n# Then re-fetch:\ngit fetch origin" },
        { title: "Last Resort: Re-clone", content: "If nothing else works, re-clone the repository:", command: "# Save any local-only work:\ngit format-patch origin/main --stdout > my-patches.patch\n\n# Re-clone:\ncd ..\ngit clone https://github.com/user/repo.git\ncd repo\n\n# Re-apply your patches:\ngit am < ../my-patches.patch" }
    ],
    faqs: [
        { question: "Will git gc fix bad objects?", answer: "Sometimes. Running 'git gc --prune=now' can clean up unreachable objects. But if a referenced object is truly corrupted, you need to fetch it from a remote or re-clone." }
    ]
},
{
    id: 109, title: "Resolving '.git/index.lock' File Errors", category_id: 8, difficulty: "Beginner",
    description: "Fix the 'Unable to create .git/index.lock: File exists' error that blocks all Git operations.",
    reading_time: "3 min", author: "GitGuide Team",
    keywords: JSON.stringify(["index.lock", "lock file", "unable to create", "file exists", "stuck"]),
    commands: JSON.stringify(["rm", "del"]),
    steps: [
        { title: "What Causes This Error", content: "Git creates a .git/index.lock file when performing operations that modify the index (add, commit, merge). If Git crashes or is interrupted, the lock file may be left behind, blocking all subsequent operations." },
        { title: "The Error Message", content: "You see:\nfatal: Unable to create '/path/to/repo/.git/index.lock': File exists.\n\nAnother git process seems to be running in this repository.\nIf no other git process is running, remove the file manually." },
        { title: "Check for Running Git Processes", content: "First, make sure no Git operation is actually running:", command: "# On Mac/Linux:\nps aux | grep git\n\n# On Windows:\ntasklist | findstr git" },
        { title: "Remove the Lock File", content: "If no Git process is running, safely remove the lock:", command: "# On Mac/Linux:\nrm -f .git/index.lock\n\n# On Windows:\ndel .git\\index.lock\n\n# Or force delete on Windows:\nrm -Force .git/index.lock" },
        { title: "Verify Git Works", content: "After removing the lock, verify Git operations work:", command: "git status\n# Should work normally now" }
    ],
    faqs: [
        { question: "Is it safe to delete index.lock?", answer: "Yes, as long as no other Git process is actually running. The lock file is temporary and Git will recreate it as needed. Deleting it when no process holds it is completely safe." }
    ]
},
{
    id: 110, title: "Troubleshooting Git Hooks Failures", category_id: 8, difficulty: "Intermediate",
    description: "Debug and fix common issues with Git hooks that prevent commits, pushes, or other operations.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["hooks", "failure", "pre-commit", "permission", "debug", "skip"]),
    commands: JSON.stringify(["git commit --no-verify", "chmod"]),
    steps: [
        { title: "Common Hook Issues", content: "Git hooks can fail due to:\n- Missing execute permissions (Linux/Mac)\n- Wrong shebang line (#!/bin/sh vs #!/bin/bash)\n- Missing dependencies (Node.js, Python not installed)\n- Path issues (hook can't find tools)\n- Windows line ending issues in hook scripts" },
        { title: "Check Permissions", content: "Ensure hook files are executable:", command: "# Check permissions:\nls -la .git/hooks/pre-commit\n\n# Make executable:\nchmod +x .git/hooks/pre-commit" },
        { title: "Debug a Failing Hook", content: "Add debugging output to your hook:", command: "# Add to the top of your hook script:\nset -x  # Enable command tracing\necho \"Hook running from: $(pwd)\"\necho \"PATH: $PATH\"\necho \"Node: $(which node)\"" },
        { title: "Skip Hooks Temporarily", content: "Bypass hooks when needed:", command: "# Skip pre-commit and commit-msg hooks:\ngit commit --no-verify -m \"Emergency fix\"\n\n# Skip pre-push hooks:\ngit push --no-verify" },
        { title: "Fix Husky Hook Issues", content: "If using Husky for team hooks:", command: "# Reinstall Husky:\nnpx husky install\n\n# Ensure .husky directory exists:\nls -la .husky/\n\n# Check if the hook is valid:\ncat .husky/pre-commit" }
    ],
    faqs: [
        { question: "My hook works locally but fails in CI. Why?", answer: "CI environments may not have the same tools installed, or hooks may not be executed at all. Most CI systems run git operations with --no-verify. Configure linting and tests as CI steps instead of relying on hooks in CI." }
    ]
},
{
    id: 111, title: "Fixing 'src refspec does not match any'", category_id: 8, difficulty: "Beginner",
    description: "Solve the 'error: src refspec main does not match any' error when pushing to a remote.",
    reading_time: "3 min", author: "GitGuide Team",
    keywords: JSON.stringify(["src refspec", "does not match", "push error", "no commits", "branch name"]),
    commands: JSON.stringify(["git branch", "git commit", "git push"]),
    steps: [
        { title: "What Causes This Error", content: "This error means Git cannot find the branch you are trying to push. The most common causes:\n\n1. No commits exist yet (empty repository)\n2. The branch name is different (master vs main)\n3. Typo in the branch name" },
        { title: "Cause 1: No Commits", content: "You cannot push an empty repository. Make at least one commit first:", command: "git add .\ngit commit -m \"Initial commit\"\ngit push -u origin main" },
        { title: "Cause 2: Wrong Branch Name", content: "Check your actual branch name:", command: "git branch\n# If it shows 'master' but you're pushing 'main':\ngit push -u origin master\n\n# Or rename your branch:\ngit branch -m master main\ngit push -u origin main" },
        { title: "Cause 3: Typo", content: "Double-check the branch name:", command: "# See all local branches:\ngit branch\n\n# See all remote branches:\ngit branch -r\n\n# Push with the correct name:\ngit push origin correct-branch-name" }
    ],
    faqs: [
        { question: "Why do some repos use 'master' and others use 'main'?", answer: "Older Git versions defaulted to 'master'. Since 2020, GitHub and Git switched the default to 'main'. Both work the same way — it's just a naming convention. You can set your default with: git config --global init.defaultBranch main" }
    ]
},
{
    id: 112, title: "Debugging Git Network Issues", category_id: 8, difficulty: "Intermediate",
    description: "Diagnose and fix network-related Git problems like timeouts, SSL errors, and proxy issues.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["network", "timeout", "SSL", "proxy", "connection", "firewall"]),
    commands: JSON.stringify(["git config", "GIT_CURL_VERBOSE"]),
    steps: [
        { title: "Enable Verbose Output", content: "Get detailed information about network operations:", command: "# For HTTPS operations:\nGIT_CURL_VERBOSE=1 git fetch origin\n\n# For SSH operations:\nGIT_SSH_COMMAND='ssh -v' git fetch origin" },
        { title: "Fix SSL Certificate Errors", content: "If you see SSL certificate verification errors:", command: "# Update CA certificates (recommended):\n# Mac: brew install ca-certificates\n# Ubuntu: sudo apt update && sudo apt install ca-certificates\n\n# Last resort: disable SSL verification (NOT recommended for production):\ngit config --global http.sslVerify false" },
        { title: "Configure Proxy Settings", content: "If you are behind a corporate proxy:", command: "# Set HTTP proxy:\ngit config --global http.proxy http://proxy.company.com:8080\n\n# Set HTTPS proxy:\ngit config --global https.proxy http://proxy.company.com:8080\n\n# Remove proxy settings:\ngit config --global --unset http.proxy" },
        { title: "Fix Timeout Issues", content: "Increase timeout for slow connections:", command: "# Increase HTTP timeout (default is no timeout):\ngit config --global http.lowSpeedLimit 1000\ngit config --global http.lowSpeedTime 60\n\n# Increase buffer size for large repos:\ngit config --global http.postBuffer 524288000" },
        { title: "Switch Between HTTPS and SSH", content: "If one protocol fails, try the other:", command: "# Switch from HTTPS to SSH:\ngit remote set-url origin git@github.com:user/repo.git\n\n# Switch from SSH to HTTPS:\ngit remote set-url origin https://github.com/user/repo.git" }
    ],
    faqs: [
        { question: "My company blocks SSH port 22. Can I still use SSH?", answer: "Yes. GitHub allows SSH over port 443: ssh -T -p 443 git@ssh.github.com. Configure it in ~/.ssh/config with 'Host github.com' → 'Hostname ssh.github.com' → 'Port 443'." }
    ]
},
{
    id: 113, title: "Solving 'fatal: unable to access' HTTPS Errors", category_id: 8, difficulty: "Beginner",
    description: "Fix HTTPS connection errors when pushing, pulling, or cloning from remote repositories.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["unable to access", "HTTPS", "connection refused", "could not resolve", "403"]),
    commands: JSON.stringify(["git remote", "git config"]),
    steps: [
        { title: "Common HTTPS Errors", content: "You may see errors like:\n- fatal: unable to access 'https://...': Could not resolve host\n- fatal: unable to access 'https://...': Failed to connect\n- The requested URL returned error: 403\n- The requested URL returned error: 401" },
        { title: "Check Your Remote URL", content: "Verify the remote URL is correct:", command: "git remote -v\n# Make sure the URL matches your actual repository" },
        { title: "Fix 401/403 Authentication Errors", content: "These mean your credentials are wrong or expired:", command: "# Update your credentials:\ngit config --global credential.helper manager-core\n\n# Or use a new Personal Access Token:\ngit remote set-url origin https://YOUR_TOKEN@github.com/user/repo.git" },
        { title: "Fix DNS Resolution Errors", content: "If Git cannot resolve the hostname:", command: "# Test DNS resolution:\nnslookup github.com\n# or:\nping github.com\n\n# If DNS fails, try:\n# 1. Check your internet connection\n# 2. Try a different DNS server (8.8.8.8)\n# 3. Check if the site is blocked by firewall" },
        { title: "Fix Connection Refused", content: "If the connection is refused or times out:", command: "# Check if the server is reachable:\ncurl -I https://github.com\n\n# If behind a proxy, configure it:\ngit config --global http.proxy http://proxy:port\n\n# If all else fails, try SSH instead:\ngit remote set-url origin git@github.com:user/repo.git" }
    ],
    faqs: [
        { question: "I get 403 when pushing but cloning works. Why?", answer: "Cloning public repos does not require authentication. Pushing always requires authentication. Make sure you are using a valid Personal Access Token (not your password) and that the token has 'repo' scope." }
    ]
},
{
    id: 114, title: "Fixing Git Submodule Update Failures", category_id: 8, difficulty: "Advanced",
    description: "Troubleshoot and fix common errors when initializing, updating, or syncing Git submodules.",
    reading_time: "5 min", author: "GitGuide Team",
    keywords: JSON.stringify(["submodule", "update", "failure", "init", "sync", "recursive"]),
    commands: JSON.stringify(["git submodule update", "git submodule sync", "git submodule init"]),
    steps: [
        { title: "Common Submodule Errors", content: "Frequent submodule issues:\n- 'fatal: no submodule mapping found' – .gitmodules is missing or wrong\n- Empty submodule directories after cloning\n- 'reference is not a tree' – submodule points to a nonexistent commit\n- Permission denied when accessing submodule repo" },
        { title: "Fix Empty Submodule Directories", content: "If submodule directories are empty after cloning:", command: "# Initialize and update all submodules:\ngit submodule init\ngit submodule update\n\n# Or do both at once:\ngit submodule update --init --recursive" },
        { title: "Fix URL Mismatch", content: "If the submodule URL has changed:", command: "# Sync URLs from .gitmodules to .git/config:\ngit submodule sync\n\n# Then update:\ngit submodule update --init --recursive" },
        { title: "Fix 'reference is not a tree'", content: "This happens when the parent repo points to a submodule commit that doesn't exist:", command: "# Enter the submodule directory:\ncd path/to/submodule\n\n# Fetch all commits:\ngit fetch --all\n\n# If the commit exists, checkout:\ngit checkout abc1234\n\n# If the commit doesn't exist, update to latest:\ngit checkout main\ncd ..\ngit add path/to/submodule\ngit commit -m \"Update submodule to latest\"" },
        { title: "Force Reinitialize", content: "Nuclear option — completely reset submodules:", command: "# Remove all submodule directories:\ngit submodule deinit --all -f\n\n# Remove the submodule caches:\nrm -rf .git/modules/*\n\n# Re-initialize:\ngit submodule init\ngit submodule update --recursive" }
    ],
    faqs: [
        { question: "Should I avoid submodules?", answer: "Submodules add complexity. Consider alternatives: npm/pip packages for libraries, git subtree for simpler embedding, or monorepo approaches. Use submodules only when you truly need to track a specific commit of an external repo." }
    ]
},
{
    id: 115, title: "Common .gitignore Mistakes and Fixes", category_id: 8, difficulty: "Beginner",
    description: "Fix the most common .gitignore mistakes that cause files to be tracked when they should not be.",
    reading_time: "4 min", author: "GitGuide Team",
    keywords: JSON.stringify(["gitignore", "mistakes", "not working", "already tracked", "pattern"]),
    commands: JSON.stringify(["git rm --cached", "git check-ignore"]),
    steps: [
        { title: "Mistake 1: Adding .gitignore After Tracking", content: "The most common mistake. If a file is already tracked by Git, adding it to .gitignore will NOT stop tracking it.", command: "# Fix: Remove the file from tracking (keeps it locally):\ngit rm --cached filename.txt\ngit commit -m \"Stop tracking filename.txt\"\n\n# For a directory:\ngit rm -r --cached node_modules/\ngit commit -m \"Stop tracking node_modules\"" },
        { title: "Mistake 2: Wrong Pattern Syntax", content: "Common pattern errors:\n\n# Wrong (matches nothing):\n/node_modules\n\n# Correct (matches the directory anywhere):\nnode_modules/\n\n# Wrong (too specific):\nsrc/components/*.test.js\n\n# Correct (matches recursively):\n**/*.test.js" },
        { title: "Mistake 3: Negation Not Working", content: "Negation patterns (!) don't work if a parent directory is ignored:", command: "# This DOES NOT work:\nbuild/\n!build/important.js\n\n# Because the build/ directory itself is ignored\n# Fix: Don't ignore the directory, ignore its contents:\nbuild/*\n!build/important.js" },
        { title: "Debug .gitignore Rules", content: "Find out why a file is or is not being ignored:", command: "# Check if a file is ignored and which rule applies:\ngit check-ignore -v filename.txt\n\n# Check multiple files:\ngit check-ignore -v path/to/file1 path/to/file2" },
        { title: "Global .gitignore", content: "Ignore files across ALL your repositories:", command: "# Create a global gitignore:\ngit config --global core.excludesFile ~/.gitignore_global\n\n# Add common patterns to ~/.gitignore_global:\n# .DS_Store\n# Thumbs.db\n# *.swp\n# .idea/\n# .vscode/" }
    ],
    faqs: [
        { question: "Where can I find good .gitignore templates?", answer: "GitHub maintains templates at github.com/github/gitignore for nearly every language and framework. GitHub also offers a .gitignore template selector when creating new repositories." }
    ]
}
];

// ============================================================
// SEED FUNCTION
// ============================================================
async function seedNewArticles() {
    console.log('🌱 Starting GitGuide new articles seed...\n');
    
    const connection = await db.getConnection();

    try {
        // Get existing article titles to avoid duplicates
        const [titleRows] = await connection.query('SELECT title FROM articles');
        const existingTitles = new Set(
            titleRows.map(r => r.title.toLowerCase())
        );

        // Get existing article IDs
        const [idRows] = await connection.query('SELECT id FROM articles');
        const existingIds = new Set(
            idRows.map(r => r.id)
        );

        // Get valid categories
        const [catRows] = await connection.query('SELECT id FROM categories');
        const validCategories = new Set(
            catRows.map(r => r.id)
        );

        console.log(`📊 Existing articles: ${existingIds.size}`);
        console.log(`📊 New articles to process: ${newArticles.length}`);
        console.log(`📊 Valid categories: ${[...validCategories].join(', ')}\n`);

        // Clean up any junk test entries (IDs 25-28 that may have been test data)
        const junkIds = [25, 26, 27, 28];
        const validTitlesStr = newArticles.filter(a => junkIds.includes(a.id)).map(a => `'${a.title.replace(/'/g, "''")}'`).join(',');
        
        const [junkEntries] = await connection.query(
            `SELECT id, title FROM articles WHERE id IN (${junkIds.join(',')}) AND title NOT IN (${validTitlesStr || "''"})`
        );

        await connection.beginTransaction();

        if (junkEntries.length > 0) {
            console.log(`🧹 Cleaning ${junkEntries.length} junk test entries...`);
            for (const j of junkEntries) {
                await connection.query('DELETE FROM article_steps WHERE article_id = ?', [j.id]);
                await connection.query('DELETE FROM article_faqs WHERE article_id = ?', [j.id]);
                await connection.query('DELETE FROM comments WHERE article_id = ?', [j.id]);
                await connection.query('DELETE FROM ratings WHERE article_id = ?', [j.id]);
                await connection.query('DELETE FROM bookmarks WHERE article_id = ?', [j.id]);
                await connection.query('DELETE FROM articles WHERE id = ?', [j.id]);
                console.log(`   Removed junk entry #${j.id}: "${j.title}"`);
            }
            console.log('');
        }

        // Prepare insert statements
        const insertArticleQuery = `
            INSERT IGNORE INTO articles (id, title, category_id, difficulty, description, reading_time, author, keywords, commands, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Published')
        `;

        const insertStepQuery = `
            INSERT INTO article_steps (article_id, step_number, title, content, command)
            VALUES (?, ?, ?, ?, ?)
        `;

        const insertFaqQuery = `
            INSERT INTO article_faqs (article_id, question, answer)
            VALUES (?, ?, ?)
        `;

        let inserted = 0;
        let skipped = 0;

        for (const art of newArticles) {
            // Skip if title already exists (case-insensitive)
            if (existingTitles.has(art.title.toLowerCase())) {
                console.log(`⏭️  Skipped (duplicate title): "${art.title}"`);
                skipped++;
                continue;
            }

            // Validate category
            if (!validCategories.has(art.category_id)) {
                console.log(`⚠️  Skipped (invalid category ${art.category_id}): "${art.title}"`);
                skipped++;
                continue;
            }

            // Delete any existing entry with this ID (handles junk entries)
            const [existingWithId] = await connection.query('SELECT id FROM articles WHERE id = ?', [art.id]);
            if (existingWithId.length > 0) {
                await connection.query('DELETE FROM article_steps WHERE article_id = ?', [art.id]);
                await connection.query('DELETE FROM article_faqs WHERE article_id = ?', [art.id]);
                await connection.query('DELETE FROM comments WHERE article_id = ?', [art.id]);
                await connection.query('DELETE FROM ratings WHERE article_id = ?', [art.id]);
                await connection.query('DELETE FROM bookmarks WHERE article_id = ?', [art.id]);
                await connection.query('DELETE FROM articles WHERE id = ?', [art.id]);
            }

            // Insert article
            await connection.query(insertArticleQuery, [
                art.id,
                art.title,
                art.category_id,
                art.difficulty || 'Beginner',
                art.description || '',
                art.reading_time || '5 min',
                art.author || 'GitGuide Team',
                art.keywords || '[]',
                art.commands || '[]'
            ]);

            // Insert steps
            if (art.steps && Array.isArray(art.steps)) {
                for (let idx = 0; idx < art.steps.length; idx++) {
                    const step = art.steps[idx];
                    await connection.query(insertStepQuery, [
                        art.id, idx + 1, step.title || '', step.content || '', step.command || null
                    ]);
                }
            }

            // Insert FAQs
            if (art.faqs && Array.isArray(art.faqs)) {
                for (const faq of art.faqs) {
                    await connection.query(insertFaqQuery, [
                        art.id, faq.question || '', faq.answer || ''
                    ]);
                }
            }

            inserted++;
            console.log(`✅ #${art.id} "${art.title}" (${art.steps ? art.steps.length : 0} steps, ${art.faqs ? art.faqs.length : 0} FAQs)`);
        }

        await connection.commit();

        // Final counts
        const [totalArticlesRows] = await connection.query('SELECT COUNT(*) as count FROM articles');
        const totalArticles = totalArticlesRows[0].count;
        
        const [totalStepsRows] = await connection.query('SELECT COUNT(*) as count FROM article_steps');
        const totalSteps = totalStepsRows[0].count;
        
        const [totalFaqsRows] = await connection.query('SELECT COUNT(*) as count FROM article_faqs');
        const totalFaqs = totalFaqsRows[0].count;

        // Category breakdown
        const [categoryBreakdown] = await connection.query(`
            SELECT c.name, COUNT(a.id) as count
            FROM categories c
            LEFT JOIN articles a ON a.category_id = c.id
            GROUP BY c.id
            ORDER BY c.id
        `);

        // Check for duplicate titles
        const [duplicates] = await connection.query(`
            SELECT title, COUNT(*) as cnt FROM articles GROUP BY LOWER(title) HAVING cnt > 1
        `);

        console.log('\n' + '='.repeat(60));
        console.log('📊 SEED RESULTS');
        console.log('='.repeat(60));
        console.log(`✅ New articles inserted: ${inserted}`);
        console.log(`⏭️  Skipped: ${skipped}`);
        console.log(`📄 Total articles in database: ${totalArticles}`);
        console.log(`📝 Total steps: ${totalSteps}`);
        console.log(`❓ Total FAQs: ${totalFaqs}`);
        console.log('\n📁 Articles by Category:');
        categoryBreakdown.forEach(c => {
            console.log(`   ${c.name}: ${c.count}`);
        });

        if (duplicates.length > 0) {
            console.log('\n⚠️  DUPLICATE TITLES FOUND:');
            duplicates.forEach(d => console.log(`   "${d.title}" (${d.cnt} times)`));
        } else {
            console.log('\n✅ No duplicate titles found');
        }

        console.log('\n🎉 Seed complete!\n');

    } catch (err) {
        await connection.rollback();
        console.error('❌ Error seeding new articles:', err);
        throw err;
    } finally {
        connection.release();
    }
}

// Run
if (require.main === module) {
    seedNewArticles()
        .then(() => process.exit(0))
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}

module.exports = seedNewArticles;
