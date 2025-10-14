// ==UserScript==
// @version         1.0.17
// @description     articles-summarize : Create prompt to summarize articles
// @match           https://www.livescience.com/*
// @match           https://www.lemonde.fr/*
// @match           https://nouveau-europresse-com.bnf.idm.oclc.org/Search/ResultMobile/*
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

const siteInfos = {
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
        ],
        article: '#article-body',
    },
    "lemonde.fr": {
        toremove: [
            'figure',
            'section.catcher',
            'section.author',
            'section.article__reactions',
        ],
        article: '.article__content',
    },
    "oclc.org": {
        toremove: [],
        article: '.docOcurrContainer',
    }
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

const createPanel = () => {
    createElementExtended('div', {
        style: {
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 10007,
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
            createElementExtended('a', {
                children: [
                    createElementExtended('img', {
                        attributes: {
                            src: 'https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com',
                            alt: 'ChatGPT',
                            title: 'ChatGPT',
                        },
                        style: { width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '5px', marginLeft: '5px' },
                    }),
                ],
                attributes: { href: 'https://chatgpt.com/', target: '_blank', rel: 'noopener noreferrer' },
                style: { textDecoration: 'none', color: 'black', fontWeight: 'bold', marginBottom: '5px', marginTop: '5px', display: 'inline-block' },
                onCreated: (el) => {
                    bindOnClick(el, async () => {
                        await cleanupAndCopyArticle();
                        openLinkInNewTab('https://chatgpt.com/');
                    });
                },
            }),
        ],
    });
}

createPanel();

