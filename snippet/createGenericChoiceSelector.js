// @import{createElementExtended}
// @import{bindOnChange}
/**
 * Creates a generic choice selector for panel
 * 
 * @param {HookableValue<string>} ssmHookableValue The SSM HookableValue to bind
 * @param {string} title The title of the selector
 * @param {Array<{value: string, text: string}>} items The selector items
 * @param {(value: string) => Promise<void>} onChange The change handler
 * @param {() => Promise<object>|undefined} getSelectorProperties A function to get additional selector properties
 * @returns 
 */
const createGenericChoiceSelector = async (ssmHookableValue, title, items, getSelectorProperties) => {
    const selectorProperties = getSelectorProperties ? (await getSelectorProperties()) : {};

    ssmHookableValue.register(async (newValue) => {
        console.log(`${ssmHookableValue.name} changed to ${newValue}`);
    });

    return createElementExtended('select', {
        children: items.map(item => createElementExtended('option', { attributes: { value: item.value }, text: item.text })),
        attributes: { title },
        style: { 
            marginLeft: '10px', 
            marginBottom: '5px', 
            marginTop: '5px', 
            display: 'inline-block', 
            color: 'black', 
            fontWeight: 'bold', 
            fontFeatureSettings: 'normal', 
            backgroundColor: 'white',
            fontSize: '1em',
            padding: '2px',
            fontFamily: 'Calibri, Helvetica, sans-serif', 
        },
        onCreated: (el) => {
            bindOnChange(el, async () => {
                ssmHookableValue.value = el.value;
            });
            el.value = ssmHookableValue.value;
            ssmHookableValue.register(async (newValue) => {
                el.value = newValue;
            });
        },
        ...selectorProperties,
    });
}
