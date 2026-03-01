// ==UserScript==
// @name        youtube-pip
// @namespace   https://github.com/gissehel/userscripts
// @version     20260227-160749-886a002
// @description youtube-pip
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       https://youtube.com/*
// @match       https://www.youtube.com/*
// @match       https://m.youtube.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant       none
// ==/UserScript==

const script_name = GM_info?.script?.name || 'no-name'
const script_version = GM_info?.script?.version || 'no-version'
const script_id = `${script_name} ${script_version}`
console.log(`Begin - ${script_id}`)


// @imported_begin{registerDomNodeMutated}
/**
 * Call the callback when the document change
 * Handle the fact that the callback can't be called while aleady being called (no stackoverflow). 
 * Use the register pattern thus return the unregister function as a result
 * @param {()=>()} callback 
 * @return {()=>{}} The unregister function
 */
const registerDomNodeMutated = (callback) => {
    let callbackInProgress = false

    const action = () => {
        if (!callbackInProgress) {
            callbackInProgress = true
            callback()
            callbackInProgress = false
        }
    }

    const mutationObserver = new MutationObserver((mutationsList, observer) => { action() });
    action()
    mutationObserver.observe(document.documentElement, { childList: true, subtree: true });

    return () => mutationObserver.disconnect()
}
// @imported_end{registerDomNodeMutated}

// @imported_begin{registerDomNodeMutatedUnique}
/**
 * Call the callback once per element provided by the elementProvider when the document change
 * Handle the fact that the callback can't be called while aleady being called (no stackoverflow). 
 * Use the register pattern thus return the unregister function as a result
 * 
 * Ensure that when an element matching the query elementProvider, the callback is called with the element 
 * exactly once for each element
 * @param {()=>[HTMLElement]} elementProvider 
 * @param {(element: HTMLElement, options: {currentIteration: number, indexElement: number})=>{}} callback 
 * @param {(element: HTMLElement, options: {currentIteration: number})=>{}} [callbackOnNotHere] called when an element is not here anymore (not provided by the elementProvider anymore)
 */
const registerDomNodeMutatedUnique = (elementProvider, callback, callbackOnNotHere) => {
    const domNodesHandled = new Map()
    let indexIteration = 0

    return registerDomNodeMutated(() => {
        indexIteration++;
        let currentIteration = indexIteration
        let indexElement = 0
        for (let element of elementProvider()) {
            if (!domNodesHandled.has(element)) {
                domNodesHandled.set(element, {element, indexIteration: currentIteration})
                const result = callback(element, {currentIteration, indexElement})
                if (result === false) {
                    domNodesHandled.delete(element)
                }
            } else {
                domNodesHandled.get(element).indexIteration = currentIteration
            }
            indexElement++;
        }
        for (let item of domNodesHandled.values().filter(item=>item.indexIteration !== currentIteration)) {
            if (callbackOnNotHere) {
                callbackOnNotHere(item.element, {currentIteration})
            }
            domNodesHandled.delete(item.element)
        }
    })
}
// @imported_end{registerDomNodeMutatedUnique}

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

// @imported_begin{addStyle}
/**
 * Add a new css string to the page
 * 
 * @param {string} styleText The CSS string to pass
 * @returns {void}
 */
 const addStyle = (() => {
    let styleElement = null;
    let styleContent = null;

    /**
     * Add a new css string to the page
     * 
     * @param {string} styleText The CSS string to pass
     * @returns {void}
     */
    return (styleText) => {
        if (styleElement === null) {
            styleElement = document.createElement('style');
            styleContent = "";
            document.head.appendChild(styleElement);
        } else {
            styleContent += "\n";
        }

        styleContent += styleText;
        styleElement.textContent = styleContent;
    };
})();
// @imported_end{addStyle}

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

// @main_begin{youtube-pip}
registerDomNodeMutatedUnique(() => [
    ...getElements('#buttons.ytd-masthead'),
    ...getElements('#actions-inner>#menu>ytd-menu-renderer'),
    // ...getElements('.slim-video-action-bar-actions'),
    ...getElements('ytm-slim-owner-renderer'),
], (buttons) => {
    if (buttons && buttons.childElementCount >= 1) {
        const subbuttons = getSubElements(buttons, '.pip-text-button')
        if (subbuttons.length > 0) {
            return false
        }
        const pipButton = createElementExtended('div', {
            attributes: {
                title: 'Picture in Picture',
                'use-keyboard-focused': '',
                'is-icon-button': '',
                'has-no-text': '',
            },
            classList: ['style-scope', 'ytd-masthead', 'style-default'],
            children: [
                createElementExtended('a', {
                    attributes: {
                        'aria-label': 'Picture in Picture',
                        'href': '#',
                    },
                    classnames: ['pip-link-button'],
                    children: [
                        createElementExtended('div', {
                            attributes: {
                                'icon': 'PiP',
                            },
                            text: 'PiP',
                            classnames: ['style-scope', 'ytd-topbar-menu-button-renderer', 'pip-text-button'],
                        }),
                    ],
                    onCreated: (element) => {
                        bindOnClick(element, () => {
                            const video = getElements('video')[0]
                            if (video) {
                                video.requestPictureInPicture()
                            }
                            return true
                        })
                    },
                })
            ],
            parent: buttons,
        })
        return false
    } else {
        return false
    }
})

addStyle(`.pip-text-button { width: 36px; height: 36px; text-align: center; alignment-baseline: middle; line-height: 36px; color: #0f0f0f; background-color: #f0f0f0; border-radius: 50%; font-weight: bold; margin-left: 5px; }`)
addStyle(`.pip-link-button { text-decoration: none; }`)

// Disable stopping the video when tab changes
document.addEventListener("visibilitychange", (e) => { e.stopImmediatePropagation(); }, true);
// @main_end{youtube-pip}

console.log(`End - ${script_id}`)
