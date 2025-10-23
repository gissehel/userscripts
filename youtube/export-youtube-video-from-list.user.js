// ==UserScript==
// @name        export-youtube-video-from-list
// @namespace   https://github.com/gissehel/userscripts
// @version     3.0.9
// @description Export youtube video information in markdown format
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       https://www.youtube.com/*
// @match       https://youtube.com/*
// @icon        https://www.youtube.com/favicon.ico
// @grant       none
// ==/UserScript==

const script_name = GM_info?.script?.name || 'no-name'
const script_version = GM_info?.script?.version || 'no-version'
const script_id = `${script_name} ${script_version}`
console.log(`Begin - ${script_id}`)


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

// @imported_begin{bindOnClick}
/**
 * Bind an onClick handler an element. Returns uninstall handler
 * 
 * @param {HtmlElement} element The element to bind the handler
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
    element.addEventListener('click', onClick, true);

    return () => {
        element.removeEventListener('click', onClick, true);
    }
}
// @imported_end{bindOnClick}

// @main_begin{export-youtube-video-from-list}
addStyle('.eyvfl-button { width: 44px; height: 30px; position: absolute; bottom: 0px; padding-inline-start: 3px; padding-inline-end: 3px; }')
addStyle('.eyvfl-export-button { right: 0px; }')
addStyle('.eyvfl-export-button2 { right: 50px; }')
addStyle('.eyvfl-export-button-interval { right: 100px; }')
addStyle('.eyvfl-mode-set .eyvfl-export-button-interval { background-color: #f0f0d0 !important; }')

HTMLElement.prototype.q=function(data) { return getSubElements(this, data) }
const q = (data) => getSubElements(data)
HTMLElement.prototype.titleOrContent = function() {
    if (this.title && this.title != '') {
        return this.title
    }
    return this.textContent 
}
const isShort = () => document.location.pathname.endsWith('/shorts')

const getVideoTitleShort = (richItemRenderer) => richItemRenderer.q('h3 [role=text]')?.map(e=>e.textContent)?.join('')
const getVideoTitleLong = (richItemRenderer) => richItemRenderer.q('#video-title-link')?.at(0)?.q('#video-title')?.slice(-1)?.at(0)?.titleOrContent()
const getVideoLinkShort = (richItemRenderer) => richItemRenderer.q('a')?.at(0)?.href
const getVideoLinkLong = (richItemRenderer) => getSubElements(richItemRenderer, 'a#thumbnail')?.at(0)?.href
const getVideoContentShort = (link) => link
const getVideoContentLong = (link) => `{{video ${link}}}`

const getShortLong = (shortFun, longFun) => (...args) => isShort() ? shortFun(...args) : longFun(...args)

const getVideoTitle = getShortLong(getVideoTitleShort, getVideoTitleLong)
const getVideoLink = getShortLong(getVideoLinkShort, getVideoLinkLong)
const getVideoContent = getShortLong(getVideoContentShort, getVideoContentLong)

let buffer = ''
const elementCache = {}
const addBufferOnElement = (richItemRenderer, preAction) => {
    const videoTitle = getVideoTitle(richItemRenderer)
    const videoLink = getVideoLink(richItemRenderer)
    const videoContent = getVideoContent(videoLink)

    if (preAction !== undefined) {
        preAction()
    }
    const markdown = `- TODO ${videoTitle}\n  collapsed:: true\n  - ${videoContent}\n`
    buffer += markdown
}

let itemId = 0
let itemIdSet = null

registerDomNodeMutatedUnique(() => getElements('ytd-rich-item-renderer'), (richItemRenderer) => {
    const videoTitle = getVideoTitle(richItemRenderer)
    const videoLink = getVideoLink(richItemRenderer)
    if ((videoTitle === undefined) || (videoLink === undefined) || (videoTitle === '') || (videoLink === '')) {
        return false
    }

    itemId++
    elementCache[itemId] = richItemRenderer
    const localItemId = itemId

    const buttonCreator = (label, classnames, preAction) => createElementExtended('button', {
        parent: richItemRenderer,
        classnames: classnames,
        text: label,
        onCreated: (button) => {
            bindOnClick(button, () => {
                addBufferOnElement(richItemRenderer, preAction)
                console.log(`Copying [${buffer}]`)
                copyTextToClipboard(buffer)
            })
        }
    })

    buttonCreator('➡️📋', ['eyvfl-button', 'eyvfl-export-button'], () => buffer = '')
    buttonCreator('➕📋', ['eyvfl-button', 'eyvfl-export-button2'])
    createElementExtended('button', {
        parent: richItemRenderer,
        classnames: ['eyvfl-button', 'eyvfl-export-button-interval'],
        text: '↔️📋',
        onCreated: (button) => {
            bindOnClick(button, () => {
                buffer = ''
                if (itemIdSet === null) {
                    itemIdSet = localItemId
                    document.body.classList.add('eyvfl-mode-set')
                } else {
                    if (itemIdSet !== localItemId) {
                        let step = 1
                        if (itemIdSet > localItemId) {
                            step = -1
                        }
                        for (let currentItemId = itemIdSet; currentItemId*step <= localItemId*step; currentItemId+=step) {
                            addBufferOnElement(elementCache[currentItemId])
                        }
                        
                    }
                    itemIdSet = null
                    document.body.classList.remove('eyvfl-mode-set')
                }
                console.log(`Copying [${buffer}]`)
                copyTextToClipboard(buffer)
            })
        }
    })
})
// @main_end{export-youtube-video-from-list}

console.log(`End - ${script_id}`)
