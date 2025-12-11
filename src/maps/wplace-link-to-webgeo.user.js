// ==UserScript==
// @match        https://wplace.live/*
// ==/UserScript==

// @import{registerClickListener}
// @import{registerDomNodeMutatedUnique}
// @import{createElementExtended}
// @import{openLinkInNewTab}

registerDomNodeMutatedUnique(() => document.querySelectorAll('.modal-box.max-h-11\\/12 .border-base-content\\/20.rounded-field.mt-3.flex.w-full.items-center.gap-1.border-2.py-1\\.5.pl-4.pr-2\\.5 button.btn.btn-primary'), (copyButton) => {
    const inputZone = copyButton.parentNode.parentNode
    const inputElement = inputZone.querySelector('input')
    console.log({ inputElement, inputZone, copyButton })
    createElementExtended('div', {
        classnames: ['h-10'],
        parent: inputZone,
        children: [
            createElementExtended('button', {
                classnames: ['btn'],
                attributes: {
                    style: 'background-image: url(\'https://webgiss.github.io/webgeo/earth-32.png\'); border: none; background-repeat: no-repeat; background-position: center;',
                },
                onCreated: (button) => {
                    button.addEventListener('click', () => {
                        const parts = inputElement.value.split('?')[1].split('&')
                        let lat=null
                        let lon=null
                        let zoom=null
                        for (let part of parts) {
                            const [key, value] = part.split('=')
                            if (key === 'lat') {
                                lat = value
                            }
                            if (key === 'lng') {
                                lon = value
                            }
                            if (key === 'zoom') {
                                zoom = value
                            }
                        }
                        openLinkInNewTab(`https://webgiss.github.io/webgeo/#style=org&map=${zoom}/${lat}/${lon}`);
                    });
                }
            })
        ],
    })
})