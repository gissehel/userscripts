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
