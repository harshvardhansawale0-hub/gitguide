// ============================================================
// GitGuide – Sample Data
// ============================================================
// Temporary frontend data.
// In the complete project, this data would come from MySQL
// through a backend API (e.g., Node.js/Express or PHP).
// ============================================================

// ---------- CATEGORIES ----------
// Each category has an id, name, emoji icon, short description, and guide count.

const categories = [
    {
        id: 1,
        name: "Git Basics",
        icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20'></path><path d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'></path></svg>",
        description: "Learn the fundamentals of Git version control.",
        guideCount: 5
    },
    {
        id: 2,
        name: "Branching",
        icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='6' y1='3' x2='6' y2='15'></line><circle cx='18' cy='6' r='3'></circle><circle cx='6' cy='18' r='3'></circle><path d='M18 9a9 9 0 0 1-9 9'></path></svg>",
        description: "Create, switch, and manage Git branches.",
        guideCount: 3
    },
    {
        id: 3,
        name: "Merging",
        icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='18' cy='18' r='3'></circle><circle cx='6' cy='6' r='3'></circle><path d='M13 6h3a2 2 0 0 1 2 2v7'></path><line x1='6' y1='9' x2='6' y2='21'></line></svg>",
        description: "Merge branches and resolve conflicts.",
        guideCount: 2
    },
    {
        id: 4,
        name: "GitHub",
        icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22'></path></svg>",
        description: "Work with GitHub repositories and features.",
        guideCount: 3
    },
    {
        id: 5,
        name: "Authentication",
        icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='11' width='18' height='11' rx='2' ry='2'></rect><path d='M7 11V7a5 5 0 0 1 10 0v4'></path></svg>",
        description: "Set up SSH keys and access tokens.",
        guideCount: 2
    },
    {
        id: 6,
        name: "Remote Repositories",
        icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z'></path></svg>",
        description: "Push, pull, and manage remote repos.",
        guideCount: 2
    },
    {
        id: 7,
        name: "Undo & Recovery",
        icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M3 2v6h6'></path><path d='M3 13a9 9 0 1 0 3-7.7L3 8'></path></svg>",
        description: "Undo mistakes and recover lost work.",
        guideCount: 4
    },
    {
        id: 8,
        name: "Troubleshooting",
        icon: "<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'></path></svg>",
        description: "Fix common Git errors and problems.",
        guideCount: 3
    }
];

// ---------- ARTICLES ----------
// Each article contains an id, title, category, difficulty, description,
// reading time, author, keywords for search, related commands,
// step-by-step content, and FAQ items.

const articles = [
    {
        id: 1,
        title: "Getting Started with Git",
        category: "Git Basics",
        difficulty: "Beginner",
        description: "Learn what Git is, why developers use it, and how to install and configure it on your computer.",
        readingTime: "5 min",
        author: "GitGuide Team",
        keywords: ["install", "setup", "config", "init", "getting started", "beginner"],
        commands: ["git init", "git config"],
        steps: [
            {
                title: "What is Git?",
                content: "Git is a free, open-source distributed version control system. It helps developers track changes in their code, collaborate with others, and maintain a history of their project. Unlike centralized systems, every developer has a full copy of the repository on their local machine."
            },
            {
                title: "Install Git",
                content: "Download Git from the official website at git-scm.com. For Windows, run the installer and follow the default settings. For Mac, you can use Homebrew with the command below. For Linux, use your package manager.",
                command: "# Windows: Download from git-scm.com\n# Mac:\nbrew install git\n# Linux (Ubuntu/Debian):\nsudo apt-get install git"
            },
            {
                title: "Configure Your Identity",
                content: "After installing Git, set your name and email. This information is attached to every commit you make.",
                command: "git config --global user.name \"Your Name\"\ngit config --global user.email \"your.email@example.com\""
            },
            {
                title: "Initialize a Repository",
                content: "Navigate to your project folder and run the init command to create a new Git repository. This creates a hidden .git folder that tracks all your changes.",
                command: "cd my-project\ngit init"
            },
            {
                title: "Verify Your Setup",
                content: "Check that Git is installed and configured correctly by running these commands:",
                command: "git --version\ngit config --list"
            }
        ],
        faqs: [
            {
                question: "Do I need a GitHub account to use Git?",
                answer: "No. Git works locally on your computer. GitHub is a cloud platform for hosting Git repositories. You only need a GitHub account if you want to share your code online."
            },
            {
                question: "What is the .git folder?",
                answer: "The .git folder is a hidden directory created when you run 'git init'. It contains all the metadata and history for your repository. Do not delete this folder."
            }
        ]
    },
    {
        id: 2,
        title: "How to Fix Git Merge Conflicts",
        category: "Merging",
        difficulty: "Intermediate",
        description: "Step-by-step guide to understanding and resolving Git merge conflicts when combining branches.",
        readingTime: "6 min",
        author: "GitGuide Team",
        keywords: ["merge", "conflict", "resolve", "markers", "combine", "branches"],
        commands: ["git merge", "git status", "git add", "git commit"],
        steps: [
            {
                title: "What is a Merge Conflict?",
                content: "A merge conflict happens when Git cannot automatically combine changes from two branches. This usually occurs when the same line in a file has been modified differently in each branch."
            },
            {
                title: "Why Do Conflicts Happen?",
                content: "Conflicts arise when two branches modify the same part of a file. Git doesn't know which change to keep, so it marks the conflict and asks you to resolve it manually."
            },
            {
                title: "Step 1: Start the Merge",
                content: "When you attempt to merge a branch and there is a conflict, Git will stop and show you a message like 'CONFLICT (content): Merge conflict in filename'.",
                command: "git merge feature-branch"
            },
            {
                title: "Step 2: Find Conflicting Files",
                content: "Use git status to see which files have conflicts. They will be listed under 'Unmerged paths'.",
                command: "git status"
            },
            {
                title: "Step 3: Open and Edit the Conflicting File",
                content: "Open the file in your text editor. You will see conflict markers like this:\n\n<<<<<<< HEAD\nYour changes\n=======\nTheir changes\n>>>>>>> feature-branch\n\nDecide which changes to keep, remove the conflict markers, and save the file."
            },
            {
                title: "Step 4: Mark as Resolved and Commit",
                content: "After resolving all conflicts, add the files and commit:",
                command: "git add .\ngit commit -m \"Resolved merge conflicts\""
            },
            {
                title: "How to Verify",
                content: "Run git log to confirm the merge commit was created successfully:",
                command: "git log --oneline -5"
            }
        ],
        faqs: [
            {
                question: "Can I abort a merge?",
                answer: "Yes. If you want to cancel the merge and go back to the state before, use: git merge --abort"
            },
            {
                question: "How can I prevent merge conflicts?",
                answer: "Pull the latest changes frequently, keep branches short-lived, and communicate with your team about which files you're editing."
            }
        ]
    },
    {
        id: 3,
        title: "Git Push Rejected – How to Fix",
        category: "Troubleshooting",
        difficulty: "Intermediate",
        description: "Fix the 'failed to push some refs' error that happens when your local branch is behind the remote.",
        readingTime: "4 min",
        author: "GitGuide Team",
        keywords: ["push", "rejected", "failed", "refs", "remote", "behind"],
        commands: ["git push", "git pull", "git push --force"],
        steps: [
            {
                title: "Understanding the Error",
                content: "The error 'failed to push some refs to remote' means that the remote branch has commits that your local branch doesn't have. Git prevents you from pushing to avoid losing those commits."
            },
            {
                title: "Step 1: Pull the Latest Changes",
                content: "First, pull the latest changes from the remote branch and merge them into your local branch:",
                command: "git pull origin main"
            },
            {
                title: "Step 2: Resolve Any Conflicts",
                content: "If there are merge conflicts after pulling, resolve them as described in our merge conflicts guide, then commit the resolved files."
            },
            {
                title: "Step 3: Push Again",
                content: "After pulling and resolving any conflicts, push your changes again:",
                command: "git push origin main"
            },
            {
                title: "Alternative: Force Push (Use with Caution)",
                content: "If you are sure you want to overwrite the remote branch, you can force push. WARNING: This will overwrite the remote branch and may cause other developers to lose their work.",
                command: "git push --force origin main"
            }
        ],
        faqs: [
            {
                question: "When is it safe to use force push?",
                answer: "Only use force push when you are working alone on a branch and you are sure nobody else has based work on the remote version of that branch."
            }
        ]
    },
    {
        id: 4,
        title: "GitHub Authentication Failed – Fix Guide",
        category: "Authentication",
        difficulty: "Intermediate",
        description: "Solve the 'authentication failed' error when pushing to GitHub. Learn to use Personal Access Tokens and SSH.",
        readingTime: "7 min",
        author: "GitGuide Team",
        keywords: ["authentication", "failed", "password", "token", "PAT", "SSH", "credentials"],
        commands: ["git remote set-url", "ssh-keygen", "git config"],
        steps: [
            {
                title: "Why Authentication Fails",
                content: "Since August 2021, GitHub no longer accepts account passwords for Git operations. You must use either a Personal Access Token (PAT) or SSH key authentication."
            },
            {
                title: "Option 1: Personal Access Token (PAT)",
                content: "Go to GitHub → Settings → Developer settings → Personal access tokens → Generate new token. Select the required scopes (at minimum, 'repo') and generate the token. Copy it immediately — you won't see it again."
            },
            {
                title: "Use the Token",
                content: "When Git asks for your password, paste the Personal Access Token instead. You can also update your remote URL to include the token:",
                command: "git remote set-url origin https://YOUR_TOKEN@github.com/username/repo.git"
            },
            {
                title: "Option 2: SSH Key Authentication",
                content: "Generate a new SSH key pair on your computer:",
                command: "ssh-keygen -t ed25519 -C \"your.email@example.com\""
            },
            {
                title: "Add SSH Key to GitHub",
                content: "Copy your public key and add it to GitHub → Settings → SSH and GPG keys → New SSH key:",
                command: "# Copy the public key:\ncat ~/.ssh/id_ed25519.pub\n\n# Then switch your remote URL to SSH:\ngit remote set-url origin git@github.com:username/repo.git"
            },
            {
                title: "Verify SSH Connection",
                content: "Test your SSH connection to GitHub:",
                command: "ssh -T git@github.com"
            }
        ],
        faqs: [
            {
                question: "What scopes should I select for my PAT?",
                answer: "For basic repository access, select the 'repo' scope. If you need to manage workflows, also select 'workflow'."
            },
            {
                question: "Can I use the same SSH key for multiple GitHub accounts?",
                answer: "You can, but it requires additional configuration in your SSH config file. It's easier to use a separate key for each account."
            }
        ]
    },
    {
        id: 5,
        title: "How to Create a New Branch",
        category: "Branching",
        difficulty: "Beginner",
        description: "Learn how to create, switch between, and manage Git branches for feature development.",
        readingTime: "4 min",
        author: "GitGuide Team",
        keywords: ["branch", "create", "switch", "checkout", "feature", "new branch"],
        commands: ["git branch", "git switch", "git checkout -b"],
        steps: [
            {
                title: "What are Branches?",
                content: "Branches allow you to work on different features or fixes independently. The default branch is usually called 'main' or 'master'. You create new branches to isolate your work."
            },
            {
                title: "Create a New Branch",
                content: "Use the git branch command followed by the name of your new branch:",
                command: "git branch feature-login"
            },
            {
                title: "Switch to the New Branch",
                content: "Switch to your newly created branch using git switch (modern) or git checkout (traditional):",
                command: "# Modern way:\ngit switch feature-login\n\n# Traditional way:\ngit checkout feature-login"
            },
            {
                title: "Create and Switch in One Command",
                content: "You can create a new branch and switch to it in a single command:",
                command: "# Modern way:\ngit switch -c feature-login\n\n# Traditional way:\ngit checkout -b feature-login"
            },
            {
                title: "List All Branches",
                content: "To see all branches in your repository, use:",
                command: "git branch\n# The current branch is marked with an asterisk (*)"
            }
        ],
        faqs: [
            {
                question: "What is a good branch naming convention?",
                answer: "Use descriptive names with prefixes like feature/, bugfix/, or hotfix/. For example: feature/user-login, bugfix/header-alignment."
            }
        ]
    },
    {
        id: 6,
        title: "Git Reset vs Git Revert",
        category: "Undo & Recovery",
        difficulty: "Intermediate",
        description: "Understand the difference between git reset and git revert, and when to use each command.",
        readingTime: "5 min",
        author: "GitGuide Team",
        keywords: ["reset", "revert", "undo", "difference", "rollback", "history"],
        commands: ["git reset", "git revert"],
        steps: [
            {
                title: "Key Difference",
                content: "git reset removes commits from history (rewrites history). git revert creates a new commit that undoes a previous commit (preserves history). Use reset for local changes and revert for shared branches."
            },
            {
                title: "Git Reset (Rewrites History)",
                content: "Reset moves the branch pointer backward, effectively removing commits. There are three modes:",
                command: "# Keep changes in working directory and staging:\ngit reset --soft HEAD~1\n\n# Keep changes in working directory only:\ngit reset --mixed HEAD~1\n\n# Discard all changes completely:\ngit reset --hard HEAD~1"
            },
            {
                title: "Git Revert (Preserves History)",
                content: "Revert creates a new commit that undoes the changes from a specific commit. This is safe to use on shared branches because it doesn't rewrite history.",
                command: "git revert HEAD\n# or revert a specific commit:\ngit revert abc1234"
            },
            {
                title: "When to Use Which",
                content: "Use git reset when:\n- Working locally and haven't pushed yet\n- Want to clean up messy local commits\n\nUse git revert when:\n- Changes have been pushed to a shared branch\n- You need to preserve the commit history\n- Working in a team"
            }
        ],
        faqs: [
            {
                question: "Can I undo a git reset --hard?",
                answer: "Yes, if you act quickly. Use 'git reflog' to find the commit hash before the reset, then use 'git reset --hard <hash>' to recover."
            }
        ]
    },
    {
        id: 7,
        title: "How to Undo the Last Git Commit",
        category: "Undo & Recovery",
        difficulty: "Beginner",
        description: "Quick guide to undoing your last commit while keeping your changes or discarding them entirely.",
        readingTime: "3 min",
        author: "GitGuide Team",
        keywords: ["undo", "last commit", "uncommit", "soft reset", "amend"],
        commands: ["git reset --soft HEAD~1", "git commit --amend"],
        steps: [
            {
                title: "Undo Commit, Keep Changes Staged",
                content: "This is the safest option. It removes the commit but keeps your changes ready to be committed again:",
                command: "git reset --soft HEAD~1"
            },
            {
                title: "Undo Commit, Unstage Changes",
                content: "This removes the commit and unstages the files, but keeps your changes in the working directory:",
                command: "git reset HEAD~1\n# or explicitly:\ngit reset --mixed HEAD~1"
            },
            {
                title: "Undo Commit and Discard All Changes",
                content: "WARNING: This permanently deletes your changes. Use only if you're sure:",
                command: "git reset --hard HEAD~1"
            },
            {
                title: "Just Fix the Commit Message",
                content: "If you only need to change the commit message, use amend:",
                command: "git commit --amend -m \"New corrected commit message\""
            }
        ],
        faqs: [
            {
                question: "What does HEAD~1 mean?",
                answer: "HEAD refers to the current commit. HEAD~1 means 'one commit before HEAD'. HEAD~2 would mean two commits back, and so on."
            }
        ]
    },
    {
        id: 8,
        title: "How to Clone a GitHub Repository",
        category: "GitHub",
        difficulty: "Beginner",
        description: "Learn how to clone a repository from GitHub to your local machine using HTTPS or SSH.",
        readingTime: "3 min",
        author: "GitGuide Team",
        keywords: ["clone", "download", "repository", "GitHub", "HTTPS", "SSH", "copy"],
        commands: ["git clone"],
        steps: [
            {
                title: "What is Cloning?",
                content: "Cloning creates a local copy of a remote repository on your computer. It downloads all files, branches, and commit history."
            },
            {
                title: "Clone Using HTTPS",
                content: "Go to the repository on GitHub, click the green 'Code' button, copy the HTTPS URL, and run:",
                command: "git clone https://github.com/username/repository.git"
            },
            {
                title: "Clone Using SSH",
                content: "If you have SSH set up (see our authentication guide), use the SSH URL:",
                command: "git clone git@github.com:username/repository.git"
            },
            {
                title: "Clone to a Specific Folder",
                content: "You can specify a folder name after the URL:",
                command: "git clone https://github.com/username/repository.git my-folder"
            }
        ],
        faqs: [
            {
                question: "What is the difference between clone and fork?",
                answer: "Clone copies a repository to your local machine. Fork copies a repository to your own GitHub account. You typically fork first, then clone your fork."
            }
        ]
    },
    {
        id: 9,
        title: "Understanding Git Add and Staging",
        category: "Git Basics",
        difficulty: "Beginner",
        description: "Learn how the staging area works and how to use git add to prepare files for a commit.",
        readingTime: "4 min",
        author: "GitGuide Team",
        keywords: ["add", "stage", "staging area", "index", "track", "untracked"],
        commands: ["git add", "git status", "git diff"],
        steps: [
            {
                title: "What is the Staging Area?",
                content: "The staging area (also called the index) is a space between your working directory and the repository. You use 'git add' to move changes to the staging area before committing them."
            },
            {
                title: "Stage a Single File",
                content: "Add a specific file to the staging area:",
                command: "git add filename.txt"
            },
            {
                title: "Stage All Changes",
                content: "Add all modified and new files to staging:",
                command: "git add .\n# or:\ngit add --all"
            },
            {
                title: "Check What is Staged",
                content: "Use git status to see which files are staged and which are not:",
                command: "git status"
            },
            {
                title: "Unstage a File",
                content: "If you accidentally staged a file, you can unstage it:",
                command: "git restore --staged filename.txt"
            }
        ],
        faqs: [
            {
                question: "Why not commit directly without staging?",
                answer: "The staging area gives you control over exactly what goes into each commit. You can stage some changes while keeping others for a separate commit."
            }
        ]
    },
    {
        id: 10,
        title: "How to Write Good Commit Messages",
        category: "Git Basics",
        difficulty: "Beginner",
        description: "Best practices for writing clear, meaningful Git commit messages that help your team.",
        readingTime: "4 min",
        author: "GitGuide Team",
        keywords: ["commit", "message", "best practice", "convention", "writing", "log"],
        commands: ["git commit", "git log"],
        steps: [
            {
                title: "Why Commit Messages Matter",
                content: "Good commit messages help you and your team understand what changed and why. They make debugging easier and create a useful project history."
            },
            {
                title: "Basic Commit with Message",
                content: "Use the -m flag to add a message to your commit:",
                command: "git commit -m \"Add user login form validation\""
            },
            {
                title: "Follow the Convention",
                content: "A good commit message format:\n\n1. Start with a verb (Add, Fix, Update, Remove, Refactor)\n2. Keep the subject line under 50 characters\n3. Use the imperative mood ('Add feature' not 'Added feature')\n4. Capitalize the first letter\n5. Don't end with a period"
            },
            {
                title: "Examples of Good vs Bad Messages",
                content: "Good:\n- Add user authentication with JWT\n- Fix null pointer error in checkout flow\n- Update README with installation steps\n\nBad:\n- fixed stuff\n- update\n- asdfasdf\n- WIP"
            },
            {
                title: "View Commit History",
                content: "Use git log to see your commit messages:",
                command: "git log --oneline -10"
            }
        ],
        faqs: [
            {
                question: "Can I change a commit message after committing?",
                answer: "Yes, for the most recent commit use: git commit --amend -m \"New message\". For older commits, you would need to use interactive rebase."
            }
        ]
    },
    {
        id: 11,
        title: "Recover Deleted Commits Using Git Reflog",
        category: "Undo & Recovery",
        difficulty: "Advanced",
        description: "Use git reflog to find and recover commits that seem to be lost after a reset or rebase.",
        readingTime: "5 min",
        author: "GitGuide Team",
        keywords: ["reflog", "recover", "lost", "deleted", "commits", "restore", "history"],
        commands: ["git reflog", "git reset", "git cherry-pick"],
        steps: [
            {
                title: "What is the Reflog?",
                content: "The reflog (reference log) records every change to your branch tips and HEAD. Even if you delete a commit with 'git reset --hard', the commit still exists in the reflog for about 90 days."
            },
            {
                title: "View the Reflog",
                content: "See the history of all HEAD movements:",
                command: "git reflog"
            },
            {
                title: "Find the Lost Commit",
                content: "The reflog shows entries like:\nabc1234 HEAD@{0}: reset: moving to HEAD~1\ndef5678 HEAD@{1}: commit: Add login feature\n\nThe hash 'def5678' is the commit you lost."
            },
            {
                title: "Recover the Commit",
                content: "Use git reset to move your branch back to the lost commit:",
                command: "# Reset to the lost commit:\ngit reset --hard def5678\n\n# Or cherry-pick it onto your current branch:\ngit cherry-pick def5678"
            }
        ],
        faqs: [
            {
                question: "How long does the reflog keep entries?",
                answer: "By default, reflog entries expire after 90 days. You can change this with: git config gc.reflogExpire 120.days"
            }
        ]
    },
    {
        id: 12,
        title: "Git Stash – Save Work Without Committing",
        category: "Undo & Recovery",
        difficulty: "Intermediate",
        description: "Learn how to temporarily save your uncommitted changes using git stash so you can switch branches cleanly.",
        readingTime: "4 min",
        author: "GitGuide Team",
        keywords: ["stash", "save", "temporary", "switch branch", "uncommitted", "pop"],
        commands: ["git stash", "git stash pop", "git stash list"],
        steps: [
            {
                title: "What is Git Stash?",
                content: "Git stash takes your uncommitted changes (both staged and unstaged) and saves them on a stack. Your working directory becomes clean, allowing you to switch branches or pull updates."
            },
            {
                title: "Stash Your Changes",
                content: "Save your current changes to the stash:",
                command: "git stash\n# or with a descriptive message:\ngit stash save \"Work in progress on login form\""
            },
            {
                title: "Restore Stashed Changes",
                content: "Apply the most recent stash and remove it from the stack:",
                command: "git stash pop"
            },
            {
                title: "List All Stashes",
                content: "View all items in your stash stack:",
                command: "git stash list"
            },
            {
                title: "Apply a Specific Stash",
                content: "Apply a specific stash without removing it from the list:",
                command: "git stash apply stash@{2}"
            }
        ],
        faqs: [
            {
                question: "What happens if stash pop causes a conflict?",
                answer: "Git will attempt to apply the stash. If there are conflicts, it will mark them just like merge conflicts. The stash will NOT be dropped in this case — resolve the conflicts, then drop the stash manually with 'git stash drop'."
            }
        ]
    },
    {
        id: 13,
        title: "Managing Git Remote Repositories",
        category: "Remote Repositories",
        difficulty: "Beginner",
        description: "Learn how to add, view, rename, and remove remote repositories in Git.",
        readingTime: "4 min",
        author: "GitGuide Team",
        keywords: ["remote", "origin", "add", "remove", "rename", "url", "upstream"],
        commands: ["git remote", "git remote add", "git remote -v"],
        steps: [
            {
                title: "What is a Remote?",
                content: "A remote is a connection to another copy of your repository, usually hosted on a platform like GitHub, GitLab, or Bitbucket. The default remote is typically called 'origin'."
            },
            {
                title: "View Remotes",
                content: "See all configured remotes and their URLs:",
                command: "git remote -v"
            },
            {
                title: "Add a New Remote",
                content: "Connect your local repo to a remote repository:",
                command: "git remote add origin https://github.com/username/repo.git"
            },
            {
                title: "Change Remote URL",
                content: "Update the URL of an existing remote:",
                command: "git remote set-url origin https://github.com/username/new-repo.git"
            },
            {
                title: "Remove a Remote",
                content: "Disconnect a remote from your local repo:",
                command: "git remote remove origin"
            }
        ],
        faqs: [
            {
                question: "What is 'upstream'?",
                answer: "Upstream typically refers to the original repository that you forked from. You add it as a remote to pull in updates from the original project."
            }
        ]
    },
    {
        id: 14,
        title: "SSH Key Setup for GitHub",
        category: "Authentication",
        difficulty: "Intermediate",
        description: "Complete guide to generating SSH keys and adding them to your GitHub account for secure authentication.",
        readingTime: "6 min",
        author: "GitGuide Team",
        keywords: ["SSH", "key", "generate", "ed25519", "RSA", "agent", "public key"],
        commands: ["ssh-keygen", "ssh-add", "ssh -T"],
        steps: [
            {
                title: "Why Use SSH Keys?",
                content: "SSH keys provide secure authentication without typing passwords. Once set up, Git operations with GitHub are seamless and secure."
            },
            {
                title: "Generate an SSH Key",
                content: "Create a new SSH key pair using the Ed25519 algorithm (recommended):",
                command: "ssh-keygen -t ed25519 -C \"your.email@example.com\""
            },
            {
                title: "Start the SSH Agent",
                content: "Start the SSH agent and add your key:",
                command: "# Start the agent:\neval \"$(ssh-agent -s)\"\n\n# Add your key:\nssh-add ~/.ssh/id_ed25519"
            },
            {
                title: "Copy the Public Key",
                content: "Copy your public key to the clipboard:",
                command: "# Mac:\npbcopy < ~/.ssh/id_ed25519.pub\n\n# Windows:\nclip < ~/.ssh/id_ed25519.pub\n\n# Linux:\ncat ~/.ssh/id_ed25519.pub"
            },
            {
                title: "Add Key to GitHub",
                content: "Go to GitHub → Settings → SSH and GPG keys → New SSH key. Paste your public key and give it a descriptive title."
            },
            {
                title: "Test the Connection",
                content: "Verify that SSH authentication is working:",
                command: "ssh -T git@github.com\n# Expected: Hi username! You've successfully authenticated..."
            }
        ],
        faqs: [
            {
                question: "Should I use Ed25519 or RSA?",
                answer: "Ed25519 is recommended because it's faster and more secure. RSA is still widely supported if you need compatibility with older systems."
            }
        ]
    },
    {
        id: 15,
        title: "Git Pull and Fetch Explained",
        category: "Remote Repositories",
        difficulty: "Beginner",
        description: "Understand the difference between git pull and git fetch, and when to use each one.",
        readingTime: "4 min",
        author: "GitGuide Team",
        keywords: ["pull", "fetch", "download", "sync", "remote", "update", "difference"],
        commands: ["git pull", "git fetch", "git merge"],
        steps: [
            {
                title: "Git Fetch vs Git Pull",
                content: "git fetch downloads changes from the remote but does NOT merge them into your working branch. git pull does both — it fetches AND merges in one step. Think of pull as fetch + merge."
            },
            {
                title: "Using Git Fetch",
                content: "Download remote changes without modifying your working directory:",
                command: "git fetch origin\n# Then review what changed:\ngit log origin/main --oneline -5"
            },
            {
                title: "Using Git Pull",
                content: "Download and immediately merge remote changes:",
                command: "git pull origin main"
            },
            {
                title: "Pull with Rebase",
                content: "Instead of creating a merge commit, you can rebase your local commits on top of the fetched changes for a cleaner history:",
                command: "git pull --rebase origin main"
            }
        ],
        faqs: [
            {
                question: "Which should I use: fetch or pull?",
                answer: "Use fetch when you want to review changes before merging. Use pull when you trust the changes and want to update quickly. In a team, fetch is often safer."
            }
        ]
    },
    {
        id: 16,
        title: "Git Push – Upload Changes to Remote",
        category: "Git Basics",
        difficulty: "Beginner",
        description: "Learn how to push your local commits to a remote repository on GitHub.",
        readingTime: "3 min",
        author: "GitGuide Team",
        keywords: ["push", "upload", "remote", "origin", "publish", "share"],
        commands: ["git push", "git push -u"],
        steps: [
            {
                title: "What is Git Push?",
                content: "Git push uploads your local commits to a remote repository. This shares your work with others and backs up your code."
            },
            {
                title: "Push to Remote",
                content: "Push your current branch to the remote repository:",
                command: "git push origin main"
            },
            {
                title: "Set Upstream and Push",
                content: "The first time you push a new branch, set the upstream tracking:",
                command: "git push -u origin feature-branch\n# After this, you can just use:\ngit push"
            },
            {
                title: "Push All Branches",
                content: "Push all local branches to the remote:",
                command: "git push --all origin"
            }
        ],
        faqs: [
            {
                question: "What does 'upstream' mean in git push -u?",
                answer: "The -u flag sets the tracking relationship between your local branch and the remote branch. After setting it once, you can just type 'git push' without specifying the remote and branch."
            }
        ]
    },
    {
        id: 17,
        title: "Fix Detached HEAD State in Git",
        category: "Troubleshooting",
        difficulty: "Advanced",
        description: "Understand what the detached HEAD state means and how to safely get back to a normal branch.",
        readingTime: "4 min",
        author: "GitGuide Team",
        keywords: ["detached", "HEAD", "checkout", "commit", "state", "fix"],
        commands: ["git checkout", "git switch", "git branch"],
        steps: [
            {
                title: "What is Detached HEAD?",
                content: "Normally, HEAD points to a branch name (like 'main'). In detached HEAD state, HEAD points directly to a specific commit instead of a branch. This usually happens when you checkout a specific commit hash."
            },
            {
                title: "How Did This Happen?",
                content: "You likely ran something like:",
                command: "git checkout abc1234\n# This detaches HEAD from any branch"
            },
            {
                title: "Go Back to a Branch",
                content: "The simplest fix is to switch back to an existing branch:",
                command: "git switch main\n# or:\ngit checkout main"
            },
            {
                title: "Save Your Work as a New Branch",
                content: "If you made commits in detached HEAD state and want to keep them, create a new branch:",
                command: "git switch -c my-saved-work\n# or:\ngit checkout -b my-saved-work"
            }
        ],
        faqs: [
            {
                question: "Will I lose my commits in detached HEAD?",
                answer: "Commits made in detached HEAD state are not lost immediately, but they are not on any branch. If you don't create a branch to save them, they may be garbage collected after ~30 days. Use 'git reflog' to find them."
            }
        ]
    },
    {
        id: 18,
        title: "How to Delete a Git Branch",
        category: "Branching",
        difficulty: "Beginner",
        description: "Learn how to delete local and remote Git branches safely after merging.",
        readingTime: "3 min",
        author: "GitGuide Team",
        keywords: ["delete", "branch", "remove", "local", "remote", "prune", "cleanup"],
        commands: ["git branch -d", "git push origin --delete"],
        steps: [
            {
                title: "Delete a Local Branch",
                content: "After merging a branch, delete it locally to keep your repository clean:",
                command: "# Safe delete (only if merged):\ngit branch -d feature-branch\n\n# Force delete (even if not merged):\ngit branch -D feature-branch"
            },
            {
                title: "Delete a Remote Branch",
                content: "Remove a branch from the remote repository:",
                command: "git push origin --delete feature-branch"
            },
            {
                title: "Clean Up Remote Tracking Branches",
                content: "Remove references to remote branches that no longer exist:",
                command: "git fetch --prune"
            }
        ],
        faqs: [
            {
                question: "Can I recover a deleted branch?",
                answer: "Yes, if you know the last commit hash. Use 'git reflog' to find it, then create a new branch at that commit: git branch recovered-branch abc1234"
            }
        ]
    },
    {
        id: 19,
        title: "Git Merge – Combining Branches",
        category: "Merging",
        difficulty: "Beginner",
        description: "Step-by-step guide to merging branches in Git using fast-forward and three-way merge strategies.",
        readingTime: "5 min",
        author: "GitGuide Team",
        keywords: ["merge", "combine", "branches", "fast-forward", "three-way", "squash"],
        commands: ["git merge", "git merge --no-ff"],
        steps: [
            {
                title: "What is Merging?",
                content: "Merging combines the changes from one branch into another. It's how you bring your feature work back into the main branch."
            },
            {
                title: "Basic Merge",
                content: "First switch to the branch you want to merge INTO (usually main), then merge:",
                command: "git switch main\ngit merge feature-branch"
            },
            {
                title: "Fast-Forward vs Three-Way Merge",
                content: "If the main branch hasn't changed since the feature branch was created, Git does a fast-forward merge (moves the pointer forward). If both branches have new commits, Git creates a merge commit (three-way merge)."
            },
            {
                title: "Force a Merge Commit",
                content: "If you want a merge commit even when fast-forward is possible (useful for keeping history clear):",
                command: "git merge --no-ff feature-branch"
            },
            {
                title: "Squash Merge",
                content: "Combine all commits from a branch into a single commit:",
                command: "git merge --squash feature-branch\ngit commit -m \"Add feature: user login\""
            }
        ],
        faqs: [
            {
                question: "Should I use merge or rebase?",
                answer: "Merge preserves the branch history and is safer for shared branches. Rebase creates a linear history and is cleaner. For beginners, merge is recommended."
            }
        ]
    },
    {
        id: 20,
        title: "Forking and Contributing on GitHub",
        category: "GitHub",
        difficulty: "Intermediate",
        description: "Learn the fork-and-pull workflow for contributing to open source projects on GitHub.",
        readingTime: "6 min",
        author: "GitGuide Team",
        keywords: ["fork", "pull request", "PR", "contribute", "open source", "upstream"],
        commands: ["git clone", "git remote add", "git push", "git fetch"],
        steps: [
            {
                title: "What is Forking?",
                content: "Forking creates a personal copy of someone else's repository on your GitHub account. You can freely experiment in your fork without affecting the original project."
            },
            {
                title: "Step 1: Fork the Repository",
                content: "Go to the repository on GitHub and click the 'Fork' button in the top-right corner. GitHub creates a copy in your account."
            },
            {
                title: "Step 2: Clone Your Fork",
                content: "Clone your forked repository to your local machine:",
                command: "git clone https://github.com/YOUR-USERNAME/repository.git\ncd repository"
            },
            {
                title: "Step 3: Add Upstream Remote",
                content: "Add the original repository as a remote called 'upstream' to stay synced:",
                command: "git remote add upstream https://github.com/ORIGINAL-OWNER/repository.git"
            },
            {
                title: "Step 4: Create a Feature Branch",
                content: "Create a new branch for your contribution:",
                command: "git switch -c fix-typo-in-readme"
            },
            {
                title: "Step 5: Push and Create Pull Request",
                content: "After making changes and committing, push to your fork and create a pull request on GitHub:",
                command: "git push origin fix-typo-in-readme\n# Then go to GitHub and click 'Create Pull Request'"
            }
        ],
        faqs: [
            {
                question: "What is the difference between a fork and a clone?",
                answer: "A fork creates a copy on GitHub (server-side). A clone creates a copy on your computer (local). You typically fork first, then clone your fork."
            },
            {
                question: "How do I sync my fork with the original repo?",
                answer: "Fetch and merge from the upstream remote: git fetch upstream, then git merge upstream/main."
            }
        ]
    },
    {
        id: 21,
        title: "Creating a GitHub Repository",
        category: "GitHub",
        difficulty: "Beginner",
        description: "Learn how to create a new repository on GitHub and connect it to your local project.",
        readingTime: "3 min",
        author: "GitGuide Team",
        keywords: ["create", "repository", "new repo", "GitHub", "initialize", "readme"],
        commands: ["git init", "git remote add", "git push -u"],
        steps: [
            {
                title: "Create on GitHub",
                content: "Go to GitHub, click the '+' button in the top-right corner, and select 'New repository'. Give it a name, choose public or private, and click 'Create repository'."
            },
            {
                title: "Connect Local Project",
                content: "If you already have a local project, connect it to the new GitHub repository:",
                command: "cd my-project\ngit init\ngit add .\ngit commit -m \"Initial commit\"\ngit remote add origin https://github.com/username/repo.git\ngit push -u origin main"
            },
            {
                title: "Or Clone the Empty Repo",
                content: "If you're starting fresh, clone the empty repository:",
                command: "git clone https://github.com/username/repo.git\ncd repo"
            }
        ],
        faqs: [
            {
                question: "Should I choose public or private?",
                answer: "Choose public if you want anyone to see your code (open source, portfolios). Choose private for personal or work projects that should not be visible."
            }
        ]
    },
    {
        id: 22,
        title: "Understanding .gitignore",
        category: "Git Basics",
        difficulty: "Beginner",
        description: "Learn how to use .gitignore to prevent unwanted files from being tracked by Git.",
        readingTime: "3 min",
        author: "GitGuide Team",
        keywords: ["gitignore", "ignore", "exclude", "untrack", "node_modules", "env"],
        commands: ["git rm --cached"],
        steps: [
            {
                title: "What is .gitignore?",
                content: "A .gitignore file tells Git which files or directories to ignore. This is useful for keeping build files, dependencies, and sensitive information out of your repository."
            },
            {
                title: "Create a .gitignore File",
                content: "Create a file named .gitignore in the root of your repository. Add patterns for files to ignore:",
                command: "# Example .gitignore contents:\nnode_modules/\n.env\n*.log\ndist/\n.DS_Store"
            },
            {
                title: "Stop Tracking an Already Tracked File",
                content: "If a file is already being tracked, add it to .gitignore and then remove it from tracking:",
                command: "git rm --cached filename.txt\ngit commit -m \"Stop tracking filename.txt\""
            }
        ],
        faqs: [
            {
                question: "Where can I find .gitignore templates?",
                answer: "GitHub provides templates at github.com/github/gitignore for many languages and frameworks (Node.js, Python, Java, etc.)."
            }
        ]
    },
    {
        id: 23,
        title: "Git Cherry-Pick – Apply Specific Commits",
        category: "Troubleshooting",
        difficulty: "Advanced",
        description: "Learn how to apply specific commits from one branch to another using git cherry-pick.",
        readingTime: "4 min",
        author: "GitGuide Team",
        keywords: ["cherry-pick", "specific commit", "apply", "copy commit", "select"],
        commands: ["git cherry-pick", "git log"],
        steps: [
            {
                title: "What is Cherry-Pick?",
                content: "Cherry-pick allows you to apply the changes from a specific commit to your current branch. Unlike merge, it picks individual commits rather than merging an entire branch."
            },
            {
                title: "Find the Commit Hash",
                content: "First, find the hash of the commit you want to pick:",
                command: "git log --oneline feature-branch"
            },
            {
                title: "Cherry-Pick the Commit",
                content: "Apply the commit to your current branch:",
                command: "git cherry-pick abc1234"
            },
            {
                title: "Cherry-Pick Without Committing",
                content: "Apply the changes without creating a commit (useful if you want to modify first):",
                command: "git cherry-pick --no-commit abc1234"
            }
        ],
        faqs: [
            {
                question: "When should I use cherry-pick?",
                answer: "Use cherry-pick when you need a specific fix from another branch but don't want to merge the entire branch. Common for applying hotfixes or moving specific features."
            }
        ]
    },
    {
        id: 24,
        title: "Git Log – View Commit History",
        category: "Git Basics",
        difficulty: "Beginner",
        description: "Learn different ways to view and search through your Git commit history using git log.",
        readingTime: "3 min",
        author: "GitGuide Team",
        keywords: ["log", "history", "commits", "view", "search", "graph"],
        commands: ["git log", "git log --oneline", "git log --graph"],
        steps: [
            {
                title: "Basic Log",
                content: "View the full commit history with details:",
                command: "git log"
            },
            {
                title: "Compact One-Line Log",
                content: "See a condensed history with short commit hashes:",
                command: "git log --oneline"
            },
            {
                title: "Visual Branch Graph",
                content: "See a visual representation of branch history:",
                command: "git log --oneline --graph --all"
            },
            {
                title: "Search Commit Messages",
                content: "Find commits with specific keywords:",
                command: "git log --grep=\"login\""
            }
        ],
        faqs: [
            {
                question: "How do I exit the git log view?",
                answer: "Press 'q' to quit the log viewer. Git log uses the 'less' pager by default."
            }
        ]
    }
];

// ---------- GIT COMMANDS (for Command Synthesizer) ----------
// Each command has a name, description, and array of available flags.
// Some flags are marked as dangerous.

const gitCommands = [
    {
        name: "git clone",
        description: "Clone a repository into a new directory",
        flags: [
            { flag: "--depth <number>", description: "Create a shallow clone with limited history", dangerous: false, hasValue: true, placeholder: "1" },
            { flag: "--branch <name>", description: "Clone a specific branch", dangerous: false, hasValue: true, placeholder: "main" },
            { flag: "--single-branch", description: "Clone only one branch", dangerous: false, hasValue: false },
            { flag: "--recurse-submodules", description: "Initialize and clone submodules", dangerous: false, hasValue: false }
        ],
        requiresArg: true,
        argPlaceholder: "<repository-url>"
    },
    {
        name: "git add",
        description: "Add file contents to the staging area",
        flags: [
            { flag: ".", description: "Stage all changes in current directory", dangerous: false, hasValue: false },
            { flag: "--all", description: "Stage all changes in the entire repo", dangerous: false, hasValue: false },
            { flag: "--patch", description: "Interactively select hunks to stage", dangerous: false, hasValue: false }
        ],
        requiresArg: false,
        argPlaceholder: "<file>"
    },
    {
        name: "git commit",
        description: "Record changes to the repository",
        flags: [
            { flag: "-m", description: "Commit message (inline)", dangerous: false, hasValue: true, placeholder: "\"Your message\"" },
            { flag: "--amend", description: "Modify the most recent commit", dangerous: false, hasValue: false },
            { flag: "--no-edit", description: "Amend without changing the message", dangerous: false, hasValue: false },
            { flag: "-a", description: "Automatically stage modified files", dangerous: false, hasValue: false }
        ],
        requiresArg: false,
        argPlaceholder: ""
    },
    {
        name: "git push",
        description: "Upload local branch commits to the remote",
        flags: [
            { flag: "-u", description: "Set upstream tracking", dangerous: false, hasValue: false },
            { flag: "--force", description: "Force push (overwrites remote)", dangerous: true, hasValue: false },
            { flag: "--force-with-lease", description: "Safer force push", dangerous: false, hasValue: false },
            { flag: "--all", description: "Push all branches", dangerous: false, hasValue: false },
            { flag: "--tags", description: "Push all tags", dangerous: false, hasValue: false }
        ],
        requiresArg: false,
        argPlaceholder: "<remote> <branch>"
    },
    {
        name: "git pull",
        description: "Fetch and integrate remote changes",
        flags: [
            { flag: "--rebase", description: "Rebase instead of merge", dangerous: false, hasValue: false },
            { flag: "--no-rebase", description: "Merge instead of rebase", dangerous: false, hasValue: false },
            { flag: "--ff-only", description: "Only fast-forward merge", dangerous: false, hasValue: false }
        ],
        requiresArg: false,
        argPlaceholder: "<remote> <branch>"
    },
    {
        name: "git branch",
        description: "List, create, or delete branches",
        flags: [
            { flag: "-a", description: "List all branches (local + remote)", dangerous: false, hasValue: false },
            { flag: "-d", description: "Delete a merged branch", dangerous: false, hasValue: false },
            { flag: "-D", description: "Force delete a branch", dangerous: true, hasValue: false },
            { flag: "-m", description: "Rename current branch", dangerous: false, hasValue: true, placeholder: "<new-name>" },
            { flag: "-r", description: "List remote branches only", dangerous: false, hasValue: false }
        ],
        requiresArg: false,
        argPlaceholder: "<branch-name>"
    },
    {
        name: "git checkout",
        description: "Switch branches or restore files",
        flags: [
            { flag: "-b", description: "Create and switch to new branch", dangerous: false, hasValue: true, placeholder: "<new-branch>" },
            { flag: "--track", description: "Set up tracking for remote branch", dangerous: false, hasValue: false }
        ],
        requiresArg: false,
        argPlaceholder: "<branch>"
    },
    {
        name: "git switch",
        description: "Switch to a different branch",
        flags: [
            { flag: "-c", description: "Create and switch to new branch", dangerous: false, hasValue: true, placeholder: "<new-branch>" },
            { flag: "--detach", description: "Switch to a commit in detached HEAD", dangerous: false, hasValue: false }
        ],
        requiresArg: false,
        argPlaceholder: "<branch>"
    },
    {
        name: "git merge",
        description: "Join two or more development histories",
        flags: [
            { flag: "--no-ff", description: "Create a merge commit even if fast-forward", dangerous: false, hasValue: false },
            { flag: "--squash", description: "Squash all commits into one", dangerous: false, hasValue: false },
            { flag: "--abort", description: "Abort the current merge", dangerous: false, hasValue: false }
        ],
        requiresArg: false,
        argPlaceholder: "<branch>"
    },
    {
        name: "git reset",
        description: "Reset current HEAD to a specified state",
        flags: [
            { flag: "--soft", description: "Keep changes staged", dangerous: false, hasValue: false },
            { flag: "--mixed", description: "Keep changes unstaged (default)", dangerous: false, hasValue: false },
            { flag: "--hard", description: "Discard all changes permanently", dangerous: true, hasValue: false }
        ],
        requiresArg: false,
        argPlaceholder: "HEAD~1"
    },
    {
        name: "git clean",
        description: "Remove untracked files from the working tree",
        flags: [
            { flag: "-f", description: "Force removal of untracked files", dangerous: true, hasValue: false },
            { flag: "-d", description: "Also remove untracked directories", dangerous: true, hasValue: false },
            { flag: "-n", description: "Dry run (show what would be deleted)", dangerous: false, hasValue: false },
            { flag: "-x", description: "Also remove ignored files", dangerous: true, hasValue: false }
        ],
        requiresArg: false,
        argPlaceholder: ""
    },
    {
        name: "git log",
        description: "Show commit history",
        flags: [
            { flag: "--oneline", description: "Show compact one-line format", dangerous: false, hasValue: false },
            { flag: "--graph", description: "Show ASCII branch graph", dangerous: false, hasValue: false },
            { flag: "--all", description: "Show all branches", dangerous: false, hasValue: false },
            { flag: "-n", description: "Limit number of commits shown", dangerous: false, hasValue: true, placeholder: "10" },
            { flag: "--grep", description: "Search commit messages", dangerous: false, hasValue: true, placeholder: "\"keyword\"" }
        ],
        requiresArg: false,
        argPlaceholder: ""
    },
    {
        name: "git stash",
        description: "Stash changes in a dirty working directory",
        flags: [
            { flag: "save", description: "Stash with a custom message", dangerous: false, hasValue: true, placeholder: "\"message\"" },
            { flag: "pop", description: "Apply and remove the latest stash", dangerous: false, hasValue: false },
            { flag: "list", description: "List all stashes", dangerous: false, hasValue: false },
            { flag: "drop", description: "Remove a specific stash", dangerous: false, hasValue: false },
            { flag: "clear", description: "Remove all stashes", dangerous: true, hasValue: false }
        ],
        requiresArg: false,
        argPlaceholder: ""
    },
    {
        name: "git revert",
        description: "Create a commit that undoes a previous commit",
        flags: [
            { flag: "--no-commit", description: "Revert without creating a commit", dangerous: false, hasValue: false },
            { flag: "--no-edit", description: "Use default commit message", dangerous: false, hasValue: false }
        ],
        requiresArg: false,
        argPlaceholder: "<commit-hash>"
    },
    {
        name: "git cherry-pick",
        description: "Apply specific commits from another branch",
        flags: [
            { flag: "--no-commit", description: "Apply changes without committing", dangerous: false, hasValue: false },
            { flag: "--edit", description: "Edit the commit message", dangerous: false, hasValue: false }
        ],
        requiresArg: false,
        argPlaceholder: "<commit-hash>"
    }
];

// ---------- ERROR PATTERNS (for Troubleshooting) ----------
// Each pattern has keywords to match, a title, a detailed solution, and
// a link to a related article.

const errorPatterns = [
    {
        keywords: ["authentication failed", "password authentication", "support for password authentication was removed"],
        title: "GitHub Authentication Failed",
        solution: "GitHub no longer accepts account passwords for Git operations since August 2021. You need to use either a Personal Access Token (PAT) or SSH key authentication instead. Go to GitHub → Settings → Developer settings → Personal access tokens to generate a token.",
        articleId: 4
    },
    {
        keywords: ["failed to push some refs", "rejected", "fetch first", "non-fast-forward"],
        title: "Git Push Rejected",
        solution: "Your local branch is behind the remote branch. The remote has commits that you don't have locally. Pull the latest changes first with 'git pull origin main', resolve any conflicts, then push again.",
        articleId: 3
    },
    {
        keywords: ["merge conflict", "conflict", "automatic merge failed", "fix conflicts"],
        title: "Git Merge Conflict",
        solution: "Open the conflicting files in your text editor and look for conflict markers (<<<<<<< HEAD, =======, >>>>>>>). Decide which changes to keep, remove the markers, then run 'git add .' and 'git commit'.",
        articleId: 2
    },
    {
        keywords: ["detached head", "head detached", "you are in 'detached head' state"],
        title: "Detached HEAD State",
        solution: "You are not on any branch. If you want to keep your changes, create a new branch with 'git switch -c new-branch-name'. To go back to an existing branch, use 'git switch main'.",
        articleId: 17
    },
    {
        keywords: ["fatal: not a git repository", "not a git repository"],
        title: "Not a Git Repository",
        solution: "You are running a Git command in a directory that has not been initialized as a Git repository. Navigate to the correct project folder, or initialize a new repository with 'git init'.",
        articleId: 1
    },
    {
        keywords: ["permission denied", "publickey", "could not read from remote"],
        title: "SSH Permission Denied",
        solution: "Your SSH key is not set up correctly or not added to your GitHub account. Generate a new SSH key with 'ssh-keygen -t ed25519' and add the public key to GitHub → Settings → SSH and GPG keys.",
        articleId: 14
    },
    {
        keywords: ["fatal: remote origin already exists"],
        title: "Remote Origin Already Exists",
        solution: "You are trying to add a remote named 'origin' but one already exists. Use 'git remote set-url origin <new-url>' to update it, or 'git remote remove origin' to remove it first.",
        articleId: 13
    },
    {
        keywords: ["error: pathspec", "pathspec", "did not match any file"],
        title: "Pathspec Error – File or Branch Not Found",
        solution: "The file or branch name you specified doesn't exist. Check for typos in the name. Use 'git branch -a' to see all branches or 'ls' to list files in the current directory.",
        articleId: 5
    },
    {
        keywords: ["your branch is ahead", "ahead of", "use git push"],
        title: "Branch Ahead of Remote",
        solution: "Your local branch has commits that haven't been pushed to the remote. Run 'git push origin <branch-name>' to upload your commits to the remote repository.",
        articleId: 16
    },
    {
        keywords: ["your branch is behind", "behind", "can be fast-forwarded"],
        title: "Branch Behind Remote",
        solution: "The remote branch has commits that you don't have locally. Run 'git pull origin <branch-name>' to download and merge the latest changes.",
        articleId: 15
    }
];

// ---------- TRENDING ARTICLE IDs (for Home Page) ----------
// These are the article IDs that will be displayed as trending on the home page.

const trendingArticleIds = [7, 2, 3, 4, 5, 6, 11, 8];
