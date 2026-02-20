// @import{delay}
// @import{registerEventListener}
// @import{RegistrationManager}
/**
 * register a video element to change playback speed based on vertical drag distance. (Use the register pattern for cleanup)
 * 
 * @param {HTMLVideoElement} video the video element
 * @param {[number[], number, number[]]} speedvalues The speed values : [lowSpeeds[], normalSpeed, highSpeeds[]]
 * @param {Object} options additional options
 * @param {boolean} [options.verbose=false] enable debug logging
 * @param {boolean} [options.simulatePlayPause=false] simulate play/pause on click when there is no drag (only left click)
 * @param {HTMLElement} [options.panelControl=undefined] panel control element to bind drag events on instead of the video element (default to the video element)
 * @param {number} [options.thresold=20] the threshold for detecting drag distance (default to 20)
 * @param {number} [options.thresoldX=thresold] the threshold for detecting horizontal drag distance (default to the same as vertical)
 * @param {number} [options.thresoldY=thresold] the threshold for detecting vertical drag distance (default to the same as horizontal)
 * @param {number} [options.deltaTime=5] the time to skip when horizontal drag exceed the threshold
 * @param {(video: HTMLVideoElement, speed: number) => void} [options.setSpeed] function to set the speed, default to changing the playbackRate of the video element
 * @param {(video: HTMLVideoElement, speed: number) => void} [options.onSpeedChanged] callback called when the speed is changed by dragging
 * @param {(video: HTMLVideoElement, deltaTime: number) => void} [options.incrTime] the function to call to increment the video time when horizontal drag exceed the threshold
 * @param {(video: HTMLVideoElement, deltaTime: number) => Promise<void>} [options.onTimeChanged] callback called when the time is changed by dragging
 * @param {number} [options.timeDisplayDelay=300] the time in ms to display the time change when horizontal drag exceed the threshold
 * @return {()=>void} cleanup function to remove event listeners
 */
const registerVideoElementToChangeSpeedOnDrag = (video, speedvalues, options) => {
    if (!options) {
        options = {}
    }
    const panelControl = options.panelControl || video
    const [lowSpeeds, normalSpeed, highSpeeds] = speedvalues
    let startY = 0;
    let startX = 0;
    let hasExceededThreshold = false;
    let hasExceededThresholdX = false;
    let hasExceededThresholdY = false;
    let shouldCancelClick = false;
    let activePointerId = null;
    let speed = normalSpeed;
    const thresold = options.thresold || 20;
    const verbose = options.verbose || false;
    const simulatePlayPause = options.simulatePlayPause || false;
    const setSpeed = options.setSpeed || ((video, speed) => video.playbackRate = speed)
    const onSpeedChanged = options.onSpeedChanged || null
    const thresoldX = options.thresoldX || thresold;
    const thresoldY = options.thresoldY || thresold;
    const deltaTime = options.deltaTime || 5;
    const incrTime = options.incrTime || ((video, deltaTime) => video.currentTime += deltaTime)
    const onTimeChanged = options.onTimeChanged || null
    const timeDisplayDelay = options.timeDisplayDelay || 300
    let deltaXSection = 0;

    const onPointerDown = async (e) => {
        if (e.button !== 0) {
            return;
        }
        e.stopImmediatePropagation();
        e.preventDefault();
        startX = e.clientX;
        startY = e.clientY;
        hasExceededThreshold = false;
        hasExceededThresholdX = false;
        hasExceededThresholdY = false;
        shouldCancelClick = false;
        activePointerId = e.pointerId;
        panelControl.setPointerCapture(activePointerId);
        deltaXSection = 0;
    }

    const onPointerMove = async (e) => {
        if (hasExceededThreshold || (!activePointerId)) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }
        if (e.pointerId !== activePointerId) {
            return;
        }
        const deltaX = e.clientX - startX;
        const deltaY = startY - e.clientY;
        if (Math.abs(deltaX) > thresoldX) {
            hasExceededThreshold = true;
            hasExceededThresholdX = true;
            shouldCancelClick = true;
        }
        if (Math.abs(deltaY) > thresoldY) {
            hasExceededThreshold = true;
            hasExceededThresholdY = true;
            shouldCancelClick = true;
        }
        if (hasExceededThresholdX) {
            const newDeltaXSection = Math.sign(deltaX) * Math.floor(Math.abs(deltaX) / thresoldX)
            if (newDeltaXSection !== deltaXSection) {
                if (newDeltaXSection > 0 && newDeltaXSection > deltaXSection) {
                    incrTime(video, deltaTime)
                    if (verbose) {
                        console.log(`TIME : [${deltaTime}s]`)
                    }
                    (async () => {
                        await onTimeChanged?.(video, deltaTime)
                        await delay(timeDisplayDelay)
                        await onTimeChanged?.(video, null)
                    })()
                } else if (newDeltaXSection < 0 && newDeltaXSection < deltaXSection) {
                    incrTime(video, -deltaTime)
                    if (verbose) {
                        console.log(`TIME : [${-deltaTime}s]`)
                    }
                    (async () => {
                        await onTimeChanged?.(video, -deltaTime)
                        await delay(timeDisplayDelay)
                        await onTimeChanged?.(video, null)
                    })()
                }
                deltaXSection = newDeltaXSection
            }
        }
        if (hasExceededThresholdY) {
            let new_speed = normalSpeed
            let hasNewSpeed = false
            let index = highSpeeds.length - 1
            while ((!hasNewSpeed) && (index >= 0)) {
                if (deltaY > thresoldY * (index + 1)) {
                    new_speed = highSpeeds[index]
                    hasNewSpeed = true
                    break
                }
                index -= 1
            }
            if (!hasNewSpeed) {
                if (deltaY > -thresoldY) {
                    new_speed = normalSpeed
                    hasNewSpeed = true
                }
            }
            while ((!hasNewSpeed) && (index < lowSpeeds.length)) {
                if (deltaY > -thresoldY * (index + 2)) {
                    new_speed = lowSpeeds[index]
                    hasNewSpeed = true
                    break
                }
                index += 1
            }
            if (!hasNewSpeed) {
                new_speed = lowSpeeds[lowSpeeds.length - 1]
                hasNewSpeed = true
            }
            if (speed !== new_speed) {
                speed = new_speed
                setSpeed(video, speed)
                if (verbose) {
                    console.log(`SPEED : [${speed}] move (${deltaY})`)
                }
                onSpeedChanged?.(video, speed)
            }
        }
    }

    const cleanup = async (e) => {
        if (hasExceededThreshold) {
            e.stopImmediatePropagation();
            e.preventDefault();
            hasExceededThreshold = false;
            if (hasExceededThresholdY) {
                speed = normalSpeed
                setSpeed(video, speed)
                if (verbose) {
                    console.log(`SPEED : [${speed}] cleanup`)
                }
                onSpeedChanged?.(video, speed)
            }
            if (hasExceededThresholdX) {
                deltaXSection = 0;
            }
        }
        if (activePointerId !== null) {
            try {
                panelControl.releasePointerCapture(activePointerId);
            }
            catch (_) { }
        }
        activePointerId = null;
    }

    const onPointerCancel = async (e) => {
        if (e.button !== 0) {
            return;
        }
        return cleanup(e)
    }

    const onPointerUp = async (e) => {
        if (e.button !== 0) {
            return;
        }
        if (!hasExceededThreshold) {
            if (simulatePlayPause) {
                shouldCancelClick = true;
                if (verbose) {
                    console.log('PLAY/PAUSE simulation')
                }
                if (video.paused) {
                    video.play()
                } else {
                    video.pause()
                }
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        }
        return cleanup(e)
    }

    const onClick = async (e) => {
        if (e.button !== 0) {
            return;
        }
        if (shouldCancelClick) {
            e.stopImmediatePropagation();
            e.preventDefault();
            shouldCancelClick = false;
        }
    }

    const registrationManager = new RegistrationManager()

    const eventsToBind = {
        pointerdown: onPointerDown,
        pointermove: onPointerMove,
        pointerup: onPointerUp,
        pointercancel: onPointerCancel,
        click: onClick
    }

    Object.entries(eventsToBind).forEach(([event, handler]) => {
        registrationManager.onRegistration(registerEventListener(panelControl, event, handler, { capture: true }));
    });

    return () => {
        registrationManager.cleanupAll();
    }
}
