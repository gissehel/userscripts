// ==UserScript==
// @name        video-player-change-speed-on-drag
// @namespace   https://github.com/gissehel/userscripts
// @version     20260227-212128-2ec7ca9
// @description video-player-change-speed-on-drag
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       https://*/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant       GM_getValue
// @grant       GM_setValue
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

// @imported_begin{prototypeBind}
/**
 * Binds a function to a type's prototype, allowing it to be called as a method on instances of that type.
 * 
 * @param {Function} type The type whose prototype to bind the function to
 * @param {Function} fn The function to bind to the prototype. Must be a named function. It's first argument will be the instance of the type on which it is called, followed by any additional arguments.
 */
const prototypeBind = (type, fn) => {
    if (!type || !type.prototype) {
        throw new Error('First argument must be a type with a prototype.');
    }
    if (!fn || typeof fn !== 'function' || !fn.name || fn.name.length === 0) {
        throw new Error('Second argument must be a named function.');
    }
    if (type.prototype) {
        type.prototype[fn.name] = function (...args) { return fn(this, ...args); }
    }
}
// @imported_end{prototypeBind}

// @imported_begin{registerEventListener}
/**
 * Wrap addEventListener and removeEventListener using a pattern where the unregister function is returned
 * 
 * @param {HTMLElement|EventTarget} element The object on which to register the event
 * @param {string} eventType The event type
 * @param {EventListenerOrEventListenerObject} callback The callback to call when the event is triggered
 * @param {boolean|AddEventListenerOptions=} options The options to pass to addEventListener
 * @return {()=>{}} The unregister function
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
// @imported_end{registerEventListener}

// @imported_begin{RegistrationManager}
/**
 * A simple class to manage the registration and cleanup of the different event listeners and mutations observers using the register pattern.
 * 
 * This class is useful when several registrations need to be done at different times and cleaned up together. 
 */
class RegistrationManager {
    /**
     * Create a new RegistrationManager instance.
     * 
     * @param {Objet} options additional options
     * @param {boolean} [options.autoCleanupOnAfterFirstCleanup=false] automatically call cleanup after the first call of cleanupAll (This instance of RegistrationManager will be only used once, but any late registration will be automatically cleaned up)
     */
    constructor(options) {
        this.cleanupFunctions = []
        this.options = options || {}
        this.autoCleanupOnAfterFirstCleanup = this.options.autoCleanupOnAfterFirstCleanup || false
        this.hasBeenCleanedUp = false
    }

    /**
     * Add a new cleanup function
     * @param {() => void} cleanupFunction 
     */
    onRegistration(cleanupFunction) {
        if (this.autoCleanupOnAfterFirstCleanup && this.hasBeenCleanedUp) {
            cleanupFunction()
        } else {
            this.cleanupFunctions.push(cleanupFunction)
        }
    }

    /**
     * Cleanup all the cleanup functions.
     */
    cleanupAll() {
        this.hasBeenCleanedUp = true
        this.cleanupFunctions.forEach(cleanup => cleanup())
        this.cleanupFunctions.length = 0
    }
}
// @imported_end{RegistrationManager}

// @imported_begin{registerVideoElementToChangeSpeedOnDrag}
/**
 * register a video element to change playback speed based on vertical drag distance. (Use the register pattern for cleanup)
 * 
 * @param {HTMLVideoElement} video the video element
 * @param {[number[], number, number[]]} speedvalues The speed values : [lowSpeeds[], normalSpeed, highSpeeds[]]
 * @param {Object} options additional options
 * @param {boolean} [options.verbose=false] enable debug logging
 * @param {boolean} [options.simulatePlayPause=false] simulate play/pause on click when there is no drag (only left click)
 * @param {HTMLElement} [options.panelControl=undefined] panel control element to bind drag events on instead of the video element (default to the video element)
 * @param {number} [options.thresold=20] the threshold for detecting drag distance (default to 20)
 * @param {number} [options.thresoldX=thresold] the threshold for detecting horizontal drag distance (default to the same as vertical)
 * @param {number} [options.thresoldY=thresold] the threshold for detecting vertical drag distance (default to the same as horizontal)
 * @param {number} [options.deltaTime=5] the time to skip when horizontal drag exceed the threshold
 * @param {(video: HTMLVideoElement, speed: number) => void} [options.setSpeed] function to set the speed, default to changing the playbackRate of the video element
 * @param {(video: HTMLVideoElement, speed: number) => void} [options.onSpeedChanged] callback called when the speed is changed by dragging
 * @param {(video: HTMLVideoElement, deltaTime: number) => void} [options.incrTime] the function to call to increment the video time when horizontal drag exceed the threshold
 * @param {(video: HTMLVideoElement, deltaTime: number) => Promise<void>} [options.onTimeChanged] callback called when the time is changed by dragging
 * @param {number} [options.timeDisplayDelay=300] the time in ms to display the time change when horizontal drag exceed the threshold
 * @return {()=>void} cleanup function to remove event listeners
 */
const registerVideoElementToChangeSpeedOnDrag = (video, speedvalues, options) => {
    if (!options) {
        options = {}
    }
    const panelControl = options.panelControl || video
    const [lowSpeeds, normalSpeed, highSpeeds] = speedvalues
    let startY = 0;
    let startX = 0;
    let hasExceededThreshold = false;
    let hasExceededThresholdX = false;
    let hasExceededThresholdY = false;
    let shouldCancelClick = false;
    let activePointerId = null;
    let speed = normalSpeed;
    const thresold = options.thresold || 20;
    const verbose = options.verbose || false;
    const simulatePlayPause = options.simulatePlayPause || false;
    const setSpeed = options.setSpeed || ((video, speed) => video.playbackRate = speed)
    const onSpeedChanged = options.onSpeedChanged || null
    const thresoldX = options.thresoldX || thresold;
    const thresoldY = options.thresoldY || thresold;
    const deltaTime = options.deltaTime || 5;
    const incrTime = options.incrTime || ((video, deltaTime) => video.currentTime += deltaTime)
    const onTimeChanged = options.onTimeChanged || null
    const timeDisplayDelay = options.timeDisplayDelay || 300
    let deltaXSection = 0;

    const onPointerDown = async (e) => {
        if (e.button !== 0) {
            return;
        }
        e.stopImmediatePropagation();
        e.preventDefault();
        startX = e.clientX;
        startY = e.clientY;
        hasExceededThreshold = false;
        hasExceededThresholdX = false;
        hasExceededThresholdY = false;
        shouldCancelClick = false;
        activePointerId = e.pointerId;
        panelControl.setPointerCapture(activePointerId);
        deltaXSection = 0;
    }

    const onPointerMove = async (e) => {
        if (hasExceededThreshold || (!activePointerId)) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }
        if (e.pointerId !== activePointerId) {
            return;
        }
        const deltaX = e.clientX - startX;
        const deltaY = startY - e.clientY;
        if (Math.abs(deltaX) > thresoldX) {
            hasExceededThreshold = true;
            hasExceededThresholdX = true;
            shouldCancelClick = true;
        }
        if (Math.abs(deltaY) > thresoldY) {
            hasExceededThreshold = true;
            hasExceededThresholdY = true;
            shouldCancelClick = true;
        }
        if (hasExceededThresholdX) {
            const newDeltaXSection = Math.sign(deltaX) * Math.floor(Math.abs(deltaX) / thresoldX)
            if (newDeltaXSection !== deltaXSection) {
                if (newDeltaXSection > 0 && newDeltaXSection > deltaXSection) {
                    incrTime(video, deltaTime)
                    if (verbose) {
                        console.log(`TIME : [${deltaTime}s]`)
                    }
                    (async () => {
                        await onTimeChanged?.(video, deltaTime)
                        await delay(timeDisplayDelay)
                        await onTimeChanged?.(video, null)
                    })()
                } else if (newDeltaXSection < 0 && newDeltaXSection < deltaXSection) {
                    incrTime(video, -deltaTime)
                    if (verbose) {
                        console.log(`TIME : [${-deltaTime}s]`)
                    }
                    (async () => {
                        await onTimeChanged?.(video, -deltaTime)
                        await delay(timeDisplayDelay)
                        await onTimeChanged?.(video, null)
                    })()
                }
                deltaXSection = newDeltaXSection
            }
        }
        if (hasExceededThresholdY) {
            let new_speed = normalSpeed
            let hasNewSpeed = false
            let index = highSpeeds.length - 1
            while ((!hasNewSpeed) && (index >= 0)) {
                if (deltaY > thresoldY * (index + 1)) {
                    new_speed = highSpeeds[index]
                    hasNewSpeed = true
                    break
                }
                index -= 1
            }
            if (!hasNewSpeed) {
                if (deltaY > -thresoldY) {
                    new_speed = normalSpeed
                    hasNewSpeed = true
                }
            }
            while ((!hasNewSpeed) && (index < lowSpeeds.length)) {
                if (deltaY > -thresoldY * (index + 2)) {
                    new_speed = lowSpeeds[index]
                    hasNewSpeed = true
                    break
                }
                index += 1
            }
            if (!hasNewSpeed) {
                new_speed = lowSpeeds[lowSpeeds.length - 1]
                hasNewSpeed = true
            }
            if (speed !== new_speed) {
                speed = new_speed
                setSpeed(video, speed)
                if (verbose) {
                    console.log(`SPEED : [${speed}] move (${deltaY})`)
                }
                onSpeedChanged?.(video, speed)
            }
        }
    }

    const cleanup = async (e) => {
        if (hasExceededThreshold) {
            e.stopImmediatePropagation();
            e.preventDefault();
            hasExceededThreshold = false;
            if (hasExceededThresholdY) {
                speed = normalSpeed
                setSpeed(video, speed)
                if (verbose) {
                    console.log(`SPEED : [${speed}] cleanup`)
                }
                onSpeedChanged?.(video, speed)
            }
            if (hasExceededThresholdX) {
                deltaXSection = 0;
            }
        }
        if (activePointerId !== null) {
            try {
                panelControl.releasePointerCapture(activePointerId);
            }
            catch (_) { }
        }
        activePointerId = null;
    }

    const onPointerCancel = async (e) => {
        if (e.button !== 0) {
            return;
        }
        return cleanup(e)
    }

    const onPointerUp = async (e) => {
        if (e.button !== 0) {
            return;
        }
        if (!hasExceededThreshold) {
            if (simulatePlayPause) {
                shouldCancelClick = true;
                if (verbose) {
                    console.log('PLAY/PAUSE simulation')
                }
                if (video.paused) {
                    video.play()
                } else {
                    video.pause()
                }
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        }
        return cleanup(e)
    }

    const onClick = async (e) => {
        if (e.button !== 0) {
            return;
        }
        if (shouldCancelClick) {
            e.stopImmediatePropagation();
            e.preventDefault();
            shouldCancelClick = false;
        }
    }

    const registrationManager = new RegistrationManager()

    const eventsToBind = {
        pointerdown: onPointerDown,
        pointermove: onPointerMove,
        pointerup: onPointerUp,
        pointercancel: onPointerCancel,
        click: onClick
    }

    Object.entries(eventsToBind).forEach(([event, handler]) => {
        registrationManager.onRegistration(registerEventListener(panelControl, event, handler, { capture: true }));
    });

    return () => {
        registrationManager.cleanupAll();
    }
}
// @imported_end{registerVideoElementToChangeSpeedOnDrag}

// @imported_begin{monkeyGetSetValue}
/**
 * Récupère ou définit une valeur dans le stockage de Tampermonkey/Greasemonkey/Violentmonkey/etc.
 * 
 * @param {String} key La clé de la valeur à récupérer ou définir
 * @param {Object} value La valeur par défaut à définir si la clé n'existe pas (optionnel) 
 * @returns {Object} La valeur récupérée
 */
const monkeyGetSetValue = (key, value) => {
    const storedValue = GM_getValue(key);
    if (storedValue === undefined && value !== undefined) {
        GM_setValue(key, value);
        return value;
    }
    return storedValue;
}
// @imported_end{monkeyGetSetValue}

// @imported_begin{monkeySetValue}
/**
 * Définit une valeur dans le stockage de Tampermonkey/Greasemonkey/Violentmonkey/etc.
 * Juste un alias pour GM_setValue, pour etre cohérent avec monkeyGetSetValue.
 * 
 * @param {String} key La clé de la valeur à définir
 * @param {Object} value La valeur à définir
 */
const monkeySetValue = (key, value) => GM_setValue(key, value);
// @imported_end{monkeySetValue}

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

// @imported_begin{realWindow}
const realWindow = typeof window.unsafeWindow === 'undefined' ? window : window.unsafeWindow
// @imported_end{realWindow}

// @imported_begin{exportOnWindow}
/**
 * Export all properties of a dictionary to the global window object.
 * @param {Object} dict A dictionary of key-value pairs to export.
 */
const exportOnWindow = (dict) => {
    for (const key in dict) {
        realWindow[key] = dict[key];
    }
}
// @imported_end{exportOnWindow}

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

// @main_begin{video-player-change-speed-on-drag}
class PersistantInternalExternalList {
    constructor(monkeyName, defaultInternalList = [], defaultExternalList = []) {
        this.internalList = [...defaultInternalList]
        this.externalList = monkeyGetSetValue(monkeyName, defaultExternalList)
        this.monkeyName = monkeyName
        this.list = [...this.internalList, ...this.externalList]
    }

    add(item) {
        if (!this.externalList.includes(item)) {
            this.externalList.push(item)
            monkeySetValue(this.monkeyName, this.externalList)
            this.list = [...this.internalList, ...this.externalList]
            return true
        }
        return false
    }

    remove(item) {
        const index = this.externalList.indexOf(item)
        if (index >= 0) {
            this.externalList.splice(index, 1)
            monkeySetValue(this.monkeyName, this.externalList)
            this.list = [...this.internalList, ...this.externalList]
            return true
        }
        return false
    }

    includes(item) {
        return this.list.includes(item)
    }

    externalIncludes(item) {
        return this.externalList.includes(item) 
    }
}

const domainBlackList = new PersistantInternalExternalList(
    'domainBlackList', 
    [], 
    []
)

const domainSimulatePlayPauseOnClickList = new PersistantInternalExternalList(
    'domainSimulatePlayPauseOnClickList', 
    ['www.youtube.com', 'www.twitch.tv'], 
    ['video.sibnet.ru', 'sendvid.com']
)

let speedLabel = null
let speedTextLabel = null

const getTimeIncrLabelSetter = (setLabel) => (video, deltaTime) => {
    const display = deltaTime !== null ? true : false
    let label = ""
    if (display) {
        const sign = deltaTime > 0 ? "+" : "-"
        label = `${sign}${Math.abs(deltaTime)}s`
    }
    setLabel(video, label, display)
}

const setLabelYoutube = (video, label, display) => {
    if (!speedLabel || !speedTextLabel) {
        speedTextLabel = document.querySelector('.ytp-speedmaster-label')
        speedLabel = document.querySelector('.ytp-speedmaster-overlay')

    }
    if (speedLabel && speedTextLabel) {
        speedTextLabel.textContent = label
        speedLabel.style.display = display ? "" : "none"
    }
}

const setSpeedLabelYoutube = (video, speed) => {
    setLabelYoutube(video, `${speed}x`, speed !== 1)
}

const setTimeIncrLabelYoutube = getTimeIncrLabelSetter(setLabelYoutube)

const setLabelGeneric = (video, label, display) => {
    if (!speedLabel || !speedTextLabel) {
        createElementExtended('div', {
            style: {
                width: '100%',
                height: '30px',
                position: 'absolute',
                top: '5px',
                left: '0px',
                right: '0px',
                display: 'block',
                textAlign: 'center',
                zIndex: '9999',
            },
            prevSibling: video,
            onCreated: (element) => speedLabel = element,
            children: [
                createElementExtended('div', {
                    style: {
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'rgb(255, 255, 255)',
                        width: '80px',
                        height: '30px',
                        position: 'relative',
                        top: '5px',
                        left: 'auto',
                        right: 'auto',
                        display: 'inline-block',
                        padding: '5px',
                        lineHeight: '20px',
                        borderRadius: '8px',
                        fontFamily: 'sans-serif',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        textAlign: 'center',
                    },
                    prevSibling: video,
                    onCreated: (element) => speedTextLabel = element,
                })
            ],
        })

    }

    if (speedLabel && speedTextLabel) {
        speedTextLabel.textContent = label
        speedLabel.style.display = display ? "inline-block" : "none"
    }
}
const setSpeedLabelGeneric = (video, speed) => {
    setLabelGeneric(video, `${speed}x`, speed !== 1)
}

const setTimeIncrLabelGeneric = getTimeIncrLabelSetter(setLabelGeneric)

const speedChangeByHost = {
    'www.youtube.com': setSpeedLabelYoutube,
}

const timeChangeByHost = {
    'www.youtube.com': setTimeIncrLabelYoutube,
}

const registerInstallation = () => {
    const speedRanges = monkeyGetSetValue('speedRanges', [[0.75, 0.5, 0.25], 1, [1.25, 1.5, 1.75, 2, 3, 4, 5, 6, 8]]);
    const verbose = monkeyGetSetValue('verbose', false);
    const simulatePlayPause = domainSimulatePlayPauseOnClickList.includes(location.host)
    let onSpeedChanged = null
    let onTimeChanged = null

    if (speedChangeByHost[location.host]) {
        onSpeedChanged = speedChangeByHost[location.host]
    } else {
        onSpeedChanged = setSpeedLabelGeneric
    }

    if (timeChangeByHost[location.host]) {
        onTimeChanged = timeChangeByHost[location.host]
    } else {
        onTimeChanged = setTimeIncrLabelGeneric
    }

    const thresold = monkeyGetSetValue('thresold', 20)
    const registrationManager = new RegistrationManager({ autoCleanupOnAfterFirstCleanup: true })

    registrationManager.onRegistration(
        registerDomNodeMutatedUnique(
            () => getElements('video'),
            (video) => {
                const panelControlByHost = {
                    'www.twitch.tv': document.querySelector('[data-a-target="player-overlay-click-handler"]'),
                }

                const panelControl = panelControlByHost[location.host] || undefined

                registrationManager.onRegistration(registerVideoElementToChangeSpeedOnDrag(
                    video,
                    speedRanges,
                    {
                        verbose,
                        thresold,
                        simulatePlayPause,
                        onSpeedChanged,
                        onTimeChanged,
                        panelControl,
                    }
                ));
            })
    )

    return () => {
        registrationManager.cleanupAll()
    }
}

const cleanupInstallation = new RegistrationManager()

const main = async () => {
    if (domainBlackList.includes(location.host)) {
        console.log(`video-player-change-speed-on-drag: This site (${location.host}) is in the black list, skipping...`)
        console.log(`To remove this site from the black list, call video_player_change_speed__Remove_this_site_from_blacklist() in the console.${(window.location !== window.parent.location) ? ` This is an iframe for the url [${window.location.href}]. Be carefull to use the console of the iframe.` : ""}`)
    } else {
        console.log(`video-player-change-speed-on-drag: This site (${location.host}) is not in the black list, applying...`)
        console.log(`To add this site to the black list, call video_player_change_speed__Add_this_site_to_blacklist() in the console.${(window.location !== window.parent.location) ? ` This is an iframe for the url [${window.location.href}]. Be carefull to use the console of the iframe.` : ""}`)
        cleanupInstallation.onRegistration(registerInstallation())
    }
}

const video_player_change_speed__Add_this_site_to_blacklist = () => {
    if (domainBlackList.add(location.host)) {
        cleanupInstallation.cleanupAll()
        main()
        alert(`This site (${location.host}) has been added to the black list, you can call video_player_change_speed__Remove_this_site_from_blacklist() to remove it from the list if it was a mistake.`)
    }
}

const video_player_change_speed__Remove_this_site_from_blacklist = () => {
    if (domainBlackList.remove(location.host)) {
        cleanupInstallation.cleanupAll()
        main()
        alert(`This site (${location.host}) has been removed from the black list, you can call video_player_change_speed__Add_this_site_to_blacklist() to add it to the list if it was a mistake.`)
    }
}

const video_player_change_speed__Add_this_site_to_simulate_play_pause_on_click_list = () => {
    if (domainSimulatePlayPauseOnClickList.add(location.host)) {
        cleanupInstallation.cleanupAll()
        main()
        alert(`This site (${location.host}) has been added to the simulate play/pause on click list, you can call video_player_change_speed__Remove_this_site_from_simulate_play_pause_on_click_list() to remove it from the list if it was a mistake.`)
    }
}

const video_player_change_speed__Remove_this_site_from_simulate_play_pause_on_click_list = () => {
    if (domainSimulatePlayPauseOnClickList.remove(location.host)) {
        cleanupInstallation.cleanupAll()
        main()
        alert(`This site (${location.host}) has been removed from the simulate play/pause on click list, you can call video_player_change_speed__Add_this_site_to_simulate_play_pause_on_click_list() to add it to the list if it was a mistake.`)
    }
}

exportOnWindow({
    video_player_change_speed__Add_this_site_to_blacklist,
    video_player_change_speed__Remove_this_site_from_blacklist,
    video_player_change_speed__Add_this_site_to_simulate_play_pause_on_click_list,
    video_player_change_speed__Remove_this_site_from_simulate_play_pause_on_click_list,
})

registerMenuCommand('Add this site to video speed change black list', video_player_change_speed__Add_this_site_to_blacklist)
registerMenuCommand('Remove this site from video speed change black list', video_player_change_speed__Remove_this_site_from_blacklist)

registerMenuCommand('Add this site to simulate play/pause on click list', video_player_change_speed__Add_this_site_to_simulate_play_pause_on_click_list)
registerMenuCommand('Remove this site from simulate play/pause on click list', video_player_change_speed__Remove_this_site_from_simulate_play_pause_on_click_list)

main()
// @main_end{video-player-change-speed-on-drag}

console.log(`End - ${script_id}`)
