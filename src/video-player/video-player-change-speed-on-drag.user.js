// ==UserScript==
// @match        https://*/*
// @iconFromDomain youtube.com
// ==/UserScript==

// @import{getElements}
// @import{registerDomNodeMutatedUnique}
// @import{registerVideoElementToChangeSpeedOnDrag}
// @import{monkeyGetSetValue}
// @import{monkeySetValue}
// @import{monkeyGetValue}
// @import{createElementExtended}
// @import{RegistrationManager}
// @import{realWindow}
// @import{exportOnWindow}
// @import{registerMenuCommand}
// @import{getPersistentParameterValueString}
// @import{getPersistentParameterValueBoolean}
// @import{PERSISTENT_PARAMETER_SCOPE}

/** @type{HookableValue<string>|null} */
let panelControlQueryHv = null

/** @type{HookableValue<boolean>|null} */
let allowVideoSpeedChange = null;
/** @type{HookableValue<boolean>|null} */
let simulatePlayPauseOnClick = null;


const defaultPanelControlByHost = {
    'www.twitch.tv': '[data-a-target="player-overlay-click-handler"]',
}

class PersistantInternalExternalList {
    constructor(monkeyName, defaultInternalList = [], defaultExternalList = []) {
        this.internalList = [...defaultInternalList]
        this.defaultExternalList = [...defaultExternalList]
        this.externalList = null
        this.monkeyName = monkeyName
        this.list = null
        // this.list = [...this.internalList, ...this.externalList]
    }

    async _ensureExternalList() {
        if (this.externalList === null) {
            this.externalList = await monkeyGetSetValue(this.monkeyName, this.defaultExternalList)
        }
        return this.externalList
    }

    async _ensureList() {
        if (this.list === null) {
            await this._ensureExternalList()
            this.list = [...this.internalList, ...this.externalList]
        }
    }

    async add(item) {
        await this._ensureExternalList()
        if (!this.externalList.includes(item)) {
            this.externalList.push(item)
            await monkeySetValue(this.monkeyName, this.externalList)
            this.list = [...this.internalList, ...this.externalList]
            return true
        }
        return false
    }

    async remove(item) {
        await this._ensureExternalList()
        const index = this.externalList.indexOf(item)
        if (index >= 0) {
            this.externalList.splice(index, 1)
            await monkeySetValue(this.monkeyName, this.externalList)
            this.list = [...this.internalList, ...this.externalList]
            return true
        }
        return false
    }

    async includes(item) {
        await this._ensureList()
        return this.list.includes(item)
    }

    async externalIncludes(item) {
        await this._ensureExternalList()
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
        if (label) {
            speedTextLabel.textContent = label
        }
        speedLabel.style.display = display ? "" : "none"
    }
}

const setSpeedLabelYoutube = (video, speed) => {
    setLabelYoutube(video, `${speed}x`, speed !== 1)
}

const removeLabelYoutube = (video) => {
    setLabelYoutube(video, null, false)
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
        if (label) {
            speedTextLabel.textContent = label
        }
        speedLabel.style.display = display ? "inline-block" : "none"
    }
}
const setSpeedLabelGeneric = (video, speed) => {
    setLabelGeneric(video, `${speed}x`, speed !== 1)
}

const removeLabelGeneric = (video) => {
    setLabelGeneric(video, null, false)
}

const setTimeIncrLabelGeneric = getTimeIncrLabelSetter(setLabelGeneric)

const speedChangeByHost = {
    'www.youtube.com': setSpeedLabelYoutube,
}

const timeChangeByHost = {
    'www.youtube.com': setTimeIncrLabelYoutube,
}

const removeLabelByHost = {
    'www.youtube.com': removeLabelYoutube,
}

const registerInstallation = async () => {
    const speedRanges = await monkeyGetSetValue('speedRanges', [[0.75, 0.5, 0.25], 1, [1.25, 1.5, 1.75, 2, 3, 4, 5, 6, 8]]);
    const verbose = await monkeyGetSetValue('verbose', false);
    const simulatePlayPause = (simulatePlayPauseOnClick?.value ?? false)
    let onSpeedChanged = null
    let onTimeChanged = null
    let onRemoveLabel = null

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

    if (removeLabelByHost[location.host]) {
        onRemoveLabel = removeLabelByHost[location.host]
    } else {
        onRemoveLabel = removeLabelGeneric
    }

    const thresold = await monkeyGetSetValue('thresold', 20)
    const registrationManager = new RegistrationManager({ autoCleanupOnAfterFirstCleanup: true })

    registrationManager.onRegistration(
        await registerDomNodeMutatedUnique(
            () => getElements('video'),
            async (video) => {

                const panelControlQuery = panelControlQueryHv?.value
                const panelControl = panelControlQuery ? document.querySelector(panelControlQuery) : undefined

                registrationManager.onRegistration(registerVideoElementToChangeSpeedOnDrag(
                    video,
                    speedRanges,
                    {
                        verbose,
                        thresold,
                        simulatePlayPause,
                        onSpeedChanged,
                        onTimeChanged,
                        onRemoveLabel,
                        panelControl,
                    }
                ));
            })
    )

    return async () => {
        await registrationManager.cleanupAll()
    }
}

const cleanupInstallation = new RegistrationManager()

async function installOrUninstall() {
    await cleanupInstallation.cleanupAll()

    allowVideoSpeedChange = await getPersistentParameterValueBoolean(`allowVideoSpeedChange`, true, {
        dontStoreDefault: true,
        scope: PERSISTENT_PARAMETER_SCOPE.BY_DOMAIN,
        displayName: `video speed change`,
    })
    simulatePlayPauseOnClick = await getPersistentParameterValueBoolean(`simulatePlayPauseOnClick`, false, {
        dontStoreDefault: true,
        scope: PERSISTENT_PARAMETER_SCOPE.BY_DOMAIN,
        displayName: `simulate play/pause on click`,
    })

    simulatePlayPauseOnClick?.registerAndCall(async (shouldSimulatePlayPauseOnClick) => {
        if (shouldSimulatePlayPauseOnClick) {
            console.log(`Simulate play/pause on click has been enabled for ${location.host}.`)
        } else {
            console.log(`Simulate play/pause on click has been disabled for ${location.host}.`)
        }
        await cleanupInstallation.cleanupAll()
        if (allowVideoSpeedChange?.value) {
            await cleanupInstallation.onRegistration(await registerInstallation())
        }
    })

    allowVideoSpeedChange?.registerAndCall(async (shouldAllowVideoSpeedChange) => {
        await cleanupInstallation.cleanupAll()
        if (shouldAllowVideoSpeedChange) {
            await cleanupInstallation.onRegistration(await registerInstallation())
            console.log(`Video speed change has been enabled for ${location.host}.`)
        } else {
            console.log(`Video speed change has been disabled for ${location.host}.`)
        }
    })
}

async function main() {
    const init = await monkeyGetValue('init')
    if (init != true) {
        for (const domain of ['www.youtube.com', 'www.twitch.tv', 'video.sibnet.ru', 'sendvid.com']) {
            await monkeySetValue(`simulatePlayPauseOnClick_domain_${domain}`, true)
        }
        await monkeySetValue('init', true)
    }

    panelControlQueryHv = await getPersistentParameterValueString(
        `panelControlQuery`,
        defaultPanelControlByHost[location.host],
        {
            scope: PERSISTENT_PARAMETER_SCOPE.BY_HOST
        }
    )

    panelControlQueryHv.register(async () => {
        await installOrUninstall()
    })

    await installOrUninstall()
}

main()
