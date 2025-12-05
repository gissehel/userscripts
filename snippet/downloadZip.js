// @require{https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js}
/**
 * Download a zip file with the given filename and content provided by the async generator
 * 
 * @param {string} fileName The zip filename to download
 * @param {() => AsyncGenerator<{path: string, data: Uint8Array<ArrayBuffer>}>} contentProvider 
 */
const downloadZip = async (fileName, contentProvider) => {
    const zip = new JSZip();
    for await (const { path, data } of contentProvider()) {
        zip.file(path, data);
    }
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = fileName;
    link.click();
}
