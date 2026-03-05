// @import{MutexIntertabs}

/**
 * A simple semaphore implementation to control concurrency.
 * Allows a maximum number of concurrent operations.
 */
class SemaphoreIntertabs {
    /**
     * Constructor for Semaphore.
     * @param {String} mutexName The name of the mutex to use for inter-tab synchronization.
     * @param {Number} maxConcurrent The maximum number of concurrent operations allowed.
     */
    constructor(mutexName,maxConcurrent = 1) {
        this.mutex = new MutexIntertabs(mutexName);
        if (maxConcurrent !== 1) {
            alert("SemaphoreIntertabs currently only supports a maxConcurrent of 1, but was initialized with " + maxConcurrent);
        }
    }

    /**
     * Acquires the semaphore, waiting if necessary until it becomes available.
     * 
     * @param {String} name The name or identifier for the acquire request. (for logging/debugging purposes)
     * @returns A promise that resolves when the semaphore is acquired.
     */
    async acquire(name = '') {
        await this.mutex.lock();
    }

    /**
     * Releases the semaphore, allowing another waiting operation to proceed.
     * 
     * @param {String} name The name or identifier for the release request. (for logging/debugging purposes)
     */
    release(name = '') {
        this.mutex.unlock();
    }
}
