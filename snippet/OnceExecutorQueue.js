/**
 * A class that ensures a given asynchronous code block is executed only once.
 * Subsequent calls to execute() will have no effect.
 */
class OnceExecutor {
    /**
     * Constructor
     * @param {() => Promise<void>} code The code to execute once.
     */
    constructor(code) {
        this.code = code;
    }
    /**
     * Executes the code if it hasn't been executed yet.
     * @returns {Promise<void>}
     */
    async execute() {
        if (this.code) {
            const code = this.code;
            this.code = null;

            await code();
        }
    }
}
/**
 * A queue that manages multiple OnceExecutor instances.
 * Allows enqueuing code blocks and executing them in order.
 */
class OnceExecutorQueue {
    /**
     * Constructor
     */
    constructor() {
        this.queue = [];
    }
    /**
     * Adds a new code block to the queue.
     * @param {() => Promise<void>)} code The code to enqueue.
     * @returns {OnceExecutor} The OnceExecutor instance for the enqueued code.
     */
    enqueue(code) {
        const onceExecutor = new OnceExecutor(code);
        this.queue.push(onceExecutor);
        return onceExecutor;
    }
    /**
     * Executes all enqueued code blocks in order.
     * @returns {Promise<void>}
     */
    async executeAll() {
        while (this.queue.length > 0) {
            const onceExecutor = this.queue.shift();
            await onceExecutor.execute();
        }
    }
}
