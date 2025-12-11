/**
 * Creates a unique ID generator function with the given prefix.
 * @param {string} prefix The prefix for the unique IDs.
 * @returns {() => string} A function that generates unique IDs.
 */
const createUniqueIdGenerator = (prefix) => {
    let uid = 0;
    return () => {
        return `${prefix}-${++uid}`;
    }
};
