// @import{createIconLink}
/**
 * Creates an icon link action element with an image and binds an async click handler.
 * 
 * @param {string} iconUrl The icon URL
 * @param {string} name The link name
 * @param {Function} asyncCode The async code to execute on click
 * @param {Function} asyncCtrlCode The async code to execute on ctrl+click
 * @returns {HTMLElement} The icon link element
 */
const createIconLinkAction = (iconUrl, name, asyncCode, asyncCtrlCode) => createIconLink(iconUrl, name, '#', asyncCode, asyncCtrlCode);
