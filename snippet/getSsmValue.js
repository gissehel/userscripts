// @import{getSsmLocalState}
/**
 * Gets a SSM const value
 * @template T
 * @param {string} localName The SSM local state name
 * @param {string} name The hookable value name
 * @param {()=>T} defaultValueGenerator The const value
 * @returns {T} The const value
 */
const getSsmValue = (localName, name, defaultValueGenerator) => {
    const ssmLocalState = getSsmLocalState(localName);
    ssmLocalState[name] = ssmLocalState[name] || defaultValueGenerator();
    return ssmLocalState[name];
}
