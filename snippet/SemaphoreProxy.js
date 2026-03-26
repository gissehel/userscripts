/**
 * A proxy for a semaphore that adds logging around acquire and release operations.
 */
class SemaphoreProxy {
    /**
     * Creates a new SemaphoreProxy instance.
     * @param {class} SemaphoreClass - The semaphore class to proxy.
     * @param {string} name - The name of the semaphore.
     * @param {number} maxConcurrent - The maximum number of concurrent locks.
     */
    constructor(SemaphoreClass, name, maxConcurrent = 1) {
        this.semaphore = new SemaphoreClass(name, maxConcurrent);
        this.name = name;
        this.maxConcurrent = maxConcurrent;
    }

    /**
     * Acquires a lock on the semaphore.
     * @param {string} name - The name of the lock request. (for logging/debugging purposes)
     */
    async acquire(name) {
        console.log(`${(new Date()).toISOString()} Begin acquire semaphore ${name} on [(${this.name},${this.maxConcurrent})]`);
        await this.semaphore.acquire(name);
        console.log(`${(new Date()).toISOString()} End acquire semaphore ${name} on [(${this.name},${this.maxConcurrent})]`);
    }

    /**
     * Releases a lock on the semaphore.
     * @param {string} name - The name of the lock request. (for logging/debugging purposes)
     */
    async release(name) {
        console.log(`${(new Date()).toISOString()} Begin release semaphore ${name} on [(${this.name},${this.maxConcurrent})]`);
        await this.semaphore.release(name);
        console.log(`${(new Date()).toISOString()} End release semaphore ${name} on [(${this.name},${this.maxConcurrent})]`);
    }
}
