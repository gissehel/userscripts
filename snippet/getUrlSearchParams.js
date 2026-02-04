// @import{parseParams}
/**
 * Return an object representing the URL search parameters (ex: ?key1=value1&key2=value2 in the URL would return { key1: 'value1', key2: 'value2' })
 * @returns {Object} The parameters as key/value pairs
 */
const getUrlSearchParams = () => {
    return parseParams(document.location.search.slice(1));
}