// ==UserScript==
// @name        wplace-cross-on-paint
// @namespace   https://github.com/gissehel/userscripts
// @version     20260227-160749-886a002
// @description WPlace cross on paint ❌🌍
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       https://wplace.live/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=wplace.live
// @grant       none
// @license     MIT
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

// @main_begin{wplace-cross-on-paint}
const semifatness = 1

const map = getElements('#map')[0]

const createCrossPart = (partname) =>
    createElementExtended('div', {
        classnames: ['wplace-cross-on-paint', `wplace-cross-on-paint-${partname}`],
        parent: map
    })


const crossX = createCrossPart('x')
const crossY = createCrossPart('y')

addStyle(`
    .wplace-cross-on-paint { position: absolute; z-index: 1000; pointer-events: none; user-select: none; background-color: yellow; mix-blend-mode: difference; }
    .wplace-cross-on-paint-x { width: ${2*semifatness+1}px; height: 100%; }
    .wplace-cross-on-paint-y { width: 100%; height: ${2*semifatness+1}px; }
    .wplace-cross-disabled { display: none; }
`)

let enabled = true

let lastId = null
let nextId = null
let lastTime = null
let buttonCross = null

const delay = 20

const toggleCross = () => {
    enabled = !enabled
    if (enabled) {
        crossX.classList.remove('wplace-cross-disabled')
        crossY.classList.remove('wplace-cross-disabled')
        if (buttonCross) {
            buttonCross.classList.add('btn-primary', 'btn-soft')
            buttonCross.classList.remove('text-base-content/80')
        }
    } else {
        crossX.classList.add('wplace-cross-disabled')
        crossY.classList.add('wplace-cross-disabled')
        if (buttonCross) {
            buttonCross.classList.remove('btn-primary', 'btn-soft')
            buttonCross.classList.add('text-base-content/80')
        }
    }
}

const updateCross = (e, rect, randomId) => {
    if (!enabled) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    crossX.style.left = `${x+semifatness}px`
    crossY.style.top = `${y+semifatness}px`
    lastId = randomId
    lastTime = Date.now()
}

registerEventListener(map, 'mousemove', (e) => {
    if (!enabled) return
    const randomId = Math.floor(Math.random() * 1000000000)
    const currentTime = Date.now()
    nextId = randomId
    const rect = map.getBoundingClientRect()

    if (lastTime && (currentTime - lastTime) < delay) {
        setTimeout(() => {
            if (nextId === randomId && lastId !== randomId) {
                updateCross(e, rect, randomId)
            }
        }, delay)
    } else {
        updateCross(e, rect, randomId)
    }
})

registerEventListener(document, 'keydown', (e) => {
    if (e.key === 'c' && (e.altKey && !e.metaKey && !e.ctrlKey && !e.shiftKey)) {
        toggleCross()
    }
})

const createCrossButton = (container, config) => {
    const parent = container.parentElement;
    if (!parent) return;

    buttonCross = document.createElement('button');
    buttonCross.className = 'btn btn-lg sm:btn-xl btn-square shadow-md btn-primary btn-soft ml-2 z-30';
    buttonCross.title = 'Enable/Disable cross on paint';
    buttonCross.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-64 -64 128 128" fill="currentColor" class="size-5">
            <path d="M 6 6 64 6 64 -6 6 -6 6 -64 -6 -64 -6 -6 -64 -6 -64 6 -6 6 -6 64 6 64 Z"/>
        </svg>
    `;
    buttonCross.addEventListener('click', () => toggleCross());
    parent.appendChild(buttonCross);
    console.log('❌ Cross button added');
}

const buttonConfigs = [
    {
        id: 'favorite-btn',
        selector: `[title="Enable/Disable cross on paint"]`,
        containerSelector: 'button[title="Toggle art opacity"]',
        create: createCrossButton
    },
];

const startButtonObserver = (configs) => {
    const ensureButtons = () => {
        configs.forEach(config => {
            if (!document.querySelector(config.selector)) {
                const container = document.querySelector(config.containerSelector);
                if (container) {
                    config.create(container, config);
                }
            }
        });
    };

    // Observe DOM changes
    const observer = new MutationObserver(() => {
        setTimeout(ensureButtons, 100);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial placement & periodic check
    setTimeout(ensureButtons, 1000);
    setInterval(ensureButtons, 5000);
}


startButtonObserver(buttonConfigs);
// @main_end{wplace-cross-on-paint}

console.log(`End - ${script_id}`)
