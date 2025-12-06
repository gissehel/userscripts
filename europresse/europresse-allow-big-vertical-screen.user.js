// ==UserScript==
// @name        europresse-allow-big-vertical-screen
// @namespace   https://github.com/gissehel/userscripts
// @version     1.0.0
// @description europresse-allow-big-vertical-screen
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       https://nouveau-europresse-com.*.idm.oclc.org/*
// @icon        https://www.europresse.com/app/uploads/2023/07/favicon-europress.svg
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

// @main_begin{europresse-allow-big-vertical-screen}
addStyle('#pdf, #pdfDocument, .docContainer, .panel { height: 100%; }')
// @main_end{europresse-allow-big-vertical-screen}

console.log(`End - ${script_id}`)
