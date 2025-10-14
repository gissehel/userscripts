/**
 * Waits for the window to gain focus.
 * 
 * @returns {Promise<void>} Resolves when the window gains focus
 */
const waitWindowFocus = async () => {
  return new Promise((resolve) => {
    if (document.hasFocus()) {
      resolve()
      return
    }
    const listener = () => {
      window.removeEventListener("focus", listener)
      resolve()
    }
    window.addEventListener("focus", listener)
  })
}
