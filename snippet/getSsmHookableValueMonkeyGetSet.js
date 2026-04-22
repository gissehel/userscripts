// @import{getSsmHookableValue}
// @import{monkeyGetSetValue}
// @import{monkeySetValue}
/**
 * Gets a SSM hookable value with monkey get/set integration
 * @template T
 * @param {string} localName The SSM local state name
 * @param {string} name The hookable value name
 * @param {T|null} defaultValue The default value
 * @returns {Promise<HookableValue<T>>} The SSM hookable value
 */
const getSsmHookableValueMonkeyGetSet = async (localName, name, defaultValue = null) => {
    const hookableValue = getSsmHookableValue(localName, name, await monkeyGetSetValue(name, defaultValue));
    hookableValue.register(async (newValue) => {
        await monkeySetValue(name, newValue);
    });
    return hookableValue;
}
