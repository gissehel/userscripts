// ==UserScript==
// @name        articles-summarize
// @namespace   https://github.com/gissehel/userscripts
// @version     20260422-142152-a036d9f
// @description articles-summarize : Create prompt to summarize articles
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       https://www.livescience.com/*
// @match       https://www.lemonde.fr/*
// @match       https://nouveau-europresse-com.bnf.idm.oclc.org/Search/ResultMobile/*
// @match       https://nouveau-europresse-com.bnf.idm.oclc.org/Document/*
// @match       https://nouveau-europresse-com.bpi.idm.oclc.org/Search/ResultMobile/*
// @match       https://nouveau-europresse-com.bpi.idm.oclc.org/Document/*
// @match       https://www.liberation.fr/*
// @match       https://www.lefigaro.fr/*
// @match       https://www.20minutes.fr/*
// @match       https://www.leparisien.fr/*
// @match       https://www.mediapart.fr/journal/*/*/*
// @match       https://www-mediapart-fr.bnf.idm.oclc.org/journal/*/*/*
// @match       https://www-mediapart-fr.bpi.idm.oclc.org/journal/*/*/*
// @match       https://sciencepost.fr/*/
// @icon        https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.registerMenuCommand
// ==/UserScript==

const script_name = GM_info?.script?.name || 'no-name'
const script_version = GM_info?.script?.version || 'no-version'
const script_id = `${script_name} ${script_version}`
console.log(`Begin - ${script_id}`)


// @imported_begin{readyPromise}
/**
 * A promise that is resolved when the html DOM is ready. 
 * Should be part of any browser, but is not.
 * 
 * @type {Promise<void>} A promise that is resolved when the html DOM is ready
 */
const readyPromise = new Promise((resolve, reject) => {
    if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
        setTimeout(() => resolve(), 1);
    } else {
        const onContentLoaded = () => {
            resolve();
            document.removeEventListener('DOMContentLoaded', onContentLoaded, false);
        }
        document.addEventListener('DOMContentLoaded', onContentLoaded, false);
    }
})
// @imported_end{readyPromise}

// @imported_begin{createElementExtended}
/**
 * Create a new element, and add some properties to it
 * 
 * @param {string} name The name of the element to create
 * @param {object} params The parameters to tweek the new element
 * @param {object.<string, string>} params.attributes The propeties of the new element
 * @param {object.<string, string>} params.style The style properties of the new element
 * @param {string} params.text The textContent of the new element
 * @param {HTMLElement[]} params.children The children of the new element
 * @param {HTMLElement} params.parent The parent of the new element
 * @param {string[]} params.classnames The classnames of the new element
 * @param {string} params.id The classnames of the new element
 * @param {HTMLElement} params.prevSibling The previous sibling of the new element (to insert after)
 * @param {HTMLElement} params.nextSibling The next sibling of the new element (to insert before)
 * @param {(element:HTMLElement)=>{}} params.onCreated called when the element is fully created
 * @returns {HTMLElement} The created element
 */
const createElementExtended = (name, params) => {
    /** @type{HTMLElement} */
    const element = document.createElement(name)
    if (!params) {
        params = {}
    }
    const { attributes, text, children, parent, prependIn, classnames, id, style, prevSibling, nextSibling, onCreated } = params
    if (attributes) {
        for (let attributeName in attributes) {
            element.setAttribute(attributeName, attributes[attributeName])
        }
    }
    if (style) {
        for (let key in style) {
            element.style[key] = style[key];
        }
    }
    if (text) {
        element.textContent = text;
    }
    if (children) {
        const addChild = (child) => {
            if (child) {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child))
                } else if (Array.isArray(child)) {
                    for (let subChild of child) {
                        addChild(subChild)
                    }
                } else {
                    element.appendChild(child)
                }
            }
        }

        for (let child of children) {
            addChild(child)
        }
    }
    if (parent) {
        parent.appendChild(element)
    }
    if (prependIn) {
        prependIn.prepend(element)
    }
    if (classnames) {
        for (let classname of classnames) {
            element.classList.add(classname)
        }
    }
    if (id) {
        element.id = id
    }
    if (prevSibling) {
        if (prevSibling.parentElement) {
            prevSibling.parentElement.insertBefore(element, prevSibling.nextSibling)
        } else {
            prevSibling.parentElement.appendChild(element)
        }
    }
    if (nextSibling) {
        nextSibling.parentElement.insertBefore(element, nextSibling)
    }
    if (onCreated) {
        onCreated(element)
    }
    return element
}
// @imported_end{createElementExtended}

// @imported_begin{getSubElements}
/**
 * Request some sub elements from an element
 *
 * @param {HTMLElement} element The element to query
 * @param {string} query The query
 * @returns {[HTMLElement]}
 */
const getSubElements = (element, query) => [...element.querySelectorAll(query)]
// @imported_end{getSubElements}

// @imported_begin{getElements}
/**
 * Request some elements from the current document
 *
 * @param {string} query The query
 * @returns {[HtmlElement]}
 */
const getElements = (query) => getSubElements(document, query)
// @imported_end{getElements}

// @imported_begin{copyTextToClipboard}
/**
 * Copy some text to clipboard
 * 
 * @param {string} text text to copy to clipboard
 * @returns 
 */
const copyTextToClipboard = async (text) => {
    if (!navigator.clipboard) {
        console.log(`Can't copy [${test}] : No navigator.clipboard API`)
        return;
    }

    await navigator.clipboard.writeText(text)
}
// @imported_end{copyTextToClipboard}

// @imported_begin{getDomain}
/**
 * Gets the domain name from the current document location.
 * 
 * @returns {string} The domain name (e.g. example.com)
 */
const getDomain=()=>document.location.hostname.split('.').slice(-2).join('.');
// @imported_end{getDomain}

// @imported_begin{monkeyGetSetValue}
/**
 * Get the value from the monkey (Tampermonkey/Greasemonkey/Violentmonkey/etc.) storage, and set them with the default if nothing already exists
 * 
 * @param {String} key The key to use to name the value to get or set
 * @param {Object} value The default value to set and return if not defined
 * @returns {Promise<Object>} The value to use
 */
const monkeyGetSetValue = async (key, value) => {
    const storedValue = await GM.getValue(key);
    if (storedValue === undefined && value !== undefined) {
        await GM.setValue(key, value);
        return value;
    }
    return storedValue;
}
// @imported_end{monkeyGetSetValue}

// @imported_begin{monkeyGetSetOptions}
/**
 * Get options using the values stored in monkey store or the default values
 * 
 * @param {Object<String, Object>} baseOptions Default values
 * @returns {Object<String, Object>} Options to use
 */
const monkeyGetSetOptions = async (baseOptions) => {
    const options = Object.fromEntries(await Promise.all(Object.entries(baseOptions).map(async ([k, v]) => [k, await monkeyGetSetValue(k, v)])));
    return options;
}
// @imported_end{monkeyGetSetOptions}

// @imported_begin{prototypeBind}
/**
 * Binds a function to a type's prototype, allowing it to be called as a method on instances of that type.
 * 
 * @param {Function} type The type whose prototype to bind the function to
 * @param {Function} fn The function to bind to the prototype. Must be a named function. It's first argument will be the instance of the type on which it is called, followed by any additional arguments.
 */
const prototypeBind = (type, fn) => {
    if (!type || !type.prototype) {
        throw new Error('First argument must be a type with a prototype.');
    }
    if (!fn || typeof fn !== 'function' || !fn.name || fn.name.length === 0) {
        throw new Error('Second argument must be a named function.');
    }
    if (type.prototype) {
        type.prototype[fn.name] = function (...args) { return fn(this, ...args); }
    }
}
// @imported_end{prototypeBind}

// @imported_begin{registerEventListener}
/**
 * Wrap addEventListener and removeEventListener using a pattern where the unregister function is returned
 * 
 * @param {HTMLElement|EventTarget} element The object on which to register the event
 * @param {string} eventType The event type
 * @param {EventListenerOrEventListenerObject} callback The callback to call when the event is triggered
 * @param {boolean|AddEventListenerOptions=} options The options to pass to addEventListener
 * @return {()=>{}} The unregister function
 */
const registerEventListener = (element, eventType, callback, options) => {
    if (element.addEventListener) {
        element.addEventListener(eventType, callback, options);
        if (typeof options === 'object' && !Array.isArray(options) && options !== null) {
            if (options.executeAtRegister) {
                setTimeout(()=>callback(),0)
            }
        }
    }
    return () => {
        if (element.removeEventListener) {
            element.removeEventListener(eventType, callback, options);
        }
    }
}
// @imported_end{registerEventListener}

// @imported_begin{bindOnClick}
/**
 * Bind an onClick handler an element. Returns uninstall handler
 * 
 * @param {HTMLElement} element The element to bind the handler
 * @param {()=>boolean|undefined} callback The onClick handler
 * @returns {()=>{}}
 */
const bindOnClick = (element, callback) => {
    const onClick = (e) => {
        const result = callback()
        if (result !== false) {
            e.preventDefault()
            e.stopImmediatePropagation()
        }
    }
    return registerEventListener(element, 'click', onClick, true);
}
// @imported_end{bindOnClick}

// @imported_begin{openLinkInNewTab}
/**
 * Open a link in a new tab
 * @param {string} url 
 */
const openLinkInNewTab = (url) => {
    const link = createElementExtended('a', {
        attributes: {
            href: url,
            target: '_blank',
        },
    })
    link.click();
}
// @imported_end{openLinkInNewTab}

// @imported_begin{realWindow}
const realWindow = typeof window.unsafeWindow === 'undefined' ? window : window.unsafeWindow
// @imported_end{realWindow}

// @imported_begin{getSsmState}
/**
 * Gets the global SSM state
 * @returns {Object} The SSM state
 */
const getSsmState = () => {
    realWindow.ssmState = realWindow.ssmState || {};
    return realWindow.ssmState;
}
// @imported_end{getSsmState}

// @imported_begin{getSsmLocalState}
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
// @imported_end{getSsmLocalState}

// @imported_begin{getSsmValue}
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
// @imported_end{getSsmValue}

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
     * @returns {()=>void} The unregister function
     */
    register(callback) {
        this.callbacks.push(callback);
        return () => {
            this.callbacks = this.callbacks.filter(cb => cb !== callback);
        }
    }

    /**
     * Clears all registered callbacks
     * @returns {void}
     */
    clearCallbacks() {
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

// @imported_begin{getSsmHookableValue}
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
// @imported_end{getSsmHookableValue}

// @imported_begin{monkeySetValue}
/**
 * Set a value in the monkey storage (Tampermonkey/Greasemonkey/Violentmonkey/etc.)
 * Just an alias for GM_setValue, for coherence use with monkeyGetSetValue.
 * 
 * @param {String} key La clé de la valeur à définir
 * @param {Object} value La valeur à définir
 */
const monkeySetValue = async (key, value) => await GM.setValue(key, value);
// @imported_end{monkeySetValue}

// @imported_begin{getSsmHookableValueMonkeyGetSet}
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
// @imported_end{getSsmHookableValueMonkeyGetSet}

// @imported_begin{bindOnClickAndCtrlClick}
/**
 * Bind an onClick and ctrl+click handler to an element. Returns uninstall handler
 * 
 * @param {HtmlElement} element The element to bind the handler
 * @param {()=>boolean|undefined} callback The onClick handler
 * @param {()=>boolean|undefined} callbackCtrl The onClick handler for ctrl+click
 * @returns {()=>{}}
 */
const bindOnClickAndCtrlClick = (element, callback, callbackCtrl) => {
    const onClick = (e) => {
        let callbackToExecute = null;
        if (e.ctrlKey && callbackCtrl) {
            callbackToExecute = callbackCtrl;
        } else {
            callbackToExecute = callback;
        }
        if (callbackToExecute) {
            const result = callbackToExecute()
            if (result !== false) {
                e.preventDefault()
                e.stopImmediatePropagation()
            }
        }
    }
    return registerEventListener(element, 'click', onClick, true);
}
// @imported_end{bindOnClickAndCtrlClick}

// @imported_begin{createIconLink}
/**
 * Creates an icon link element with an image and binds an async click handler.
 * 
 * @param {string} iconUrl The icon URL
 * @param {string} name The link name
 * @param {string} defaultLink The default link URL
 * @param {Function} asyncCode The async code to execute on click
 * @param {Function} asyncCtrlCode The async code to execute on ctrl+click
 * @returns {HTMLElement} The icon link element
 */
const createIconLink = (iconUrl, name, defaultLink, asyncCode, asyncCtrlCode) => {
    return createElementExtended('a', {
        children: [
            createElementExtended('img', {
                attributes: {
                    src: iconUrl,
                    alt: name,
                    title: name,
                },
                style: { width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '5px', marginLeft: '5px' },
            }),
        ],
        attributes: { href: defaultLink, title: name },
        style: { textDecoration: 'none', color: 'black', fontWeight: 'bold', marginBottom: '5px', marginTop: '5px', display: 'inline-block' },
        onCreated: (el) => {
            bindOnClickAndCtrlClick(el, asyncCode, asyncCtrlCode);
        },
    });
}
// @imported_end{createIconLink}

// @imported_begin{createIconLinkAction}
/**
 * Creates an icon link action element with an image and binds an async click handler.
 * 
 * @param {string} iconUrl The icon URL
 * @param {string} name The link name
 * @param {Function} asyncCode The async code to execute on click
 * @param {Function} asyncCtrlCode The async code to execute on ctrl+click
 * @returns {HTMLElement} The icon link element
 */
const createIconLinkAction = (iconUrl, name, asyncCode, asyncCtrlCode) => createIconLink(iconUrl, name, '#', asyncCode, asyncCtrlCode);
// @imported_end{createIconLinkAction}

// @imported_begin{ICONS}
const ICONS = {
    COPY: 'https://cdn-icons-png.flaticon.com/512/2570/2570600.png', // From Flaticon [Clean icons created by Smashicons - Flaticon](https://www.flaticon.com/authors/smashicons)
    SEASON: 'https://cdn-icons-png.flaticon.com/512/6430/6430770.png', // From Flaticon [Close icons created by Freepik - Flaticon](https://www.flaticon.com/authors/freepik)
    MOVE: 'https://cdn-icons-png.flaticon.com/512/8841/8841247.png', // From Flaticon [Link icons created by Freepik - Flaticon](https://www.flaticon.com/authors/freepik)
    TITLE: 'https://cdn-icons-png.flaticon.com/512/3131/3131642.png', // From Flaticon [Clean icons created by Smashicons - Flaticon](https://www.flaticon.com/authors/smashicons)
    LEFT: 'https://cdn-icons-png.flaticon.com/512/5376/5376904.png', // From Flaticon [Link icons created by Freepik - Flaticon](https://www.flaticon.com/authors/freepik)
    RIGHT: 'https://cdn-icons-png.flaticon.com/512/5375/5375438.png', // From Flaticon [Link icons created by Freepik - Flaticon](https://www.flaticon.com/authors/freepik)
    SHRINK: 'https://cdn-icons-png.flaticon.com/512/5376/5376654.png', // From Flaticon [Link icons created by Freepik - Flaticon](https://www.flaticon.com/authors/freepik)
    GROW: 'https://cdn-icons-png.flaticon.com/512/5376/5376785.png', // From Flaticon [Link icons created by Freepik - Flaticon](https://www.flaticon.com/authors/freepik)
    CLEANUP: 'https://cdn-icons-png.flaticon.com/512/2954/2954888.png', // From Flaticon [Clean icons created by Smashicons - Flaticon](https://www.flaticon.com/free-icons/clean)
}
// @imported_end{ICONS}

// @imported_begin{registerMenuCommand}
/**
 * Register a menu command in the userscript manager's menu (e.g., Tampermonkey, Greasemonkey, Violentmonkey).
 * @param {string} name The name of the menu command to display.
 * @param {() => void} callback The function to execute when the menu command is selected.
 */
const registerMenuCommand = (name, callback) => {
    GM.registerMenuCommand(name, callback);
}
// @imported_end{registerMenuCommand}

// @imported_begin{createSsmGenericPanel}
/**
 * Creates a generic panel
 * @param {string} localName The local storage name
 * @param {string} sectionName The section name within the panel
 * @param {()=>Promise<HTMLElement[]>} getPanelContent The function to get the panel content
 * @param {Object} [options] Additional options
 * @param {(newPosition: string) => void} [options.onPanelPositionChanged] A callback called when the panel position changes
 * @param {(swapGenericPanel: () => void) => void} [options.setSwapGenericPanelFunction] A function to get the swap generic panel function, which can be used to toggle the panel visibility
 */
const createSsmGenericPanel = async (localName, sectionName, getPanelContent, options) => {
    if (!options) {
        options = {};
    }
    const PANEL_POSITION = {
        RIGHT: 'right',
        LEFT: 'left',
        MINI: 'mini',
        NONE: 'none',
    }

    let panelPosition = await getSsmHookableValueMonkeyGetSet(localName, 'panelPosition', PANEL_POSITION.RIGHT);

    const panel = getSsmValue(localName, 'panel', () => createElementExtended('div', {
        style: {
            position: 'fixed',
            top: '10px',
            right: panelPosition.value === PANEL_POSITION.LEFT ? 'unset' : '10px',
            left: panelPosition.value === PANEL_POSITION.LEFT ? '10px' : 'unset',
            display: panelPosition.value === PANEL_POSITION.NONE ? 'none' : 'block',
            zIndex: 2147483621,
            backgroundColor: 'white',
            border: '1px solid black',
            padding: '10px',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.5)',
            maxWidth: '250px',
            fontSize: '14px',
            fontFamily: 'Calibri, Helvetica, sans-serif',
            borderRadius: '5px',
            opacity: '0.8',
        },
        parent: document.body,
        children: [
            createElementExtended('span', {
                children: [
                    createIconLinkAction(
                        ICONS.LEFT,
                        'Move panel to the left',
                        async () => await panelPosition.setValue(PANEL_POSITION.LEFT),
                    ),
                    createIconLinkAction(
                        ICONS.RIGHT,
                        'Move panel to the right',
                        async () => await panelPosition.setValue(PANEL_POSITION.RIGHT),
                    ),
                    createIconLinkAction(
                        ICONS.SHRINK,
                        'Shrink panel',
                        async () => await panelPosition.setValue(PANEL_POSITION.MINI),
                    ),
                ],
                style: {
                    display: panelPosition.value === PANEL_POSITION.MINI ? 'none' : 'inline-block',
                },
                onCreated: (element) => panelPosition.register(async (newValue) => element.style.display = newValue === PANEL_POSITION.MINI ? 'none' : 'inline-block'),
            }),
            createElementExtended('span', {
                children: [
                    createIconLinkAction(
                        ICONS.GROW,
                        'Grow panel',
                        async () => await panelPosition.setValue(PANEL_POSITION.RIGHT),
                    ),
                ],
                style: {
                    display: panelPosition.value === PANEL_POSITION.MINI ? 'inline-block' : 'none',
                },
                onCreated: (element) => panelPosition.register(async (newValue) => element.style.display = newValue === PANEL_POSITION.MINI ? 'inline-block' : 'none'),
            }),
        ],
        onCreated: (panel) => {
            panel.subSections = {};
            panelPosition.register(async (newValue) => {
                panel.style.right = newValue === PANEL_POSITION.LEFT ? 'unset' : '10px';
                panel.style.left = newValue === PANEL_POSITION.LEFT ? '10px' : 'unset';
                panel.style.display = newValue === PANEL_POSITION.NONE ? 'none' : 'block';
            });
        },
    }));

    if (panel.subSections[sectionName]) {
        panel.subSections[sectionName].remove()
    }

    const sectionElement = createElementExtended('span', {
        children: await getPanelContent(),
        style: {
            display: panelPosition.value === PANEL_POSITION.MINI ? 'none' : 'block',
        },
        onCreated: (panelContent) => panelPosition.register(async (newValue) => panelContent.style.display = newValue === PANEL_POSITION.MINI ? 'none' : 'block'),
    })

    panel.subSections[sectionName] = sectionElement;

    const nextSectionKey = Object.keys(panel.subSections).sort((a, b) => a.localeCompare(b)).filter(key => sectionName.localeCompare(key) < 0)[0];

    if (nextSectionKey) {
        panel.insertBefore(sectionElement, panel.subSections[nextSectionKey]);
    } else {
        panel.appendChild(sectionElement);
    }

    const swapGenericPanel = async () => {
        panelPosition.value = (panelPosition.value === PANEL_POSITION.NONE) ? PANEL_POSITION.RIGHT : PANEL_POSITION.NONE;
    }

    registerMenuCommand('Show/Hide generic panel', async () => {
        if (swapGenericPanel) {
            await swapGenericPanel();
        }
    })

    if (options.onPanelPositionChanged) {
        panelPosition.register(options.onPanelPositionChanged);
    }
    if (options.setSwapGenericPanelFunction) {
        options.setSwapGenericPanelFunction(swapGenericPanel);
    }
}
// @imported_end{createSsmGenericPanel}

// @imported_begin{delay}
/**
 * @param {Number} timeout The timeout in ms
 * @param {Object} data The data to return after the timeout
 * @returns 
 */
const delay = (timeout, data) =>
    new Promise((resolve) =>
        setTimeout(() =>
            resolve(data), timeout
        )
    )
// @imported_end{delay}

// @main_begin{articles-summarize}
// Exemples pour test:
// * https://www.lemonde.fr/planete/article/2025/10/14/pollution-atmospherique-il-faut-reduire-les-emissions-humaines-pendant-les-tempetes-de-sable-selon-l-anses_6646592_3244.html
// * https://www.lemonde.fr/planete/article/2025/09/01/les-emissions-de-gaz-a-effet-de-serre-continuent-leur-progression-malgre-les-bons-chiffres-chinois_6637986_3244.html
// * https://www.lemonde.fr/planete/article/2025/10/14/pollution-atmospherique-il-faut-reduire-les-emissions-humaines-pendant-les-tempetes-de-sable-selon-l-anses_6646592_3244.html
// * https://www.liberation.fr/politique/reforme-des-retraites-493-deficit-ce-quil-faut-retenir-de-la-declaration-de-politique-general-de-sebastien-lecornu-20251014_6Q5XRISHGVAO5OT7HVTXF3RIQQ/
// * https://www.lefigaro.fr/conjoncture/taxe-sur-les-holdings-contribution-sur-les-hauts-revenus-les-premieres-mesures-du-budget-lecornu-devoilees-20251014
// * https://www.20minutes.fr/paris/4179419-20251015-si-seine-atteignant-9-10-paris-assiste-exercice-simulation-crue-ratp
// * https://www.leparisien.fr/economie/retraites/suspension-de-la-reforme-des-retraites-un-trimestre-de-moins-a-travailler-cest-toujours-bon-a-prendre-15-10-2025-PUMPIITUC5H2RAAPRYLK524CSQ.php
// * https://www.livescience.com/planet-earth/earthquakes/link-between-cascadia-and-san-andreas-fault-earthquakes-discovered-30-years-after-lost-vessel-stumbled-across-key-data
// * https://sciencepost.fr/des-archeologues-se-sont-mis-a-cuisiner-comme-neandertal-et-ont-decouvert-quelque-chose-de-troublant/

const siteInfos = [
    {
        domains: ["lemonde.fr"],
        hosts: [],
        toremove: [
            'figure',
            'section.catcher',
            'section.author',
            'section.article__reactions',
            'section.js-services-inread',
            'section.inread',
        ],
        article: '.article__content',
    },
    {
        domains: [],
        hosts: ["nouveau-europresse-com.bnf.idm.oclc.org", "nouveau-europresse-com.bpi.idm.oclc.org"],
        name: "europresse",
        toremove: [],
        article: '.docOcurrContainer',
    },
    {
        domains: ["liberation.fr"],
        hosts: [],
        toremove: [
            '.skAfM',
        ],
        article: 'article',
    },
    {
        domains: ["lefigaro.fr"],
        hosts: [],
        toremove: [
            'figure',
            '.fig-wrapper',
            '.fig-crosslinking',
            '.fig-free',
            '.fig-wrapper-follow-button',
            '.fig-tags',
            '.fig-sharebar',
            '.ext-player',
            '.fig-a11y-skip',
            '.a11y-hidden',
            '.fig-ad-content',
            '.fig-quote',
            '.fig-body-link',
            '.fig-table-contents',
        ],
        article: 'article',
    },
    {
        domains: ["20minutes.fr"],
        hosts: [],
        toremove: [
            'figure',
            'article header',
            '.c-ad-placeholder',
            '.c-link',
            '.c-read-also-banner',
            'article.o-paper__content footer',
        ],
        title: 'section header h1',
        abstract: 'section header span:last-child',
        article: 'article.o-paper__content',
    },
    {
        domains: ["leparisien.fr"],
        hosts: [],
        toremove: [
            '.dailymotion-suggestion_container',
            '.article-read-also_container',
            'figure',
        ],
        title: 'header h1',
        abstract: 'header .subheadline',
        article: '.article-section',
    },
    {
        domains: ["livescience.com"],
        hosts: [],
        toremove: [
            'aside',
            'figure',
            '.fancy-box',
            '.hero-image-wrapper',
            '.byline',
            '#article-body script',
            '.slice-container-newsletterForm',
            '.ad-unit',
            '.slice-container',
            '.imageGallery-wrapper',
            '.slice-container-imageGallery',
            '#article-body hr',
        ],
        title: '.news-article header h1',
        abstract: '.news-article header .byline-social .strapline',
        article: '#article-body',
    },
    {
        domains: ["sciencepost.fr"],
        hosts: [],
        toremove: [
            'figure',
        ],
        title: 'h1.entry-title',
        abstract: 'div.entry-content p strong:first-child',
        article: 'div.entry-content',
    },
    {
        domains: ["mediapart.fr"],
        hosts: ["www-mediapart-fr.bnf.idm.oclc.org", "www-mediapart-fr.bpi.idm.oclc.org"],
        name: "mediapart",
        toremove: [
            'figure',
            'aside',
        ],
        title: 'h1#page-title',
        abstract: 'p.news__heading__top__intro',
        article: '.news__body__center__article',
    },
]

const baseOptions = {
    language: 'English',
    prompts: [
        "Could you summarize the following article in {{language}} using a hierarchical bullet-point structure in Markdown?",
        "Please include bullet points at every level, including for main headings and subheadings.",
        "Only use bullet points—no extra characters—and make sure the hierarchy is clear through indentation.",
        "Do not add separators between sections; the bullet points alone should convey the structure.",
        "",
        "Here is the article:",
    ],
    llmEngines: [
        {
            name: "ChatGPT",
            url: "https://chatgpt.com/",
            domain: "chatgpt.com",
            icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABfUlEQVQ4ja3TPUiXURgF8N9rQQZ9SgmF0JAFgllB/fGDMAxpECGiIVqkoYIEIRpaguaWliDChkQcTGhKsZSioGwosqE1KoOUoCIdlMhquM8bL3/ERZ/p3ufeezjPOeeywsqW6K3FMRyN/RO8iPU8/i4HkKEHTRhBFc7jPRYwjTt4lz9YUwZwCGdwGYvowEfcxSg24CJe41sRIMMpXMcrzOEqBjCGE2jAPWzBPjyDigBoQRdexpw1QXsXBuPODG7gAHbmlHOATtwviPUb7diBB9iNT7iGrwGwtTjCSUxiHfZjNgS7gnGUcAHbg8WeWL/JGUzieIjzJ4TKz0TvlmRhCY9wsMjgA86iHrfxFkdwGG0h8MMAncVGbMZ4DrCAVmyTQvQDv0Kbp/gZI21CHRola6eKNL/ECJdQHXRPYwq1+Iz18bgfz5XVXgyjW/K8Hb3ok5JZgyEpbP+rPMr1OCfZVynZ14vvUioncFPhPyz1mbKgCs2SiFlo8VjKyOrVP+YNUzrWZGSLAAAAAElFTkSuQmCC",
        },
        {
            name: "Claude",
            url: "https://claude.ai/new",
            domain: "claude.ai",
            icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACZ0lEQVQ4jY2TzWvUVxiFn3N/k5mkCn4gVRQ/sRobSMUmoFbcqNBFF404TSLiRsFiNw2ETKybYKGOreDGhV10pZBoFMGCxT9AKKhIhNRkGhURTCgSWyyJE+d3TxdOJIlgPbvz3vM+773ce2GOSoW2zlJX+55pP9iTzw51tTXNzU0rzDRPOvJ1xiet+LPz+QQgeakDUrz2XoCVZ/onDb8Aa4fXJi2vq1qH9RDgQSG/arjQeqtUaNs/3ZMBuF9o254QOyqVTKfD5PEQs19ZPma4UrI+JHjg0bdfLpwi3ADqUfSsHWTEpNHuJBPvyLXN0ZwQbPmzq7UFe4XQwFRt7jxQD7qwoXipdxbgo2Lf3bSSbAYPyvF6EKsRj6M4brHMMbZgvgD+eJnWfD3z2Jpp3NMTShP3jyKKwLxquQzkgBSxDTMls8XQ4BCua6i7/XPhrYqMG54b/pH8AXASWDODX6nCskL3TPw9TXQuYzwU7NUxaGEgLlEkC8oZzGw9x1xF3HSIz5yGvzb90DeoOSFGuvPrU4dTmGbEciCpLt22dBn7swA7DIuQOzPTjU868nUTNeH71By1OSsBOAfaDCwH1mA3pnVx30YaKqXy8IanudGRN4CJbLiNqDhqJ3KzYRdSUZFRxHygUeLvZDL8ei99sPeT071Db66xqv0vxhc0JUlaIziRUWxV9MeWxioxdgDLbI0jX6xNyldnvQOAjacuDmQX/zs/OvTaOrS+2D9CUJNgrOGn/jHgG+HuGLK/VaIPvgUASMqvJHy4/se+15/H/lSKY9UBfUgHnC2/qAL/X6VC65GH37UvfVfmP/6zA9ZpeVnhAAAAAElFTkSuQmCC",
        },
        {
            name: "Mistal",
            url: "https://chat.mistral.ai/",
            domain: "mistral.ai",
            icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIUlEQVQ4jcWSsU4CURBFz112a0vEQk2gsdktpJaEioo/YKkt/ARt/AMb613/gMqaWgpoZRMlEbSkJr6xYYmBXUxsmGpy57w7k5kHhw7lyWcvundYUx6DWjJ5LIIX/fDaHF0PvRw/jW8B/LzosCbQwfRa2s50AdZx2EbyC6jwI45uPNmylkzSdefYmY7Awm16x8CMlrCWQQaka+1OZnXbhosnyJ0IvvqXdYBvtwrKsHIDOP12q+meOgDeX8B/DNKKFzQktXNBUrviBQ3WO9lrIGlZTUaZJ3+2geTPqskok7Tc4Rdx9ABgRhfsDDSWGBqsDN4ABOeCwIwrsAj0LjEA0LwXFl0HRHaSThoA8zicYtSLMB94Ln6vxa98aFj5Dz1o/ACvJ2CcRIlDwAAAAABJRU5ErkJggg==",
        },
    ],
};

const getGptInstructions = (options) => options.prompts.join('\n ').replace('{{language}}', options.language);

const getSiteInfo = () => {
    const domain = getDomain();
    const hostname = document.location.hostname;
    return siteInfos.find(siteInfo =>
        siteInfo.domains.includes(domain) ||
        siteInfo.hosts.includes(hostname)
    ) || null;
}

const cleanup = (siteInfo) => {
    siteInfo.toremove.map(p => getElements(p).map(x => x.remove()));
}

const cleanupArticle = async () => {
    const siteInfo = getSiteInfo();
    cleanup(siteInfo);
}

const COPY_TYPE = {
    CLIPBOARD: 'clipboard',
    ALERT: 'alert',
}

/**
 * Copy or display the text to the user depending on the copyType
 * @param {*} text The text to copy or display
 * @param {*} copyType The way to copy or display the text, can be 'clipboard' or 'alert'
 */
const copy = async (text, copyType) => {
    if (copyType === COPY_TYPE.CLIPBOARD) {
        await copyTextToClipboard(text);
    } else if (copyType === COPY_TYPE.ALERT) {
        alert(text);
    } else {
        await delay(0)
        console.error('Invalid copy type:', copyType);
    }
}

const copyPromptPrefix = async (copyType, options) => {
    const promptPrefix = getGptInstructions(options);
    await copy(promptPrefix, copyType);
}

const cleanupAndCopyArticle = async (copyType, options) => {
    const siteInfo = getSiteInfo();
    const mainArticle = getElements(siteInfo.article)[0];
    cleanup(siteInfo);
    const text = mainArticle.innerText
    const prompt = getGptInstructions(options) + '\n\n' + text;
    await copy(prompt, copyType);
}

const createPanel = async () => {
    const options = await monkeyGetSetOptions(baseOptions);

    await createSsmGenericPanel(
        'articles',
        'articles-summarize',
        async () => {
            return [
                ...options.llmEngines.map((engine) =>
                    createIconLink(engine.icon ? engine.icon : 'https://www.google.com/s2/favicons?sz=64&domain=' + engine.domain, engine.name, engine.url, async () => {
                        await cleanupAndCopyArticle(COPY_TYPE.CLIPBOARD, options);
                        openLinkInNewTab(engine.url);
                    })
                ),
                createElementExtended('hr'),
                createIconLink(
                    ICONS.CLEANUP,
                    'Cleanup',
                    '#',
                    async () => { cleanupArticle(); }
                ),
                createIconLink(
                    ICONS.TITLE,
                    'Copy prompt prefix',
                    '#',
                    async () => { await copyPromptPrefix(COPY_TYPE.CLIPBOARD, options); },
                    async () => { await copyPromptPrefix(COPY_TYPE.ALERT, options); }
                ),
                createIconLink(
                    ICONS.COPY,
                    'Copy prompt',
                    '#',
                    async () => { await cleanupAndCopyArticle(COPY_TYPE.CLIPBOARD, options); },
                    async () => { await cleanupAndCopyArticle(COPY_TYPE.ALERT, options); }
                ),
            ]
        },
    )
}

createPanel();
// @main_end{articles-summarize}

console.log(`End - ${script_id}`)
