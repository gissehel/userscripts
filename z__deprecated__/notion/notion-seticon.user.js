// ==UserScript==
// @name        notion-seticon
// @namespace   https://github.com/gissehel/userscripts
// @version     20260512-164951-201f5c1
// @description Fix notion "set icon" that randomly don't set page icon to tab icon
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       https://notion.so/*
// @match       https://www.notion.so/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=notion.so
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
 * @param {()=>Promise<void>} callback 
 * @return {()=>Promise<void>} The unregister function
 */
const registerDomNodeMutated = async (callback) => {
    let callbackInProgress = false

    const action = async () => {
        if (!callbackInProgress) {
            callbackInProgress = true
            await callback()
            callbackInProgress = false
        }
    }

    const mutationObserver = new MutationObserver(async (mutationsList, observer) => { await action() });
    await action()
    mutationObserver.observe(document.documentElement, { childList: true, subtree: true });

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

// @main_begin{notion-seticon}
registerDomNodeMutatedUnique(() => getElements('.pseudoSelection>.notion-record-icon'), async (icon_container) => {
    const hrefs = getSubElements(icon_container, 'img')
        .map((image)=>image.getAttribute('src'))
        .filter((href)=>href.startsWith('https://'))

    if (hrefs.length === 0) {
        return false
    }
    const href = hrefs[hrefs.length - 1]

    const xicons = getElements('head > [type="image/x-icon"]')
    if (xicons.length === 0) {
        return false
    }
    const xicon = xicons[xicons.length - 1]

    xicon.setAttribute('href', href)

    return true
})
// @main_end{notion-seticon}

console.log(`End - ${script_id}`)
