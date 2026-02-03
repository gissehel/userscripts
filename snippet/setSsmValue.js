// @import{getSsmLocalState}
/**
 * Sets a SSM const value
 * @template T
 * @param {string} localName The SSM local state name
 * @param {string} name The name of the value
 * @param {T|null} value The const value
 */
const setSsmValue = (localName, name, value = null) => {
    const ssmLocalState = getSsmLocalState(localName);
    ssmLocalState[name] = ssmLocalState[name] || value;
}
