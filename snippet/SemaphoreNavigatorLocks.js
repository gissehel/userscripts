/**
 * A semaphore implementation that uses Navigator Locks API for inter-tab synchronization.
 */
class SemaphoreNavigatorLocks {
    /**
     * Creates a new SemaphoreNavigatorLocks instance.
     * @param {string} name - The name of the semaphore. Should be unique to avoid conflicts with other semaphores using the same locking mechanism.
     * @param {number} maxConcurrent - The maximum number of concurrent locks.
     */
    constructor(name, maxConcurrent = 1) {
        this.name = name;
        this.maxConcurrent = maxConcurrent;
        this._lockName = `semaphore-${name}-lock`;
        this._slotPrefix = `semaphore-${name}-slot-`;
        this._countName = `semaphore-${name}-count`;
        this._slotsPromises = []
        this._localIndexes = []
    }

    /**
     * Acquires a lock on the semaphore.
     * @param {string} name - The name of the lock request. (for logging/debugging purposes)
     */
    async acquire(name) {
        // console.log(`${new Date().toISOString()} Requesting lock: ${name} for [(${this.name},${this.maxConcurrent})]`);
        let indexSlot = null;

        while (indexSlot === null) {
            await navigator.locks.request(this._lockName, async (lock) => {
                // console.log(`${new Date().toISOString()} Lock acquired: ${name} for [(${this.name},${this.maxConcurrent})]`);

                const slotPromises = Array
                    .from({ length: this.maxConcurrent }, (_, i) => i)
                    .map(async (i) => {
                        return navigator.locks.request(this._slotPrefix + i, { mode: 'exclusive', ifAvailable: true }, async (slotLock) => {
                            if (slotLock && indexSlot === null) {
                                // console.log(`${new Date().toISOString()} Slot ${i} acquired: ${name} for [(${this.name},${this.maxConcurrent})]`);
                                indexSlot = i;
                                await new Promise((resolve) => {
                                    this._slotsPromises[i] = resolve;
                                });
                            }
                        })
                    });

                Promise.all(slotPromises);

                // console.log(`${new Date().toISOString()} Releasing lock: ${name} for [(${this.name},${this.maxConcurrent})]`);
            });
            // console.log(`${new Date().toISOString()} End request: ${name} for [(${this.name},${this.maxConcurrent})]`);

            if (indexSlot === null) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }

        this._localIndexes.push(indexSlot);
        // console.log(`${new Date().toISOString()} Lock acquired and slot assigned: ${name} (slot ${indexSlot}) for [(${this.name},${this.maxConcurrent})]`);
    }

    /**
     * Releases a lock on the semaphore.
     * @param {string} name - The name of the lock request. (for logging/debugging purposes)
     */
    async release(name) {
        // console.log(`${new Date().toISOString()} Releasing lock: ${name} for [(${this.name},${this.maxConcurrent})]`);
        await navigator.locks.request(this._lockName, async (lock) => {
            // console.log(`${new Date().toISOString()} Lock acquired: ${name} for [(${this.name},${this.maxConcurrent})]`);

            const indexSlot = this._localIndexes.shift();
            if (indexSlot !== undefined) {
                const releaseSlot = this._slotsPromises[indexSlot];
                if (releaseSlot) {
                    this._slotsPromises[indexSlot] = null;
                    releaseSlot();
                }
            }

            // console.log(`${new Date().toISOString()} Releasing lock: ${name} for [(${this.name},${this.maxConcurrent})]`);
        });
        // console.log(`${new Date().toISOString()} Lock released: ${name} for [(${this.name},${this.maxConcurrent})]`);
    }
}

