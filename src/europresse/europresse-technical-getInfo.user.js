// ==UserScript==
// @match        https://nouveau-eureka-cc.*.idm.oclc.org/WebPages/SourceDetails.aspx?*
// @match        https://nouveau.eureka.cc/WebPages/SourceDetails.aspx?*
// @match        https://nouveau-eureka-cc.*.idm.oclc.org/*
// @match        https://nouveau.eureka.cc/*
// ==/UserScript==

// https://nouveau.eureka.cc/WebPages/Sources/SourceSearch.aspx
// https://nouveau.eureka.cc/WebPages/SourceDetails.aspx?source_id=1773&target=2&cond=1

// @import{getElements}
// @import{getUrlSearchParams}
// @import{monkeySetValue}
// @import{downloadData}
// @import{monkeyListKeys}
// @import{monkeyGetValue}

const getInfo = async () => {
    const info = {};
    urlParams = getUrlSearchParams();
    if (urlParams['source_id']) {
        info['source_id'] = urlParams['source_id']
    }
    const table = getElements('#sourceDetails > table > tbody > tr > td > table')[0]
    if (table) {
        const rows = getSubElements(table, 'table[cellpadding="3"] > tbody > tr').filter(row => getSubElements(row, 'table').length === 0)
        for (let row of rows) {
            const [cellKey, cellValue] = getSubElements(row, 'td.tdDocument')
            if (cellKey && cellValue) {
                let value = null;
                const link = getSubElements(cellValue, '#SourceDetail1_lblSourceWebSite a')[0]
                if (link) {
                    value = link.href
                } else {
                    value = cellValue.textContent.trim()
                }
                let key = cellKey.textContent.trim().split(' :')[0]
                info[key] = value
            }
        }
    }
    return info;
}

const saveInfo = async () => {
    const info = await getInfo();
    code = info['Code de source'] || `unknown-${(new Date).getTime()}`;
    monkeySetValue(`europresse-info-${code}`, JSON.stringify(info, null, 0));
}

const downloadInfo = async () => {
    const keys = monkeyListKeys().filter(key => key.startsWith('europresse-info-'))
    const values = keys.map(key => JSON.parse(monkeyGetValue(key)))
    downloadData(`europresse-info-${(new Date).toISOString()}.json`, JSON.stringify(values, null, 2), { mimetype: 'application/json' })
}

const main = async () => {
    if (window.location.pathname === '/' || window.location.pathname === '/Login/') {
        downloadInfo();
    } else if (window.location.pathname === '/WebPages/SourceDetails.aspx') {
        saveInfo();
    }
}

main();