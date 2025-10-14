
/**
 * Récupère ou définit une valeur dans le stockage de Tampermonkey/Greasemonkey/Violentmonkey/etc.
 * 
 * @param {String} key La clé de la valeur à récupérer ou définir
 * @param {Object} value La valeur par défaut à définir si la clé n'existe pas (optionnel) 
 * @returns {Object} La valeur récupérée
 */
const monkeyGetSetValue = (key, value) => {
    const storedValue = GM_getValue(key);
    if (storedValue === undefined && value !== undefined) {
        GM_setValue(key, value);
    }
    return storedValue;
}
