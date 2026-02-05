// @import{getSsmState}

/**
 * Gets a local SSM state
 * @param {string} localName The local state name
 * @returns {Object} The local SSM state
 */
const getSsmLocalState = (localName) => {
    const ssmState = getSsmState();
    ssmState[localName] = ssmState[localName] || {};
    return ssmState[localName];
}
