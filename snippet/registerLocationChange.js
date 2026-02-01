/**
 * Registers a callback to be called when the location changes (SPA navigation)
 * 
 * @param {(Location)=>void} callback A callback called when the location changes
 * @returns {()=>void} The unregister function
 */
const registerLocationChange = (callback) => {
    const locationKeys = ['href', 'origin', 'protocol', 'host', 'hostname', 'port', 'pathname', 'search', 'hash'];
    const normalizeLocation = (location) => Object.fromEntries(Object.entries(location).filter(x => locationKeys.indexOf(x[0]) >= 0))
    let currentLocation = normalizeLocation(location);

    const observer = new MutationObserver(() => {
        const newLocation = normalizeLocation(location);
        if (newLocation.href !== currentLocation.href) {
            currentLocation = newLocation;
            callback(currentLocation);
        }
    });

    callback(currentLocation);
    observer.observe(document, { subtree: true, childList: true });

    return () => {
        observer.disconnect();
    };
}


