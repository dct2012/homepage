function updateTime() {
    const timeElement = document.getElementById('current-time');
    if (!timeElement) return;

    const now = new Date();
    const options = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
    };
    timeElement.textContent = now.toLocaleDateString('en-US', options).replace(/,/g, '');
}

function initTerminal() {
    const terminalHistory = document.getElementById('terminal-history');
    const commandInput = document.getElementById('command-input');
    const terminalContent = document.getElementById('terminal-content');
    const hiddenInput = document.getElementById('hidden-input');
    const promptText = '[guest@camerontaaffe ~]$';

    let currentCommand = '';
    const commandHistory = [];
    let historyIndex = -1;

    // Focus hidden input on terminal click
    terminalContent.addEventListener('click', () => {
        hiddenInput.focus();
    });

    // Auto-focus on load
    hiddenInput.focus();

    hiddenInput.addEventListener('input', (e) => {
        currentCommand = e.target.value;
        commandInput.textContent = currentCommand;
        terminalContent.scrollTop = terminalContent.scrollHeight;
    });

    hiddenInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = currentCommand.trim();

            // Add current command to history
            const historyLine = document.createElement('div');
            historyLine.className = 'history-line';
            historyLine.innerHTML = `<span class="prompt-text">${promptText}</span><span>${currentCommand}</span>`;
            terminalHistory.appendChild(historyLine);

            if (command !== '') {
                // Save to command history array
                commandHistory.push(currentCommand);
                historyIndex = -1;

                const errorLine = document.createElement('div');
                errorLine.textContent = `zsh: command not found: ${command.split(' ')[0]}`;
                terminalHistory.appendChild(errorLine);
            }

            // Reset input
            currentCommand = '';
            commandInput.textContent = '';
            hiddenInput.value = '';

            // Scroll to bottom
            terminalContent.scrollTop = terminalContent.scrollHeight;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                if (historyIndex === -1) {
                    historyIndex = commandHistory.length - 1;
                } else if (historyIndex > 0) {
                    historyIndex--;
                }
                currentCommand = commandHistory[historyIndex];
                commandInput.textContent = currentCommand;
                hiddenInput.value = currentCommand;
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex !== -1) {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    currentCommand = commandHistory[historyIndex];
                } else {
                    historyIndex = -1;
                    currentCommand = '';
                }
                commandInput.textContent = currentCommand;
                hiddenInput.value = currentCommand;
            }
        }
    });

    // Handle paste events
    hiddenInput.addEventListener('paste', (e) => {
        // Default behavior for input handles paste, but we need to sync
        setTimeout(() => {
            currentCommand = hiddenInput.value;
            commandInput.textContent = currentCommand;
            terminalContent.scrollTop = terminalContent.scrollHeight;
        }, 0);
    });
}

// Initial update
document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 1000);
    initTerminal();
});
