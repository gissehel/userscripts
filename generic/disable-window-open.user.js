// ==UserScript==
// @name        disable-window-open
// @namespace   https://github.com/gissehel/userscripts
// @version     20260902-093746-0e98d7a
// @description Disable window.open calls by hosts
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMDAwMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGQ9Ik0xODQsNzJINDBBMTYsMTYsMCwwLDAsMjQsODhWMjAwYTE2LDE2LDAsMCwwLDE2LDE2SDE4NGExNiwxNiwwLDAsMCwxNi0xNlY4OEExNiwxNiwwLDAsMCwxODQsNzJabTAsMTI4SDQwVjg4SDE4NFYyMDBaTTIzMiw1NlYxNzZhOCw4LDAsMCwxLTE2LDBWNTZINjRhOCw4LDAsMCwxLDAtMTZIMjE2QTE2LDE2LDAsMCwxLDIzMiw1NloiPjwvcGF0aD48L3N2Zz4=
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @grant       GM.registerMenuCommand
// @grant       GM.unregisterMenuCommand
// ==/UserScript==

const script_name = GM_info?.script?.name || 'no-name'
const script_version = GM_info?.script?.version || 'no-version'
const script_id = `${script_name} ${script_version}`
console.log(`Begin - ${script_id}`)


// @imported_begin{realWindow}
const realWindow = typeof window.unsafeWindow === 'undefined' ? window : window.unsafeWindow
// @imported_end{realWindow}

// @imported_begin{exportOnWindow}
/**
 * Export all properties of a dictionary to the global window object.
 * @param {Object} dict A dictionary of key-value pairs to export.
 */
const exportOnWindow = (dict) => {
    for (const key in dict) {
        realWindow[key] = dict[key];
    }
}
// @imported_end{exportOnWindow}

// @imported_begin{monkeyGetValue}
/**
 * Get a value from the monkey storage (Tampermonkey/Greasemonkey/Violentmonkey/etc.)
 * Just an alias for GM.getValue, for coherence use with monkeyGetSetValue.
 * 
 * @param {String} key The key of the value to get
 * @returns {Promise<Object>} The value stored in the monkey storage for the given key
 */
const monkeyGetValue = async (key) => await GM.getValue(key);
// @imported_end{monkeyGetValue}

// @imported_begin{monkeySetValue}
/**
 * Set a value in the monkey storage (Tampermonkey/Greasemonkey/Violentmonkey/etc.)
 * Just an alias for GM_setValue, for coherence use with monkeyGetSetValue.
 * 
 * @param {String} key La clé de la valeur à définir
 * @param {Object} value La valeur à définir
 * @returns {Promise<void>} A promise that resolves when the value has been set
 */
const monkeySetValue = async (key, value) => await GM.setValue(key, value);
// @imported_end{monkeySetValue}

// @imported_begin{monkeyDeleteValue}
/**
 * Delete a value from the monkey storage (Tampermonkey/Greasemonkey/Violentmonkey/etc.)
 * Just an alias for GM.deleteValue, for coherence use with monkeyGetSetValue.
 * 
 * @param {String} key The key of the value to delete
 * @returns {Promise<void>} A promise that resolves when the value has been deleted
 */
const monkeyDeleteValue = async (key) => await GM.deleteValue(key);
// @imported_end{monkeyDeleteValue}

// @imported_begin{registerMenuCommand}
/**
 * Register a menu command in the userscript manager's menu (e.g., Tampermonkey, Greasemonkey, Violentmonkey). Unlike the underlying `GM.registerMenuCommand`, this function use the register pattern, thus returns an unregister function that can be called to remove the menu command when it's no longer needed.
 * 
 * @param {string} name The name of the menu command to display.
 * @param {() => void} callback The function to execute when the menu command is selected.
 * @return {() => Promise<void>} A function that, when called, will unregister the menu command.
 */
const registerMenuCommand = async (name, callback) => {
    let id = await GM.registerMenuCommand(name, callback);
    return async () => {
        if (id !== null) {
            const tempId = id;
            id = null;
            await GM.unregisterMenuCommand(tempId);
        }
    }
}
// @imported_end{registerMenuCommand}

// @imported_begin{HookableValue}
/**
 * A class representing a value that can have hooks on change
 * @template T The type of the value
 */
class HookableValue {
    /**
     * Constructor
     * @param {string} name The name of the hook
     * @param {T|null} defaultValue The default value
     */
    constructor(name, defaultValue = null) {
        this._name = name;
        this._value = defaultValue;
        this.callbacks = [];
    }

    /**
     * Sets the value and calls the hooks if the value changed
     * 
     * @param {T} newValue The new value
     * @returns {Promise<void>} A promise that resolves when all hooks have been called
     */
    async setValue(newValue) {
        const oldValue = this.value;
        if (oldValue !== newValue) {
            this._value = newValue;
            for (const callback of this.callbacks) {
                await callback(newValue, oldValue);
            }
        }
    }

    /**
     * Gets the value
     * 
     * @returns {T} The current value
     */
    getValue() {
        return this._value;
    }

    /**
     * Register a callback to be called when the value changes
     * @param {(newValue:T, oldValue:T)=>Promise<void>} callback The callback (that may be async)
     * @returns {Promise<()=>Promise<void>>} The unregister function
     */
    async register(callback) {
        this.callbacks.push(callback);
        return async () => {
            this.callbacks = this.callbacks.filter(cb => cb !== callback);
        }
    }

    /**
     * Registers a callback and immediately calls it with the current value
     * @param {(newValue:T, oldValue:T)=>Promise<void>} callback The callback (that may be async)
     * @returns {Promise<()=>Promise<void>>} The unregister function
     */
    async registerAndCall(callback) {
        const unregisterFunction = await this.register(callback);
        await callback(this.value, this.value);
        return unregisterFunction;
    }

    /**
     * Registers a callback to be called when any of the given hookable values changes
     * @param {HookableValue[]} hookableValues The hookable values to watch
     * @param {(newValues: any[], oldValues: any[]) => Promise<void>} callback The callback (that may be async) that will receive the new and old values of all the hookable values
     * @returns {Promise<()=>Promise<void>>} The unregister function
     */
    static async registerAll(hookableValues, callback) {
        const unregisterFunctions = await Promise.all(hookableValues.map(
            (hookableValue,indexHookable) => hookableValue.register(
                async (value, oldValue) => await callback(
                    hookableValues.map((hv,indexValue) => indexValue === indexHookable ? value : hv.value), 
                    hookableValues.map((hv,indexValue) => indexValue === indexHookable ? oldValue : hv.value)
                )
            )
        ));
        return async () => {
            for (const unregister of unregisterFunctions) {
                await unregister();
            }
        };
    }

    /**
     * Clears all registered callbacks
     * @returns {Promise<void>}
     */
    async clearCallbacks() {
        for (const callback of this.callbacks) {
            await callback(null, this._value);
        }
        this.callbacks = [];
    }

    get value() {
        return this.getValue();
    }

    set value(newValue) {
        this.setValue(newValue);
    }

    get name() {
        return this._name;
    }
}
/** @typedef {HookableValue} HookableValue */
// @imported_end{HookableValue}

// @imported_begin{PERSISTENT_PARAMETER_SCOPE}
/**
 * Defines the scope of a persistent parameter. This is used to determine how the parameter value is stored and shared across different pages.
 * 
 * - BY_SCRIPT: The parameter value is stored separately for each script. This means that all sites will have the same parameter value, but different scripts will have different parameter values.
 * - BY_HOST: The parameter value is stored separately for each host. This means that all pages on the same host will share the same parameter value, but different hosts will have different parameter values.
 * - BY_DOMAIN: The parameter value is stored separately for each domain. This means that all pages on the same domain (including subdomains) will share the same parameter value, but different domains will have different parameter values.
 * - BY_CUSTOM: The parameter value is stored based on a custom key. This means that the parameter value will be shared among all pages that use the same custom key, and different parameter values can be defined for different custom keys. This is useful when you want to share a parameter value across multiple scripts or across multiple hosts/domains, but you don't want to use the same parameter value for all scripts or all hosts/domains.
 */
const PERSISTENT_PARAMETER_SCOPE = {
    BY_SCRIPT: 'BY_SCRIPT',
    BY_HOST: 'BY_HOST',
    BY_DOMAIN: 'BY_DOMAIN',
    BY_CUSTOM: 'BY_CUSTOM',
}
// @imported_end{PERSISTENT_PARAMETER_SCOPE}

// @imported_begin{getPersistentParameterValue}
/**
 * @typedef {Object} GetPersistentParameterValueOptions
 * @property {((oldValue: T) => Promise<T>)} [onParameterNeedNewValue] A callback function that is called when a new parameter value is needed, with the old value as parameter, and that returns the new value
 * @property {((parameterName: string, newValue: T, scopeName?: string) => Promise<String>)} [getMenuLabel] A callback function that is called to get the menu label, with the parameter name and the new value as parameters, and that returns the menu label
 * @property {PERSISTENT_PARAMETER_SCOPE} [scope] The scope of the persistent parameter. This determines how the parameter value is stored and shared across different pages. Default is PERSISTENT_PARAMETER_SCOPE.BY_SCRIPT.
 * @property {string} [customScopeKey] If the scope is BY_CUSTOM, this key is used to differentiate the parameter value. It can be set to any string, but it should be unique to avoid conflicts with other parameters. Default is an empty string.
 * @property {boolean} [alertOnChange] Whether to alert the user when the parameter value changes. Default is false.
 * @property {boolean} [dontStoreDefault] Whether to not store the default value in the monkey storage. If true, the default value will not be stored, and the parameter will be considered unset until it is changed. Default is false.
 * @property {string} [displayName] The display name of the parameter, which can be used in the menu command instead of the parameter name. Default is the parameter name.
 */

/**
 * Gets the persistent string value of a parameter, and registers menu commands to toggle it.
 * The parameter state is persisted in the monkey storage, so it will be remembered across page reloads.
 * 
 * The menu command will be "Change {parameterName} (current : {currentValue})". 
 * When the menu command is selected, the value will be asked, the parameter value will be updated.
 * 
 * @template T The type of the parameter value
 * @param {String} parameterName The name of the parameter (used for menu command and storage)
 * @param {T} defaultValue The default value of the parameter
 * @param {GetPersistentParameterValueOptions} [options] Additional options
 * @returns {Promise<HookableValue<T>>} The hookable value for the parameter
 */
const getPersistentParameterValue = (() => {
    /**
     * @type {{[parameterName: string]: HookableValue<T>}}
     * @template T
     */
    const hookableValueParameterValues = {};
    exportOnWindow({ hookableValueParameterValues });

    /**
     * @template T The type of the parameter value
     * @param {String} parameterName The name of the parameter (used for menu command and storage)
     * @param {T} defaultValue The default value of the parameter
     * @param {GetPersistentParameterValueOptions} [options] Additional options
     * @returns {Promise<HookableValue<T>>} The hookable value for the parameter
     */
    return async (parameterName, defaultValue, options) => {
        if (!options) {
            options = {};
        }
        const displayName = options?.displayName ?? parameterName;
        const getMenuLabel = options?.getMenuLabel ?? ((parameterName, newValue, scopeName) => `⚙️ Change ${displayName} (current : ${newValue}${scopeName ? `, scope: ${scopeName}` : ''})`);
        const onParameterNeedNewValue = options?.onParameterNeedNewValue ?? (async (oldValue) => {
            const newValue = prompt(`⌨️ Enter new value for ${displayName}:`, oldValue);
            return newValue;
        });
        const alertOnChange = options?.alertOnChange ?? false;
        const scope = options?.scope ?? PERSISTENT_PARAMETER_SCOPE.BY_SCRIPT;
        const dontStoreDefault = options?.dontStoreDefault ?? false;
        let parameterNameForMonkey = parameterName;
        let scopeName = undefined
        if (scope === PERSISTENT_PARAMETER_SCOPE.BY_HOST) {
            scopeName = location.host;
            parameterNameForMonkey = `${parameterName}_host_${scopeName}`;
        } else if (scope === PERSISTENT_PARAMETER_SCOPE.BY_DOMAIN) {
            scopeName = location.hostname.split('.').slice(-2).join('.');
            parameterNameForMonkey = `${parameterName}_domain_${scopeName}`;
        } else if (scope === PERSISTENT_PARAMETER_SCOPE.BY_CUSTOM) {
            const customScopeKey = options?.customScopeKey ?? '';
            scopeName = customScopeKey;
            parameterNameForMonkey = `${parameterName}_custom_${scopeName}`;
        }

        /** @type{(()=>Promise<void>) | null} */
        let menuCommandUnregisterFunction = null;

        if (!hookableValueParameterValues[parameterName]) {
            let value = await monkeyGetValue(parameterNameForMonkey);
            if (value === undefined) {
                value = defaultValue;
            }
            if (value === defaultValue && dontStoreDefault) {
                await monkeyDeleteValue(parameterNameForMonkey);
            } else {
                await monkeySetValue(parameterNameForMonkey, value);
            }
            hookableValueParameterValues[parameterName] = new HookableValue(parameterName);
            const hookableValue = hookableValueParameterValues[parameterName];
            await hookableValue.register(async (newValue) => {
                if (newValue === defaultValue && dontStoreDefault) {
                    await monkeyDeleteValue(parameterNameForMonkey);
                } else {
                    await monkeySetValue(parameterNameForMonkey, newValue);
                }

                if (menuCommandUnregisterFunction) {
                    await menuCommandUnregisterFunction();
                    menuCommandUnregisterFunction = null;
                }
                const label = await getMenuLabel(parameterName, newValue, scopeName);
                menuCommandUnregisterFunction = await registerMenuCommand(label, async () => {
                    const nextValue = await onParameterNeedNewValue(newValue);
                    if (nextValue !== null) {
                        await hookableValue.setValue(nextValue);
                    }
                });

                if (alertOnChange) {
                    alert(`ℹ️ Parameter [${parameterName}]${parameterName !== displayName ? ` (${displayName})` : ''} is set to ${hookableValue.value}${scopeName ? ` (scope: ${scopeName})` : ''}`);
                }
            });
            hookableValue.value = value;
        }

        return hookableValueParameterValues[parameterName];
    }
})();
exportOnWindow({ getPersistentParameterValue });
// @imported_end{getPersistentParameterValue}

// @imported_begin{getPersistentParameterValueBoolean}
/**
 * Gets the persistent boolean value of a parameter, and registers menu commands to toggle it.
 * The parameter state is persisted in the monkey storage, so it will be remembered across page reloads.
 * 
 * The menu command will be "Enable {parameterName}" if the parameter is currently disabled, 
 * and "Disable {parameterName}" if the parameter is currently enabled. When the menu command is selected, 
 * the parameter value will be toggled.
 * 
 * @param {String} parameterName The name of the parameter (used for menu command and storage)
 * @param {Boolean} defaultValue The default value of the parameter
 * @param {GetPersistentParameterValueOptions} [options] Additional options
 * @returns {Promise<HookableValue<Boolean>>} The hookable value for the parameter
 */
const getPersistentParameterValueBoolean = async (parameterName, defaultValue, options) => {
    return await getPersistentParameterValue(parameterName, defaultValue, {
        onParameterNeedNewValue: async (oldValue) => {
            return !oldValue;
        },
        getMenuLabel: async (parameterName, newValue, scopeName) => {
            return `${newValue ? '❌ Disable' : '✅ Enable'} ${options?.displayName ?? parameterName}${scopeName ? ` (scope: ${scopeName})` : ''}`;
        },
        ...options,
    })
}
// @imported_end{getPersistentParameterValueBoolean}

// @main_begin{disable-window-open}
const main = async () => {
    const windowOpenOrig = realWindow.open;
    const windowOpenMock = (...args) => {
        console.log('window.open is disabled');
        console.log('   Arguments tried:', args);
        return null;
    }
    const enableWindowOpen = await getPersistentParameterValueBoolean('allow-window-open', true, {
        scope: PERSISTENT_PARAMETER_SCOPE.BY_HOST,
        dontStoreDefault: true,
        displayName: 'opening popups',
    });
    enableWindowOpen.registerAndCall(async (newValue) => {
        if (newValue) {
            if (realWindow.open !== windowOpenOrig) {
                realWindow.open = windowOpenOrig;
            }
        } else {
            if (realWindow.open !== windowOpenMock) {
                realWindow.open = windowOpenMock;
            }
        }
    })
}

main()
// @main_end{disable-window-open}

console.log(`End - ${script_id}`)
