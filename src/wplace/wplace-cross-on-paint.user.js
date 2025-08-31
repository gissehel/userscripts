// ==UserScript==
// @description  WPlace cross on paint ❌🌍
// @version      1.0.1
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
    .wplace-cross-on-paint { position: absolute; z-index: 1000; pointer-events: none; user-select: none; background-color: white; mix-blend-mode: difference; }
    .wplace-cross-on-paint-x { width: 1px; height: 100%; }
    .wplace-cross-on-paint-y { width: 100%; height: 1px; }
    .wplace-cross-disabled { display: none; }
`)

registerEventListener(map, 'mousemove', (e) => {
    const rect = map.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    crossX.style.left = `${x}px`
    crossY.style.top = `${y}px`
})