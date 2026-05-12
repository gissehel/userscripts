// @import{registerDomNodeMutatedUnique}
// @import{getElements}

registerDomNodeMutatedUnique(
    () => getElements('.alert-hotspot .alert-close'),
    async (close_button) => {
        close_button.click()

        return true
    }
)
