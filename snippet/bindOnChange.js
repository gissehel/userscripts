// @import{registerEventListener}
/**
 * Bind an onChange handler an element. Returns uninstall handler
 * 
 * @param {HTMLElement} element The element to bind the handler
 * @param {()=>boolean|undefined} callback The onChange handler
 * @returns {()=>{}}
 */
const bindOnChange = (element, callback) => {
    const onChange = (e) => {
        const result = callback()
        if (result !== false) {
            e.preventDefault()
            e.stopImmediatePropagation()
        }
    }
    return element.registerEventListener('change', onChange, true);
}
