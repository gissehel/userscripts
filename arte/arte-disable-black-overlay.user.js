// ==UserScript==
// @name        arte-disable-black-overlay
// @namespace   https://github.com/gissehel/userscripts
// @version     20260902-103603-0b662fb
// @description arte-disable-black-overlay
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       https://www.arte.tv/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=www.arte.tv
// @grant       none
// ==/UserScript==

const script_name = GM_info?.script?.name || 'no-name'
const script_version = GM_info?.script?.version || 'no-version'
const script_id = `${script_name} ${script_version}`
console.log(`Begin - ${script_id}`)


// @imported_begin{addStyle}
/**
 * Add a new css string to the page
 * 
 * @param {string} styleText The CSS string to pass
 * @returns {void}
 */
 const addStyle = (() => {
    let styleElement = null;
    let styleContent = null;

    /**
     * Add a new css string to the page
     * 
     * @param {string} styleText The CSS string to pass
     * @returns {void}
     */
    return (styleText) => {
        if (styleElement === null) {
            styleElement = document.createElement('style');
            styleContent = "";
            document.head.appendChild(styleElement);
        } else {
            styleContent += "\n";
        }

        styleContent += styleText;
        styleElement.textContent = styleContent;
    };
})();
// @imported_end{addStyle}

// @main_begin{arte-disable-black-overlay}
const main = async () => {

    addStyle(`
        .avp .avp-content {
            background-color: transparent !important;
        }
    `)
}

main()
// @main_end{arte-disable-black-overlay}

console.log(`End - ${script_id}`)
