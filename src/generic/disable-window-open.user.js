// @import{getPersistentParameterValueBoolean}
// @import{PERSISTENT_PARAMETER_SCOPE}
// @import{realWindow}

const main = async () => {
    const windowOpenOrig = realWindow.open;
    const windowOpenMock = (...args) => {
        console.log('window.open is disabled');
        console.log('   Arguments tried:', args);
        return null;
    }
    const enableWindowOpen = await getPersistentParameterValueBoolean('allow-window-open', true, {
        scope: PERSISTENT_PARAMETER_SCOPE.BY_HOST,
        dontStoreDefault: true,      
    });
    enableWindowOpen.registerAndCall(async (newValue) => {
        if (newValue) {
            if (realWindow.open !== windowOpenOrig) {
                realWindow.open = windowOpenOrig;
            }
        } else {
            if (realWindow.open !== windowOpenMock) {
                realWindow.open = windowOpenMock; 
            }
        }   
    })
}

main()