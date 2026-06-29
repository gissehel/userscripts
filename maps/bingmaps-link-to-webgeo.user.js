// ==UserScript==
// @name        bingmaps-link-to-webgeo
// @namespace   https://github.com/gissehel/userscripts
// @version     20260605-193748-ff8c368
// @description bingmaps-link-to-webgeo
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       https://bing.com/maps
// @match       https://www.bing.com/maps
// @icon        https://webgiss.github.io/webgeo/earth-64.png
// @grant       none
// ==/UserScript==

const script_name = GM_info?.script?.name || 'no-name'
const script_version = GM_info?.script?.version || 'no-version'
const script_id = `${script_name} ${script_version}`
console.log(`Begin - ${script_id}`)


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

// @imported_begin{registerClickListener}
/**
 * Wrap addEventListener and removeEventListener using a pattern where the unregister function is returned for click events
 * @param {HTMLElement|EventTarget} eventTarget The object on which to register the event
 * @param {EventListenerOrEventListenerObject} callback The callback to call when the event is triggered
 * @param {boolean|AddEventListenerOptions=} options The options to pass to addEventListener
 * @returns {()=>{}} The unregister function
 */
const registerClickListener = (eventTarget, callback, options) => {
    return registerEventListener(eventTarget, 'click', (e) => {
        e.preventDefault()
        const result = callback(e)
        if (result === false) {
            return false
        }
        return true
    }, options);
}
// @imported_end{registerClickListener}

// @imported_begin{registerDomNodeMutated}
/**
 * Call the callback when the document change
 * Handle the fact that the callback can't be called while aleady being called (no stackoverflow). 
 * Use the register pattern thus return the unregister function as a result
 * @param {()=>Promise<void>} callback 
 * @param {Object} options
 * @param {HTMLElement} options.rootElement The root element to observe, default to document.documentElement
 * @return {()=>Promise<void>} The unregister function
 */
const registerDomNodeMutated = async (callback, options) => {
    let callbackInProgress = false

    options = options || {}
    const rootElement = options.rootElement || document.documentElement;

    const action = async () => {
        if (!callbackInProgress) {
            callbackInProgress = true
            await callback()
            callbackInProgress = false
        }
    }

    const mutationObserver = new MutationObserver(async (mutationsList, observer) => { await action() });
    await action()
    mutationObserver.observe(rootElement, { childList: true, subtree: true });

    return async () => mutationObserver.disconnect()
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
 * @param {(element: HTMLElement, options: {currentIteration: number, indexElement: number})=>Promise<void>} callback 
 * @param {(element: HTMLElement, options: {currentIteration: number})=>Promise<void>} [callbackOnNotHere] called when an element is not here anymore (not provided by the elementProvider anymore)
 */
const registerDomNodeMutatedUnique = async (elementProvider, callback, callbackOnNotHere) => {
    const domNodesHandled = new Map()
    let indexIteration = 0

    return registerDomNodeMutated(async () => {
        indexIteration++;
        let currentIteration = indexIteration
        let indexElement = 0
        for (let element of elementProvider()) {
            if (!domNodesHandled.has(element)) {
                domNodesHandled.set(element, {element, indexIteration: currentIteration})
                const result = await callback(element, {currentIteration, indexElement})
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
                await callbackOnNotHere(item.element, {currentIteration})
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

// @main_begin{bingmaps-link-to-webgeo}
registerDomNodeMutatedUnique(
    () => document.querySelectorAll('.top-right.subcontrol-container'),
    async (container) => {
        if (container.querySelectorAll('[aria-label="Pitch Control"]').length === 0) {
            return false
        }
        createElementExtended('div', {
            classnames: ['azure-maps-control-container', 'light'],
            parent: container,
            children: [
                createElementExtended('a', {
                    attributes: {
                        href: '#',
                    },
                    children: [
                        createElementExtended('img', {
                            attributes: {
                                src: 'https://webgiss.github.io/webgeo/earth-32.png',
                                width: '32px',
                                height: '32px',
                            },
                        })
                    ],
                    onCreated: (image) => {
                        registerClickListener(image, () => {
                            const bingPosition = Object.fromEntries(document.URL.split('?')[1].split('&').map(data => data.split('=')))
                            if (bingPosition) {
                                const [lat, lon] = bingPosition.cp.split('%7E')
                                const zoom = Number.parseInt(bingPosition.lvl)
                                openLinkInNewTab(`https://webgiss.github.io/webgeo/#map=${zoom}/${lat}/${lon}`)
                            }
                            return false;
                        })
                    },
                })
            ],
        })
        return true
    }
)
// @main_end{bingmaps-link-to-webgeo}

console.log(`End - ${script_id}`)
