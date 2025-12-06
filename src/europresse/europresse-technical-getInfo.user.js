// ==UserScript==
// @version      1.0.1
// @description  europresse-technical-getInfo
// @match        https://nouveau-eureka-cc.*.idm.oclc.org/WebPages/SourceDetails.aspx?*
// ==/UserScript==

// https://nouveau-eureka-cc.bpi.idm.oclc.org/WebPages/SourceDetails.aspx?source_id=1773&target=2&cond=1

// @import{getElements}
// @import{getUrlSearchParams}
// @import{downloadData}

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

const downloadInfo = async () => {
    const info = await getInfo();
    code = info['Code de source'] || `unknown-${(new Date).getTime()}`;
    downloadData(`europresse-info-${code}.json`, JSON.stringify(info, null, 4), { mimetype: 'application/json', encoding: 'utf-8' });
}

downloadInfo();