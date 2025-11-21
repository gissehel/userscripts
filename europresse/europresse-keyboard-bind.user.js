// ==UserScript==
// @name        europresse-keyboard-bind
// @namespace   https://github.com/gissehel/userscripts
// @version     1.0.12
// @description europresse-keyboard-bind
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       https://nouveau-europresse-com.*.idm.oclc.org/*
// @icon        https://www.europresse.com/app/uploads/2023/07/favicon-europress.svg
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
 * @param {(element: HTMLElement)=>{}} callback 
 */
const registerDomNodeMutatedUnique = (elementProvider, callback) => {
    const domNodesHandled = new Set()

    return registerDomNodeMutated(() => {
        for (let element of elementProvider()) {
            if (!domNodesHandled.has(element)) {
                domNodesHandled.add(element)
                const result = callback(element)
                if (result === false) {
                    domNodesHandled.delete(element)
                }
            }
        }
    })
}
// @imported_end{registerDomNodeMutatedUnique}

// @imported_begin{registerEventListener}
/**
 * Wrap addEventListener and removeEventListener using a pattern where the unregister function is returned
 * 
 * @param {HTMLElement|EventTarget} element The object on which to register the event
 * @param {string} eventType The event type
 * @param {EventListenerOrEventListenerObject} callback The callback to call when the event is triggered
 * @param {boolean|AddEventListenerOptions=} options The options to pass to addEventListener
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
HTMLElement.prototype.registerEventListener = function (type, callback, options) { return registerEventListener(this, type, callback, options); }
EventTarget.prototype.registerEventListener = function (type, callback, options) { return registerEventListener(this, type, callback, options); }
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

// @imported_begin{createElementExtended}
/**
 * Create a new element, and add some properties to it
 * 
 * @param {string} name The name of the element to create
 * @param {object} params The parameters to tweek the new element
 * @param {object.<string, string>} params.attributes The propeties of the new element
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
        prevSibling.parentElement.insertBefore(element, prevSibling.nextSibling)
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

// @imported_begin{downloadDataUrl}
/**
 * Downloads a data url as a file
 * 
 * @param {String} url The data url to download
 * @param {String} filename The filename to use to save the file
 * @returns
 */
const downloadDataUrl = async (url, filename) => {
    const a = createElementExtended('a', {
        attributes: {
            href: url,
            target: '_blank',
            download: filename,
        },
    })
    a.click()
}
// @imported_end{downloadDataUrl}

// @main_begin{europresse-keyboard-bind}
const getKeyKey = ({ code, key, ctrlKey, shiftKey, altKey, metaKey }) => {
    return `${code}|${key}|${ctrlKey ? '1' : '0'}|${shiftKey ? '1' : '0'}|${altKey ? '1' : '0'}|${metaKey ? '1' : '0'}`
}

const removePx = (x) => {
  if (x.substr(-2) == "px") { return x.substr(0, x.length-2) } else { return x }
}

registerDomNodeMutatedUnique(() => getElements('#currentDoc.panel'), (close_button) => {
    const next_button = getElements('#nextPdf')[0]
    const prev_button = getElements('#prevPdf')[0]
    const zoom_in_button = getElements('#zoomin')[0]
    const zoom_out_button = getElements('#zoomout')[0]
    const reset_zoom_button = getElements('#reset')[0]
    const pdf_pages_panel_btn = getElements('span.pdf-pages-panel-btn')[0]
    const downloadImage = () => downloadDataUrl(getElements('.imagePdf')[0].src, `europresse-${_docNameList[_docIndex]}`)
    const moveDirection = (attrName, delta) => {
        const viewer = getElements('img.viewer-move')[0];
        if (viewer) {
            viewer.style[attrName] = `${Number(removePx(viewer.style[attrName]))+delta}px` 
        }

    };
    const next_action = () => next_button.click();
    const prev_action = () => prev_button.click();
    const zoom_in_action = () => zoom_in_button.click();
    const zoom_out_action = () => zoom_out_button.click();
    const reset_zoom_action = () => reset_zoom_button.click();
    const togglePdfPagesPanel = () => pdf_pages_panel_btn.click();
    const moveLeft = () => moveDirection('marginLeft', -10);
    const moveRight = () => moveDirection('marginLeft', 10);
    const moveUp = () => moveDirection('marginTop', -10);
    const moveDown = () => moveDirection('marginTop', 10);
    const actions = {
    }
    const addAction = (action, ...keyStructs ) => {
        keyStructs.forEach( (keyStruct) => {
            actions[getKeyKey(keyStruct)] = action
        })
    }
    addAction(zoom_in_action,
        { key: 'ArrowDown', shiftKey: true },
        { key: 'j' },
        { key: '+' },
        { key: '+', shiftKey: true },
        { code: 'Numpad2' },
    )
    addAction(zoom_out_action,
        { key: 'ArrowUp', shiftKey: true },
        { key: 'k' },
        { key: '-' },
        { key: '-', shiftKey: true },
        { code: 'Numpad8' },
    )
    addAction(next_action,
        { key: 'l' },
        { key: 'ArrowRight', shiftKey: true },
        { code: 'Space' },
        { code: 'Numpad6' },
    )
    addAction(prev_action,
        { key: 'h' },
        { key: 'ArrowLeft', shiftKey: true },
        { key: 'Backspace' },
        { code: 'Numpad4' },
    )
    addAction(reset_zoom_action,
        { key: 'r' },
        { code: 'Numpad5' },
        { code: 'Numpad0' },
    )
    addAction(downloadImage,
        { key: 's' },
        { key: '/' },
    )
    addAction(togglePdfPagesPanel,
        { key: 'p' },
        { key: '*' },
    )
    addAction(moveUp,
        { key: 'ArrowDown' },
    )
    addAction(moveDown,
        { key: 'ArrowUp' },
    )
    addAction(moveLeft,
        { key: 'ArrowRight' },
    )
    addAction(moveRight,
        { key: 'ArrowLeft' },
    )

    registerEventListener(document.body, 'keydown', (event) => {
        let result = false;
        ['code','key'].forEach((prop) => {
            
            const {code, key, ctrlKey, shiftKey, altKey, metaKey} = event
            const keyKey = getKeyKey({ code, key, ctrlKey, shiftKey, altKey, metaKey, [prop]: undefined })
            console.log('keyKey', keyKey)
            if (actions[keyKey]) {
                actions[keyKey]()
                result = true
            }
        })
        return result
    })
})
// @main_end{europresse-keyboard-bind}

console.log(`End - ${script_id}`)
