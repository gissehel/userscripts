// @import{getElements}
// @import{registerMenuCommand}


/**
 * @param {(HTMLVideoElement)=>void} func 
 */
const setVideoFunction = async (func) => {
    try {
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
            ,noVideo
        )
        func(biggestVideo)

    } catch (err) {
        alert(err);
    }
}

registerMenuCommand('🔄 Toggle Picture-in-Picture', async () => setVideoFunction((video) => video.requestPictureInPicture()))
registerMenuCommand('🛑 Exit Picture-in-Picture', async () => document.exitPictureInPicture())
registerMenuCommand('📺 Toggle Fullscreen', async () => setVideoFunction((video) => video.requestFullscreen()))
registerMenuCommand('🛑 Exit Fullscreen', async () => document.exitFullscreen())
