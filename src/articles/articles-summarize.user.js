// ==UserScript==
// @description     articles-summarize : Create prompt to summarize articles
// @match           https://www.livescience.com/*
// @match           https://www.lemonde.fr/*
// @match           https://nouveau-europresse-com.bnf.idm.oclc.org/Search/ResultMobile/*
// @match           https://nouveau-europresse-com.bnf.idm.oclc.org/Document/*
// @match           https://nouveau-europresse-com.bpi.idm.oclc.org/Search/ResultMobile/*
// @match           https://nouveau-europresse-com.bpi.idm.oclc.org/Document/*
// @match           https://www.liberation.fr/*
// @match           https://www.lefigaro.fr/*
// @match           https://www.20minutes.fr/*
// @match           https://www.leparisien.fr/*
// @match           https://www.mediapart.fr/journal/*/*/*
// @match           https://www-mediapart-fr.bnf.idm.oclc.org/journal/*/*/*
// @match           https://www-mediapart-fr.bpi.idm.oclc.org/journal/*/*/*
// @match           https://sciencepost.fr/*/
// @iconFromDomain  chatgpt.com
// ==/UserScript==

// @import{readyPromise}
// @import{createElementExtended}
// @import{getElements}
// @import{copyTextToClipboard}
// @import{getDomain}
// @import{monkeyGetSetOptionsSync}
// @import{bindOnClick}
// @import{openLinkInNewTab}
// @import{createSsmGenericPanel}
// @import{ICONS}
// @import{delay}

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

const siteInfos = [
    {
        domains: ["lemonde.fr"],
        hosts: [],
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
    {
        domains: [],
        hosts: ["nouveau-europresse-com.bnf.idm.oclc.org", "nouveau-europresse-com.bpi.idm.oclc.org"],
        name: "europresse",
        toremove: [],
        article: '.docOcurrContainer',
    },
    {
        domains: ["liberation.fr"],
        hosts: [],
        toremove: [
            '.skAfM',
        ],
        article: 'article',
    },
    {
        domains: ["lefigaro.fr"],
        hosts: [],
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
    {
        domains: ["20minutes.fr"],
        hosts: [],
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
    {
        domains: ["leparisien.fr"],
        hosts: [],
        toremove: [
            '.dailymotion-suggestion_container',
            '.article-read-also_container',
            'figure',
        ],
        title: 'header h1',
        abstract: 'header .subheadline',
        article: '.article-section',
    },
    {
        domains: ["livescience.com"],
        hosts: [],
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
    {
        domains: ["sciencepost.fr"],
        hosts: [],
        toremove: [
            'figure',
        ],
        title: 'h1.entry-title',
        abstract: 'div.entry-content p strong:first-child',
        article: 'div.entry-content',
    },
    {
        domains: ["mediapart.fr"],
        hosts: ["www-mediapart-fr.bnf.idm.oclc.org", "www-mediapart-fr.bpi.idm.oclc.org"],
        name: "mediapart",
        toremove: [
            'figure',
            'aside',
        ],
        title: 'h1#page-title',
        abstract: 'p.news__heading__top__intro',
        article: '.news__body__center__article',
    },
]

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

const options = monkeyGetSetOptionsSync(baseOptions);

const getGptInstructions = (options) => options.prompts.join('\n ').replace('{{language}}', options.language);

const getSiteInfo = () => {
    const domain = getDomain();
    const hostname = document.location.hostname;
    return siteInfos.find(siteInfo =>
        siteInfo.domains.includes(domain) ||
        siteInfo.hosts.includes(hostname)
    ) || null;
}

const cleanup = (siteInfo) => {
    siteInfo.toremove.map(p => getElements(p).map(x => x.remove()));
}

const cleanupArticle = async () => {
    const siteInfo = getSiteInfo();
    cleanup(siteInfo);
}

const COPY_TYPE = {
    CLIPBOARD: 'clipboard',
    ALERT: 'alert',
}

/**
 * Copy or display the text to the user depending on the copyType
 * @param {*} text The text to copy or display
 * @param {*} copyType The way to copy or display the text, can be 'clipboard' or 'alert'
 */
const copy = async (text, copyType) => {
    if (copyType === COPY_TYPE.CLIPBOARD) {
        await copyTextToClipboard(text);
    } else if (copyType === COPY_TYPE.ALERT) {
        alert(text);
    } else {
        await delay(0)
        console.error('Invalid copy type:', copyType);
    }
}

const copyPromptPrefix = async (copyType) => {
    const promptPrefix = getGptInstructions(options);
    await copy(promptPrefix, copyType);
}

const cleanupAndCopyArticle = async (copyType) => {
    const siteInfo = getSiteInfo();
    const mainArticle = getElements(siteInfo.article)[0];
    cleanup(siteInfo);
    const text = mainArticle.innerText
    const prompt = getGptInstructions(options) + '\n\n' + text;
    await copy(prompt, copyType);
}

const createPanel = async () => {
    await createSsmGenericPanel(
        'articles',
        'articles-summarize',
        async () => {
            return [
                ...options.llmEngines.map((engine) =>
                    createIconLink(engine.icon ? engine.icon : 'https://www.google.com/s2/favicons?sz=64&domain=' + engine.domain, engine.name, engine.url, async () => {
                        await cleanupAndCopyArticle(COPY_TYPE.CLIPBOARD);
                        openLinkInNewTab(engine.url);
                    })
                ),
                createElementExtended('hr'),
                createIconLink(
                    ICONS.CLEANUP,
                    'Cleanup',
                    '#',
                    async () => { cleanupArticle(); }
                ),
                createIconLink(
                    ICONS.TITLE,
                    'Copy prompt prefix',
                    '#',
                    async () => { await copyPromptPrefix(COPY_TYPE.CLIPBOARD); },
                    async () => { await copyPromptPrefix(COPY_TYPE.ALERT); }
                ),
                createIconLink(
                    ICONS.COPY,
                    'Copy prompt',
                    '#',
                    async () => { await cleanupAndCopyArticle(COPY_TYPE.CLIPBOARD); },
                    async () => { await cleanupAndCopyArticle(COPY_TYPE.ALERT); }
                ),
            ]
        },
    )
}

createPanel();

