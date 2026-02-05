// @import{realWindow}
/**
 * Gets the global SSM state
 * @returns {Object} The SSM state
 */
const getSsmState = () => {
    realWindow.ssmState = realWindow.ssmState || {};
    return realWindow.ssmState;
}
