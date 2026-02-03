/**
 * Capitalizes the first letter of a string.
 * 
 * @param {string} data The string to capitalize
 * @returns {string} The capitalized string
 */
const capitalize = (data) => data.length > 0 ? data[0].toUpperCase() + data.slice(1) : "";
