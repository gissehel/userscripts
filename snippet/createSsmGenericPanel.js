// @import{getSsmValue}
// @import{getSsmHookableValue}
// @import{getSsmHookableValueMonkeyGetSet}
// @import{createElementExtended}
// @import{createIconLinkAction}
// @import{ICONS}

/**
 * Creates a generic panel
 * @param {string} localName The local storage name
 * @param {()=>Promise<HTMLElement[]>} getPanelContent The function to get the panel content
 */
const createSsmGenericPanel = async (localName, getPanelContent) => {
    const PANEL_POSITION = {
        RIGHT: 'right',
        LEFT: 'left',
        MINI: 'mini',
    }

    const getNextPanelPosition = (position) => {
        switch (position) {
            case PANEL_POSITION.RIGHT: return PANEL_POSITION.LEFT;
            case PANEL_POSITION.LEFT: return PANEL_POSITION.MINI;
            case PANEL_POSITION.MINI: return PANEL_POSITION.RIGHT;
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
            createIconLinkAction(
                ICONS.MOVE,
                'Move panel',
                async () => {
                    await panelPosition.setValue(getNextPanelPosition(panelPosition.value));
                }
            ),
        ],
        onCreated: (panel) => {
            panelPosition.register(async (newValue) => {
                if (newValue === PANEL_POSITION.LEFT) {
                    panel.style.right = 'unset';
                    panel.style.left = '10px';
                } else {
                    panel.style.right = '10px';
                    panel.style.left = 'unset';
                }
            });
        },
    }));

    panel.appendChild(
        createElementExtended('span', {
            children: await getPanelContent(),
            style: {
                display: panelPosition.value === PANEL_POSITION.MINI ? 'none' : 'block',
            },
            onCreated: (panelContent) => {
                panelPosition.register(async (newValue) => {
                    if (newValue === PANEL_POSITION.MINI && panelContent) {
                        panelContent.style.display = 'none';
                    } else if (panelContent) {
                        panelContent.style.display = 'block';
                    }
                });
            },
        }),
    )
}
