// ==UserScript==
// @name        europresse-technical-getInfo
// @namespace   https://github.com/gissehel/userscripts
// @version     20260207-152419-14d0883
// @description europresse-technical-getInfo
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       https://nouveau-eureka-cc.*.idm.oclc.org/WebPages/SourceDetails.aspx?*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=nouveau.europresse.com
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

// @imported_begin{parseParams}
/**
 * Parses a URL parameter string into an object.
 * 
 * @param {string} paramString 
 * @returns {Object}
 */
const parseParams = (paramString) => {
    return Object.fromEntries(paramString.split('&').map(item => [item.slice(0, item.indexOf('=')), item.slice(item.indexOf('=') + 1)]).filter(entry => entry[0].length));
}
// @imported_end{parseParams}

// @imported_begin{getUrlSearchParams}
/**
 * Return an object representing the URL search parameters (ex: ?key1=value1&key2=value2 in the URL would return { key1: 'value1', key2: 'value2' })
 * @returns {Object} The parameters as key/value pairs
 */
const getUrlSearchParams = () => {
    return parseParams(document.location.search.slice(1));
}
// @imported_end{getUrlSearchParams}

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

// @imported_begin{downloadData}
/**
 * Download data as a file
 * 
 * @param {string} filename - The name of the file
 * @param {string|Uint8Array} data - The data to download
 * @param {object} options - The options
 * @param {string} options.mimetype - The mimetype of the data
 * @param {string} options.encoding - The encoding to use on the text data if provided
 */
const downloadData = (filename, data, options) => {
    if (!options) {
        options = {}
    }
    let { mimetype, encoding } = options
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

// @main_begin{europresse-technical-getInfo}
// https://nouveau-eureka-cc.bpi.idm.oclc.org/WebPages/SourceDetails.aspx?source_id=1773&target=2&cond=1


const getInfo = async () => {
    const info = {};
    urlParams = getUrlSearchParams();
    if (urlParams['source_id']) {
        info['source_id'] = urlParams['source_id']
    }
    const table = getElements('#sourceDetails > table > tbody > tr > td > table')[0]
    if (table) {
        const rows = getSubElements(table, 'table[cellpadding="3"] > tbody > tr').filter(row => getSubElements(row, 'table').length === 0)
        for (let row of rows) {
            const [cellKey, cellValue] = getSubElements(row, 'td.tdDocument')
            if (cellKey && cellValue) {
                let value = null;
                const link = getSubElements(cellValue, '#SourceDetail1_lblSourceWebSite a')[0]
                if (link) {
                    value = link.href
                } else {
                    value = cellValue.textContent.trim()
                }
                let key = cellKey.textContent.trim().split(' :')[0]
                info[key] = value
            }
        }
    }
    return info;
}

const downloadInfo = async () => {
    const info = await getInfo();
    code = info['Code de source'] || `unknown-${(new Date).getTime()}`;
    downloadData(`europresse-info-${code}.json`, JSON.stringify(info, null, 0), { mimetype: 'application/json', encoding: 'utf-8' });
}

downloadInfo();
// @main_end{europresse-technical-getInfo}

console.log(`End - ${script_id}`)
