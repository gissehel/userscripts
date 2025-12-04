// @grant{GM_setValue}
/**
 * Définit une valeur dans le stockage de Tampermonkey/Greasemonkey/Violentmonkey/etc.
 * Juste un alias pour GM_setValue, pour etre cohérent avec monkeyGetSetValue.
 * 
 * @param {String} key La clé de la valeur à définir
 * @param {Object} value La valeur à définir
 */
const monkeySetValue = (key, value) => GM_setValue(key, value);
