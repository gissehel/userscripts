// ==UserScript==
// @match        https://www.arte.tv/*
// @iconFromDomain arte.tv
// ==/UserScript==

// @import{addStyle}

const main = async () => {

    addStyle(`
        .avp .avp-content {
            background-color: none !important;
        }
    `)
}

main()