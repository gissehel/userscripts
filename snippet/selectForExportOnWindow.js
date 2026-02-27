// @import{exportOnWindow}
// @import{registerMenuCommand}
const toExportOnWindow = {}
/**
 * Exports the given object to the window for debugging purposes.
 * @param {Object} obj The object to export on the window
 */
const selectForExportOnWindow = (obj) => {
    for (let key in obj) {
        toExportOnWindow[key] = obj[key]
    }
}
registerMenuCommand('Export item to window', () => {
    exportOnWindow(toExportOnWindow);
})