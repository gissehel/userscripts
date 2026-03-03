// @import{registerLocationChange}

const main = async () => {
    registerLocationChange((/**@type{Location}*/ location) => {
        const locationParts = location.pathname.split('/')
        if (locationParts.length === 4 && locationParts[1] === 'r' && locationParts[0] === '' && locationParts[3] === '') {
            window.location.pathname = `/r/${locationParts[2]}/new/`;
        }
    })
}

main()