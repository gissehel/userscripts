// ==UserScript==
// @name        europresse-keyboard-bind
// @namespace   https://github.com/gissehel/userscripts
// @version     20260227-160749-886a002
// @description europresse-keyboard-bind
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
// @grant       none
// ==/UserScript==

const script_name = GM_info?.script?.name || 'no-name'
const script_version = GM_info?.script?.version || 'no-version'
const script_id = `${script_name} ${script_version}`
console.log(`Begin - ${script_id}`)


// @imported_begin{realWindow}
const realWindow = typeof window.unsafeWindow === 'undefined' ? window : window.unsafeWindow
// @imported_end{realWindow}

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

// @imported_begin{downloadDataUrl}
/**
 * Downloads a data url as a file
 * 
 * @param {String} url The data url to download
 * @param {String} filename The filename to use to save the file
 * @returns
 */
const downloadDataUrl = async (url, filename) => {
    const a = createElementExtended('a', {
        attributes: {
            href: url,
            target: '_blank',
            download: filename,
        },
    })
    a.click()
}
// @imported_end{downloadDataUrl}

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

// @main_begin{europresse-keyboard-bind}
const moveAccelerationRatio = 1.1;
const moveBaseDelta = 10;
const moveHistoryTimeout = 3000; // ms


const getKeyKey = ({ code, key, ctrlKey, shiftKey, altKey, metaKey }) => {
    return `${code}|${key}|${ctrlKey ? '1' : '0'}|${shiftKey ? '1' : '0'}|${altKey ? '1' : '0'}|${metaKey ? '1' : '0'}`
}

const removePx = (x) => {
    if (x.substr(-2) == "px") { return x.substr(0, x.length - 2) } else { return x }
}

const Direction = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    TOP: 'TOP',
    BOTTOM: 'BOTTOM',
}

registerDomNodeMutatedUnique(() => getElements('#currentDoc.panel'), (close_button) => {
    const next_button = getElements('#nextPdf')[0]
    const prev_button = getElements('#prevPdf')[0]
    const reset_zoom_button = getElements('#reset')[0]
    const pdf_pages_panel_btn = getElements('span.pdf-pages-panel-btn')[0]
    const downloadImage = () => downloadDataUrl(getElements('.imagePdf')[0].src, `europresse-${realWindow._docNameList[realWindow._docIndex]}`)
    const moveDirection = (direction, delta) => {
        const viewer = getElements('img.viewer-move')[0];
        exportOnWindow({ viewer });
        switch (direction) {
            case Direction.LEFT:   _pdfViewer.moveTo(viewer.offsetLeft + delta, viewer.offsetTop); break;
            case Direction.RIGHT:  _pdfViewer.moveTo(viewer.offsetLeft - delta, viewer.offsetTop); break;
            case Direction.TOP:    _pdfViewer.moveTo(viewer.offsetLeft, viewer.offsetTop + delta); break;
            case Direction.BOTTOM: _pdfViewer.moveTo(viewer.offsetLeft, viewer.offsetTop - delta); break;
            default:
                console.error(`Unknown direction: ${direction}`);
                break;
        }
    };
    const recentMoveHistory = [];
    exportOnWindow({ recentMoveHistory });
    const moveDirectionWithAcceleration = (direction) => {
        const timestamp = (new Date()).getTime();
        const historyField = { timestamp, direction };
        [...recentMoveHistory].forEach((item) => {
            if (item.direction !== direction || (timestamp - item.timestamp) > moveHistoryTimeout) {
                const index = recentMoveHistory.indexOf(item)
                if (index >= 0) {
                    recentMoveHistory.splice(index,1)
                }
            }
        });
        recentMoveHistory.push(historyField);
        let currentDelta = moveBaseDelta*(moveAccelerationRatio**(recentMoveHistory.length-1));
        moveDirection(direction, currentDelta);
    }
    const zoomDelta = 0.1;
    const zoom_in_action = () => _pdfViewer.zoom(zoomDelta)
    const zoom_out_action = () => _pdfViewer.zoom(-zoomDelta)
    const next_action = () => next_button.click();
    const prev_action = () => prev_button.click();
    const reset_zoom_action = () => reset_zoom_button.click();
    const togglePdfPagesPanel = () => pdf_pages_panel_btn.click();
    const moveLeft = () => moveDirectionWithAcceleration(Direction.LEFT);
    const moveRight = () => moveDirectionWithAcceleration(Direction.RIGHT);
    const moveUp = () => moveDirectionWithAcceleration(Direction.TOP);
    const moveDown = () => moveDirectionWithAcceleration(Direction.BOTTOM);
    const accessArchive = () => document.location.pathname = "/PDF/ArchiveResult";
    const actions = {
    }
    const addAction = (action, ...keyStructs) => {
        keyStructs.forEach((keyStruct) => {
            actions[getKeyKey(keyStruct)] = action
        })
    }
    exportOnWindow({ addAction });
    addAction(zoom_in_action,
        { key: 'ArrowDown', shiftKey: true },
        { key: 'j' },
        { key: '+' },
        { key: '+', shiftKey: true },
        { code: 'Numpad2' },
    )
    addAction(zoom_out_action,
        { key: 'ArrowUp', shiftKey: true },
        { key: 'k' },
        { key: '-' },
        { key: '-', shiftKey: true },
        { code: 'Numpad8' },
    )
    addAction(next_action,
        { key: 'l' },
        { key: 'ArrowRight', shiftKey: true },
        { code: 'Space' },
        { code: 'Numpad6' },
    )
    addAction(prev_action,
        { key: 'h' },
        { key: 'ArrowLeft', shiftKey: true },
        { key: 'Backspace' },
        { code: 'Numpad4' },
    )
    addAction(reset_zoom_action,
        { key: 'r' },
        { code: 'Numpad5' },
        { code: 'Numpad0' },
    )
    addAction(downloadImage,
        { key: 's' },
        { key: '/' },
    )
    addAction(togglePdfPagesPanel,
        { key: 'p' },
        { key: '*' },
    )
    addAction(moveUp,
        { key: 'ArrowDown' },
    )
    addAction(moveDown,
        { key: 'ArrowUp' },
    )
    addAction(moveLeft,
        { key: 'ArrowRight' },
    )
    addAction(moveRight,
        { key: 'ArrowLeft' },
    )
    addAction(accessArchive,
        { key: 'a' },
    )

    registerEventListener(document.body, 'keydown', (event) => {
        let result = false;
        ['code', 'key'].forEach((prop) => {

            const { code, key, ctrlKey, shiftKey, altKey, metaKey } = event
            const keyKey = getKeyKey({ code, key, ctrlKey, shiftKey, altKey, metaKey, [prop]: undefined })
            // console.log('keyKey', keyKey)
            if (actions[keyKey]) {
                actions[keyKey]()
                result = true
            }
        })
        return result
    })
})
// @main_end{europresse-keyboard-bind}

console.log(`End - ${script_id}`)
