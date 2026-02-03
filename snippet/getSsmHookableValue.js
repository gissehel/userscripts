// @import{HookableValue}
// @import{getSsmLocalState}
/**
 * Gets a SSM hookable value
 * @template T
 * @param {string} localName The SSM local state name
 * @param {string} name The hookable value name
 * @param {T|null} defaultValue The default value
 * @returns {HookableValue<T>} The SSM hookable value
 */
const getSsmHookableValue = (localName, name, defaultValue = null) => {
    const ssmLocalState = getSsmLocalState(localName);
    ssmLocalState[name] = ssmLocalState[name] || new HookableValue(name, defaultValue);
    return ssmLocalState[name];
}
