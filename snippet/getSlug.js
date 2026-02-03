/**
 * Get a slug from a name removing diacritics and special characters
 * @param {string} name The name to convert
 * @returns {string} The slugified version of the name
 */
const getSlug = (name, options = {}) => {
    let currentName = name;
    if (! options.case) {
        currentName = currentName.toLocaleLowerCase();
    }
    
    currentName = currentName.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove diacritics
    currentName = currentName.replace(/ß/g, "ss"); // Special case for German sharp S
    currentName = currentName.replace(/[^A-Za-z0-9]/g, '-').replace(/--+/g, '-').replace(/^-+|-+$/g, '');

    if (options.separator) {
        currentName = currentName.replace(/-/g, options.separator);
    }
    return currentName;
}
