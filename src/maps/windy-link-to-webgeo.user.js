// ==UserScript==
// @name         windy-link-to-webgeo
// @namespace    https://github.com/gissehel/userscripts
// @version      1.0.1
// @description  windy-link-to-webgeo
// @author       gissehel
// @homepage     https://github.com/gissehel/userscripts
// @supportURL   https://github.com/gissehel/userscripts/issues
// @match        https://www.windy.com/*
// @match        https://windy.com/*
// @icon         https://webgiss.github.io/webgeo/earth-64.png
// @grant        none
// ==/UserScript==

(() => {
    const script_name = GM_info?.script?.name || 'no-name'
    const script_version = GM_info?.script?.version || 'no-version'
    const script_id = `${script_name} ${script_version}`
    console.log(`Begin - ${script_id}`)

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

    /**
     * Wrap addEventListener and removeEventListener using a pattern where the unregister function is returned
     * @param {EventTarget} eventTarget The object on which to register the event
     * @param {string} eventType The event type
     * @param {EventListenerOrEventListenerObject} callback The callback to call when the event is triggered
     * @param {boolean|AddEventListenerOptions=} options The options to pass to addEventListener
     */
    const registerEventListener = (eventTarget, eventType, callback, options) => {
        if (eventTarget.addEventListener) {
            eventTarget.addEventListener(eventType, callback, options);
        }
        return () => {
            if (eventTarget.removeEventListener) {
                eventTarget.removeEventListener(eventType, callback, options);
            }
        }
    }

    /**
     * Wrap addEventListener and removeEventListener using a pattern where the unregister function is returned for click events
     * @param {EventTarget} eventTarget The object on which to register the event
     * @param {EventListenerOrEventListenerObject} callback The callback to call when the event is triggered
     * @param {boolean|AddEventListenerOptions=} options The options to pass to addEventListener
     * @returns 
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

    /**
     * Add a DOMNodeInserted on the document. 
     * Handle the fact that the callback can't be called while aleady being called (no stackoverflow). 
     * Use the register pattern thus return the unregister function as a result
     * @param {EventListener} callback 
     * @return {()=>{}} The unregister function
     */
    const registerDomNodeInserted = (callback) => {
        let nodeChangeInProgress = false

        /** @type{EventListener} */
        const onNodeChanged = (e) => {
            if (!nodeChangeInProgress) {
                nodeChangeInProgress = true
                callback(e)
                nodeChangeInProgress = false
            }

        }
        document.documentElement.addEventListener('DOMNodeInserted', onNodeChanged, false);
        onNodeChanged()
        return () => {
            document.documentElement.removeEventListener('DOMNodeInserted', onNodeChanged, false);
        }
    }

    /**
     * Add a DOMNodeInserted on the document. 
     * Handle the fact that the callback can't be called while aleady being called (no stackoverflow). 
     * Use the register pattern thus return the unregister function as a result
     * 
     * Ensure that when an element matching the query elementProvider, the callback is called with the element 
     * exactly once for each element
     * @param {()=>[HTMLElement]} elementProvider 
     * @param {(element: HTMLElement)=>{}} callback 
     */
    const registerDomNodeInsertedUnique = (elementProvider, callback) => {
        const domNodesHandled = new Set()

        return registerDomNodeInserted(() => {
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
        const { attributes, text, children, parent, classnames, id, prevSibling, nextSibling, onCreated } = params
        if (attributes) {
            for (let attributeName in attributes) {
                element.setAttribute(attributeName, attributes[attributeName])
            }
        }
        if (text) {
            element.textContent = text;
        }
        if (children) {
            for (let child of children) {
                element.appendChild(child)
            }
        }
        if (parent) {
            parent.appendChild(element)
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

    registerDomNodeInsertedUnique(() => [...document.body.querySelectorAll('#overlay')], (overlay) => {
        const toggleOverlays = overlay.querySelector('[data-do=toggleOverlays]')
        if (!toggleOverlays) {
            return false
        }
        createElementExtended('a', {
            attributes: {
                href: '#',
            },
            children: [
                createElementExtended('img', {
                    attributes: {
                        src: 'https://webgiss.github.io/webgeo/earth-16.png',
                        width: '16',
                        height: '16',
                    },
                    classnames: ['webgeo-icon', 'iconfont', 'notap'],
                }),
                createElementExtended('span', {
                    text: 'WebGeo',
                    classnames: ['menu-text', 'notap'],
                }),
            ],
            nextSibling: toggleOverlays,
            onCreated: (link) => {
                registerClickListener(link, () => {
                    const params = document.URL.split('?')[1].split(',').filter(x => x.indexOf(':') === -1)
                    if (params.length >= 3) {
                        const [lat, lon, zoom] = params.slice(params.length - 3)
                        const url = `https://webgiss.github.io/webgeo/#map=${zoom}/${lat}/${lon}`
                        openLinkInNewTab(url);
                    }
                })
            },
        })
        return true
    })

    addStyle(`#rhpane #overlay a .iconfont.webgeo-icon { width: 24px; height: 24px; margin-right: 0px; margin-left: 1px; margin-top: 0px; margin-bottom: 1px; background-color: #fff; padding: 4px; }`)

    console.log(`End - ${script_id}`)
})()