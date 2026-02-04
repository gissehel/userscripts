/**
 * Parses a URL parameter string into an object.
 * 
 * @param {string} paramString 
 * @returns {Object}
 */
const parseParams = (paramString) => {
    return Object.fromEntries(paramString.split('&').map(item => [item.slice(0, item.indexOf('=')), item.slice(item.indexOf('=') + 1)]).filter(entry => entry[0].length));
}