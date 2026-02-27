// ==UserScript==
// @match        https://*/*
// @iconFromDomain youtube.com
// ==/UserScript==

// @import{getElements}
// @import{registerDomNodeMutatedUnique}
// @import{registerVideoElementToChangeSpeedOnDrag}
// @import{monkeyGetSetValue}
// @import{monkeySetValue}
// @import{createElementExtended}
// @import{RegistrationManager}
// @import{realWindow}
// @import{exportOnWindow}
// @import{registerMenuCommand}

class PersistantInternalExternalList {
    constructor(monkeyName, defaultInternalList = [], defaultExternalList = []) {
        this.internalList = [...defaultInternalList]
        this.externalList = monkeyGetSetValue(monkeyName, defaultExternalList)
        this.monkeyName = monkeyName
        this.list = [...this.internalList, ...this.externalList]
    }

    add(item) {
        if (!this.externalList.includes(item)) {
            this.externalList.push(item)
            monkeySetValue(this.monkeyName, this.externalList)
            this.list = [...this.internalList, ...this.externalList]
            return true
        }
        return false
    }

    remove(item) {
        const index = this.externalList.indexOf(item)
        if (index >= 0) {
            this.externalList.splice(index, 1)
            monkeySetValue(this.monkeyName, this.externalList)
            this.list = [...this.internalList, ...this.externalList]
            return true
        }
        return false
    }

    includes(item) {
        return this.list.includes(item)
    }

    externalIncludes(item) {
        return this.externalList.includes(item) 
    }
}

const domainBlackList = new PersistantInternalExternalList(
    'domainBlackList', 
    [], 
    []
)

const domainSimulatePlayPauseOnClickList = new PersistantInternalExternalList(
    'domainSimulatePlayPauseOnClickList', 
    ['www.youtube.com', 'www.twitch.tv'], 
    ['video.sibnet.ru', 'sendvid.com']
)

let speedLabel = null
let speedTextLabel = null

const getTimeIncrLabelSetter = (setLabel) => (video, deltaTime) => {
    const display = deltaTime !== null ? true : false
    let label = ""
    if (display) {
        const sign = deltaTime > 0 ? "+" : "-"
        label = `${sign}${Math.abs(deltaTime)}s`
    }
    setLabel(video, label, display)
}

const setLabelYoutube = (video, label, display) => {
    if (!speedLabel || !speedTextLabel) {
        speedTextLabel = document.querySelector('.ytp-speedmaster-label')
        speedLabel = document.querySelector('.ytp-speedmaster-overlay')

    }
    if (speedLabel && speedTextLabel) {
        speedTextLabel.textContent = label
        speedLabel.style.display = display ? "" : "none"
    }
}

const setSpeedLabelYoutube = (video, speed) => {
    setLabelYoutube(video, `${speed}x`, speed !== 1)
}

const setTimeIncrLabelYoutube = getTimeIncrLabelSetter(setLabelYoutube)

const setLabelGeneric = (video, label, display) => {
    if (!speedLabel || !speedTextLabel) {
        createElementExtended('div', {
            style: {
                width: '100%',
                height: '30px',
                position: 'absolute',
                top: '5px',
                left: '0px',
                right: '0px',
                display: 'block',
                textAlign: 'center',
                zIndex: '9999',
            },
            prevSibling: video,
            onCreated: (element) => speedLabel = element,
            children: [
                createElementExtended('div', {
                    style: {
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'rgb(255, 255, 255)',
                        width: '80px',
                        height: '30px',
                        position: 'relative',
                        top: '5px',
                        left: 'auto',
                        right: 'auto',
                        display: 'inline-block',
                        padding: '5px',
                        lineHeight: '20px',
                        borderRadius: '8px',
                        fontFamily: 'sans-serif',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        textAlign: 'center',
                    },
                    prevSibling: video,
                    onCreated: (element) => speedTextLabel = element,
                })
            ],
        })

    }

    if (speedLabel && speedTextLabel) {
        speedTextLabel.textContent = label
        speedLabel.style.display = display ? "inline-block" : "none"
    }
}
const setSpeedLabelGeneric = (video, speed) => {
    setLabelGeneric(video, `${speed}x`, speed !== 1)
}

const setTimeIncrLabelGeneric = getTimeIncrLabelSetter(setLabelGeneric)

const speedChangeByHost = {
    'www.youtube.com': setSpeedLabelYoutube,
}

const timeChangeByHost = {
    'www.youtube.com': setTimeIncrLabelYoutube,
}

const registerInstallation = () => {
    const speedRanges = monkeyGetSetValue('speedRanges', [[0.75, 0.5, 0.25], 1, [1.25, 1.5, 1.75, 2, 3, 4, 5, 6, 8]]);
    const verbose = monkeyGetSetValue('verbose', false);
    const simulatePlayPause = domainSimulatePlayPauseOnClickList.includes(location.host)
    let onSpeedChanged = null
    let onTimeChanged = null

    if (speedChangeByHost[location.host]) {
        onSpeedChanged = speedChangeByHost[location.host]
    } else {
        onSpeedChanged = setSpeedLabelGeneric
    }

    if (timeChangeByHost[location.host]) {
        onTimeChanged = timeChangeByHost[location.host]
    } else {
        onTimeChanged = setTimeIncrLabelGeneric
    }

    const thresold = monkeyGetSetValue('thresold', 20)
    const registrationManager = new RegistrationManager({ autoCleanupOnAfterFirstCleanup: true })

    registrationManager.onRegistration(
        registerDomNodeMutatedUnique(
            () => getElements('video'),
            (video) => {
                const panelControlByHost = {
                    'www.twitch.tv': document.querySelector('[data-a-target="player-overlay-click-handler"]'),
                }

                const panelControl = panelControlByHost[location.host] || undefined

                registrationManager.onRegistration(registerVideoElementToChangeSpeedOnDrag(
                    video,
                    speedRanges,
                    {
                        verbose,
                        thresold,
                        simulatePlayPause,
                        onSpeedChanged,
                        onTimeChanged,
                        panelControl,
                    }
                ));
            })
    )

    return () => {
        registrationManager.cleanupAll()
    }
}

const cleanupInstallation = new RegistrationManager()

const main = async () => {
    if (domainBlackList.includes(location.host)) {
        console.log(`video-player-change-speed-on-drag: This site (${location.host}) is in the black list, skipping...`)
        console.log(`To remove this site from the black list, call video_player_change_speed__Remove_this_site_from_blacklist() in the console.${(window.location !== window.parent.location) ? ` This is an iframe for the url [${window.location.href}]. Be carefull to use the console of the iframe.` : ""}`)
    } else {
        console.log(`video-player-change-speed-on-drag: This site (${location.host}) is not in the black list, applying...`)
        console.log(`To add this site to the black list, call video_player_change_speed__Add_this_site_to_blacklist() in the console.${(window.location !== window.parent.location) ? ` This is an iframe for the url [${window.location.href}]. Be carefull to use the console of the iframe.` : ""}`)
        cleanupInstallation.onRegistration(registerInstallation())
    }
}

const video_player_change_speed__Add_this_site_to_blacklist = () => {
    if (domainBlackList.add(location.host)) {
        cleanupInstallation.cleanupAll()
        main()
        alert(`This site (${location.host}) has been added to the black list, you can call video_player_change_speed__Remove_this_site_from_blacklist() to remove it from the list if it was a mistake.`)
    }
}

const video_player_change_speed__Remove_this_site_from_blacklist = () => {
    if (domainBlackList.remove(location.host)) {
        cleanupInstallation.cleanupAll()
        main()
        alert(`This site (${location.host}) has been removed from the black list, you can call video_player_change_speed__Add_this_site_to_blacklist() to add it to the list if it was a mistake.`)
    }
}

const video_player_change_speed__Add_this_site_to_simulate_play_pause_on_click_list = () => {
    if (domainSimulatePlayPauseOnClickList.add(location.host)) {
        cleanupInstallation.cleanupAll()
        main()
        alert(`This site (${location.host}) has been added to the simulate play/pause on click list, you can call video_player_change_speed__Remove_this_site_from_simulate_play_pause_on_click_list() to remove it from the list if it was a mistake.`)
    }
}

const video_player_change_speed__Remove_this_site_from_simulate_play_pause_on_click_list = () => {
    if (domainSimulatePlayPauseOnClickList.remove(location.host)) {
        cleanupInstallation.cleanupAll()
        main()
        alert(`This site (${location.host}) has been removed from the simulate play/pause on click list, you can call video_player_change_speed__Add_this_site_to_simulate_play_pause_on_click_list() to add it to the list if it was a mistake.`)
    }
}

exportOnWindow({
    video_player_change_speed__Add_this_site_to_blacklist,
    video_player_change_speed__Remove_this_site_from_blacklist,
    video_player_change_speed__Add_this_site_to_simulate_play_pause_on_click_list,
    video_player_change_speed__Remove_this_site_from_simulate_play_pause_on_click_list,
})

registerMenuCommand('Add this site to video speed change black list', video_player_change_speed__Add_this_site_to_blacklist)
registerMenuCommand('Remove this site from video speed change black list', video_player_change_speed__Remove_this_site_from_blacklist)

registerMenuCommand('Add this site to simulate play/pause on click list', video_player_change_speed__Add_this_site_to_simulate_play_pause_on_click_list)
registerMenuCommand('Remove this site from simulate play/pause on click list', video_player_change_speed__Remove_this_site_from_simulate_play_pause_on_click_list)

main()
