/**
 * register a video element to change playback speed based on vertical drag distance. (Use the register pattern for cleanup)
 * 
 * @param {HTMLVideoElement} video the video element
 * @param {number} thresold the threshold for detecting drag distance
 * @param {[number[], number, number[]]} speedvalues The speed values : [lowSpeeds[], normalSpeed, highSpeeds[]]
 * @param {(number) => void} setSpeed function to set the speed
 * @param {Object} options additional options
 * @param {boolean} [options.verbose=false] enable debug logging
 * @return {()=>void} cleanup function to remove event listeners
 */
const registerVideoElementToChangeSpeedOnDrag = (video, thresold, speedvalues, setSpeed, options) => {
    if (!options) {
        options = {}
    }
    const [lowSpeeds, normalSpeed, highSpeeds] = speedvalues
    let startY = 0;
    let hasExceededThreshold = false;
    let shouldCancelClick = false;
    let activePointerId = null;
    let speed = normalSpeed;

    const onPointerDown = (e) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        startY = e.clientY;
        hasExceededThreshold = false;
        shouldCancelClick = false;
        activePointerId = e.pointerId;
        video.setPointerCapture(activePointerId);
    }

    const onPointerMove = (e) => {
        if (hasExceededThreshold) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }
        if (e.pointerId !== activePointerId) {
            return;
        }
        const deltaY = startY - e.clientY;
        if (Math.abs(deltaY) > thresold) {
            hasExceededThreshold = true;
            shouldCancelClick = true;
        }
        if (hasExceededThreshold) {
            let new_speed = normalSpeed
            let hasNewSpeed = false
            let index = highSpeeds.length - 1
            while ((!hasNewSpeed) && (index >= 0)) {
                if (deltaY > thresold * (index + 1)) {
                    new_speed = highSpeeds[index]
                    hasNewSpeed = true
                    break
                }
                index -= 1
            }
            if (!hasNewSpeed) {
                if (deltaY > -thresold) {
                    new_speed = normalSpeed
                    hasNewSpeed = true
                }
            }
            while ((!hasNewSpeed) && (index < lowSpeeds.length)) {
                if (deltaY > -thresold * (index + 2)) {
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
                setSpeed(speed)
                if (options.verbose) {
                    console.log(`SPEED : [${speed}] move (${deltaY})`)
                }
            }
        }
    }

    const cleanup = (e) => {
        if (hasExceededThreshold) {
            e.stopImmediatePropagation();
            e.preventDefault();
            hasExceededThreshold = false;
            speed = normalSpeed
            setSpeed(speed)
            if (options.verbose) {
                console.log(`SPEED : [${speed}] cleanup`)
            }
        }
        if (activePointerId !== null) {
            try {
                video.releasePointerCapture(activePointerId);
            }
            catch (_) { }
        }
        activePointerId = null;
    }

    const onPointerUp = (e) => {
      if (!hasExceededThreshold) {
        if (options.simulatePlayPause) {
          console.log('play pause simulation')
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

    const onClick = (e) => {
        if (shouldCancelClick) {
            e.stopImmediatePropagation();
            e.preventDefault();
            shouldCancelClick = false;
        }
    }

    video.addEventListener("pointerdown", onPointerDown, { capture: true });
    video.addEventListener("pointermove", onPointerMove, { capture: true });
    video.addEventListener("pointerup", onPointerUp, { capture: true });
    video.addEventListener("pointercancel", cleanup, { capture: true });
    video.addEventListener("click", onClick, { capture: true });

    return () => {
        video.removeEventListener("pointerdown", onPointerDown, { capture: true });
        video.removeEventListener("pointermove", onPointerMove, { capture: true });
        video.removeEventListener("pointerup", onPointerUp, { capture: true });
        video.removeEventListener("pointercancel", cleanup, { capture: true });
        video.removeEventListener("click", onClick, { capture: true });
    }
}
