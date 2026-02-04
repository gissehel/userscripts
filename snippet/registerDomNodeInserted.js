// @import{registerEventListener}
/**
 * Add a DOMNodeInserted on the document. 
 * Handle the fact that the callback can't be called while aleady being called (no stackoverflow). 
 * Use the register pattern thus return the unregister function as a result
 * @param {EventListener} callback 
 * @return {()=>{}} The unregister function
 */
 const registerDomNodeInserted = (callback) => {
    let nodeChangeInProgress = false

    /** @type{EventListener} */
    const onNodeChanged = (e) => {
        if (!nodeChangeInProgress) {
            nodeChangeInProgress = true
            callback(e)
            nodeChangeInProgress = false
        }

    }
    const unregister = document.documentElement.registerEventListener('DOMNodeInserted', onNodeChanged, false);
    onNodeChanged()
    return unregister;
}
