// ==UserScript==
// @match        https://www.arte.tv/*
// @iconFromDomain www.arte.tv
// ==/UserScript==

// @import{addStyle}

const main = async () => {

    addStyle(`
        .avp .avp-content {
            background-color: transparent !important;
        }
    `)
}

main()