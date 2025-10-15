// ==UserScript==
// @version         1.0.32
// @description     articles-summarize : Create prompt to summarize articles
// @match           https://www.livescience.com/*
// @match           https://www.lemonde.fr/*
// @match           https://nouveau-europresse-com.bnf.idm.oclc.org/Search/ResultMobile/*
// @match           https://nouveau-europresse-com.bnf.idm.oclc.org/Document/*
// @match           https://www.liberation.fr/*
// @match           https://www.lefigaro.fr/*
// @match           https://www.20minutes.fr/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

// @import{readyPromise}
// @import{createElementExtended}
// @import{getElements}
// @import{copyNodeToClipboard}
// @import{getDomain}
// @import{waitUserActivation}
// @import{monkeySetValue}
// @import{monkeyGetSetOptions}
// @import{bindOnClick}
// @import{openLinkInNewTab}

// Exemples pour test:
// * https://www.lemonde.fr/planete/article/2025/10/14/pollution-atmospherique-il-faut-reduire-les-emissions-humaines-pendant-les-tempetes-de-sable-selon-l-anses_6646592_3244.html
// * https://www.lemonde.fr/planete/article/2025/09/01/les-emissions-de-gaz-a-effet-de-serre-continuent-leur-progression-malgre-les-bons-chiffres-chinois_6637986_3244.html
// * https://www.lemonde.fr/planete/article/2025/10/14/pollution-atmospherique-il-faut-reduire-les-emissions-humaines-pendant-les-tempetes-de-sable-selon-l-anses_6646592_3244.html
// * https://www.liberation.fr/politique/reforme-des-retraites-493-deficit-ce-quil-faut-retenir-de-la-declaration-de-politique-general-de-sebastien-lecornu-20251014_6Q5XRISHGVAO5OT7HVTXF3RIQQ/
// * https://www.lefigaro.fr/conjoncture/taxe-sur-les-holdings-contribution-sur-les-hauts-revenus-les-premieres-mesures-du-budget-lecornu-devoilees-20251014
// * https://www.20minutes.fr/paris/4179419-20251015-si-seine-atteignant-9-10-paris-assiste-exercice-simulation-crue-ratp
// * https://www.livescience.com/planet-earth/earthquakes/link-between-cascadia-and-san-andreas-fault-earthquakes-discovered-30-years-after-lost-vessel-stumbled-across-key-data

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
    "oclc.org": {
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
        ],
        title: 'section header h1',
        abstract: 'section header span:last-child',
        article: 'article',
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
}

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

let gptInstructionsElement = null;

const ensureGptInstructionsElement = (mainArticle) => {
    const gptInstructions = options.prompts.join('\n ').replace('{{language}}', options.language);

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

const cleanupArticle = (siteInfo) => {
    if (!siteInfo) {
        siteInfo = siteInfos[getDomain()];
    }
    siteInfo.toremove.map(p => getElements(p).map(x => x.remove()));
}




const cleanupAndCopyArticle = async () => {
    // await waitUserActivation();
    const siteInfo = siteInfos[getDomain()];
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

