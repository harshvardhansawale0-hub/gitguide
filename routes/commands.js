// ============================================================
// GitGuide – Git Commands Catalog & Synthesizer API Routes
// ============================================================
const express = require('express');
const db = require('../config/db');

const router = express.Router();

// GET /api/commands – List all Git commands
router.get('/', (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM git_commands ORDER BY id ASC').all();
        const commands = rows.map(r => ({
            id: r.id,
            name: r.name,
            description: r.description,
            flags: r.flags ? JSON.parse(r.flags) : [],
            requiresArg: Boolean(r.requires_arg),
            argPlaceholder: r.arg_placeholder || ''
        }));

        return res.json({ success: true, count: commands.length, data: commands });
    } catch (err) {
        console.error('Error fetching git commands:', err);
        return res.status(500).json({ success: false, message: 'Server error fetching commands.' });
    }
});

// POST /api/commands/synthesize – Backend command safety analyzer & formatter
router.post('/synthesize', (req, res) => {
    try {
        const { commandName, selectedFlags = [], argument = '' } = req.body;

        if (!commandName) {
            return res.status(400).json({ success: false, message: 'commandName is required.' });
        }

        const cmd = db.prepare('SELECT * FROM git_commands WHERE name = ?').get(commandName);
        if (!cmd) {
            return res.status(404).json({ success: false, message: 'Command not recognized.' });
        }

        const allFlags = cmd.flags ? JSON.parse(cmd.flags) : [];
        const parts = [commandName];
        let isDangerous = false;
        let warningMessage = null;

        selectedFlags.forEach(f => {
            const flagObj = allFlags.find(item => item.flag === f.flag);
            if (flagObj && flagObj.dangerous) {
                isDangerous = true;
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

        return res.json({
            success: true,
            data: {
                command: synthesized,
                isDangerous,
                warningMessage
            }
        });
    } catch (err) {
        console.error('Error synthesizing command:', err);
        return res.status(500).json({ success: false, message: 'Server error synthesizing command.' });
    }
});

module.exports = router;
