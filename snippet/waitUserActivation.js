/**
 * Waits for the user to activate the page by clicking anywhere.
 * 
 * @returns {Promise<void>} Resolves when the user activates the page
 */
const waitUserActivation = async () => {
  return new Promise((resolve) => {
    const listener = () => {
      window.removeEventListener("click", listener)
      resolve()
    }
    window.addEventListener("click", listener)
  })
}
