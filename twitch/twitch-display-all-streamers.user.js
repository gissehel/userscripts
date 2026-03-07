// ==UserScript==
// @name        twitch-display-all-streamers
// @namespace   https://github.com/gissehel/userscripts
// @version     20260227-160749-886a002
// @description Display all streamers followed in the side bar
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       https://twitch.tv/*
// @match       https://www.twitch.tv/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
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

// @imported_begin{delay}
/**
 * @param {Number} timeout The timeout in ms
 * @param {Object} data The data to return after the timeout
 * @returns 
 */
const delay = (timeout, data) =>
    new Promise((resolve) =>
        setTimeout(() =>
            resolve(data), timeout
        )
    )
// @imported_end{delay}

// @main_begin{twitch-display-all-streamers}
const getFollowedChannelZone = () => {
    return document.querySelector('[aria-label="Followed Channels"]')
}

const showMoreChannels = (followedChannelZone) => {
    const button = followedChannelZone.querySelector('[data-a-target="side-nav-show-more-button"]')
    if (button) {
        button.click()
        return true
    }
    return false
}

const showAllChannels = async (followedChannelZone) => {
    let cont = true
    while (cont) {
        console.log('cont')
        cont = showMoreChannels(followedChannelZone)
        await delay(50)
    }
}

const openAllChannels = async () => {
    return new Promise((resolve) => {
        registerDomNodeMutatedUnique(() => [getFollowedChannelZone()], (followedChannelZone) => {
            console.log({ followedChannelZone })
            showAllChannels(followedChannelZone).then(() => resolve())
        })
    })
}

const main = () => {
    console.log({ message: 'in main' })
    openAllChannels().then(() => console.log('x'))

}

addStyle(`.side-nav-card:has(> a > .side-nav-card__avatar--offline) { height: 20px; } `)
addStyle(`.side-nav-card:has(> a > .side-nav-card__avatar--offline):hover { height: 42px; } `)
addStyle(`.side-nav-card__avatar--offline { overflow: hidden; transform: scale(0.5); }`)
main()
// @main_end{twitch-display-all-streamers}

console.log(`End - ${script_id}`)
