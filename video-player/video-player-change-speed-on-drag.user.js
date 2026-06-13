// ==UserScript==
// @name        video-player-change-speed-on-drag
// @namespace   https://github.com/gissehel/userscripts
// @version     20260613-104625-7293ab7
// @description video-player-change-speed-on-drag
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       https://*/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.registerMenuCommand
// @grant       GM.unregisterMenuCommand
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
    async cleanupAll() {
        this.hasBeenCleanedUp = true
        await Promise.all(this.cleanupFunctions.map(async (cleanup) => await cleanup()))
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
 * Get the value from the monkey (Tampermonkey/Greasemonkey/Violentmonkey/etc.) storage, and set them with the default if nothing already exists
 * 
 * @template T
 * @param {String} key The key to use to name the value to get or set
 * @param {T} value The default value to set and return if not defined
 * @returns {Promise<T>} The value to use
 */
const monkeyGetSetValue = async (key, value) => {
    const storedValue = await GM.getValue(key);
    if (storedValue === undefined && value !== undefined) {
        await GM.setValue(key, value);
        return value;
    }
    return storedValue;
}
// @imported_end{monkeyGetSetValue}

// @imported_begin{monkeySetValue}
/**
 * Set a value in the monkey storage (Tampermonkey/Greasemonkey/Violentmonkey/etc.)
 * Just an alias for GM_setValue, for coherence use with monkeyGetSetValue.
 * 
 * @param {String} key La clé de la valeur à définir
 * @param {Object} value La valeur à définir
 */
const monkeySetValue = async (key, value) => await GM.setValue(key, value);
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

// @imported_begin{HookableValue}
/**
 * A class representing a value that can have hooks on change
 * @template T The type of the value
 */
class HookableValue {
    /**
     * Constructor
     * @param {string} name The name of the hook
     * @param {T|null} defaultValue The default value
     */
    constructor(name, defaultValue = null) {
        this._name = name;
        this._value = defaultValue;
        this.callbacks = [];
    }

    /**
     * Sets the value and calls the hooks if the value changed
     * 
     * @param {T} newValue The new value
     * @returns {Promise<void>} A promise that resolves when all hooks have been called
     */
    async setValue(newValue) {
        const oldValue = this.value;
        if (oldValue !== newValue) {
            this._value = newValue;
            for (const callback of this.callbacks) {
                await callback(newValue, oldValue);
            }
        }
    }

    /**
     * Gets the value
     * 
     * @returns {T} The current value
     */
    getValue() {
        return this._value;
    }

    /**
     * Register a callback to be called when the value changes
     * @param {(newValue:T, oldValue:T)=>Promise<void>} callback The callback (that may be async)
     * @returns {()=>Promise<void>} The unregister function
     */
    async register(callback) {
        this.callbacks.push(callback);
        return async () => {
            this.callbacks = this.callbacks.filter(cb => cb !== callback);
        }
    }

    /**
     * Registers a callback and immediately calls it with the current value
     * @param {(newValue:T, oldValue:T)=>Promise<void>} callback The callback (that may be async)
     * @returns {()=>Promise<void>} The unregister function
     */
    async registerAndCall(callback) {
        const unregisterFunction = await this.register(callback);
        await callback(this.value, this.value);
        return unregisterFunction;
    }

    /**
     * Registers a callback to be called when any of the given hookable values changes
     * @param {HookableValue[]} hookableValues The hookable values to watch
     * @param {(newValues: any[], oldValues: any[]) => Promise<void>} callback The callback (that may be async) that will receive the new and old values of all the hookable values
     * @returns {()=>Promise<void>} The unregister function
     */
    static async registerAll(hookableValues, callback) {
        const unregisterFunctions = await Promise.all(hookableValues.map(
            (hookableValue,indexHookable) => hookableValue.register(
                async (value, oldValue) => await callback(
                    hookableValues.map((hv,indexValue) => indexValue === indexHookable ? value : hv.value), 
                    hookableValues.map((hv,indexValue) => indexValue === indexHookable ? oldValue : hv.value)
                )
            )
        ));
        return async () => {
            for (const unregister of unregisterFunctions) {
                await unregister();
            }
        };
    }

    /**
     * Clears all registered callbacks
     * @returns {Promise<void>}
     */
    async clearCallbacks() {
        for (const callback of this.callbacks) {
            await callback(null, this._value);
        }
        this.callbacks = [];
    }

    get value() {
        return this.getValue();
    }

    set value(newValue) {
        this.setValue(newValue);
    }

    get name() {
        return this._name;
    }
}
/** @typedef {HookableValue} HookableValue */
// @imported_end{HookableValue}

// @imported_begin{PERSISTENT_PARAMETER_SCOPE}
/**
 * Defines the scope of a persistent parameter. This is used to determine how the parameter value is stored and shared across different pages.
 * 
 * - BY_SCRIPT: The parameter value is stored separately for each script. This means that all sites will have the same parameter value, but different scripts will have different parameter values.
 * - BY_HOST: The parameter value is stored separately for each host. This means that all pages on the same host will share the same parameter value, but different hosts will have different parameter values.
 * - BY_DOMAIN: The parameter value is stored separately for each domain. This means that all pages on the same domain (including subdomains) will share the same parameter value, but different domains will have different parameter values.
 * - BY_CUSTOM: The parameter value is stored based on a custom key. This means that the parameter value will be shared among all pages that use the same custom key, and different parameter values can be defined for different custom keys. This is useful when you want to share a parameter value across multiple scripts or across multiple hosts/domains, but you don't want to use the same parameter value for all scripts or all hosts/domains.
 */
const PERSISTENT_PARAMETER_SCOPE = {
    BY_SCRIPT: 'BY_SCRIPT',
    BY_HOST: 'BY_HOST',
    BY_DOMAIN: 'BY_DOMAIN',
    BY_CUSTOM: 'BY_CUSTOM',
}
// @imported_end{PERSISTENT_PARAMETER_SCOPE}

// @imported_begin{getPersistentParameterValue}
/**
 * @typedef {Object} GetPersistentParameterValueOptions
 * @property {((oldValue: T) => Promise<T>)} [onParameterNeedNewValue] A callback function that is called when a new parameter value is needed, with the old value as parameter, and that returns the new value
 * @property {((parameterName: string, newValue: T) => Promise<String>)} [getMenuLabel] A callback function that is called to get the menu label, with the parameter name and the new value as parameters, and that returns the menu label
 * @property {PERSISTENT_PARAMETER_SCOPE} [scope] The scope of the persistent parameter. This determines how the parameter value is stored and shared across different pages. Default is PERSISTENT_PARAMETER_SCOPE.BY_SCRIPT.
 * @property {string} [customScopeKey] If the scope is BY_CUSTOM, this key is used to differentiate the parameter value. It can be set to any string, but it should be unique to avoid conflicts with other parameters. Default is an empty string.
 * @property {boolean} [alertOnChange] Whether to alert the user when the parameter value changes. Default is false.
 */

/**
 * Gets the persistent string value of a parameter, and registers menu commands to toggle it.
 * The parameter state is persisted in the monkey storage, so it will be remembered across page reloads.
 * 
 * The menu command will be "Change {parameterName} (current : {currentValue})". 
 * When the menu command is selected, the value will be asked, the parameter value will be updated.
 * 
 * @template T The type of the parameter value
 * @param {String} parameterName The name of the parameter (used for menu command and storage)
 * @param {T} defaultValue The default value of the parameter
 * @param {GetPersistentParameterValueOptions} [options] Additional options
 * @returns {Promise<HookableValue<T>>} The hookable value for the parameter
 */
const getPersistentParameterValue = (() => {
    /**
     * @type {{[parameterName: string]: HookableValue<T>}}
     * @template T
     */
    const hookableValueParameterValues = {};
    exportOnWindow({ hookableValueParameterValues });

    /**
     * @template T The type of the parameter value
     * @param {String} parameterName The name of the parameter (used for menu command and storage)
     * @param {T} defaultValue The default value of the parameter
     * @param {GetPersistentParameterValueOptions} [options] Additional options
     * @returns {Promise<HookableValue<T>>} The hookable value for the parameter
     */
    return async (parameterName, defaultValue, options) => {
        if (!options) {
            options = {};
        }
        const getMenuLabel = options?.getMenuLabel ?? ((parameterName, newValue) => `Change ${parameterName} (current : ${newValue})`);
        const onParameterNeedNewValue = options?.onParameterNeedNewValue ?? (async (oldValue) => {
            const newValue = prompt(`Enter new value for ${parameterName}:`, oldValue);
            return newValue;
        });
        const alertOnChange = options?.alertOnChange ?? false;
        const scope = options?.scope ?? PERSISTENT_PARAMETER_SCOPE.BY_SCRIPT;
        let parameterNameForMonkey = parameterName;
        if (scope === PERSISTENT_PARAMETER_SCOPE.BY_HOST) {
            parameterNameForMonkey = `${parameterName}_host_${location.host}`;
        } else if (scope === PERSISTENT_PARAMETER_SCOPE.BY_DOMAIN) {
            parameterNameForMonkey = `${parameterName}_domain_${location.hostname.split('.').slice(-2).join('.')}`;
        } else if (scope === PERSISTENT_PARAMETER_SCOPE.BY_CUSTOM) {
            const customScopeKey = options?.customScopeKey ?? '';
            parameterNameForMonkey = `${parameterName}_custom_${customScopeKey}`;
        }

        /** @type{(()=>Promise<void>) | null} */
        let menuCommandUnregisterFunction = null;

        if (!hookableValueParameterValues[parameterName]) {
            const value = await monkeyGetSetValue(parameterNameForMonkey, defaultValue);
            hookableValueParameterValues[parameterName] = new HookableValue(parameterName);
            const hookableValue = hookableValueParameterValues[parameterName];
            await hookableValue.register(async (newValue) => {
                await monkeySetValue(parameterNameForMonkey, newValue);

                if (menuCommandUnregisterFunction) {
                    await menuCommandUnregisterFunction();
                    menuCommandUnregisterFunction = null;
                }
                const label = await getMenuLabel(parameterName, newValue);
                menuCommandUnregisterFunction = await registerMenuCommand(label, async () => {
                    const nextValue = await onParameterNeedNewValue(newValue);
                    if (nextValue !== null) {
                        await hookableValue.setValue(nextValue);
                    }
                });

                if (alertOnChange) {
                    alert(`Parameter [${parameterName}] is set to ${hookableValue.value}`);
                }
            });
            hookableValue.value = value;
        }

        return hookableValueParameterValues[parameterName];
    }
})();
exportOnWindow({ getPersistentParameterValue });
// @imported_end{getPersistentParameterValue}

// @imported_begin{getPersistentParameterValueString}
/**
 * Gets the persistent string value of a parameter, and registers menu commands to change it.
 * The parameter state is persisted in the monkey storage, so it will be remembered across page reloads.
 * The menu command will be "Change {parameterName} (current : {currentValue})". When the menu command is selected, the new value will be asked, and the parameter value will be updated.
 * 
 * @param {String} parameterName The name of the parameter (used for menu command and storage)
 * @param {String} defaultValue The default value of the parameter
 * @param {GetPersistentParameterValueOptions} [options] Additional options
 * @returns {Promise<HookableValue<String>>} The hookable value for the parameter
 */
const getPersistentParameterValueString = async (parameterName, defaultValue, options) => {
    return await getPersistentParameterValue(parameterName, defaultValue, {
        onParameterNeedNewValue: async (oldValue) => {
            const newValue = prompt(`Enter new value for ${parameterName}:`, oldValue);
            return newValue;
        },
        getMenuLabel: async (parameterName, newValue) => {
            return `Change ${parameterName} (current : ${newValue})`;
        },
        ...options,
    })
}
// @imported_end{getPersistentParameterValueString}

// @main_begin{video-player-change-speed-on-drag}
let panelControlQueryHv = null

const defaultPanelControlByHost = {
    'www.twitch.tv': '[data-a-target="player-overlay-click-handler"]',
}

class PersistantInternalExternalList {
    constructor(monkeyName, defaultInternalList = [], defaultExternalList = []) {
        this.internalList = [...defaultInternalList]
        this.defaultExternalList = [...defaultExternalList]
        this.externalList = null
        this.monkeyName = monkeyName
        this.list = null
        // this.list = [...this.internalList, ...this.externalList]
    }

    async _ensureExternalList() {
        if (this.externalList === null) {
            this.externalList = await monkeyGetSetValue(this.monkeyName, this.defaultExternalList)
        }
        return this.externalList
    }

    async _ensureList() {
        if (this.list === null) {
            await this._ensureExternalList()
            this.list = [...this.internalList, ...this.externalList]
        }
    }

    async add(item) {
        await this._ensureExternalList()
        if (!this.externalList.includes(item)) {
            this.externalList.push(item)
            await monkeySetValue(this.monkeyName, this.externalList)
            this.list = [...this.internalList, ...this.externalList]
            return true
        }
        return false
    }

    async remove(item) {
        await this._ensureExternalList()
        const index = this.externalList.indexOf(item)
        if (index >= 0) {
            this.externalList.splice(index, 1)
            await monkeySetValue(this.monkeyName, this.externalList)
            this.list = [...this.internalList, ...this.externalList]
            return true
        }
        return false
    }

    async includes(item) {
        await this._ensureList()
        return this.list.includes(item)
    }

    async externalIncludes(item) {
        await this._ensureExternalList()
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

const registerInstallation = async () => {
    const speedRanges = await monkeyGetSetValue('speedRanges', [[0.75, 0.5, 0.25], 1, [1.25, 1.5, 1.75, 2, 3, 4, 5, 6, 8]]);
    const verbose = await monkeyGetSetValue('verbose', false);
    const simulatePlayPause = await domainSimulatePlayPauseOnClickList.includes(location.host)
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

    const thresold = await monkeyGetSetValue('thresold', 20)
    const registrationManager = new RegistrationManager({ autoCleanupOnAfterFirstCleanup: true })

    registrationManager.onRegistration(
        await registerDomNodeMutatedUnique(
            () => getElements('video'),
            async (video) => {

                const panelControlQuery = panelControlQueryHv?.value
                const panelControl = panelControlQuery ? document.querySelector(panelControlQuery) : undefined

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

    return async () => {
        await registrationManager.cleanupAll()
    }
}

const cleanupInstallation = new RegistrationManager()

const video_player_change_speed__Add_this_site_to_blacklist = async () => {
    if (await domainBlackList.add(location.host)) {
        await installOrUninstall()
        alert(`This site (${location.host}) has been added to the black list, you can call video_player_change_speed__Remove_this_site_from_blacklist() to remove it from the list if it was a mistake.`)
    }
}

const video_player_change_speed__Remove_this_site_from_blacklist = async () => {
    if (await domainBlackList.remove(location.host)) {
        await installOrUninstall()
        alert(`This site (${location.host}) has been removed from the black list, you can call video_player_change_speed__Add_this_site_to_blacklist() to add it to the list if it was a mistake.`)
    }
}

const video_player_change_speed__Add_this_site_to_simulate_play_pause_on_click_list = async () => {
    if (await domainSimulatePlayPauseOnClickList.add(location.host)) {
        await installOrUninstall()
        alert(`This site (${location.host}) has been added to the simulate play/pause on click list, you can call video_player_change_speed__Remove_this_site_from_simulate_play_pause_on_click_list() to remove it from the list if it was a mistake.`)
    }
}

const video_player_change_speed__Remove_this_site_from_simulate_play_pause_on_click_list = async () => {
    if (await domainSimulatePlayPauseOnClickList.remove(location.host)) {
        await installOrUninstall()
        alert(`This site (${location.host}) has been removed from the simulate play/pause on click list, you can call video_player_change_speed__Add_this_site_to_simulate_play_pause_on_click_list() to add it to the list if it was a mistake.`)
    }
}

exportOnWindow({
    video_player_change_speed__Add_this_site_to_blacklist,
    video_player_change_speed__Remove_this_site_from_blacklist,
    video_player_change_speed__Add_this_site_to_simulate_play_pause_on_click_list,
    video_player_change_speed__Remove_this_site_from_simulate_play_pause_on_click_list,
})

async function installOrUninstall() {
    await cleanupInstallation.cleanupAll()

    if (await domainBlackList.includes(location.host)) {
        console.log(`video-player-change-speed-on-drag: This site (${location.host}) is in the black list, skipping...`)
        console.log(`To remove this site from the black list, call video_player_change_speed__Remove_this_site_from_blacklist() in the console.${(window.location !== window.parent.location) ? ` This is an iframe for the url [${window.location.href}]. Be carefull to use the console of the iframe.` : ""}`)
    } else {
        console.log(`video-player-change-speed-on-drag: This site (${location.host}) is not in the black list, applying...`)
        console.log(`To add this site to the black list, call video_player_change_speed__Add_this_site_to_blacklist() in the console.${(window.location !== window.parent.location) ? ` This is an iframe for the url [${window.location.href}]. Be carefull to use the console of the iframe.` : ""}`)
        cleanupInstallation.onRegistration(await registerInstallation())
    }
    if (await domainBlackList.includes(location.host)) {
        cleanupInstallation.onRegistration(await registerMenuCommand('Remove this site from video speed change black list', video_player_change_speed__Remove_this_site_from_blacklist))
    } else {
        cleanupInstallation.onRegistration(await registerMenuCommand('Add this site to video speed change black list', video_player_change_speed__Add_this_site_to_blacklist))
    }

    if (await domainSimulatePlayPauseOnClickList.includes(location.host)) {
        cleanupInstallation.onRegistration(await registerMenuCommand('Remove this site from simulate play/pause on click list', video_player_change_speed__Remove_this_site_from_simulate_play_pause_on_click_list))
    } else {
        cleanupInstallation.onRegistration(await registerMenuCommand('Add this site to simulate play/pause on click list', video_player_change_speed__Add_this_site_to_simulate_play_pause_on_click_list))
    }

}

async function main() {
    panelControlQueryHv = await getPersistentParameterValueString(
        `panelControlQuery`,
        defaultPanelControlByHost[location.host],
        {
            scope: PERSISTENT_PARAMETER_SCOPE.BY_HOST
        }
    )

    panelControlQueryHv.register(async () => {
        await installOrUninstall()
    })

    await installOrUninstall()
}

main()
// @main_end{video-player-change-speed-on-drag}

console.log(`End - ${script_id}`)
