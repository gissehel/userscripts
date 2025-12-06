/**
 * Return an object representing the URL search parameters (ex: #key1=value1&key2=value2 in the URL would return { key1: 'value1', key2: 'value2' })
 * @returns {Object} The parameters as key/value pairs
 */
const getUrlHashParams = () => {
    return Object.fromEntries(document.location.hash.slice(1).split('&').map(item=>[item.slice(0,item.indexOf('=')), item.slice(item.indexOf('=')+1)]).filter(entry=>entry[0].length));
}