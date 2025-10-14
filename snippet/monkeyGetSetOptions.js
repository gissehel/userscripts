// @import{monkeyGetSetValue}

/**
 * Récupère les options en utilisant les valeurs stockées ou les valeurs par défaut
 * 
 * @param {Object<String, Object>} baseOptions Les valeurs par défaut des options
 * @returns {Object<String, Object>} Les options récupérées
 */
const monkeyGetSetOptions = (baseOptions) => {
    const options = Object.fromEntries(Object.entries(baseOptions).map(([k, v]) => [k, monkeyGetSetValue(k, v)]));
    return options;
}
