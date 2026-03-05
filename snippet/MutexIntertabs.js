// @grant{GM.getValue}
// @grant{GM.setValue}
// @grant{GM.deleteValue}
// @grant{GM.listValues}
// @import{delay}

/**
 * A simple mutex implementation for inter-tab synchronization using GM storage.
 * It uses a priority-based locking mechanism to ensure fairness between tabs.
 * Note: This implementation assumes that all tabs will use the same mutex name for synchronization.
 */
class MutexIntertabs {
    /**
     * Constructor for MutexIntertabs.
     * @param {string} target A unique identifier for the mutex, used to distinguish between different mutexes if multiple are used in the same environment.
     */
    constructor(target) {
        this.target = typeof target === "string" ? target : JSON.stringify(target);
        this.key = `MUTEX-${this.target}-${self.crypto.randomUUID()}_`;
        // Clean up if this script gets closed
        addEventListener("pagehide", () => this.unlock());
        addEventListener("beforeunload", () => this.unlock());
    }
    getOther(key, what) {
        return GM.getValue(key + what);
    }
    setSelf(what, val) {
        return GM.setValue(this.key + what, val);
    }
    async otherKeys() {
        const vars = await GM.listValues();
        const keys = vars.filter(v => v.startsWith(`MUTEX-${this.target}-`) && !v.startsWith(this.key) && v.endsWith("E"));
        return keys.map(v => v.slice(0, -1));
    }
    async otherPriorities() {
        const keys = await this.otherKeys();
        const values = await Promise.all(keys.map(async (key) => this.getOther(key, "N")));
        return values.filter(Boolean);
    }
    /**
     * Acquires the mutex, waiting if necessary until it becomes available.
     */
    async lock() {
        await this.setSelf("E", true);
        const thisPriority = 1 + Math.max(0, ...await this.otherPriorities());
        await this.setSelf("N", thisPriority);
        await this.setSelf("E", false);
        for (const otherKey of await this.otherKeys()) {
            while (await this.getOther(otherKey, "E")) { /* nothing */ }
            let otherPriority;
            do {
                otherPriority = await this.getOther(otherKey, "N");
                await delay(10);
            } while (otherPriority && (otherPriority < thisPriority || otherPriority === thisPriority && otherKey < this.key));
        }
    }
    /**
     * Releases the mutex, allowing another waiting operation to proceed.
     * @returns {Promise} A promise that resolves when the mutex is released.
     */
    unlock() {
        return Promise.all(Array.from("NE", async (suffix) => GM.deleteValue(this.key + suffix)));
    }
}