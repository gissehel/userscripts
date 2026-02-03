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
    element.addEventListener('change', onChange, true);

    return () => {
        element.removeEventListener('change', onChange, true);
    }
}
