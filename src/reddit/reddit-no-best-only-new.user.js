// @import{delay}
// @import{registerLocationChange}

const main = async () => {
    registerLocationChange(async (/**@type{Location}*/ location) => {
        const locationParts = location.pathname.split('/')
        if (locationParts.length === 4 && locationParts[1] === 'r' && locationParts[0] === '' && locationParts[3] === '') {
            await delay(2000)
            window.location.pathname = `/r/${locationParts[2]}/new/`;
        }
    })
}

main()