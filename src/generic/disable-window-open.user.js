// ==UserScript==
// @description  Disable window.open calls by hosts
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0iIzAwMDAwMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGQ9Ik0xODQsNzJINDBBMTYsMTYsMCwwLDAsMjQsODhWMjAwYTE2LDE2LDAsMCwwLDE2LDE2SDE4NGExNiwxNiwwLDAsMCwxNi0xNlY4OEExNiwxNiwwLDAsMCwxODQsNzJabTAsMTI4SDQwVjg4SDE4NFYyMDBaTTIzMiw1NlYxNzZhOCw4LDAsMCwxLTE2LDBWNTZINjRhOCw4LDAsMCwxLDAtMTZIMjE2QTE2LDE2LDAsMCwxLDIzMiw1NloiPjwvcGF0aD48L3N2Zz4=
// ==/UserScript==

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
    const enableWindowOpen = await getPersistentParameterValueBoolean('opening-popups', true, {
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