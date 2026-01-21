// @grant{unsafeWindow}
/**
 * Export all properties of a dictionary to the global window object.
 * @param {Object} dict A dictionary of key-value pairs to export.
 */
const exportOnWindow = (dict) => {
    for (const key in dict) {
        window[key] = dict[key];
    }
}
