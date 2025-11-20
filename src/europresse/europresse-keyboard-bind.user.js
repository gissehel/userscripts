// ==UserScript==
// @version      1.0.5
// @description  europresse-keyboard-bind
// ==/UserScript==

// @import{registerDomNodeMutatedUnique}
// @import{registerEventListener}
// @import{getElements}
// @import{downloadDataUrl}

registerDomNodeMutatedUnique(() => getElements('#currentDoc.panel'), (close_button) => {
    const next_button = getElements('#nextPdf')[0]
    const prev_button = getElements('#prevPdf')[0]
    const zoom_in_button = getElements('#zoomin')[0]
    const zoom_out_button = getElements('#zoomout')[0]
    const reset_zoom_button = getElements('#reset')[0]
    const pdf_pages_panel_btn = getElements('span.pdf-pages-panel-btn')[0]

    registerEventListener(document.body, 'keydown', (event) => {
        if (event.key === 'ArrowRight' || event.code === 'KeyL' || event.code === 'Space') {
            next_button.click()
            return true
        }
        if (event.key === 'ArrowLeft' || event.code === 'KeyH') {
            prev_button.click()
            return true
        }
        if (event.key === '+' || event.code === 'KeyJ') {
            zoom_in_button.click()
            return true
        }
        if (event.key === '-' || event.code === 'KeyK') {
            zoom_out_button.click()
            return true
        }
        if (event.key === '0' || event.code === 'KeyR') {
            reset_zoom_button.click()
            return true
        }
        if (event.code === 'KeyP') {
            pdf_pages_panel_btn.click()
            return true
        }
        if (event.code === 'KeyS') {
            downloadDataUrl(getElements('.imagePdf')[0].src, `europresse-${_docNameList[_docIndex]}`)
            return true
        }
        return false
    })
    

})
