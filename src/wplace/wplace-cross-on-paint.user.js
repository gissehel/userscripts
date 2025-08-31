// ==UserScript==
// @description  WPlace cross on paint ❌🌍
// @version      1.0.2
// @license      MIT
// ==/UserScript==

// @import{addStyle}
// @import{createElementExtended}
// @import{registerDomNodeMutatedUnique}
// @import{registerEventListener}
// @import{getElements}

const map = getElements('#map')[0]

const createCrossPart = (partname) =>
    createElementExtended('div', {
        classnames: ['wplace-cross-on-paint', `wplace-cross-on-paint-${partname}`],
        parent: map
    })


const crossX = createCrossPart('x')
const crossY = createCrossPart('y')

addStyle(`
    .wplace-cross-on-paint { position: absolute; z-index: 1000; pointer-events: none; user-select: none; background-color: yellow; mix-blend-mode: difference; }
    .wplace-cross-on-paint-x { width: 3px; height: 100%; }
    .wplace-cross-on-paint-y { width: 100%; height: 3px; }
    .wplace-cross-disabled { display: none; }
`)

let lastId = null
let nextId = null
let lastTime = null

const updateCross = (e, rect, randomId) => {
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    crossX.style.left = `${x}px`
    crossY.style.top = `${y}px`
    lastId = randomId
    lastTime = Date.now()
}

registerEventListener(map, 'mousemove', (e) => {
    const randomId = Math.floor(Math.random() * 1000000000)
    const currentTime = Date.now()
    nextId = randomId
    const rect = map.getBoundingClientRect()

    if (lastTime && (currentTime - lastTime) < 50) {
        setTimeout(() => {
            if (nextId === randomId && lastId !== randomId) {
                updateCross(e, rect, randomId)
            }
        }, 100)
    } else {
        updateCross(e, rect, randomId)
    }
})
