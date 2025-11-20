// @import{createElementExtended}

/**
 * Downloads a data url as a file
 * 
 * @param {String} url The data url to download
 * @param {String} filename The filename to use to save the file
 * @returns
 */
const downloadDataUrl = async (url, filename) => {
    const a = createElementExtended('a', {
        attributes: {
            href: url,
            target: '_blank',
            download: filename,
        },
    })
    a.click()
}