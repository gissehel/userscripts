// @import{getSsmValue}
// @import{getSsmHookableValue}
// @import{getSsmHookableValueMonkeyGetSet}
// @import{createElementExtended}
// @import{createIconLinkAction}
// @import{ICONS}
// @import{registerMenuCommand}

/**
 * Creates a generic panel
 * @param {string} localName The local storage name
 * @param {string} sectionName The section name within the panel
 * @param {()=>Promise<HTMLElement[]>} getPanelContent The function to get the panel content
 * @param {Object} [options] Additional options
 * @param {(newPosition: string) => void} [options.onPanelPositionChanged] A callback called when the panel position changes
 * @param {(swapGenericPanel: () => void) => void} [options.setSwapGenericPanelFunction] A function to get the swap generic panel function, which can be used to toggle the panel visibility
 */
const createSsmGenericPanel = async (localName, sectionName, getPanelContent, options) => {
    if (!options) {
        options = {};
    }
    const PANEL_POSITION = {
        RIGHT: 'right',
        LEFT: 'left',
        MINI: 'mini',
        NONE: 'none',
    }

    const getNextPanelPosition = (position) => {
        switch (position) {
            case PANEL_POSITION.RIGHT: return PANEL_POSITION.LEFT;
            case PANEL_POSITION.LEFT: return PANEL_POSITION.MINI;
            case PANEL_POSITION.MINI: return PANEL_POSITION.RIGHT;
            case PANEL_POSITION.NONE: return PANEL_POSITION.RIGHT;
        }
        return PANEL_POSITION.RIGHT;
    }

    let panelPosition = getSsmHookableValueMonkeyGetSet(localName, 'panelPosition', PANEL_POSITION.RIGHT);

    const panel = getSsmValue(localName, 'panel', () => createElementExtended('div', {
        style: {
            position: 'fixed',
            top: '10px',
            right: panelPosition.value === PANEL_POSITION.LEFT ? 'unset' : '10px',
            left: panelPosition.value === PANEL_POSITION.LEFT ? '10px' : 'unset',
            zIndex: 2147483621,
            backgroundColor: 'white',
            border: '1px solid black',
            padding: '10px',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.5)',
            maxWidth: '250px',
            fontSize: '14px',
            fontFamily: 'Calibri, Helvetica, sans-serif',
            borderRadius: '5px',
            opacity: '0.8',
        },
        parent: document.body,
        children: [
            createElementExtended('span', {
                children: [
                    createIconLinkAction(
                        ICONS.LEFT,
                        'Move panel to the left',
                        async () => await panelPosition.setValue(PANEL_POSITION.LEFT),
                    ),
                    createIconLinkAction(
                        ICONS.RIGHT,
                        'Move panel to the right',
                        async () => await panelPosition.setValue(PANEL_POSITION.RIGHT),
                    ),
                    createIconLinkAction(
                        ICONS.SHRINK,
                        'Shrink panel',
                        async () => await panelPosition.setValue(PANEL_POSITION.MINI),
                    ),
                ],
                style: {
                    display: panelPosition.value === PANEL_POSITION.MINI ? 'none' : 'inline-block',
                },
                onCreated: (element) => panelPosition.register(async (newValue) => element.style.display = newValue === PANEL_POSITION.MINI ? 'none' : 'inline-block'),
            }),
            createElementExtended('span', {
                children: [
                    createIconLinkAction(
                        ICONS.GROW,
                        'Grow panel',
                        async () => await panelPosition.setValue(PANEL_POSITION.RIGHT),
                    ),
                ],
                style: {
                    display: panelPosition.value === PANEL_POSITION.MINI ? 'inline-block' : 'none',
                },
                onCreated: (element) => panelPosition.register(async (newValue) => element.style.display = newValue === PANEL_POSITION.MINI ? 'inline-block' : 'none'),
            }),
        ],
        onCreated: (panel) => {
            panel.subSections = {};
            panelPosition.register(async (newValue) => {
                panel.style.right = newValue === PANEL_POSITION.LEFT ? 'unset' : '10px';
                panel.style.left = newValue === PANEL_POSITION.LEFT ? '10px' : 'unset';
                panel.style.display = newValue === PANEL_POSITION.NONE ? 'none' : 'block';
            });
        },
    }));

    if (panel.subSections[sectionName]) {
        panel.subSections[sectionName].remove()
    }

    const sectionElement = createElementExtended('span', {
        children: await getPanelContent(),
        style: {
            display: panelPosition.value === PANEL_POSITION.MINI ? 'none' : 'block',
        },
        onCreated: (panelContent) => panelPosition.register(async (newValue) => panelContent.style.display = newValue === PANEL_POSITION.MINI ? 'none' : 'block'),
    })

    panel.subSections[sectionName] = sectionElement;

    const nextSectionKey = Object.keys(panel.subSections).sort((a, b) => a.localeCompare(b)).filter(key => sectionName.localeCompare(key) < 0)[0];

    if (nextSectionKey) {
        panel.insertBefore(sectionElement, panel.subSections[nextSectionKey]);
    } else {
        panel.appendChild(sectionElement);
    }

    const swapGenericPanel = async () => {
        panelPosition.value = (panelPosition.value === PANEL_POSITION.NONE) ? PANEL_POSITION.RIGHT : PANEL_POSITION.NONE;
    }

    registerMenuCommand('Show/Hide generic panel', async () => {
        if (swapGenericPanel) {
            await swapGenericPanel();
        }
    })

    if (options.onPanelPositionChanged) {
        panelPosition.register(options.onPanelPositionChanged);
    }
    if (options.setSwapGenericPanelFunction) {
        options.setSwapGenericPanelFunction(swapGenericPanel);
    }
}
