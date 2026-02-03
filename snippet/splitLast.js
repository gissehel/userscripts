/**
 * Splits a string into two parts at the last occurrence of a separator.
 *
 * @param {string} data The string to split
 * @param {string} separator The separator to split by
 * @returns {[string, string]} An array with two parts of the string
 */
const splitLast = (data, separator) => {
    const index = data.lastIndexOf(separator);
    if (index === -1) {
        return [data, ''];
    }
    return [data.slice(0, index), data.slice(index + separator.length)];
}
