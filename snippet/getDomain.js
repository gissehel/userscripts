/**
 * Gets the domain name from the current document location.
 * 
 * @returns {string} The domain name (e.g. example.com)
 */
const getDomain=()=>document.location.hostname.split('.').slice(-2).join('.');