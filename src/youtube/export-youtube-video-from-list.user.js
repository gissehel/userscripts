// ==UserScript==
// @version      3.0.10
// @description  Export youtube video information in markdown format
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// ==/UserScript==

// @import{getSubElements}
// @import{getElements}
// @import{addStyle}
// @import{registerDomNodeMutatedUnique}
// @import{copyTextToClipboard}
// @import{createElementExtended}
// @import{bindOnClick}

addStyle('.eyvfl-button { width: 44px; height: 30px; position: absolute; bottom: 0px; padding-inline-start: 3px; padding-inline-end: 3px; }')
addStyle('.eyvfl-export-button { right: 0px; }')
addStyle('.eyvfl-export-button2 { right: 50px; }')
addStyle('.eyvfl-export-button-interval { right: 100px; }')
addStyle('.eyvfl-mode-set .eyvfl-export-button-interval { background-color: #f0f0d0 !important; }')

HTMLElement.prototype.q=function(data) { return getSubElements(this, data) }
const q = (data) => getSubElements(data)
HTMLElement.prototype.titleOrContent = function() {
    if (this.title && this.title != '') {
        return this.title
    }
    return this.textContent 
}
const isShort = () => document.location.pathname.endsWith('/shorts')

const getVideoTitleShort = (richItemRenderer) => richItemRenderer.q('h3 [role=text]')?.map(e=>e.textContent)?.join('')
const getVideoTitleLong = (richItemRenderer) => richItemRenderer.q('#video-title-link')?.at(0)?.q('#video-title')?.slice(-1)?.at(0)?.titleOrContent()
const getVideoLinkShort = (richItemRenderer) => richItemRenderer.q('a')?.at(0)?.href
const getVideoLinkLong = (richItemRenderer) => getSubElements(richItemRenderer, 'a#thumbnail')?.at(0)?.href
const getVideoContentShort = (link) => link
// const getVideoContentLong = (link) => `{{video ${link}}}`
const getVideoContentLong = (link) => link

const getShortLong = (shortFun, longFun) => (...args) => isShort() ? shortFun(...args) : longFun(...args)

const getVideoTitle = getShortLong(getVideoTitleShort, getVideoTitleLong)
const getVideoLink = getShortLong(getVideoLinkShort, getVideoLinkLong)
const getVideoContent = getShortLong(getVideoContentShort, getVideoContentLong)

let buffer = ''
const elementCache = {}
const addBufferOnElement = (richItemRenderer, preAction) => {
    const videoTitle = getVideoTitle(richItemRenderer)
    const videoLink = getVideoLink(richItemRenderer)
    const videoContent = getVideoContent(videoLink)

    if (preAction !== undefined) {
        preAction()
    }
    // const markdown = `- TODO ${videoTitle}\n  collapsed:: true\n  - ${videoContent}\n`
    const markdown = `- TODO [${videoTitle}](${videoContent})\n`
    buffer += markdown
}

let itemId = 0
let itemIdSet = null

registerDomNodeMutatedUnique(() => getElements('ytd-rich-item-renderer'), (richItemRenderer) => {
    const videoTitle = getVideoTitle(richItemRenderer)
    const videoLink = getVideoLink(richItemRenderer)
    if ((videoTitle === undefined) || (videoLink === undefined) || (videoTitle === '') || (videoLink === '')) {
        return false
    }

    itemId++
    elementCache[itemId] = richItemRenderer
    const localItemId = itemId

    const buttonCreator = (label, classnames, preAction) => createElementExtended('button', {
        parent: richItemRenderer,
        classnames: classnames,
        text: label,
        onCreated: (button) => {
            bindOnClick(button, () => {
                addBufferOnElement(richItemRenderer, preAction)
                console.log(`Copying [${buffer}]`)
                copyTextToClipboard(buffer)
            })
        }
    })

    buttonCreator('➡️📋', ['eyvfl-button', 'eyvfl-export-button'], () => buffer = '')
    buttonCreator('➕📋', ['eyvfl-button', 'eyvfl-export-button2'])
    createElementExtended('button', {
        parent: richItemRenderer,
        classnames: ['eyvfl-button', 'eyvfl-export-button-interval'],
        text: '↔️📋',
        onCreated: (button) => {
            bindOnClick(button, () => {
                buffer = ''
                if (itemIdSet === null) {
                    itemIdSet = localItemId
                    document.body.classList.add('eyvfl-mode-set')
                } else {
                    if (itemIdSet !== localItemId) {
                        let step = 1
                        if (itemIdSet > localItemId) {
                            step = -1
                        }
                        for (let currentItemId = itemIdSet; currentItemId*step <= localItemId*step; currentItemId+=step) {
                            addBufferOnElement(elementCache[currentItemId])
                        }
                        
                    }
                    itemIdSet = null
                    document.body.classList.remove('eyvfl-mode-set')
                }
                console.log(`Copying [${buffer}]`)
                copyTextToClipboard(buffer)
            })
        }
    })
})
