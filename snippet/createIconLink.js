// @import{createElementExtended}
// @import{bindOnClickAndCtrlClick}
/**
 * Creates an icon link element with an image and binds an async click handler.
 * 
 * @param {string} iconUrl The icon URL
 * @param {string} name The link name
 * @param {string} defaultLink The default link URL
 * @param {Function} asyncCode The async code to execute on click
 * @param {Function} asyncCtrlCode The async code to execute on ctrl+click
 * @returns {HTMLElement} The icon link element
 */
const createIconLink = (iconUrl, name, defaultLink, asyncCode, asyncCtrlCode) => {
    return createElementExtended('a', {
        children: [
            createElementExtended('img', {
                attributes: {
                    src: iconUrl,
                    alt: name,
                    title: name,
                },
                style: { width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '5px', marginLeft: '5px' },
            }),
        ],
        attributes: { href: defaultLink, title: name },
        style: { textDecoration: 'none', color: 'black', fontWeight: 'bold', marginBottom: '5px', marginTop: '5px', display: 'inline-block' },
        onCreated: (el) => {
            bindOnClickAndCtrlClick(el, asyncCode, asyncCtrlCode);
        },
    });
}
