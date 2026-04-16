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
    const promptText = '[guest@camerontaaffe ~]$';

    let currentCommand = '';

    document.addEventListener('keydown', (e) => {
        // Prevent default browser behavior for common terminal keys
        if (['Enter', 'Backspace', ' '].includes(e.key)) {
            e.preventDefault();
        }

        if (e.key === 'Enter') {
            const command = currentCommand.trim();
            
            // Add current command to history
            const historyLine = document.createElement('div');
            historyLine.className = 'history-line';
            historyLine.innerHTML = `<span class="prompt-text">${promptText}</span><span>${currentCommand}</span>`;
            terminalHistory.appendChild(historyLine);

            if (command !== '') {
                const errorLine = document.createElement('div');
                errorLine.textContent = `zsh: command not found: ${command.split(' ')[0]}`;
                terminalHistory.appendChild(errorLine);
            }

            // Reset input
            currentCommand = '';
            commandInput.textContent = '';
            
            // Scroll to bottom
            terminalContent.scrollTop = terminalContent.scrollHeight;
        } else if (e.key === 'Backspace') {
            currentCommand = currentCommand.slice(0, -1);
            commandInput.textContent = currentCommand;
            terminalContent.scrollTop = terminalContent.scrollHeight;
        } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
            currentCommand += e.key;
            commandInput.textContent = currentCommand;
            terminalContent.scrollTop = terminalContent.scrollHeight;
        }
    });

    // Handle paste events
    document.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text');
        currentCommand += text;
        commandInput.textContent = currentCommand;
        terminalContent.scrollTop = terminalContent.scrollHeight;
    });
}

// Initial update
document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 1000);
    initTerminal();
});
