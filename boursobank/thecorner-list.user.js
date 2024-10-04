// ==UserScript==
// @name        thecorner-list
// @namespace   https://github.com/gissehel/userscripts
// @version     1.0.0
// @description thecorner-list
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       https://clients.boursobank.com/thecorner/toutes-les-offres
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

// @imported_begin{cleanupString}
/**
 * Cleanup string by removing leading and trailing whitespaces and replacing multiple whitespaces with a single whitespace
 * 
 * @param {string} string The string to cleanup
 * @returns {string} The cleaned string
 */
const cleanupString = (string) => string.trim().replace(/\s+/g, ' ')
// @imported_end{cleanupString}

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
// @imported_end{createElementExtended}

// @imported_begin{downloadData}
/**
 * Download data as a file
 * 
 * @param {string} filename - The name of the file
 * @param {string} data - The data to download
 * @param {object} options - The options
 * @param {string} options.mimetype - The mimetype of the data
 * @param {string} options.encoding - The encoding to use on the text data if provided
 */
const downloadData = (filename, data, options) => {
    if (!options) {
        options = {}
    }
    const { mimetype, encoding } = options
    if (!mimetype) {
        mimetype = 'application/octet-stream'
    }
    if (encoding) {
        data = new TextEncoder(encoding).encode(data)
    }
    const element = createElementExtended('a', {
        attributes: {
            href: URL.createObjectURL(new Blob([data], { type: mimetype })),
            download: filename,
        }
    })
    element.click()
}
// @imported_end{downloadData}

// @main_begin{thecorner-list}
registerDomNodeMutatedUnique(() => document.querySelectorAll('#marketplaceProductList'), (container) => {
    const date = new Date()
    const dateiso = date.toISOString()
    const dateunix = date.getTime()/1000
    const dateid = dateiso.replace(/\..*/, '').replace(/[-:]/g, '').replace(/T/, '-')

    const infos = {
        date: {
            iso: dateiso,
            unix: dateunix,
            id: dateid
        },
        items: getSubElements(container, '.boursoshop-universe-product__card').map((card) => {
            const info = {}
            info.id = card.getAttribute('data-product-id')
            for (let attribute of ['name', 'description']) {
                getSubElements(card, `.boursoshop-universe-product__${attribute}`).map((element) => {
                    info[attribute] = cleanupString(element.textContent)
                })
            }
            for (let attribute of ['CTA', 'tag']) {
                getSubElements(card, `.boursoshop-universe-product__${attribute}`).map((element) => {
                    info[attribute] = cleanupString(element.childNodes[0].childNodes[0].textContent)
                })
            }
            const favorite_icon = getSubElements(card, '.boursoshop-universe-product__favorite i.c-icon')[0]
            info.favorite = favorite_icon.classList.contains('c-icon--like-full')

            return info
        })
    }

    const json = JSON.stringify(infos,null,2)
    const csv = [
        ['id', 'name', 'description', 'CTA', 'tag', 'favorite'].join(';'),
        ...infos.items.map(({id, name, description, CTA, tag, favorite}) => `"${id}";"${name}";"${description}";"${CTA}";"${tag}";"${favorite}"`)
    ].join('\r\n')

    downloadData(`thecorner-list-${dateid}.json`, json, { mimetype: 'application/json', encoding: 'utf-8' })
    downloadData(`thecorner-list-${dateid}.csv`, csv, { mimetype : 'text/csv', encoding: 'windows-1252' })

    console.log(infos)
    console.log(json)
    console.log(csv)

    return true
})
// @main_end{thecorner-list}

console.log(`End - ${script_id}`)
