// ==UserScript==
// @name        twitch-display-all-streamers
// @namespace   https://github.com/gissehel/userscripts
// @version     20260605-193748-ff8c368
// @description Display all streamers followed in the side bar
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       https://twitch.tv/*
// @match       https://www.twitch.tv/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant       GM.registerMenuCommand
// @grant       GM.unregisterMenuCommand
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

// @imported_begin{registerMenuCommand}
/**
 * Register a menu command in the userscript manager's menu (e.g., Tampermonkey, Greasemonkey, Violentmonkey). Unlike the underlying `GM.registerMenuCommand`, this function use the register pattern, thus returns an unregister function that can be called to remove the menu command when it's no longer needed.
 * 
 * @param {string} name The name of the menu command to display.
 * @param {() => void} callback The function to execute when the menu command is selected.
 * @return {() => Promise<void>} A function that, when called, will unregister the menu command.
 */
const registerMenuCommand = async (name, callback) => {
    let id = await GM.registerMenuCommand(name, callback);
    return async () => {
        if (id !== null) {
            const tempId = id;
            id = null;
            await GM.unregisterMenuCommand(tempId);
        }
    }
}
// @imported_end{registerMenuCommand}

// @main_begin{twitch-display-all-streamers}
const getFollowedChannelZone = () => {
    return document.querySelector('[aria-label="Followed Channels"]')
}

const showMoreChannels = async (followedChannelZone) => {
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
        cont = await showMoreChannels(followedChannelZone)
        await delay(50)
    }
}

const openAllChannels = async () => {
    return new Promise((resolve) => {
        registerDomNodeMutatedUnique(() => [getFollowedChannelZone()], async (followedChannelZone) => {
            console.log({ followedChannelZone })
            await showAllChannels(followedChannelZone)
            resolve()
        })
    })
}

const main = async () => {
    console.log({ message: 'in main' })
    await openAllChannels()
    await registerMenuCommand('Show all followed channels', async () => {
        await openAllChannels()
        console.log('All followed channels should be shown now')
    })
}

addStyle(`.side-nav-card:has(> a > .side-nav-card__avatar--offline) { height: 20px; } `)
addStyle(`.side-nav-card:has(> a > .side-nav-card__avatar--offline):hover { height: 42px; } `)
addStyle(`.side-nav-card__avatar--offline { overflow: hidden; transform: scale(0.5); }`)
main()
// @main_end{twitch-display-all-streamers}

console.log(`End - ${script_id}`)
