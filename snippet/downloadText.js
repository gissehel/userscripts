/**
 * Download a text file with the given filename and content
 * 
 * @param {string} fileName The text filename to download
 * @param {string} content The text content as a string
 * @param {Object} options The download options
 * @param {string} option.mimeType The mime type of the text content
 */
const downloadText = async (fileName, content, options = {}) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([content], { type: options.mimeType || 'text/plain' }));
    link.download = fileName;
    link.click();
}
