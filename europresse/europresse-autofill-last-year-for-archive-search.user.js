// ==UserScript==
// @name        europresse-autofill-last-year-for-archive-search
// @namespace   https://github.com/gissehel/userscripts
// @version     1.0.0
// @description europresse-ensure-cache-for-already-downloaded-pages
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       https://nouveau-europresse-com.*.idm.oclc.org/PDF/ArchiveResult?*
// @icon        https://www.europresse.com/app/uploads/2023/07/favicon-europress.svg
// @grant       none
// ==/UserScript==

const script_name = GM_info?.script?.name || 'no-name'
const script_version = GM_info?.script?.version || 'no-version'
const script_id = `${script_name} ${script_version}`
console.log(`Begin - ${script_id}`)


// @main_begin{europresse-autofill-last-year-for-archive-search}
const fromField = document.querySelectorAll('#pdfSeachFrom')[0]
const toField = document.querySelectorAll('#pdfSeachTo')[0]

if (fromField && toField) {
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    const todayIso = today.toISOString().split('T')[0];
    const oneYearAgoIso = oneYearAgo.toISOString().split('T')[0];
    fromField.value = oneYearAgoIso;
    toField.value = todayIso;
}
// @main_end{europresse-autofill-last-year-for-archive-search}

console.log(`End - ${script_id}`)
