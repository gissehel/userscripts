// @import{registerClickListener}
// @import{registerDomNodeMutatedUnique}
// @import{createElementExtended}
// @import{getElements}

registerDomNodeMutatedUnique(() => getElements('.top-nav__prime'), (nav_menu) => {
    createElementExtended('div', {
        text: 'PiP',
        classnames: ['pip-button'],
        nextSibling: nav_menu,
        onCreated: (pipNode) => {
            pipNode.style.fontWeight = 'bold'
            pipNode.style.cursor = 'pointer'
            pipNode.registerClickListener(() => {
                (
                    getElements('video').reduce(
                        (prev, current) => (prev.offsetHeight > current.offsetHeight) ? prev : current,
                        {
                            requestPictureInPicture: () => Promise.reject('No video found')
                        }
                    ).requestPictureInPicture()
                ).catch(err => alert(err))
            }, false)
        }
    })
})
