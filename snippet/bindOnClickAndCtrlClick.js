// @import{registerEventListener}
/**
 * Bind an onClick and ctrl+click handler to an element. Returns uninstall handler
 * 
 * @param {HtmlElement} element The element to bind the handler
 * @param {()=>boolean|undefined} callback The onClick handler
 * @param {()=>boolean|undefined} callbackCtrl The onClick handler for ctrl+click
 * @returns {()=>{}}
 */
const bindOnClickAndCtrlClick = (element, callback, callbackCtrl) => {
    const onClick = (e) => {
        let callbackToExecute = null;
        if (e.ctrlKey && callbackCtrl) {
            callbackToExecute = callbackCtrl;
        } else {
            callbackToExecute = callback;
        }
        if (callbackToExecute) {
            const result = callbackToExecute()
            if (result !== false) {
                e.preventDefault()
                e.stopImmediatePropagation()
            }
        }
    }
    return element.registerEventListener('click', onClick, true);
}
