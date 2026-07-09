// ==UserScript==
// @name        europresse-ensure-cache-for-already-downloaded-pages
// @namespace   https://github.com/gissehel/userscripts
// @version     20260709-095433-20694de
// @description europresse-ensure-cache-for-already-downloaded-pages
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       http://nouveau.europresse.com.docelec.enssib.fr/access/ip/default.aspx?un=ENSSIBT_1
// @match       https://2160010m-cas.esidoc.fr/*
// @match       https://europresse.ezproxy.univ-ubs.fr/*
// @match       https://nouveau-eureka-cc.ezproxy.biblioottawalibrary.ca/*
// @match       https://nouveau-eureka-cc.res.banq.qc.ca/*
// @match       https://nouveau-europresse-com.acces-distant.bnu.fr/*
// @match       https://nouveau-europresse-com.acces.bibliotheque-diderot.fr/*
// @match       https://nouveau-europresse-com.accesdistant.bu.univ-paris8.fr/*
// @match       https://nouveau-europresse-com.accesdistant.sorbonne-universite.fr/*
// @match       https://nouveau-europresse-com.bases-doc.univ-lorraine.fr/*
// @match       https://nouveau-europresse-com.bibdocs.u-cergy.fr/*
// @match       https://nouveau-europresse-com.bibelec.univ-lyon2.fr/*
// @match       https://nouveau-europresse-com.bnf.idm.oclc.org/*
// @match       https://nouveau-europresse-com.bpi.idm.oclc.org/*
// @match       https://nouveau-europresse-com.bsg-ezproxy.univ-paris3.fr/*
// @match       https://nouveau-europresse-com.bu-services.univ-antilles.fr/*
// @match       https://nouveau-europresse-com.buadistant.univ-angers.fr/*
// @match       https://nouveau-europresse-com.bunantes.idm.oclc.org/*
// @match       https://nouveau-europresse-com.buproxy2.univ-avignon.fr/*
// @match       https://nouveau-europresse-com.distant.bu.univ-rennes2.fr/*
// @match       https://nouveau-europresse-com.doc-elec.univ-lemans.fr/*
// @match       https://nouveau-europresse-com.docelec-u-paris2.idm.oclc.org/*
// @match       https://nouveau-europresse-com.docelec.insa-lyon.fr/*
// @match       https://nouveau-europresse-com.docelec.u-bordeaux.fr/*
// @match       https://nouveau-europresse-com.docelec.univ-lyon1.fr/*
// @match       https://nouveau-europresse-com.ehesp.idm.oclc.org/*
// @match       https://nouveau-europresse-com.em-lyon.idm.oclc.org/
// @match       https://nouveau-europresse-com.esc-clermont.idm.oclc.org/*
// @match       https://nouveau-europresse-com.essec.idm.oclc.org/*
// @match       https://nouveau-europresse-com.eu1.proxy.openathens.net/*
// @match       https://nouveau-europresse-com.extranet.enpc.fr/*
// @match       https://nouveau-europresse-com.ezp.lib.cam.ac.uk/*
// @match       https://nouveau-europresse-com.ezpaarse.univ-paris1.fr/*
// @match       https://nouveau-europresse-com.ezproxy.campus-condorcet.fr/*
// @match       https://nouveau-europresse-com.ezproxy.ensta-bretagne.fr/*
// @match       https://nouveau-europresse-com.ezproxy.hec.fr/*
// @match       https://nouveau-europresse-com.ezproxy.normandie-univ.fr/*
// @match       https://nouveau-europresse-com.ezproxy.u-bordeaux-montaigne.fr/*
// @match       https://nouveau-europresse-com.ezproxy.u-paris.fr/*
// @match       https://nouveau-europresse-com.ezproxy.u-pec.fr/*
// @match       https://nouveau-europresse-com.ezproxy.uca.fr/*
// @match       https://nouveau-europresse-com.ezproxy.uclouvain.be/*
// @match       https://nouveau-europresse-com.ezproxy.ulb.ac.be/*
// @match       https://nouveau-europresse-com.ezproxy.unilim.fr/*
// @match       https://nouveau-europresse-com.ezproxy.univ-artois.fr/*
// @match       https://nouveau-europresse-com.ezproxy.univ-catholille.fr/*
// @match       https://nouveau-europresse-com.ezproxy.univ-littoral.fr/*
// @match       https://nouveau-europresse-com.ezproxy.univ-orleans.fr/*
// @match       https://nouveau-europresse-com.ezproxy.univ-paris13.fr/*
// @match       https://nouveau-europresse-com.ezproxy.univ-paris3.fr/*
// @match       https://nouveau-europresse-com.ezproxy.univ-perp.fr/*
// @match       https://nouveau-europresse-com.ezproxy.univ-tln.fr/*
// @match       https://nouveau-europresse-com.ezproxy.universite-paris-saclay.fr/*
// @match       https://nouveau-europresse-com.ezproxy.upf.pf/*
// @match       https://nouveau-europresse-com.ezproxy.uphf.fr/*
// @match       https://nouveau-europresse-com.ezproxy.utbm.fr/*
// @match       https://nouveau-europresse-com.ezproxy.utc.fr/*
// @match       https://nouveau-europresse-com.ezproxy.vetagro-sup.fr/*
// @match       https://nouveau-europresse-com.ezpum.scdi-montpellier.fr/*
// @match       https://nouveau-europresse-com.ezpupv.scdi-montpellier.fr/*
// @match       https://nouveau-europresse-com.ezscd.univ-lyon3.fr/*
// @match       https://nouveau-europresse-com.eztest.biblio.univ-evry.fr/*
// @match       https://nouveau-europresse-com.faraway.parisnanterre.fr/*
// @match       https://nouveau-europresse-com.federation.unimes.fr/*
// @match       https://nouveau-europresse-com.gorgone.univ-toulouse.fr/*
// @match       https://nouveau-europresse-com.gutenberg.univ-lr.fr/*
// @match       https://nouveau-europresse-com.hub.tbs-education.fr/*
// @match       https://nouveau-europresse-com.iepnomade-2.grenet.fr/*
// @match       https://nouveau-europresse-com.lama.univ-amu.fr/*
// @match       https://nouveau-europresse-com.mediaproxy.imtbs-tsp.eu/*
// @match       https://nouveau-europresse-com.merlin.u-picardie.fr/*
// @match       https://nouveau-europresse-com.passerelle.univ-rennes1.fr/*
// @match       https://nouveau-europresse-com.portail.psl.eu/*
// @match       https://nouveau-europresse-com.proxy-bu1.u-bourgogne.fr/*
// @match       https://nouveau-europresse-com.proxy.bnl.lu/*
// @match       https://nouveau-europresse-com.proxy.openathens.net/*
// @match       https://nouveau-europresse-com.proxy.rubens.ens.fr/*
// @match       https://nouveau-europresse-com.proxy.scd.univ-tours.fr/*
// @match       https://nouveau-europresse-com.proxy.sciencespobordeaux.fr/*
// @match       https://nouveau-europresse-com.proxy.unice.fr/*
// @match       https://nouveau-europresse-com.proxy.univ-nc.nc/*
// @match       https://nouveau-europresse-com.proxy.utt.fr/*
// @match       https://nouveau-europresse-com.proxybib-pp.cnam.fr/*
// @match       https://nouveau-europresse-com.rennes-sb.idm.oclc.org/*
// @match       https://nouveau-europresse-com.ressources-electroniques.univ-lille.fr/*
// @match       https://nouveau-europresse-com.ressources.sciencespo-lyon.fr/*
// @match       https://nouveau-europresse-com.ressources.univ-poitiers.fr/*
// @match       https://nouveau-europresse-com.revproxy.escpeurope.eu/*
// @match       https://nouveau-europresse-com.rp1.ensam.eu/*
// @match       https://nouveau-europresse-com.rproxy.insa-rennes.fr/*
// @match       https://nouveau-europresse-com.rproxy.univ-pau.fr/*
// @match       https://nouveau-europresse-com.scd-proxy.uha.fr/*
// @match       https://nouveau-europresse-com.scd-proxy.univ-brest.fr/*
// @match       https://nouveau-europresse-com.scd1.univ-fcomte.fr/*
// @match       https://nouveau-europresse-com.scpo.idm.oclc.org/*
// @match       https://nouveau-europresse-com.sid2nomade-2.grenet.fr/*
// @match       https://nouveau-europresse-com.srvext.uco.fr/*
// @match       https://nouveau-europresse-com.ujm.idm.oclc.org/*
// @match       https://nouveau-europresse-com.univ-eiffel.idm.oclc.org/*
// @match       https://nouveau-europresse-com.univ-smb.idm.oclc.org/*
// @match       https://nouveau-europresse-com.urca.idm.oclc.org/*
// @match       https://nouveau.europresse.com.elgebar.univ-reunion.fr/*
// @match       https://nouveau.europresse.com/*
// @match       https://nouveau.europresse.com/access/ip/default.aspx?un=CENTRALENANTEST_1
// @match       https://nouveau.europresse.com/access/ip/default.aspx?un=U033137T_1
// @match       https://nouveau.europresse.com/access/ip/default.aspx?un=lausanneAT_1
// @icon        https://www.google.com/s2/favicons?sz=64&domain=nouveau.europresse.com
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.registerMenuCommand
// @grant       GM.unregisterMenuCommand
// ==/UserScript==

const script_name = GM_info?.script?.name || 'no-name'
const script_version = GM_info?.script?.version || 'no-version'
const script_id = `${script_name} ${script_version}`
console.log(`Begin - ${script_id}`)


// @imported_begin{realWindow}
const realWindow = typeof window.unsafeWindow === 'undefined' ? window : window.unsafeWindow
// @imported_end{realWindow}

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

// @imported_begin{Semaphore}
/**
 * A simple semaphore implementation to control concurrency.
 * Allows a maximum number of concurrent operations.
 */
class Semaphore {
    /**
     * Constructor for Semaphore.
     * @param {Number} maxConcurrent The maximum number of concurrent operations allowed.
     */
    constructor(name, maxConcurrent = 1) {
        this.name = name;
        this.maxConcurrent = maxConcurrent;
        this.current = 0;
        this.queue = [];
        this.debug = false;
    }

    /**
     * Acquires the semaphore, waiting if necessary until it becomes available.
     * 
     * @param {String} name The name or identifier for the acquire request. (for logging/debugging purposes)
     * @returns A promise that resolves when the semaphore is acquired.
     */
    async acquire(name = '') {
        if (this.current < this.maxConcurrent) {
            this.current++;
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            this.queue.push(() => {
                resolve();
            });
        });
    }

    /**
     * Releases the semaphore, allowing another waiting operation to proceed.
     * 
     * @param {String} name The name or identifier for the release request. (for logging/debugging purposes)
     */
    async release(name = '') {
        if (this.queue.length > 0) {
          const next = this.queue.shift();
          next();
        } else {
          this.current--;
        }
    }
}
// @imported_end{Semaphore}

// @imported_begin{SemaphoreNavigatorLocks}
/**
 * A semaphore implementation that uses Navigator Locks API for inter-tab synchronization.
 */
class SemaphoreNavigatorLocks {
    /**
     * Creates a new SemaphoreNavigatorLocks instance.
     * @param {string} name - The name of the semaphore. Should be unique to avoid conflicts with other semaphores using the same locking mechanism.
     * @param {number} maxConcurrent - The maximum number of concurrent locks.
     */
    constructor(name, maxConcurrent = 1) {
        this.name = name;
        this.maxConcurrent = maxConcurrent;
        this._lockName = `semaphore-${name}-lock`;
        this._slotPrefix = `semaphore-${name}-slot-`;
        this._countName = `semaphore-${name}-count`;
        this._slotsPromises = []
        this._localIndexes = []
    }

    /**
     * Acquires a lock on the semaphore.
     * @param {string} name - The name of the lock request. (for logging/debugging purposes)
     */
    async acquire(name) {
        // console.log(`${new Date().toISOString()} Requesting lock: ${name} for [(${this.name},${this.maxConcurrent})]`);
        let indexSlot = null;

        while (indexSlot === null) {
            await navigator.locks.request(this._lockName, async (lock) => {
                // console.log(`${new Date().toISOString()} Lock acquired: ${name} for [(${this.name},${this.maxConcurrent})]`);

                const slotPromises = Array
                    .from({ length: this.maxConcurrent }, (_, i) => i)
                    .map(async (i) => {
                        return navigator.locks.request(this._slotPrefix + i, { mode: 'exclusive', ifAvailable: true }, async (slotLock) => {
                            if (slotLock && indexSlot === null) {
                                // console.log(`${new Date().toISOString()} Slot ${i} acquired: ${name} for [(${this.name},${this.maxConcurrent})]`);
                                indexSlot = i;
                                await new Promise((resolve) => {
                                    this._slotsPromises[i] = resolve;
                                });
                            }
                        })
                    });

                Promise.all(slotPromises);

                // console.log(`${new Date().toISOString()} Releasing lock: ${name} for [(${this.name},${this.maxConcurrent})]`);
            });
            // console.log(`${new Date().toISOString()} End request: ${name} for [(${this.name},${this.maxConcurrent})]`);

            if (indexSlot === null) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }

        this._localIndexes.push(indexSlot);
        // console.log(`${new Date().toISOString()} Lock acquired and slot assigned: ${name} (slot ${indexSlot}) for [(${this.name},${this.maxConcurrent})]`);
    }

    /**
     * Releases a lock on the semaphore.
     * @param {string} name - The name of the lock request. (for logging/debugging purposes)
     */
    async release(name) {
        // console.log(`${new Date().toISOString()} Releasing lock: ${name} for [(${this.name},${this.maxConcurrent})]`);
        await navigator.locks.request(this._lockName, async (lock) => {
            // console.log(`${new Date().toISOString()} Lock acquired: ${name} for [(${this.name},${this.maxConcurrent})]`);

            const indexSlot = this._localIndexes.shift();
            if (indexSlot !== undefined) {
                const releaseSlot = this._slotsPromises[indexSlot];
                if (releaseSlot) {
                    this._slotsPromises[indexSlot] = null;
                    releaseSlot();
                }
            }

            // console.log(`${new Date().toISOString()} Releasing lock: ${name} for [(${this.name},${this.maxConcurrent})]`);
        });
        // console.log(`${new Date().toISOString()} Lock released: ${name} for [(${this.name},${this.maxConcurrent})]`);
    }
}
// @imported_end{SemaphoreNavigatorLocks}

// @imported_begin{SemaphoreProxy}
/**
 * A proxy for a semaphore that adds logging around acquire and release operations.
 */
class SemaphoreProxy {
    /**
     * Creates a new SemaphoreProxy instance.
     * @param {class} SemaphoreClass - The semaphore class to proxy.
     * @param {string} name - The name of the semaphore.
     * @param {number} maxConcurrent - The maximum number of concurrent locks.
     */
    constructor(SemaphoreClass, name, maxConcurrent = 1) {
        this.semaphore = new SemaphoreClass(name, maxConcurrent);
        this.name = name;
        this.maxConcurrent = maxConcurrent;
    }

    /**
     * Acquires a lock on the semaphore.
     * @param {string} name - The name of the lock request. (for logging/debugging purposes)
     */
    async acquire(name) {
        console.log(`${(new Date()).toISOString()} Begin acquire semaphore ${name} on [(${this.name},${this.maxConcurrent})]`);
        await this.semaphore.acquire(name);
        console.log(`${(new Date()).toISOString()} End acquire semaphore ${name} on [(${this.name},${this.maxConcurrent})]`);
    }

    /**
     * Releases a lock on the semaphore.
     * @param {string} name - The name of the lock request. (for logging/debugging purposes)
     */
    async release(name) {
        console.log(`${(new Date()).toISOString()} Begin release semaphore ${name} on [(${this.name},${this.maxConcurrent})]`);
        await this.semaphore.release(name);
        console.log(`${(new Date()).toISOString()} End release semaphore ${name} on [(${this.name},${this.maxConcurrent})]`);
    }
}
// @imported_end{SemaphoreProxy}

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
        const getMenuLabel = options?.getMenuLabel ?? ((parameterName, newValue) => `⚙️ Change ${parameterName} (current : ${newValue})`);
        const onParameterNeedNewValue = options?.onParameterNeedNewValue ?? (async (oldValue) => {
            const newValue = prompt(`⌨️ Enter new value for ${parameterName}:`, oldValue);
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
                    alert(`ℹ️ Parameter [${parameterName}] is set to ${hookableValue.value}`);
                }
            });
            hookableValue.value = value;
        }

        return hookableValueParameterValues[parameterName];
    }
})();
exportOnWindow({ getPersistentParameterValue });
// @imported_end{getPersistentParameterValue}

// @imported_begin{getPersistentParameterValueBoolean}
/**
 * Gets the persistent boolean value of a parameter, and registers menu commands to toggle it.
 * The parameter state is persisted in the monkey storage, so it will be remembered across page reloads.
 * 
 * The menu command will be "Enable {parameterName}" if the parameter is currently disabled, 
 * and "Disable {parameterName}" if the parameter is currently enabled. When the menu command is selected, 
 * the parameter value will be toggled.
 * 
 * @param {String} parameterName The name of the parameter (used for menu command and storage)
 * @param {Boolean} defaultValue The default value of the parameter
 * @param {GetPersistentParameterValueOptions} [options] Additional options
 * @returns {Promise<HookableValue<Boolean>>} The hookable value for the parameter
 */
const getPersistentParameterValueBoolean = async (parameterName, defaultValue, options) => {
    return await getPersistentParameterValue(parameterName, defaultValue, {
        onParameterNeedNewValue: async (oldValue) => {
            return !oldValue;
        },
        getMenuLabel: async (parameterName, newValue) => {
            return `${newValue ? '❌ Disable' : '✅ Enable'} ${parameterName}`;
        },
        ...options,
    })
}
// @imported_end{getPersistentParameterValueBoolean}

// @imported_begin{getPersistentParameterValueNumber}
/**
 * Gets the persistent number value of a parameter, and registers menu commands to change it.
 * The parameter state is persisted in the monkey storage, so it will be remembered across page reloads.
 * The menu command will be "Change {parameterName} (current : {currentValue})". When the menu command is selected, the new value will be asked, and the parameter value will be updated.
 * 
 * @param {String} parameterName The name of the parameter (used for menu command and storage)
 * @param {Number} defaultValue The default value of the parameter
 * @param {GetPersistentParameterValueOptions} [options] Additional options
 * @returns {Promise<HookableValue<Number>>} The hookable value for the parameter
 */
const getPersistentParameterValueNumber = async (parameterName, defaultValue, options) => {
    return await getPersistentParameterValue(parameterName, defaultValue, {
        onParameterNeedNewValue: async (oldValue) => {
            const newValueString = prompt(`⌨️ Enter new value for ${parameterName}:`, oldValue);
            const newValue = Number(newValueString);
            return newValue;
        },
        getMenuLabel: async (parameterName, newValue) => {
            return `⚙️ Change ${parameterName} (current : ${newValue})`;
        },
        ...options,
    })
}
// @imported_end{getPersistentParameterValueNumber}

// @main_begin{europresse-ensure-cache-for-already-downloaded-pages}
const main = async () => {
    const useNavigatorLocksSemaphore = await monkeyGetSetValue('useNavigatorLocksSemaphore', true);
    const useProxySemaphore = await monkeyGetSetValue('useProxySemaphore', false);
    const downloadCooldown = await getPersistentParameterValueNumber(`downloadCooldown`, 0, { scope: PERSISTENT_PARAMETER_SCOPE.BY_HOST });

    exportOnWindow({ createElementExtended, delay, Semaphore, SemaphoreNavigatorLocks, SemaphoreProxy });

    // #region Waiting screen management
    const createWaitingScreen = () => {
        const waitingScreen = createElementExtended('div', {
            id: 'waiting-screen',
            style: {
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                backgroundColor: 'rgba(0, 0, 0)',
                color: 'white',
                display: 'none',
                opacity: '0.7',
            },
            parent: document.body,
            children: [
                createElementExtended('div', {
                    style: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '30px',
                        fontWeight: 'bold',
                    },
                    text: 'Loading, please wait...'
                })
            ]
        });
        return waitingScreen;
    }
    exportOnWindow({ createWaitingScreen });

    const waitingScreenSemaphore = new Semaphore('waitingScreenSemaphore', 1);
    exportOnWindow({ waitingScreenSemaphore });

    let waitingTasksCount = 0;
    let waitingScreenSemaphoreIndex = 0;

    const showWaitingScreen = async () => {
        const uid = `showWaitingScreen-${++waitingScreenSemaphoreIndex}`;
        await waitingScreenSemaphore.acquire(uid);
        if (waitingTasksCount === 0 && realWindow.waitingScreen) {
            realWindow.waitingScreen.style.display = 'block';
        }
        waitingTasksCount++;
        waitingScreenSemaphore.release(uid);
    }
    exportOnWindow({ showWaitingScreen });

    const hideWaitingScreen = async () => {
        const uid = `hideWaitingScreen-${++waitingScreenSemaphoreIndex}`;
        await waitingScreenSemaphore.acquire(uid);
        waitingTasksCount--;
        if (waitingTasksCount === 0 && realWindow.waitingScreen) {
            realWindow.waitingScreen.style.display = 'none';
        }
        waitingScreenSemaphore.release(uid);
    }
    exportOnWindow({ hideWaitingScreen });
    // #endregion

    // #region progressBar
    let progressBarItems = {}
    let progressBarItemsByIndex = []
    exportOnWindow({ progressBarItems, progressBarItemsByIndex });
    const progressBarColors = {
        DEFAULT: '#ffffff',
        LOADING: '#ffff00',
        LOADED: '#bbbb00',
        CURRENTDEFAULT: '#ffdddd',
        CURRENTLOADING: '#ff8888',
        CURRENT: '#ff0000',
    }

    const createProgressBar = () => {
        const height = '3px';
        const progressBarContainer = createElementExtended('div', {
            id: 'progress-bar-container',
            style: {
                position: 'fixed',
                bottom: '0px',
                left: '0px',
                right: '0px',
                height,
                backgroundColor: '#ffffff',
                zIndex: '1000',
            },
            parent: document.body,
            children: [
                realWindow._docNameList.map((docName, index) => {
                    const progressBarItem = createElementExtended('div', {
                        id: `progress-bar-item-${index}`,
                        style: {
                            height,
                            backgroundColor: progressBarColors.DEFAULT,
                            left: `${(index * 100) / realWindow._docNameList.length}%`,
                            right: `${100 - ((index + 1) * 100) / realWindow._docNameList.length}%`,
                            opacity: '1',
                            transition: 'background-color 0.3s ease',
                            position: 'absolute',
                        },
                        onCreated: (el) => {
                            const progressBarItem = {
                                element: el,
                                color: progressBarColors.DEFAULT,
                            }
                            progressBarItemsByIndex[index] = progressBarItem;
                            progressBarItems[docName] = progressBarItem;
                        }
                    });
                    return progressBarItem;
                })
            ]
        });
        return progressBarContainer;
    };
    exportOnWindow({ createProgressBar });

    let lastCurrent = null;
    const progressBarUpdateCurrent = (pageName) => {
        if (lastCurrent) {
            switch (lastCurrent.color) {
                case progressBarColors.CURRENT:
                    lastCurrent.color = progressBarColors.LOADED;
                    break;
                case progressBarColors.CURRENTLOADING:
                    lastCurrent.color = progressBarColors.LOADING;
                    break;
                case progressBarColors.CURRENTDEFAULT:
                    lastCurrent.color = progressBarColors.DEFAULT;
                    break;
                default:
                    break;
            }
            lastCurrent.element.style.backgroundColor = lastCurrent.color;
        }
        const current = progressBarItems[pageName];
        if (current) {
            switch (current.color) {
                case progressBarColors.LOADED:
                    current.color = progressBarColors.CURRENT;
                    break;
                case progressBarColors.LOADING:
                    current.color = progressBarColors.CURRENTLOADING;
                    break;
                case progressBarColors.DEFAULT:
                    current.color = progressBarColors.CURRENTDEFAULT;
                    break;
                default:
                    break;
            }
            current.element.style.backgroundColor = current.color;
        }
        lastCurrent = current;
    }
    exportOnWindow({ progressBarUpdateCurrent });
    const progressBarStartLoading = (pageName) => {
        const item = progressBarItems[pageName];
        if (item) {
            switch (item.color) {
                case progressBarColors.DEFAULT:
                    item.color = progressBarColors.LOADING;
                    break;
                case progressBarColors.CURRENTDEFAULT:
                    item.color = progressBarColors.CURRENTLOADING;
                    break;
                default:
                    break;
            }
            item.element.style.backgroundColor = item.color;
        }
    }
    exportOnWindow({ progressBarStartLoading });
    const progressBarFinishLoading = (pageName) => {
        const item = progressBarItems[pageName];
        if (item) {
            switch (item.color) {
                case progressBarColors.LOADING:
                    item.color = progressBarColors.LOADED;
                    break;
                case progressBarColors.CURRENTLOADING:
                    item.color = progressBarColors.CURRENT;
                    break;
                default:
                    break;
            }
            item.element.style.backgroundColor = item.color;
        }
    }
    exportOnWindow({ progressBarFinishLoading });
    // #endregion

    // #region preserve legacy functions
    const legacyRenderPdf = realWindow.renderPdf;
    const legacyOpenPdf = realWindow.openPdf;
    exportOnWindow({ legacyRenderPdf, legacyOpenPdf });
    // #endregion

    // #region cache management
    const imageCache = {};
    exportOnWindow({ imageCache });

    const getImageCount = (imageName) => {
        return new Promise((resolve, reject) => {
            const jqueryPromise = $.ajax({
                type: "GET",
                url: `/Pdf/ImageList?docName=${encodeURIComponent(imageName)}`,
                contentType: "application/json; charset=utf-8",
                dataType: "html"
            });
            jqueryPromise.done((data) => {
                const index = parseInt(data);
                resolve(data);
            })
            jqueryPromise.fail((err) => reject(err));
        })
    }
    exportOnWindow({ getImageCount });

    const getImage = (index, imageName) => {
        return new Promise((resolve, reject) => {
            const time = (new Date).getTime();
            const url = `/Pdf/ImageBytes?imageIndex=${index}&id=${imageName}&cache=${time}`;
            const jqueryPromise = $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf-8",
                data: {}
            });
            jqueryPromise.done((data) => resolve(data));
            jqueryPromise.fail((err) => reject(err));
        })
    }
    exportOnWindow({ getImage });

    const getCacheSemaphoreClass = () => {
        if (useNavigatorLocksSemaphore) {
            return SemaphoreNavigatorLocks
        } else {
            return Semaphore
        }
    }

    const getCacheSemaphore = () => {
        if (useProxySemaphore) {
            return new SemaphoreProxy(getCacheSemaphoreClass(), 'europresse_cache', 1);
        } else {
            return new (getCacheSemaphoreClass())('europresse_cache', 1);
        }
    }

    let cacheSemaphore = getCacheSemaphore();
    exportOnWindow({ cacheSemaphore });

    const allPagesCachedHookableValue = new HookableValue(false);
    let uidcache = 0;
    let currnentUrgentPage = null;
    const ensurePageCached = async (imageIndex, urgent) => {
        if (imageIndex < 0 || imageIndex >= realWindow._docNameList.length) {
            return [""];
        }
        const imageName = realWindow._docNameList[imageIndex];
        if (imageCache[imageName]) {
            return imageCache[imageName];
        }

        if (urgent) {
            currnentUrgentPage = imageName;
        }

        if (!urgent && currnentUrgentPage) {
            await delay(1000);
        }

        const uidName = `${imageName}-${++uidcache}`;
        await cacheSemaphore.acquire(uidName);

        if (imageCache[imageName]) {
            await cacheSemaphore.release(uidName);
            return imageCache[imageName];
        }

        if (urgent && currnentUrgentPage !== imageName) {
            await cacheSemaphore.release(uidName);
            return [""];
        }

        progressBarStartLoading(imageName);
        const imageCount = await getImageCount(imageName);
        const cache = []
        for (let index = 0; index < imageCount; index++) {
            cache.push(await getImage(index, imageName));
        }
        if (cache.length !== imageCount*1) {
            console.error(`Expected ${imageCount} images for ${imageName}, but got ${cache.length}`);
        } else {
            imageCache[imageName] = cache;
        }
        progressBarFinishLoading(imageName);

        await allPagesCachedHookableValue.setValue(Object.values(_docNameList).every(name => imageCache[name] !== undefined));

        if (urgent && currnentUrgentPage === imageName) {
            currnentUrgentPage = null;
        }

        console.log(`ensurePageCached done for ${imageName} with ${imageCount} image(s)`);

        await delay(200);
        await delay(downloadCooldown);

        await cacheSemaphore.release(uidName);
        return imageCache[imageName];
    }
    exportOnWindow({ ensurePageCached });

    const getImageCached = async (index, imageName, size) => {
        if (!imageCache[imageName] || !imageCache[imageName][index]) {
            return "";
        }
        return imageCache[imageName][index];
    }
    exportOnWindow({ getImageCached });


    const getImageCountReady = async (imageIndex) => {
        const imageName = realWindow._docNameList[imageIndex];
        if (!imageCache[imageName]) {
            return 0
        }
        return imageCache[imageName].length;
    }
    exportOnWindow({ getImageCountReady });

    const ensureCurrentPageCached = async () => {
        const result = await ensurePageCached(realWindow._docIndex, true);
        if (result[0].length > 0) {
            ensurePageCached(realWindow._docIndex + 1);
            ensurePageCached(realWindow._docIndex - 1);
        }
        return result;
    }
    exportOnWindow({ ensureCurrentPageCached });
    // #endregion

    // #region original functions overrides
    const renderPdf = async (imageCount, imageName, asSubCall) => {
        await showWaitingScreen();
        for (var htmlContent = "", viewerOffset = $(".viewer-move").length !== 0 ? $(".viewer-move").offset() : null, imageIndex = 0; imageIndex < imageCount; imageIndex++) {
            progressBarUpdateCurrent(imageName)
            if (!asSubCall) {
                await ensurePageCached(realWindow._docIndex, true);
            }
            const data = await getImageCached(imageIndex, imageName, imageCount)
            htmlContent += "<div id='rawimagewrapper'><img id='imagePdf" + imageIndex + "' class='imagePdf' src='data:image/png;base64," + data + "' /><\/div>";
            $("#pdfDocument").html(htmlContent);
            _pdfViewer = new Viewer(document.getElementById("rawimagewrapper"), {
                inline: !0,
                button: !1,
                title: !1,
                toolbar: !1,
                transition: !1,
                navbar: !1,
                zoomRatio: .7,
                minZoomRatio: .25,
                maxZoomRatio: 10,
                viewed: function () {
                    _ratio !== null && _pdfViewer.zoomTo(_ratio);
                    viewerOffset != null && _pdfViewer.moveTo(viewerOffset.left, viewerOffset.top)
                },
                zoomed: function (n) {
                    _ratio = n.detail.ratio
                }
            })
        }
        await hideWaitingScreen();
    }
    exportOnWindow({ renderPdf });

    const openPdf = async (n) => {
        progressBarUpdateCurrent(realWindow._docNameList[realWindow._docIndex])
        await showWaitingScreen();
        await ensureCurrentPageCached();

        let imageCount = await getImageCountReady(realWindow._docIndex);

        if (imageCount > 1) {
            imageCount = 1
        }
        await renderPdf(imageCount, realWindow._docNameList[realWindow._docIndex], true);
        onSwipePdf();
        await hideWaitingScreen();
        $("#pdf").css({
            opacity: 1
        });
        $("#loading").fadeOut().remove();
        scrollImages(0, 0);
        updateNavigationState();
        selectCurrentPage(n)
    }
    exportOnWindow({ openPdf });
    // #endregion

    // #region auto-cache all pages
    const loadAllPages = async () => {
        if (realWindow['_docNameList']) {
            for (let index = 0; index < realWindow._docNameList.length; index++) {
                await ensurePageCached(index);
                // await delay(1000);
            }
        }
    }
    exportOnWindow({ loadAllPages });
    // #endregion

    // #region inspect image type
    const getMagic2 = (data) => {
        let result = '';
        for (let i = 0; i < 2; i++) {
            const hex = data.charCodeAt(i).toString(16);
            result += (hex.length === 2 ? hex : '0' + hex);
        }
        return result
    }
    exportOnWindow({ getMagic2 });

    const identifyImageMimeType = (data) => {
        const magic2 = getMagic2(data);
        switch (magic2) {
            case '8950': return 'image/png';
            case 'ffd8': return 'image/jpeg';
            case '4749': return 'image/gif';
            default:
                return 'application/octet-stream';
        }
    }
    exportOnWindow({ identifyImageMimeType });
    // #endregion

    if (realWindow._docNameList) {
        createProgressBar();

        /** @type{Promise<void>} */
        const allLoaded = new Promise((resolve) => {
            if (allPagesCachedHookableValue.value) {
                resolve();
            } else {
                await allPagesCachedHookableValue.register(async (newValue) => {
                    if (newValue) {
                        resolve();
                    }
                });
            }
        });

        /** @type{Promise<void>|null} */
        let allLoadedAutoloadFunctionResult = null;
        const autoLoadAllPages = await getPersistentParameterValueBoolean('autoLoadAllPages', false, { scope: PERSISTENT_PARAMETER_SCOPE.BY_HOST });
        await autoLoadAllPages.register(async (newValue) => {
            if (newValue && !allLoadedAutoloadFunctionResult) {
                allLoadedAutoloadFunctionResult = loadAllPages();
            }
        });

        exportOnWindow({ allLoaded, autoLoadAllPages, allLoadedAutoloadFunctionResult });

        const waitingScreen = createWaitingScreen();
        exportOnWindow({ waitingScreen });

        const enumerateCachedPages = async function* () {
            await allLoaded;
            for (let docIndex = 0; docIndex < realWindow._docNameList.length; docIndex++) {
                const imageName = realWindow._docNameList[docIndex];
                const imageCount = imageCache[imageName].length;
                for (let imageIndex = 0; imageIndex < imageCount; imageIndex++) {
                    const base64Data = imageCache[imageName][imageIndex];
                    const imgData = atob(base64Data);
                    const imgArray = new Uint8Array(imgData.length);
                    for (let i = 0; i < imgData.length; i++) {
                        imgArray[i] = imgData.charCodeAt(i);
                    }
                    const mimeType = identifyImageMimeType(imgData);
                    yield {
                        mimeType,
                        docIndex,
                        imageIndex,
                        imageName,
                        imgArray,
                    };
                }
            }
        }
        exportOnWindow({ enumerateCachedPages });
    }
}

main();
// @main_end{europresse-ensure-cache-for-already-downloaded-pages}

console.log(`End - ${script_id}`)
