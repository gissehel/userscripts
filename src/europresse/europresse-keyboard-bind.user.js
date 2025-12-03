// ==UserScript==
// @version      1.0.13
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
        if (attrName === 'marginLeft') {
            _pdfViewer.moveTo(viewer.offsetLeft + delta,viewer.offsetTop)
        } else if (attrName === 'marginTop') {
            _pdfViewer.moveTo(viewer.offsetLeft,viewer.offsetTop + delta)
        }
        // if (viewer) {
        //     viewer.style[attrName] = `${Number(removePx(viewer.style[attrName]))+delta}px` 
        // }

    };
    const next_action = () => next_button.click();
    const prev_action = () => prev_button.click();
    const zoom_in_action = () => zoom_in_button.click();
    const zoom_out_action = () => zoom_out_button.click();
    const reset_zoom_action = () => reset_zoom_button.click();
    const togglePdfPagesPanel = () => pdf_pages_panel_btn.click();
    const moveLeft = () => moveDirection('marginLeft', -10);
    const moveRight = () => moveDirection('marginLeft', 10);
    const moveUp = () => moveDirection('marginTop', -10);
    const moveDown = () => moveDirection('marginTop', 10);
    const actions = {
    }
    const addAction = (action, ...keyStructs ) => {
        keyStructs.forEach( (keyStruct) => {
            actions[getKeyKey(keyStruct)] = action
        })
    }
    addAction(zoom_in_action,
        { key: 'ArrowDown', shiftKey: true },
        { key: 'j' },
        { key: '+' },
        { key: '+', shiftKey: true },
        { code: 'Numpad2' },
    )
    addAction(zoom_out_action,
        { key: 'ArrowUp', shiftKey: true },
        { key: 'k' },
        { key: '-' },
        { key: '-', shiftKey: true },
        { code: 'Numpad8' },
    )
    addAction(next_action,
        { key: 'l' },
        { key: 'ArrowRight', shiftKey: true },
        { code: 'Space' },
        { code: 'Numpad6' },
    )
    addAction(prev_action,
        { key: 'h' },
        { key: 'ArrowLeft', shiftKey: true },
        { key: 'Backspace' },
        { code: 'Numpad4' },
    )
    addAction(reset_zoom_action,
        { key: 'r' },
        { code: 'Numpad5' },
        { code: 'Numpad0' },
    )
    addAction(downloadImage,
        { key: 's' },
        { key: '/' },
    )
    addAction(togglePdfPagesPanel,
        { key: 'p' },
        { key: '*' },
    )
    addAction(moveUp,
        { key: 'ArrowDown' },
    )
    addAction(moveDown,
        { key: 'ArrowUp' },
    )
    addAction(moveLeft,
        { key: 'ArrowRight' },
    )
    addAction(moveRight,
        { key: 'ArrowLeft' },
    )

    registerEventListener(document.body, 'keydown', (event) => {
        let result = false;
        ['code','key'].forEach((prop) => {
            
            const {code, key, ctrlKey, shiftKey, altKey, metaKey} = event
            const keyKey = getKeyKey({ code, key, ctrlKey, shiftKey, altKey, metaKey, [prop]: undefined })
            console.log('keyKey', keyKey)
            if (actions[keyKey]) {
                actions[keyKey]()
                result = true
            }
        })
        return result
    })
})
