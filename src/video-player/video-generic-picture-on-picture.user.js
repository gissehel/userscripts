// @import{getElements}

const setVideoPictureInPicture = async () => {
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
        biggestVideo.requestPictureInPicture()

    } catch (err) {
        alert(err);
    }
}

setVideoPictureInPicture();