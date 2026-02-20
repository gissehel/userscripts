// ==UserScript==
// @name        articles-summarize
// @namespace   https://github.com/gissehel/userscripts
// @version     20260206-195947-93cadaf
// @description articles-summarize : Create prompt to summarize articles
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       https://www.livescience.com/*
// @match       https://www.lemonde.fr/*
// @match       https://nouveau-europresse-com.bnf.idm.oclc.org/Search/ResultMobile/*
// @match       https://nouveau-europresse-com.bnf.idm.oclc.org/Document/*
// @match       https://www.liberation.fr/*
// @match       https://www.lefigaro.fr/*
// @match       https://www.20minutes.fr/*
// @match       https://www.leparisien.fr/*
// @match       https://www.mediapart.fr/journal/*/*/*
// @match       https://www-mediapart-fr.bnf.idm.oclc.org/journal/*/*/*
// @match       https://sciencepost.fr/*/
// @icon        https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

const script_name = GM_info?.script?.name || 'no-name'
const script_version = GM_info?.script?.version || 'no-version'
const script_id = `${script_name} ${script_version}`
console.log(`Begin - ${script_id}`)


// @imported_begin{readyPromise}
/**
 * A promise that is resolved when the html DOM is ready. 
 * Should be part of any browser, but is not.
 * 
 * @type {Promise<void>} A promise that is resolved when the html DOM is ready
 */
const readyPromise = new Promise((resolve, reject) => {
    if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
        setTimeout(() => resolve(), 1);
    } else {
        const onContentLoaded = () => {
            resolve();
            document.removeEventListener('DOMContentLoaded', onContentLoaded, false);
        }
        document.addEventListener('DOMContentLoaded', onContentLoaded, false);
    }
})
// @imported_end{readyPromise}

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

// @imported_begin{copyNodeToClipboard}
/**
 * Copies the content of a DOM node to the clipboard (both HTML and plain text).
 * Requires that the user has interacted with the page (e.g. a click event).
 * 
 * @param {HTMLElement} element The element containing the text to select/copy
 * @param {Object} [options] Options object
 * @param {boolean} [options.keepSelection=false] If true, keeps the selection after copying
 */
const copyNodeToClipboard = async function (element, options) {
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    if (!options) {
        options = { keepSelection: false };
    }

    if (!options.keepSelection) {
        selection.removeAllRanges();
    }

    try {
        const clipboardItemParams = Object.fromEntries([
            ["text/html", (element) => element.outerHTML],
            ["text/plain", (element) => element.innerText],
        ].map(([type, dataFunc]) => [type, new Blob([dataFunc(element)], { type })]));
        await navigator.clipboard.write([new ClipboardItem(clipboardItemParams)]);
    } catch (err) {
        console.error("Impossible de copier le HTML :", err);
    }
}
// @imported_end{copyNodeToClipboard}

// @imported_begin{getDomain}
/**
 * Gets the domain name from the current document location.
 * 
 * @returns {string} The domain name (e.g. example.com)
 */
const getDomain=()=>document.location.hostname.split('.').slice(-2).join('.');
// @imported_end{getDomain}

// @imported_begin{waitUserActivation}
/**
 * Waits for the user to activate the page by clicking anywhere.
 * 
 * @returns {Promise<void>} Resolves when the user activates the page
 */
const waitUserActivation = async () => {
  return new Promise((resolve) => {
    const listener = () => {
      window.removeEventListener("click", listener)
      resolve()
    }
    window.addEventListener("click", listener)
  })
}
// @imported_end{waitUserActivation}

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

// @imported_begin{monkeyGetSetOptions}
/**
 * Récupère les options en utilisant les valeurs stockées ou les valeurs par défaut
 * 
 * @param {Object<String, Object>} baseOptions Les valeurs par défaut des options
 * @returns {Object<String, Object>} Les options récupérées
 */
const monkeyGetSetOptions = (baseOptions) => {
    const options = Object.fromEntries(Object.entries(baseOptions).map(([k, v]) => [k, monkeyGetSetValue(k, v)]));
    return options;
}
// @imported_end{monkeyGetSetOptions}

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

// @imported_begin{bindOnClick}
/**
 * Bind an onClick handler an element. Returns uninstall handler
 * 
 * @param {HTMLElement} element The element to bind the handler
 * @param {()=>boolean|undefined} callback The onClick handler
 * @returns {()=>{}}
 */
const bindOnClick = (element, callback) => {
    const onClick = (e) => {
        const result = callback()
        if (result !== false) {
            e.preventDefault()
            e.stopImmediatePropagation()
        }
    }
    return registerEventListener(element, 'click', onClick, true);
}
// @imported_end{bindOnClick}

// @imported_begin{openLinkInNewTab}
/**
 * Open a link in a new tab
 * @param {string} url 
 */
const openLinkInNewTab = (url) => {
    const link = createElementExtended('a', {
        attributes: {
            href: url,
            target: '_blank',
        },
    })
    link.click();
}
// @imported_end{openLinkInNewTab}

// @main_begin{articles-summarize}
// Exemples pour test:
// * https://www.lemonde.fr/planete/article/2025/10/14/pollution-atmospherique-il-faut-reduire-les-emissions-humaines-pendant-les-tempetes-de-sable-selon-l-anses_6646592_3244.html
// * https://www.lemonde.fr/planete/article/2025/09/01/les-emissions-de-gaz-a-effet-de-serre-continuent-leur-progression-malgre-les-bons-chiffres-chinois_6637986_3244.html
// * https://www.lemonde.fr/planete/article/2025/10/14/pollution-atmospherique-il-faut-reduire-les-emissions-humaines-pendant-les-tempetes-de-sable-selon-l-anses_6646592_3244.html
// * https://www.liberation.fr/politique/reforme-des-retraites-493-deficit-ce-quil-faut-retenir-de-la-declaration-de-politique-general-de-sebastien-lecornu-20251014_6Q5XRISHGVAO5OT7HVTXF3RIQQ/
// * https://www.lefigaro.fr/conjoncture/taxe-sur-les-holdings-contribution-sur-les-hauts-revenus-les-premieres-mesures-du-budget-lecornu-devoilees-20251014
// * https://www.20minutes.fr/paris/4179419-20251015-si-seine-atteignant-9-10-paris-assiste-exercice-simulation-crue-ratp
// * https://www.leparisien.fr/economie/retraites/suspension-de-la-reforme-des-retraites-un-trimestre-de-moins-a-travailler-cest-toujours-bon-a-prendre-15-10-2025-PUMPIITUC5H2RAAPRYLK524CSQ.php
// * https://www.livescience.com/planet-earth/earthquakes/link-between-cascadia-and-san-andreas-fault-earthquakes-discovered-30-years-after-lost-vessel-stumbled-across-key-data
// * https://sciencepost.fr/des-archeologues-se-sont-mis-a-cuisiner-comme-neandertal-et-ont-decouvert-quelque-chose-de-troublant/

const siteInfos = {
    "lemonde.fr": {
        toremove: [
            'figure',
            'section.catcher',
            'section.author',
            'section.article__reactions',
            'section.js-services-inread',
            'section.inread',
        ],
        article: '.article__content',
    },
    "nouveau-europresse-com.bnf.idm.oclc.org": {
        toremove: [],
        article: '.docOcurrContainer',
    },
    "liberation.fr": {
        toremove: [
            '.skAfM',
        ],
        article: 'article',
    },
    "lefigaro.fr": {
        toremove: [
            'figure',
            '.fig-wrapper',
            '.fig-crosslinking',
            '.fig-free',
            '.fig-wrapper-follow-button',
            '.fig-tags',
            '.fig-sharebar',
            '.ext-player',
            '.fig-a11y-skip',
            '.a11y-hidden',
            '.fig-ad-content',
            '.fig-quote',
            '.fig-body-link',
            '.fig-table-contents',
        ],
        article: 'article',
    },
    "20minutes.fr": {
        toremove: [
            'figure',
            'article header',
            '.c-ad-placeholder',
            '.c-link',
            '.c-read-also-banner',
            'article.o-paper__content footer',
        ],
        title: 'section header h1',
        abstract: 'section header span:last-child',
        article: 'article.o-paper__content',
    },
    "leparisien.fr": {
        toremove: [
            '.dailymotion-suggestion_container',
            '.article-read-also_container',
            'figure',
        ],
        title: 'header h1',
        abstract: 'header .subheadline',
        article: '.article-section',
    },
    "livescience.com": {
        toremove: [
            'aside',
            'figure',
            '.fancy-box',
            '.hero-image-wrapper',
            '.byline',
            '#article-body script',
            '.slice-container-newsletterForm',
            '.ad-unit',
            '.slice-container',
            '.imageGallery-wrapper',
            '.slice-container-imageGallery',
            '#article-body hr',
        ],
        title: '.news-article header h1',
        abstract: '.news-article header .byline-social .strapline',
        article: '#article-body',
    },
    "sciencepost.fr": {
        toremove: [
            'figure',
        ],
        title: 'h1.entry-title',
        abstract: 'div.entry-content p strong:first-child',
        article: 'div.entry-content',
    },
    "www.mediapart.fr": {
        toremove: [
            'figure',
            'aside',
        ],
        title: 'h1#page-title',
        abstract: 'p.news__heading__top__intro',
        article: '.news__body__center__article',
    },
}

siteInfos["www-mediapart-fr.bnf.idm.oclc.org"] = siteInfos["www.mediapart.fr"];

const baseOptions = {
    language: 'English',
    prompts: [
        "Could you summarize the following article in {{language}} using a hierarchical bullet-point structure in Markdown?",
        "Please include bullet points at every level, including for main headings and subheadings.",
        "Only use bullet points—no extra characters—and make sure the hierarchy is clear through indentation.",
        "Do not add separators between sections; the bullet points alone should convey the structure.",
        "",
        "Here is the article:",
    ],
    llmEngines: [
        {
            name: "ChatGPT",
            url: "https://chatgpt.com/",
            domain: "chatgpt.com",
            icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABfUlEQVQ4ja3TPUiXURgF8N9rQQZ9SgmF0JAFgllB/fGDMAxpECGiIVqkoYIEIRpaguaWliDChkQcTGhKsZSioGwosqE1KoOUoCIdlMhquM8bL3/ERZ/p3ufeezjPOeeywsqW6K3FMRyN/RO8iPU8/i4HkKEHTRhBFc7jPRYwjTt4lz9YUwZwCGdwGYvowEfcxSg24CJe41sRIMMpXMcrzOEqBjCGE2jAPWzBPjyDigBoQRdexpw1QXsXBuPODG7gAHbmlHOATtwviPUb7diBB9iNT7iGrwGwtTjCSUxiHfZjNgS7gnGUcAHbg8WeWL/JGUzieIjzJ4TKz0TvlmRhCY9wsMjgA86iHrfxFkdwGG0h8MMAncVGbMZ4DrCAVmyTQvQDv0Kbp/gZI21CHRola6eKNL/ECJdQHXRPYwq1+Iz18bgfz5XVXgyjW/K8Hb3ok5JZgyEpbP+rPMr1OCfZVynZ14vvUioncFPhPyz1mbKgCs2SiFlo8VjKyOrVP+YNUzrWZGSLAAAAAElFTkSuQmCC",
        },
        {
            name: "Claude",
            url: "https://claude.ai/new",
            domain: "claude.ai",
            icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACZ0lEQVQ4jY2TzWvUVxiFn3N/k5mkCn4gVRQ/sRobSMUmoFbcqNBFF404TSLiRsFiNw2ETKybYKGOreDGhV10pZBoFMGCxT9AKKhIhNRkGhURTCgSWyyJE+d3TxdOJIlgPbvz3vM+773ce2GOSoW2zlJX+55pP9iTzw51tTXNzU0rzDRPOvJ1xiet+LPz+QQgeakDUrz2XoCVZ/onDb8Aa4fXJi2vq1qH9RDgQSG/arjQeqtUaNs/3ZMBuF9o254QOyqVTKfD5PEQs19ZPma4UrI+JHjg0bdfLpwi3ADqUfSsHWTEpNHuJBPvyLXN0ZwQbPmzq7UFe4XQwFRt7jxQD7qwoXipdxbgo2Lf3bSSbAYPyvF6EKsRj6M4brHMMbZgvgD+eJnWfD3z2Jpp3NMTShP3jyKKwLxquQzkgBSxDTMls8XQ4BCua6i7/XPhrYqMG54b/pH8AXASWDODX6nCskL3TPw9TXQuYzwU7NUxaGEgLlEkC8oZzGw9x1xF3HSIz5yGvzb90DeoOSFGuvPrU4dTmGbEciCpLt22dBn7swA7DIuQOzPTjU868nUTNeH71By1OSsBOAfaDCwH1mA3pnVx30YaKqXy8IanudGRN4CJbLiNqDhqJ3KzYRdSUZFRxHygUeLvZDL8ei99sPeT071Db66xqv0vxhc0JUlaIziRUWxV9MeWxioxdgDLbI0jX6xNyldnvQOAjacuDmQX/zs/OvTaOrS+2D9CUJNgrOGn/jHgG+HuGLK/VaIPvgUASMqvJHy4/se+15/H/lSKY9UBfUgHnC2/qAL/X6VC65GH37UvfVfmP/6zA9ZpeVnhAAAAAElFTkSuQmCC",
        },
        {
            name: "Mistal",
            url: "https://chat.mistral.ai/",
            domain: "mistral.ai",
            icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABIUlEQVQ4jcWSsU4CURBFz112a0vEQk2gsdktpJaEioo/YKkt/ARt/AMb613/gMqaWgpoZRMlEbSkJr6xYYmBXUxsmGpy57w7k5kHhw7lyWcvundYUx6DWjJ5LIIX/fDaHF0PvRw/jW8B/LzosCbQwfRa2s50AdZx2EbyC6jwI45uPNmylkzSdefYmY7Awm16x8CMlrCWQQaka+1OZnXbhosnyJ0IvvqXdYBvtwrKsHIDOP12q+meOgDeX8B/DNKKFzQktXNBUrviBQ3WO9lrIGlZTUaZJ3+2geTPqskok7Tc4Rdx9ABgRhfsDDSWGBqsDN4ABOeCwIwrsAj0LjEA0LwXFl0HRHaSThoA8zicYtSLMB94Ln6vxa98aFj5Dz1o/ACvJ2CcRIlDwAAAAABJRU5ErkJggg==",
        },
    ],
};

const options = monkeyGetSetOptions(baseOptions);

const getGptInstructions = (options) => options.prompts.join('\n ').replace('{{language}}', options.language);

let gptInstructionsElement = null;

const ensureGptInstructionsElement = (mainArticle) => {
    const gptInstructions = getGptInstructions(options);

    if (gptInstructionsElement) {
        gptInstructionsElement.remove();
    }

    gptInstructionsElement = createElementExtended('div', {
        style: {
            fontSize: "1px",
            color: "white",
            height: "1px",
        },
        text: gptInstructions,
        prependIn: mainArticle,
    });
}


const getSiteInfo = () => siteInfos[getDomain()] || siteInfos[document.location.hostname];

const cleanupArticle = (siteInfo) => {
    if (!siteInfo) {
        siteInfo = getSiteInfo();
    }
    siteInfo.toremove.map(p => getElements(p).map(x => x.remove()));
}

const cleanupAndCopyArticle = async () => {
    // await waitUserActivation();
    const siteInfo = getSiteInfo();
    const mainArticle = getElements(siteInfo.article)[0];
    cleanupArticle(siteInfo);
    ensureGptInstructionsElement(mainArticle);
    await copyNodeToClipboard(mainArticle);
}

const createIconLink = (iconUrl, name, defaultLink, asyncCode) => {
    return createElementExtended('a', {
        children: [
            createElementExtended('img', {
                attributes: {
                    src: iconUrl,
                    alt: name,
                    title: name,
                },
                style: { width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '5px', marginLeft: '5px' },
            }),
        ],
        attributes: { href: defaultLink, title: name },
        style: { textDecoration: 'none', color: 'black', fontWeight: 'bold', marginBottom: '5px', marginTop: '5px', display: 'inline-block' },
        onCreated: (el) => {
            bindOnClick(el, asyncCode);
        },
    });
}

const createPanel = () => {
    createElementExtended('div', {
        style: {
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 2147483621,
            backgroundColor: 'white',
            border: '1px solid black',
            padding: '10px',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.5)',
            maxWidth: '200px',
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            borderRadius: '5px',
            opacity: '0.7',
        },
        parent: document.body,
        classnames: ['articles-summarize-panel'],
        children: [
            ...options.llmEngines.map((engine) =>
                createIconLink(engine.icon ? engine.icon : 'https://www.google.com/s2/favicons?sz=64&domain=' + engine.domain, engine.name, engine.url, async () => {
                    await cleanupAndCopyArticle();
                    openLinkInNewTab(engine.url);
                })
            ),
            createElementExtended('hr'),
            createIconLink(
                'https://cdn-icons-png.flaticon.com/512/2954/2954888.png', // From Flaticon [Clean icons created by Smashicons - Flaticon](https://www.flaticon.com/free-icons/clean)
                'Cleanup', 
                '#', 
                async () => { cleanupArticle(); }
            ),
            createIconLink(
                'https://cdn-icons-png.flaticon.com/512/2570/2570600.png', // From Flaticon [Clean icons created by Smashicons - Flaticon](https://www.flaticon.com/free-icons/clean)
                'Copy prompt', 
                '#', 
                async () => { await cleanupAndCopyArticle(); }
            ),
        ]
    });
}

createPanel();
// @main_end{articles-summarize}

console.log(`End - ${script_id}`)
