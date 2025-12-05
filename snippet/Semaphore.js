/**
 * A simple semaphore implementation to control concurrency.
 * Allows a maximum number of concurrent operations.
 */
class Semaphore {
    /**
     * Constructor for Semaphore.
     * @param {Number} maxConcurrent The maximum number of concurrent operations allowed.
     */
    constructor(maxConcurrent = 1) {
        this.maxConcurrent = maxConcurrent;
        this.current = 0;
        this.queue = [];
        this.debug = false;
    }

    /**
     * Acquires the semaphore, waiting if necessary until it becomes available.
     * 
     * @param {String} name The name or identifier for the acquire request. (for logging/debugging purposes)
     * @returns A promise that resolves when the semaphore is acquired.
     */
    async acquire(name = '') {
        if (this.debug) {
            console.log(`acquire - ${name} (${this.queue.length})`)
        }
        if (this.current < this.maxConcurrent) {
            this.current++;
            return Promise.resolve();
        }

        return new Promise(resolve => {
            this.queue.push(() => {
                if (this.debug) {
                    console.log(`unlocked - ${name} (${this.queue.length})`)
                }
                resolve();
            });
        });
    }

    /**
     * Releases the semaphore, allowing another waiting operation to proceed.
     * 
     * @param {String} name The name or identifier for the release request. (for logging/debugging purposes)
     */
    release(name = '') {
        if (this.debug) {
            console.log(`release - ${name} (${this.queue.length})`)
        }
        if (this.queue.length > 0) {
          const next = this.queue.shift();
          next();
        } else {
          this.current--;
        }
    }
}
