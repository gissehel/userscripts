/**
 * Wrap addEventListener and removeEventListener using a pattern where the unregister function is returned
 * @param {EventTarget} eventTarget The object on which to register the event
 * @param {string} eventType The event type
 * @param {EventListenerOrEventListenerObject} callback The callback to call when the event is triggered
 * @param {boolean|AddEventListenerOptions=} options The options to pass to addEventListener
 */
const registerEventListener = (eventTarget, eventType, callback, options) => {
    if (eventTarget.addEventListener) {
        eventTarget.addEventListener(eventType, callback, options);
    }
    return () => {
        if (eventTarget.removeEventListener) {
            eventTarget.removeEventListener(eventType, callback, options);
        }
    }
}