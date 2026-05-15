// ==UserScript==
// @description  Add keys to nightcafe.studio. Alt+s : Like/Unlike ; Alt+f : Shade or Unshade the liked images
// ==/UserScript==

// @import{registerKeyStruct}
// @import{addStyle}
// @import{registerDomNodeMutated}
// @import{parentsElement}

const LIKED_CLASSES = {
    LIKED: 'isLiked',
    NOT_LIKED: 'isNotLiked',
    SHADE_LIKED: 'shadeLiked',
    MINIMISE_LIKED: 'minimiseLiked',
}

const likeOrUnlike = async (e) => {
    const likeOrUnlikeButtons = [...document.querySelectorAll('[data-testid="JobPopup"] button[title=Unlike]'), ...document.querySelectorAll('[data-testid="JobPopup"] button[title=Like]')]
    if (likeOrUnlikeButtons.length > 0) {
        likeOrUnlikeButtons[0].click()
    }

    e.preventDefault()
}

const onDomChanged = async () => {
    const images = [...document.querySelectorAll('.renderIfVisible')]
    for (let image of images) {
        const parentElementClassList = image.parentElement.classList
        const liked = [...image.querySelectorAll('path[d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"]')]
        if (liked.length > 0) {
            parentElementClassList.add(LIKED_CLASSES.LIKED)
            parentElementClassList.remove(LIKED_CLASSES.NOT_LIKED)
        } else {
            parentElementClassList.add(LIKED_CLASSES.NOT_LIKED)
            parentElementClassList.remove(LIKED_CLASSES.LIKED)
        }
    }
    for (let [pattern, depth] of [
        ["[href*='https://reddit.com/r/nightcafe']", 8], 
        ["[style*='lounge-bg.jpg']", 3], 
        ["[href*='/pricing#pro']", 2],
    ]) {
        const spamZones = [...document.querySelectorAll(pattern)]
        for (let spamZone of spamZones) {
            const zoneToSuppress = parentsElement(spamZone, depth)
            if (zoneToSuppress && !zoneToSuppress.classList.contains('hidden-element')) {
                zoneToSuppress.classList.add('hidden-element')
            }
        }
    }
}

const shadeOrUnshadeLiked = async (e) => {
    if (document.body.classList.contains(LIKED_CLASSES.SHADE_LIKED)) {
        document.body.classList.remove(LIKED_CLASSES.SHADE_LIKED)
    } else {
        document.body.classList.add(LIKED_CLASSES.SHADE_LIKED)
    }
    e.preventDefault()
}

const minimiseOrUnminimiseLiked = async (e) => {
    if (document.body.classList.contains(LIKED_CLASSES.MINIMISE_LIKED)) {
        document.body.classList.remove(LIKED_CLASSES.MINIMISE_LIKED)
    } else {
        document.body.classList.add(LIKED_CLASSES.MINIMISE_LIKED)
    }
    e.preventDefault()
}

registerDomNodeMutated(onDomChanged)
document.body.classList.add(LIKED_CLASSES.SHADE_LIKED)

const unregisterLikeOrUnlike = registerKeyStruct({ key: 's', altKey: true }, likeOrUnlike);
const unregisterShadeOrUnshadeLiked = registerKeyStruct({ key: 'f', altKey: true }, shadeOrUnshadeLiked);
const unregisterMinimiseOrUnminimiseLiked = registerKeyStruct({ key: 'm', altKey: true }, minimiseOrUnminimiseLiked);

addStyle('html, body { overflow: auto !important; }')
addStyle('.css-l316jd { position: fixed !important; }')
addStyle('.css-1s2cce1, .css-12ih86r, .css-7hfamk { margin-top: 60px; }')
addStyle(`.${LIKED_CLASSES.SHADE_LIKED} .${LIKED_CLASSES.LIKED} { opacity: 0.3; }`)
addStyle(`.${LIKED_CLASSES.MINIMISE_LIKED} .${LIKED_CLASSES.LIKED} { height: 10px; overflow: hidden; }`)
addStyle('.hidden-element { display: none !important; } ')
addStyle('.css-1ntkoiw { margin-bottom: 1000px; }')
addStyle(`.${LIKED_CLASSES.NOT_LIKED} .mdi-icon[width="28"] { width: 100px; height: 100px; }`)
addStyle(`.${LIKED_CLASSES.NOT_LIKED} .mdi-icon[width="30"] { display: none; }`)

