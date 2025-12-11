// ==UserScript==
// @description  WPlace cross on paint ❌🌍
// @license      MIT
// ==/UserScript==

// @import{addStyle}
// @import{createElementExtended}
// @import{registerDomNodeMutatedUnique}
// @import{registerEventListener}
// @import{getElements}

const semifatness = 1

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
    .wplace-cross-on-paint-x { width: ${2*semifatness+1}px; height: 100%; }
    .wplace-cross-on-paint-y { width: 100%; height: ${2*semifatness+1}px; }
    .wplace-cross-disabled { display: none; }
`)

let enabled = true

let lastId = null
let nextId = null
let lastTime = null
let buttonCross = null

const delay = 20

const toggleCross = () => {
    enabled = !enabled
    if (enabled) {
        crossX.classList.remove('wplace-cross-disabled')
        crossY.classList.remove('wplace-cross-disabled')
        if (buttonCross) {
            buttonCross.classList.add('btn-primary', 'btn-soft')
            buttonCross.classList.remove('text-base-content/80')
        }
    } else {
        crossX.classList.add('wplace-cross-disabled')
        crossY.classList.add('wplace-cross-disabled')
        if (buttonCross) {
            buttonCross.classList.remove('btn-primary', 'btn-soft')
            buttonCross.classList.add('text-base-content/80')
        }
    }
}

const updateCross = (e, rect, randomId) => {
    if (!enabled) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    crossX.style.left = `${x+semifatness}px`
    crossY.style.top = `${y+semifatness}px`
    lastId = randomId
    lastTime = Date.now()
}

registerEventListener(map, 'mousemove', (e) => {
    if (!enabled) return
    const randomId = Math.floor(Math.random() * 1000000000)
    const currentTime = Date.now()
    nextId = randomId
    const rect = map.getBoundingClientRect()

    if (lastTime && (currentTime - lastTime) < delay) {
        setTimeout(() => {
            if (nextId === randomId && lastId !== randomId) {
                updateCross(e, rect, randomId)
            }
        }, delay)
    } else {
        updateCross(e, rect, randomId)
    }
})

registerEventListener(document, 'keydown', (e) => {
    if (e.key === 'c' && (e.altKey && !e.metaKey && !e.ctrlKey && !e.shiftKey)) {
        toggleCross()
    }
})

const createCrossButton = (container, config) => {
    const parent = container.parentElement;
    if (!parent) return;

    buttonCross = document.createElement('button');
    buttonCross.className = 'btn btn-lg sm:btn-xl btn-square shadow-md btn-primary btn-soft ml-2 z-30';
    buttonCross.title = 'Enable/Disable cross on paint';
    buttonCross.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-64 -64 128 128" fill="currentColor" class="size-5">
            <path d="M 6 6 64 6 64 -6 6 -6 6 -64 -6 -64 -6 -6 -64 -6 -64 6 -6 6 -6 64 6 64 Z"/>
        </svg>
    `;
    buttonCross.addEventListener('click', () => toggleCross());
    parent.appendChild(buttonCross);
    console.log('❌ Cross button added');
}

const buttonConfigs = [
    {
        id: 'favorite-btn',
        selector: `[title="Enable/Disable cross on paint"]`,
        containerSelector: 'button[title="Toggle art opacity"]',
        create: createCrossButton
    },
];

const startButtonObserver = (configs) => {
    const ensureButtons = () => {
        configs.forEach(config => {
            if (!document.querySelector(config.selector)) {
                const container = document.querySelector(config.containerSelector);
                if (container) {
                    config.create(container, config);
                }
            }
        });
    };

    // Observe DOM changes
    const observer = new MutationObserver(() => {
        setTimeout(ensureButtons, 100);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial placement & periodic check
    setTimeout(ensureButtons, 1000);
    setInterval(ensureButtons, 5000);
}


startButtonObserver(buttonConfigs);