// ==UserScript==
// @version      1.0.23
// @description  europresse-keyboard-bind
// ==/UserScript==

const moveAccelerationRatio = 1.1;
const moveBaseDelta = 10;
const moveHistoryTimeout = 3000; // ms

// @import{registerDomNodeMutatedUnique}
// @import{registerEventListener}
// @import{getElements}
// @import{downloadDataUrl}

const getKeyKey = ({ code, key, ctrlKey, shiftKey, altKey, metaKey }) => {
    return `${code}|${key}|${ctrlKey ? '1' : '0'}|${shiftKey ? '1' : '0'}|${altKey ? '1' : '0'}|${metaKey ? '1' : '0'}`
}

const removePx = (x) => {
    if (x.substr(-2) == "px") { return x.substr(0, x.length - 2) } else { return x }
}

const Direction = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    TOP: 'TOP',
    BOTTOM: 'BOTTOM',
}

registerDomNodeMutatedUnique(() => getElements('#currentDoc.panel'), (close_button) => {
    const next_button = getElements('#nextPdf')[0]
    const prev_button = getElements('#prevPdf')[0]
    const reset_zoom_button = getElements('#reset')[0]
    const pdf_pages_panel_btn = getElements('span.pdf-pages-panel-btn')[0]
    const downloadImage = () => downloadDataUrl(getElements('.imagePdf')[0].src, `europresse-${_docNameList[_docIndex]}`)
    const moveDirection = (direction, delta) => {
        const viewer = getElements('img.viewer-move')[0];
        window.viewer = viewer;
        switch (direction) {
            case Direction.LEFT:
                _pdfViewer.moveTo(viewer.offsetLeft + delta, viewer.offsetTop); break;
            case Direction.RIGHT:
                _pdfViewer.moveTo(viewer.offsetLeft - delta, viewer.offsetTop); break;
            case Direction.TOP:
                _pdfViewer.moveTo(viewer.offsetLeft, viewer.offsetTop + delta); break;
            case Direction.BOTTOM:
                _pdfViewer.moveTo(viewer.offsetLeft, viewer.offsetTop - delta); break;
            default:
                console.error(`Unknown direction: ${direction}`);
                break;
        }
    };
    const recentMoveHistory = [];
    window.recentMoveHistory = recentMoveHistory;
    const moveDirectionWithAcceleration = (direction) => {
        const timestamp = (new Date()).getTime();
        const historyField = { timestamp, direction };
        [...recentMoveHistory].forEach((item) => {
            if (item.direction !== direction || (timestamp - item.timestamp) > moveHistoryTimeout) {
                const index = recentMoveHistory.indexOf(item)
                if (index >= 0) {
                    recentMoveHistory.splice(index,1)
                }
            }
        });
        recentMoveHistory.push(historyField);
        let currentDelta = moveBaseDelta*(moveAccelerationRatio**(recentMoveHistory.length-1));
        moveDirection(direction, currentDelta);
    }
    const zoomDelta = 0.1;
    const zoom_in_action = () => _pdfViewer.zoom(zoomDelta)
    const zoom_out_action = () => _pdfViewer.zoom(-zoomDelta)
    const next_action = () => next_button.click();
    const prev_action = () => prev_button.click();
    const reset_zoom_action = () => reset_zoom_button.click();
    const togglePdfPagesPanel = () => pdf_pages_panel_btn.click();
    const moveLeft = () => moveDirectionWithAcceleration(Direction.LEFT);
    const moveRight = () => moveDirectionWithAcceleration(Direction.RIGHT);
    const moveUp = () => moveDirectionWithAcceleration(Direction.TOP);
    const moveDown = () => moveDirectionWithAcceleration(Direction.BOTTOM);
    const downloadCBZ = () => {
        if (window.downloadCBZofAllPages) {
            window.downloadCBZofAllPages();
        }
    }
    const accessArchive = () => document.location.pathname = "/PDF/ArchiveResult";
    const actions = {
    }
    const addAction = (action, ...keyStructs) => {
        keyStructs.forEach((keyStruct) => {
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
    addAction(downloadCBZ,
        { key: 'b' },
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
    addAction(accessArchive,
        { key: 'a' },
    )

    registerEventListener(document.body, 'keydown', (event) => {
        let result = false;
        ['code', 'key'].forEach((prop) => {

            const { code, key, ctrlKey, shiftKey, altKey, metaKey } = event
            const keyKey = getKeyKey({ code, key, ctrlKey, shiftKey, altKey, metaKey, [prop]: undefined })
            // console.log('keyKey', keyKey)
            if (actions[keyKey]) {
                actions[keyKey]()
                result = true
            }
        })
        return result
    })
})
