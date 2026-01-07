/**
 * CodeBarre Class
 * Handles keyboard input to simulate barcode scanner reading.
 */
export default class CodeBarre {
    /**
     * @param {Object} options - Configuration options
     * @param {number} options.SCAN_TIMEOUT - Timeout between keystrokes in ms (default: 200)
     */
    constructor(options = {}) {
        this.SCAN_TIMEOUT = options.SCAN_TIMEOUT || 200;
        this.buffer = '';
        this.lastKeyTime = 0;
        this.onFinish = null;
        this.onError = null;
        this.onProgress = null;
        this._handleKeyDown = this._handleKeyDown.bind(this);
    }

    /**
     * Internal handler for keydown events
     * @param {KeyboardEvent} e 
     * @private
     */
    _handleKeyDown(e) {
        const currentTime = Date.now();
        const timeDiff = currentTime - this.lastKeyTime;

        // Check for "Enter" key which usually terminates a barcode scan
        if (e.key === 'Enter') {
            e.preventDefault();

            if (this.buffer.length > 0) {
                if (this.onFinish) {
                    this.onFinish(this.buffer);
                }
                this.buffer = '';
            }
        } else {
            // If time between keys is long, it's likely manual typing or a new scan starting
            if (timeDiff > this.SCAN_TIMEOUT) {
                this.buffer = ''; // Reset buffer
            }

            if (e.key.length === 1) {
                // Only append printable characters
                this.buffer += e.key;
                if (this.onProgress) {
                    this.onProgress(this.buffer);
                }
            }
        }

        this.lastKeyTime = currentTime;
    }

    /**
     * Starts listening for barcode scans
     * @param {Function} onFinish - Callback when a scan is completed
     * @param {Function} onError - Callback when an error occurs
     * @param {Function} onProgress - Callback on each keystroke
     */
    listen(onFinish, onError, onProgress) {
        this.onFinish = onFinish;
        this.onError = onError;
        this.onProgress = onProgress;
        document.addEventListener('keydown', this._handleKeyDown);
    }

    /**
     * Stops listening and cleans up events
     */
    close() {
        document.removeEventListener('keydown', this._handleKeyDown);
        this.buffer = '';
        this.onFinish = null;
        this.onError = null;
        this.onProgress = null;
    }
}
