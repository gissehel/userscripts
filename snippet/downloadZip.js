// @grant{unsafeWindow}
const loadInUnsafeWindow = (url) => {
    return new Promise((resolve, reject) => {
        if (unsafeWindow.JSZipPromise) {
            resolve(unsafeWindow.JSZip);
            return;
        }
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
            resolve(unsafeWindow.JSZip);
        };
        script.onerror = () => {
            reject(new Error(`Failed to load script: ${url}`));
        }
        document.head.appendChild(script);
    });
};

const JSZipPromise = loadInUnsafeWindow('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js')
if (!unsafeWindow.JSZipPromise) {
    unsafeWindow.JSZipPromise = JSZipPromise;
}

/**
 * Download a zip file with the given filename and content provided by the async generator
 * 
 * @param {string} fileName The zip filename to download
 * @param {() => AsyncGenerator<{path: string, data: Uint8Array<ArrayBuffer>}>} contentProvider 
 */
const downloadZip = async (fileName, contentProvider) => {
    const JSZip = await JSZipPromise
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
