// ==UserScript==
// @name        video-generic-picture-on-picture
// @namespace   https://github.com/gissehel/userscripts
// @version     20260301-090053-74f01e7
// @description video-generic-picture-on-picture
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @grant       GM.registerMenuCommand
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

// @imported_begin{registerMenuCommand}
/**
 * Register a menu command in the userscript manager's menu (e.g., Tampermonkey, Greasemonkey, Violentmonkey).
 * @param {string} name The name of the menu command to display.
 * @param {() => void} callback The function to execute when the menu command is selected.
 */
const registerMenuCommand = (name, callback) => {
    GM.registerMenuCommand(name, callback);
}
// @imported_end{registerMenuCommand}

// @main_begin{video-generic-picture-on-picture}
const setVideoPictureInPicture = async () => {
    try {
        const videos = getElements('video')
        const noVideo = { 
            requestPictureInPicture: () => Promise.reject('No video found'), 
            offsetHeight: 0 
        }
        const biggestVideo = videos.reduce(
            (prev, current) => {
                if (prev.offsetHeight > current.offsetHeight) {
                    return prev
                } else {
                    return current
                }
            }
            ,noVideo
        )
        biggestVideo.requestPictureInPicture()

    } catch (err) {
        alert(err);
    }
}

registerMenuCommand('Toggle Picture-in-Picture', setVideoPictureInPicture)
// @main_end{video-generic-picture-on-picture}

console.log(`End - ${script_id}`)
