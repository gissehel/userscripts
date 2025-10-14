// ==UserScript==
// @version         1.0.5
// @description     articles-summarize : Create prompt to summarize articles
// @match           https://www.livescience.com/*
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

const siteInfos = {
    "livescience.com": {
        toremove: ['aside', 'figure', '.fancy-box', '.hero-image-wrapper', '.byline', '#article-body script', '.slice-container-newsletterForm'],
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
};

const options = monkeyGetSetOptions(baseOptions);

let gptInstructionsElement = null;

const ensureGptInstructionsElement = (mainArticle) => {
    const gptInstructions = options.prompts.join('\n ').replace('{{language}}', options.language);

    if (gptInstructionsElement) {
        gptInstructionsElement.remove();
    }

    gptInstructionsElement = createElementExtended('div', {
        styles: {
            fontSize: "1px",
            color: "white",
            height: "1px",
        },
        textContent: gptInstructions,
        prependIn: mainArticle,
    });
}

const cleanupArticle = (siteInfo) => {
    siteInfo.toremove.map(p => getElements(p).map(x => x.remove()));
}

const cleanupAndCopyArticle = async () => {
    const siteInfo = siteInfos[getDomain()];

    const mainArticle = getElements(siteInfo.article)[0];

    cleanupArticle(siteInfo);

    ensureGptInstructionsElement(mainArticle);

    await waitUserActivation();

    await copyNodeToClipboard(mainArticle);
}

readyPromise.then(cleanupAndCopyArticle)
