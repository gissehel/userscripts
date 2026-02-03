/**
 * Gets the global SSM state
 * @returns {Object} The SSM state
 */
const getSsmState = () => {
    unsafeWindow.ssmState = unsafeWindow.ssmState || {};
    return unsafeWindow.ssmState;
}
