/**
 * Codebar Reader Logic
 * Handles keyboard input to simulate barcode scanner reading.
 */

document.addEventListener('DOMContentLoaded', () => {
    const resultDisplay = document.getElementById('result-display');
    const historyList = document.getElementById('scan-history');
    const statusIndicator = document.getElementById('status-indicator');
    const clearHistoryBtn = document.getElementById('clear-history');

    let buffer = '';
    let lastKeyTime = 0;
    const SCAN_TIMEOUT = 3000; // Increased to 100ms to be more forgiving

    // Listen for global keydown events
    document.addEventListener('keydown', (e) => {
        const currentTime = Date.now();
        const timeDiff = currentTime - lastKeyTime;

        // Check for "Enter" key which usually terminates a barcode scan
        if (e.key === 'Enter') {
            // Prevent default action (like form submission)
            e.preventDefault();

            if (buffer.length > 0) {
                handleScan(buffer);
                buffer = '';
            }
        } else {
            // For normal keys, check timing
            // If time between keys is long, it's likely manual typing or a new scan starting
            if (timeDiff > SCAN_TIMEOUT) {
                buffer = ''; // Reset buffer
            }

            if (e.key.length === 1) {
                // Only append printable characters
                buffer += e.key;
                updateStatus('scanning');
            }
        }

        lastKeyTime = currentTime;
    });

    function handleScan(code) {
        // Update Display
        resultDisplay.textContent = code;
        resultDisplay.classList.remove('empty');

        // Add to History
        addToHistory(code);

        // Reset Status
        updateStatus('ready');
    }

    function addToHistory(code) {
        const li = document.createElement('li');
        li.className = 'history-item';

        const codeSpan = document.createElement('span');
        codeSpan.textContent = code;

        const timeSpan = document.createElement('span');
        timeSpan.className = 'timestamp';
        const now = new Date();
        timeSpan.textContent = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        li.appendChild(codeSpan);
        li.appendChild(timeSpan);

        // Insert at the top
        historyList.insertBefore(li, historyList.firstChild);
    }

    function updateStatus(state) {
        if (state === 'scanning') {
            statusIndicator.textContent = 'Lecture...';
            statusIndicator.className = 'status scanning';
        } else {
            statusIndicator.textContent = 'Prêt';
            statusIndicator.className = 'status ready';
        }
    }

    clearHistoryBtn.addEventListener('click', () => {
        historyList.innerHTML = '';
        resultDisplay.textContent = 'En attente...';
        resultDisplay.classList.add('empty');
    });
});
