/**
 * Get the size in Mo from bytes
 * 
 * @param {Number} sizeInBytes The size in bytes
 * @returns {string} The size in MiB
 */
const getMiBSize = (sizeInBytes) => {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MiB`;
}