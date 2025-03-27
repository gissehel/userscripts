// ==UserScript==
// @version      3.0.2
// @description  windy-link-to-webgeo
// @match        https://www.windy.com/*
// @match        https://windy.com/*
// ==/UserScript==

// @import{addStyle}
// @import{registerClickListener}
// @import{registerDomNodeMutatedUnique}
// @import{createElementExtended}
// @import{openLinkInNewTab}

registerDomNodeMutatedUnique(() => [...document.body.querySelectorAll('#overlay')], (overlay) => {
    const toggleOverlays = overlay.querySelector('[data-do=toggleOverlays]')
    if (!toggleOverlays) {
        return false
    }
    createElementExtended('a', {
        attributes: {
            href: '#',
        },
        children: [
            createElementExtended('img', {
                attributes: {
                    src: 'https://webgiss.github.io/webgeo/earth-16.png',
                    width: '16',
                    height: '16',
                },
                classnames: ['webgeo-icon', 'iconfont', 'notap'],
            }),
            createElementExtended('span', {
                text: 'WebGeo',
                classnames: ['menu-text', 'notap'],
            }),
        ],
        nextSibling: toggleOverlays,
        onCreated: (link) => {
            link.registerClickListener(() => {
                const params = document.URL.split('?')[1].split(',').filter(x => x.indexOf(':') === -1)
                if (params.length >= 3) {
                    const [lat, lon, zoom] = params.slice(params.length - 3)
                    const url = `https://webgiss.github.io/webgeo/#map=${zoom}/${lat}/${lon}`
                    openLinkInNewTab(url);
                }
            })
        },
    })
    return true
})

addStyle(`#rhpane #overlay a .iconfont.webgeo-icon { width: 24px; height: 24px; margin-right: 0px; margin-left: 1px; margin-top: 0px; margin-bottom: 1px; background-color: #fff; padding: 4px; }`)
