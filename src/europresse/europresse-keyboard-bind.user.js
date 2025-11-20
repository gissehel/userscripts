// ==UserScript==
// @version      1.0.8
// @description  europresse-keyboard-bind
// ==/UserScript==

// @import{registerDomNodeMutatedUnique}
// @import{registerEventListener}
// @import{getElements}
// @import{downloadDataUrl}

const getKeyKey = ({ code, key, ctrlKey, shiftKey, altKey, metaKey }) => {
    return `${code}|${key}|${ctrlKey ? '1' : '0'}|${shiftKey ? '1' : '0'}|${altKey ? '1' : '0'}|${metaKey ? '1' : '0'}`
}

const removePx = (x) => {
  if (x.substr(-2) == "px") { return x.substr(0, x.length-2) } else { return x }
}

registerDomNodeMutatedUnique(() => getElements('#currentDoc.panel'), (close_button) => {
    const next_button = getElements('#nextPdf')[0]
    const prev_button = getElements('#prevPdf')[0]
    const zoom_in_button = getElements('#zoomin')[0]
    const zoom_out_button = getElements('#zoomout')[0]
    const reset_zoom_button = getElements('#reset')[0]
    const pdf_pages_panel_btn = getElements('span.pdf-pages-panel-btn')[0]
    const downloadImage = () => downloadDataUrl(getElements('.imagePdf')[0].src, `europresse-${_docNameList[_docIndex]}`)
    const moveDirection = (attrName, delta) => {
        const viewer = getElements('img.viewer-move')[0];
        if (viewer) {
            viewer.style[attrName] = `${Number(removePx(viewer.style[attrName]))-10}px` 
        }

    };
    const moveLeft = () => moveDirection('marginLeft', -10);
    const moveRight = () => moveDirection('marginLeft', 10);
    const moveUp = () => moveDirection('marginTop', -10);
    const moveDown = () => moveDirection('marginTop', 10);
    const actions = {
        [getKeyKey({ key: 'l' })]: () => next_button.click(),
        [getKeyKey({ key: 'ArrowRight' })]: () => next_button.click(),
        [getKeyKey({ code: 'Space' })]: () => next_button.click(),
        [getKeyKey({ key: 'h' })]: () => prev_button.click(),
        [getKeyKey({ key: 'ArrowLeft' })]: () => prev_button.click(),
        [getKeyKey({ key: 'j' })]: () => zoom_in_button.click(),
        [getKeyKey({ key: '+' })]: () => zoom_in_button.click(),
        [getKeyKey({ key: 'k' })]: () => zoom_out_button.click(),
        [getKeyKey({ key: '-' })]: () => zoom_out_button.click(),
        [getKeyKey({ key: 'r' })]: () => reset_zoom_button.click(),
        [getKeyKey({ code: 'Numpad0' })]: () => reset_zoom_button.click(),
        [getKeyKey({ key: 'p' })]: () => pdf_pages_panel_btn.click(),
        [getKeyKey({ key: 's' })]: () => downloadImage(),
        [getKeyKey({ key: 'ArrowUp', shiftKey: true })]: () => moveUp(),
        [getKeyKey({ key: 'ArrowDown', shiftKey: true })]: () => moveDown(),
        [getKeyKey({ key: 'ArrowLeft', shiftKey: true })]: () => moveLeft(),
        [getKeyKey({ key: 'ArrowRight', shiftKey: true })]: () => moveRight(),        
    }
    registerEventListener(document.body, 'keydown', (event) => {
        let result = false;
        ['code','key'].forEach((prop) => {
            
            const {code, key, ctrlKey, shiftKey, altKey, metaKey} = event
            const keyKey = getKeyKey({ code, key, ctrlKey, shiftKey, altKey, metaKey, [prop]: undefined })
            if (actions[keyKey]) {
                actions[keyKey]()
                result = true
            }
        })
        return result
    })
})
