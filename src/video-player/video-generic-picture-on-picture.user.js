// @import{getElements}
// @import{registerMenuCommand}


/**
 * @param {(HTMLVideoElement)=>Promise<void>} funcSet 
 * @param {()=>Promise<HTMLVideoElement|null>} funcFind
 * @param {()=>Promise<void>} funcExit
 */
const setVideoFunction = async (funcSet, funcFind, funcExit) => {
    try {
        if (await funcFind()) {
            await funcExit()
        } else {
            const videos = getElements('video')
            const noVideo = {
                requestPictureInPicture: () => Promise.reject('No video found'),
                offsetHeight: 0
            }
            const biggestVideo = videos.reduce(
                (prev, current) => {
                    if (prev.offsetHeight > current.offsetHeight) {
                        return prev
                    } else {
                        return current
                    }
                }
                , noVideo
            )
            await funcSet(biggestVideo)
        }
    } catch (err) {
        alert(err);
    }
}

registerMenuCommand(
    '🔄 Toggle Picture-in-Picture',
    async () => setVideoFunction(
        async (video) => video.requestPictureInPicture(),
        async () => document.pictureInPictureElement,
        async () => document.exitPictureInPicture()
    )
)
// registerMenuCommand(
//     '📺 Toggle Fullscreen',
//     async () => setVideoFunction(
//         async (video) => video.requestFullscreen(),
//         async () => document.fullscreenElement,
//         async () => document.exitFullscreen()
//     )
// )
