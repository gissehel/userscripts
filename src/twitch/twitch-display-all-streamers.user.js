// ==UserScript==
// @description  Display all streamers followed in the side bar
// ==/UserScript==

// @import{addStyle}
// @import{registerDomNodeMutatedUnique}
// @import{delay}
// @import{registerMenuCommand}

const getFollowedChannelZone = () => {
    return document.querySelector('[aria-label="Followed Channels"]')
}

const showMoreChannels = async (followedChannelZone) => {
    const button = followedChannelZone.querySelector('[data-a-target="side-nav-show-more-button"]')
    if (button) {
        button.click()
        return true
    }
    return false
}

const showAllChannels = async (followedChannelZone) => {
    let cont = true
    while (cont) {
        console.log('cont')
        cont = await showMoreChannels(followedChannelZone)
        await delay(50)
    }
}

const openAllChannels = async () => {
    return new Promise((resolve) => {
        registerDomNodeMutatedUnique(() => [getFollowedChannelZone()], async (followedChannelZone) => {
            console.log({ followedChannelZone })
            await showAllChannels(followedChannelZone)
            resolve()
        })
    })
}

const main = async () => {
    console.log({ message: 'in main' })
    await openAllChannels()
    await registerMenuCommand('👁️ Show all followed channels', async () => {
        await openAllChannels()
        console.log('👁️ All followed channels should be shown now')
    })
}

addStyle(`.side-nav-card:has(> a > .side-nav-card__avatar--offline) { height: 20px; } `)
addStyle(`.side-nav-card:has(> a > .side-nav-card__avatar--offline):hover { height: 42px; } `)
addStyle(`.side-nav-card__avatar--offline { overflow: hidden; transform: scale(0.5); }`)
main()
