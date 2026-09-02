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

/** @type{HookableValue<string|undefined>|null} */
let panelControlQueryHv = null

/** @type{HookableValue<boolean>|null} */
let allowVideoSpeedChange = null;
/** @type{HookableValue<boolean>|null} */
let simulatePlayPauseOnClick = null;

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
    const speedRanges = await monkeyGetSetValue('speedRanges', [[0.75, 0.5, 0.25], 1, [1.25, 1.5, 1.75, 1.85, 2, 2.2, 2.35, 2.5, 3, 4, 5, 6, 8]]);
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

    await registrationManager.onRegistration(
        await registerDomNodeMutatedUnique(
            () => getElements('video'),
            async (video) => {

                const panelControlQuery = panelControlQueryHv?.value
                const panelControl = panelControlQuery ? document.querySelector(panelControlQuery) : undefined

                await registrationManager.onRegistration(await registerVideoElementToChangeSpeedOnDrag(
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

    panelControlQueryHv = await getPersistentParameterValueString(`panelControlQuery`, undefined, {
        dontStoreDefault: true,
        scope: PERSISTENT_PARAMETER_SCOPE.BY_HOST,
        displayName: `Panel Control Query`,
    })

    allowVideoSpeedChange = await getPersistentParameterValueBoolean(`allowVideoSpeedChange`, true, {
        dontStoreDefault: true,
        scope: PERSISTENT_PARAMETER_SCOPE.BY_HOST,
        displayName: `video speed change`,
    })

    simulatePlayPauseOnClick = await getPersistentParameterValueBoolean(`simulatePlayPauseOnClick`, false, {
        dontStoreDefault: true,
        scope: PERSISTENT_PARAMETER_SCOPE.BY_HOST,
        displayName: `simulate play/pause on click`,
    })

    await cleanupInstallation.onRegistration(await panelControlQueryHv.register(async () => { await installOrUninstall() }))
    await cleanupInstallation.onRegistration(await allowVideoSpeedChange?.register(async () => { await installOrUninstall() }))
    await cleanupInstallation.onRegistration(await simulatePlayPauseOnClick?.register(async () => { await installOrUninstall() }))

    if (allowVideoSpeedChange?.value) {
        await cleanupInstallation.onRegistration(await registerInstallation())
    }
}

async function main() {
    const init = await monkeyGetValue('init')
    if (init != true) {
        const defaultData = {
            'panelControlQuery': {
                'www.twitch.tv': "[data-a-target=\"player-overlay-click-handler\"]",
                'vidzy.org': "#fss-ov",
                'www.arte.tv': ".avp-content",
            },
            'simulatePlayPauseOnClick': {
                'www.youtube.com': true,
                'www.twitch.tv': true,
                'video.sibnet.ru': true,
                'sendvid.com': true,
            },
        }
        for (const key of Object.keys(defaultData)) {
            for (const host of Object.keys(defaultData[key])) {
                await monkeySetValue(`${key}_host_${host}`, defaultData[key][host])
            }
        }
        await monkeySetValue('init', true)
    }

    await installOrUninstall()
}

main()
