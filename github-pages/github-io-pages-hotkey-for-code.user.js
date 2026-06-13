// ==UserScript==
// @name        github-io-pages-hotkey-for-code
// @namespace   https://github.com/gissehel/userscripts
// @version     20260206-195947-93cadaf
// @description github-io-pages-hotkey-for-code
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       https://*.github.io/
// @match       https://*.github.io/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant       none
// ==/UserScript==

const script_name = GM_info?.script?.name || 'no-name'
const script_version = GM_info?.script?.version || 'no-version'
const script_id = `${script_name} ${script_version}`
console.log(`Begin - ${script_id}`)


// @imported_begin{addOnKey}
/**
 * Add a key binding on an element (or on the current page if not provided).
 * 
 * @param {Object} param 
 * @param {()=>{}} param.action The action to perform when the key is pressed.
 * @param {HTMLElement} param.element The element on which to listen for the key event. (default: document.body)
 * @param {Key} param.key The key to listen for. (example: { code: "KeyA", ctrlKey: true } for Ctrl + A)
 * @param {PhaseName} param.phase The phase to listen for the key event. (default: "down", may be "down" or "up")
 * @returns {()=>{}|undefined} A function to remove the key binding, or undefined if the binding was not added.
 */
const addOnKey = (() => {
    const normalizeBool = (data) => data ? true : false;

    /**
     * @typedef {{ code: string, ctrlKey: boolean?, shiftKey: boolean?, altKey: boolean?, metaKey: boolean?, isComposing: boolean? }} Key
     */

    /**
     * 
     * @param {Key} e
     * @returns {string}
     */
    const getHashFromKey = (e) => {
        const code = e.code;
        let { ctrlKey, shiftKey, altKey, metaKey, isComposing } = e;
        [ctrlKey, shiftKey, altKey, metaKey, isComposing] = [ctrlKey, shiftKey, altKey, metaKey, isComposing].map(normalizeBool);
        return `${code};${ctrlKey};${shiftKey};${altKey};${metaKey};${isComposing}`;
    };

    /**
     * @typedef {"up"|"down"} PhaseName
     */

    /**
     * @typedef {{[phaseName:string]: RegisteredKeysForPhase}} RegisteredKeys
     */

    /**
     * @typedef {{ list: KeyBindingItem[], byKeys: Object.<string, KeyBindingItem[]>, eventListener: (e:KeyboardEvent) => {} }} RegisteredKeysForPhaseForElement
     */

    /**
     * @typedef {{ key: Key, hash: string, element: HTMLElement, phase: PhaseName, action: ()=>{}, remove: ()=>{}?}} KeyBindingItem
     */

    /**
     * @typedef {Map<HTMLElement, RegisteredKeysForPhaseForElement>} RegisteredKeysForPhase
     */

    /**
     * @typedef {Map<string, string>} RegisteredKeysForPhase
     */

    /** @type{RegisteredKeys} */
    const registeredKeys = {
        'up': null,
        'down': null,
    };

    /**
     * @type {Object.<string, PhaseName>}
     */
    const typeToKeyIndex = {
        'keydown': 'down',
        'keyup': 'up',
    };

    /**
     * 
     * @param {HTMLElement} element 
     * @returns {(e:KeyboardEvent) => {}}
     */
    const onKeyGenerator = (element) => (e) => {
        let phase = typeToKeyIndex[e.type];
        if (phase) {
            const hash = getHashFromKey(e);
            const registeredKeysForPhase = registeredKeys[phase];
            if (registeredKeysForPhase) {
                const registeredKeysForPhaseElement = registeredKeysForPhase.get(element);
                if (registeredKeysForPhaseElement) {
                    const items = registeredKeysForPhaseElement.byKeys[hash];
                    if (items) {
                        items.forEach((item) => item.action());
                    }
                }
            }
        }
    };

    /**
     * Remove an element from an array
     * 
     * @template{T}
     * @param {T[]} array 
     * @param {T} item 
     */
    const removeElementFromArray = (array, item) => {
        if (array) {
            const index = array.indexOf(item);
            if (index >= 0) {
                array.splice(index, 1);
            }
        }
    };

    /**
     * 
     * @param {KeyBindingItem} item 
     */
    const removeOnKey = (item) => {
        const { hash, element, phase } = item;
        const registeredKeysForPhase = registeredKeys[phase];
        if (registeredKeysForPhase) {
            const registeredKeysForPhaseElement = registeredKeysForPhase.get(element);
            if (registeredKeysForPhaseElement) {
                removeElementFromArray(registeredKeysForPhaseElement.byKeys[hash], item);
                removeElementFromArray(registeredKeysForPhaseElement.list, item);
                if (registeredKeysForPhaseElement.list.length === 0) {
                    element.removeEventListener(`key${phase}`, registeredKeysForPhaseElement.eventListener, false);
                    registeredKeysForPhase.delete(element);
                }
            }
        }
    };

    /**
     * Add a key binding on an element (or on the current page if not provided).
     * 
     * @param {Object} param 
     * @param {()=>{}} param.action The action to perform when the key is pressed.
     * @param {HTMLElement} param.element The element on which to listen for the key event. (default: document.body)
     * @param {Key} param.key The key to listen for. (example: { code: "KeyA", ctrlKey: true } for Ctrl + A)
     * @param {PhaseName} param.phase The phase to listen for the key event. (default: "down", may be "down" or "up")
     * @returns {()=>{}|undefined} A function to remove the key binding, or undefined if the binding was not added.
     */
    const addOnKey = ({ action, element, key, phase }) => {
        if (!action) {
            return;
        }
        if (!key) {
            return;
        }
        if (!element) {
            element = document.body;
        }
        if (!phase) {
            phase = 'down';
        }
        let registeredKeysForPhase = registeredKeys[phase];
        if (registeredKeysForPhase === undefined) {
            return;
        }
        if (registeredKeysForPhase === null) {
            registeredKeys[phase] = new Map();
            registeredKeysForPhase = registeredKeys[phase];
        }
        if (!registeredKeysForPhase.get(element)) {
            registeredKeysForPhase.set(element, { list: [], byKeys: {}, eventListener: null });
        }
        const registeredKeysForPhaseElement = registeredKeysForPhase.get(element);
        const hash = getHashFromKey(key);
        /** @type{KeyBindingItem} */
        const item = { key, hash, element, phase, action };
        item.remove = () => removeOnKey(item);
        if (registeredKeysForPhaseElement.list.length === 0) {
            registeredKeysForPhaseElement.eventListener = onKeyGenerator(element);
            element.addEventListener(`key${phase}`, registeredKeysForPhaseElement.eventListener, false);
        }
        registeredKeysForPhaseElement.list.push(item);
        if (!registeredKeysForPhaseElement.byKeys[hash]) {
            registeredKeysForPhaseElement.byKeys[hash] = [];
        }
        registeredKeysForPhaseElement.byKeys[hash].push(item);
        return item.remove;
    };

    return addOnKey;
})();
// @imported_end{addOnKey}

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

// @main_begin{github-io-pages-hotkey-for-code}
const pageEnding = '.github.io'

const findRepo = (url) => {
    const match = url.match(/^https?:\/\/([^/]+)\/([^/]+)/);
    if (match) {
        const host = match[1];
        const project = match[2];
        if (host && host.endsWith(pageEnding)) {
            const user = host.slice(0, -pageEnding.length);
            return `https://github.com/${user}/${project}`
        }
    }
    return null;
}

const findMainRepo = (url) => {
    const match = url.match(/^https?:\/\/([^/]+)/);
    if (match) {
        const host = match[1];
        if (host && host.endsWith(pageEnding)) {
            const user = host.slice(0, -pageEnding.length);
            return `https://github.com/${user}/${host}`
        }
    }
    return null;
}

const actionUsingUrlGetter = (urlGetter) => {
    const url = urlGetter(document.location.href)
    if (url) {
        openLinkInNewTab(url)
    }
    return true;
}

const action = () => actionUsingUrlGetter(findRepo);
const actionForMainRepo = () => actionUsingUrlGetter(findMainRepo);

const element = document.body;
const key = { code: 'KeyG', altKey: true };
const keyForMainRepo = { code: 'KeyG', altKey: true, shiftKey: true };
const phase = 'down';
addOnKey({action, element, key, phase})
addOnKey({action: actionForMainRepo, element, key: keyForMainRepo, phase})
// @main_end{github-io-pages-hotkey-for-code}

console.log(`End - ${script_id}`)
