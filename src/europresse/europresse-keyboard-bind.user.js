// ==UserScript==
// @version      1.0.0
// @description  europresse-keyboard-bind
// ==/UserScript==

// @import{registerDomNodeMutatedUnique}
// @import{registerEventListener}
// @import{getElements}

registerDomNodeMutatedUnique(() => getElements('#currentDoc.panel'), (close_button) => {
    const next_button = getElements('#nextPdf')[0]
    const prev_button = getElements('#prevPdf')[0]
    const zoom_in_button = getElements('#zoomin')[0]
    const zoom_out_button = getElements('#zoomout')[0]

    registerEventListener(document.body, 'keydown', (event) => {
        if (event.key === 'ArrowRight') {
            next_button.click()
            return true
        }
        if (event.key === 'ArrowLeft') {
            prev_button.click()
            return true
        }
        if (event.key === '+') {
            zoom_in_button.click()
            return true
        }
        if (event.key === '-') {
            zoom_out_button.click()
            return true
        }
        return false
    })
    

})
