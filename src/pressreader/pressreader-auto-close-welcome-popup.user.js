// ==UserScript==
// @version      1.0.1
// @description  pressreader-auto-close-welcome-popup
// ==/UserScript==

// @import{registerDomNodeMutatedUnique}
// @import{getElements}

registerDomNodeMutatedUnique(() => getElements('.alert-hotspot .alert-close'), (close_button) => {
    close_button.click()

    return true
})
