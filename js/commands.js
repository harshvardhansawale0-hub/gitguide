// ============================================================
// GitGuide – Command Synthesizer JavaScript (Full-Stack Integrated)
// ============================================================
// Dynamic CLI Flag Combinator & Synthesizer connecting to the
// backend Git commands catalog with safety analysis.
// ============================================================

var liveGitCommands = typeof gitCommands !== 'undefined' ? gitCommands : [];

// ---- INITIALIZE COMMANDS PAGE ----

document.addEventListener('DOMContentLoaded', async function () {
    await populateCommandDropdown();

    var select = document.getElementById('commandSelect');
    if (select) {
        select.addEventListener('change', onCommandChange);
    }

    var copyBtn = document.getElementById('copyCommandBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function () {
            var commandText = document.getElementById('commandText');
            if (commandText && commandText.textContent !== 'Select a command to begin...') {
                copyToClipboard(commandText.textContent, copyBtn);
            }
        });
    }
});

// ---- POPULATE COMMAND DROPDOWN ----

async function populateCommandDropdown() {
    var select = document.getElementById('commandSelect');
    if (!select) return;

    if (typeof API !== 'undefined' && API.commands) {
        var res = await API.commands.getAll();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            liveGitCommands = res.data;
        }
    }

    select.innerHTML = '<option value="">Choose a Git command...</option>';

    liveGitCommands.forEach(function (cmd) {
        var option = document.createElement('option');
        option.value = cmd.name;
        option.textContent = cmd.name;
        select.appendChild(option);
    });
}

// ---- HANDLE COMMAND SELECTION ----

function onCommandChange() {
    var select = document.getElementById('commandSelect');
    var commandName = select.value;

    var command = liveGitCommands.find(function (cmd) {
        return cmd.name === commandName;
    });

    var descEl = document.getElementById('commandDescription');
    if (descEl) {
        descEl.textContent = command ? command.description : '';
    }

    var argGroup = document.getElementById('argGroup');
    var argInput = document.getElementById('argInput');
    var argLabel = document.getElementById('argLabel');

    if (command && command.argPlaceholder) {
        argGroup.style.display = 'block';
        argInput.placeholder = command.argPlaceholder;
        argLabel.textContent = 'Argument (' + command.argPlaceholder + ')';
        argInput.value = '';

        argInput.removeEventListener('input', generateCommand);
        argInput.addEventListener('input', generateCommand);
    } else {
        argGroup.style.display = 'none';
        argInput.value = '';
    }

    renderFlags(command);
    generateCommand();
}

// ---- RENDER FLAGS ----

function renderFlags(command) {
    var container = document.getElementById('flagsContainer');
    if (!container) return;

    if (!command || !command.flags || command.flags.length === 0) {
        container.innerHTML = '<p style="color:var(--text-light); font-size:0.9rem;">Select a command to see available flags.</p>';
        return;
    }

    var html = '<h4 style="margin-bottom:0.75rem; font-size:0.95rem;">Available Flags</h4>';

    command.flags.forEach(function (flag, index) {
        html += '<div class="flag-item">';
        html += '  <input type="checkbox" id="flag-' + index + '" data-flag="' + flag.flag + '" data-dangerous="' + flag.dangerous + '" data-has-value="' + (flag.hasValue || false) + '">';
        html += '  <label for="flag-' + index + '">';
        html += '    <span class="flag-name">' + flag.flag + '</span>';
        if (flag.dangerous) {
            html += '    <span class="badge badge-advanced" style="margin-left:0.4rem; font-size:0.65rem;">DANGEROUS</span>';
        }
        html += '    <br><span class="flag-desc">' + flag.description + '</span>';

        if (flag.hasValue) {
            html += '    <br><input type="text" class="flag-value-input" id="flag-value-' + index + '" placeholder="' + (flag.placeholder || 'value') + '" data-for-flag="' + flag.flag + '">';
        }

        html += '  </label>';
        html += '</div>';
    });

    container.innerHTML = html;

    var checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (cb) {
        cb.addEventListener('change', generateCommand);
    });

    var valueInputs = container.querySelectorAll('.flag-value-input');
    valueInputs.forEach(function (input) {
        input.addEventListener('input', generateCommand);
    });
}

// ---- GENERATE COMMAND ----

function generateCommand() {
    var select = document.getElementById('commandSelect');
    var commandName = select.value;
    var commandTextEl = document.getElementById('commandText');
    var warningBox = document.getElementById('warningBox');

    if (!commandName) {
        commandTextEl.textContent = 'Select a command to begin...';
        warningBox.classList.add('hidden');
        return;
    }

    var parts = [commandName];
    var hasDangerousFlag = false;

    var checkboxes = document.querySelectorAll('#flagsContainer input[type="checkbox"]:checked');
    checkboxes.forEach(function (cb) {
        var flagName = cb.getAttribute('data-flag');
        var isDangerous = cb.getAttribute('data-dangerous') === 'true';
        var hasValue = cb.getAttribute('data-has-value') === 'true';

        if (isDangerous) {
            hasDangerousFlag = true;
        }

        if (hasValue) {
            var index = cb.id.replace('flag-', '');
            var valueInput = document.getElementById('flag-value-' + index);
            var value = valueInput ? valueInput.value.trim() : '';

            if (value) {
                parts.push(flagName.replace(/<[^>]+>/g, '') + ' ' + value);
            } else {
                parts.push(flagName);
            }
        } else {
            parts.push(flagName);
        }
    });

    var argInput = document.getElementById('argInput');
    if (argInput && argInput.value.trim()) {
        parts.push(argInput.value.trim());
    }

    commandTextEl.textContent = parts.join(' ');

    if (hasDangerousFlag) {
        warningBox.classList.remove('hidden');
        var warningText = document.getElementById('warningText');
        if (commandName.includes('reset') && commandTextEl.textContent.includes('--hard')) {
            warningText.textContent = 'git reset --hard will permanently discard all uncommitted changes in your working directory. This action cannot be undone.';
        } else if (commandName.includes('clean')) {
            warningText.textContent = 'git clean will permanently delete untracked files from your working directory. These files cannot be recovered.';
        } else if (commandName.includes('push') && commandTextEl.textContent.includes('--force')) {
            warningText.textContent = 'Force pushing will overwrite the remote branch history. Other collaborators may lose their work.';
        } else if (commandName.includes('stash') && commandTextEl.textContent.includes('clear')) {
            warningText.textContent = 'This will permanently remove all stashed entries. They cannot be recovered.';
        } else if (commandName.includes('branch') && commandTextEl.textContent.includes('-D')) {
            warningText.textContent = 'Force deleting a branch will remove it even if it has unmerged changes. Make sure your work is saved elsewhere.';
        } else {
            warningText.textContent = 'This command can permanently remove local changes or files. Use with caution.';
        }
    } else {
        warningBox.classList.add('hidden');
    }
}
