// ==UserScript==
// @name        reddit-no-best-only-new
// @namespace   https://github.com/gissehel/userscripts
// @version     20260303-142137-655d189
// @description reddit-no-best-only-new
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       https://www.reddit.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant       none
// ==/UserScript==

const script_name = GM_info?.script?.name || 'no-name'
const script_version = GM_info?.script?.version || 'no-version'
const script_id = `${script_name} ${script_version}`
console.log(`Begin - ${script_id}`)


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

// @imported_begin{registerLocationChange}
/**
 * Registers a callback to be called when the location changes (SPA navigation)
 * 
 * @param {(Location)=>void} callback A callback called when the location changes
 * @returns {()=>void} The unregister function
 */
const registerLocationChange = (callback) => {
    const normalizeLocation = (location) => {
        const { href, origin, protocol, host, hostname, port, pathname, search, hash } = location;
        const pathParts = pathname.split('/')
        if (pathParts.length > 0 && pathParts[0] === '') {
            pathParts.shift();
        }
        const isFolder = pathParts.length === 0 || pathParts[pathParts.length - 1] === '';
        if (isFolder) {
            pathParts.pop();
        }

        return { href, origin, protocol, host, hostname, port, pathname, pathParts, isFolder, search, hash };
    }
    let currentLocation = normalizeLocation(location);

    const observer = new MutationObserver(() => {
        const newLocation = normalizeLocation(location);
        if (newLocation.href !== currentLocation.href) {
            currentLocation = newLocation;
            callback(currentLocation);
        }
    });

    callback(currentLocation);
    observer.observe(document, { subtree: true, childList: true });

    return () => {
        observer.disconnect();
    };
}
// @imported_end{registerLocationChange}

// @main_begin{reddit-no-best-only-new}
const main = async () => {
    registerLocationChange(async (/**@type{Location}*/ location) => {
        const locationParts = location.pathname.split('/')
        if (locationParts.length === 4 && locationParts[1] === 'r' && locationParts[0] === '' && locationParts[3] === '') {
            await delay(2000)
            window.location.pathname = `/r/${locationParts[2]}/new/`;
        }
    })
}

main()
// @main_end{reddit-no-best-only-new}

console.log(`End - ${script_id}`)
