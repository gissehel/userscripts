// @import{createElementExtended}
// @import{registerDomNodeMutatedUnique}

registerDomNodeMutatedUnique(
    () => [...document.querySelectorAll('[data-testid=ExploreBtn]')],
    async (explorerButton) => {
        const liExplorer = explorerButton.parentElement
        createElementExtended('li', {
            children: [
                createElementExtended('a', {
                    attributes: { 'href': '/explore?q=hottest' },
                    text: 'Hot',
                })
            ],
            prevSibling: liExplorer
        })
        createElementExtended('li', {
            children: [
                createElementExtended('a', {
                    attributes: { 'href': '/explore?q=new' },
                    text: 'New',
                })
            ],
            prevSibling: liExplorer
        })
    }
)
