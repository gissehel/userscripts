/**
 * A promise that is resolved when the html DOM is ready. 
 * Should be part of any browser, but is not.
 * 
 * @type {Promise<void>} A promise that is resolved when the html DOM is ready
 */
const readyPromise = new Promise((resolve, reject) => {
    if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
        setTimeout(() => resolve(), 1);
    } else {
        const onContentLoaded = () => {
            resolve();
            document.removeEventListener('DOMContentLoaded', onContentLoaded, false);
        }
        document.addEventListener('DOMContentLoaded', onContentLoaded, false);
    }
})

/**
 * Add a new css string to the page
 * 
 * @param {string} styleText The CSS string to pass
 * @returns {void}
 */
const addStyle = (() => {
    let styleElement = null;
    let styleContent = null;

    /**
     * Add a new css string to the page
     * 
     * @param {string} styleText The CSS string to pass
     * @returns {void}
     */
    return (styleText) => {
        if (styleElement === null) {
            styleElement = document.createElement('style');
            styleContent = "";
            document.head.appendChild(styleElement);
        } else {
            styleContent += "\n";
        }

        styleContent += styleText;
        styleElement.textContent = styleContent;
    };
})();

/**
 * Get scripts infos
 * @returns {{[path: string]: {[property: string]:string}[]}}
 */
const getUserscripts = async () => {
    // const userscripts = { "twitch/twitch-auto-click.user.js": [["name", "twitch-auto-click"], ["namespace", "http://github.com/gissehel/userscripts"], ["version", "1.0.8"], ["description", "twitch-auto-click"], ["author", "gissehel"], ["match", "https://twitch.tv/*"], ["match", "https://www.twitch.tv/*"], ["grant", "none"]], "twitch/twitch-picture-in-picture.user.js": [["name", "twitch-picture-in-picture"], ["namespace", "http://github.com/gissehel/userscripts"], ["version", "1.0.0.8"], ["description", "twitch-picture-in-picture"], ["author", "gissehel"], ["match", "https://twitch.tv/*"], ["match", "https://www.twitch.tv/*"], ["grant", "none"]], "twitter/twitter-image-downloader.user.js": [["name", "twitter-image-downloader"], ["namespace", "http://github.com/gissehel/userscripts"], ["version", "1.4.7"], ["description", "Twitter image/video downloader"], ["author", "gissehel"], ["match", "https://twitter.com/*"], ["grant", "none"]], "twitter/twittervideodownloader-easy.user.js": [["name", "twittervideodownloader-easy"], ["namespace", "http://tampermonkey.net/"], ["version", "1.2.4"], ["description", "twittervideodownloader.com easy"], ["author", "gissehel"], ["match", "http://twittervideodownloader.com/*"], ["match", "https://twittervideodownloader.com/*"], ["grant", "none"]] };
    const response = await fetch('userscripts.json');
    const userscripts = await response.json();
    // console.log(userscripts)
    return userscripts;
}

/**
 * Create an HTMLElement using various properties 
 * @param {string} name
 * @param {object} obj
 * @param {HTMLElement} obj.parent
 * @param {string[]} obj.classNames
 * @param {string} obj.text
 * @param {HTMLElement[]} obj.children
 * @param {{[name: string]: string}} obj.properties
 * @param {(HTMLElement)=>void} obj.onCreated
 * @returns {HTMLElement}
 */
const createElement = (name, { parent, classNames, text, children, properties, onCreated }) => {
    const element = document.createElement(name);
    if (parent) {
        parent.appendChild(element);
    }
    if (classNames) {
        classNames.forEach(className => element.classList.add(className))
    }
    if (text) {
        element.textContent = text;
    }
    if (children) {
        children.forEach(child => element.appendChild(child));
    }
    if (onCreated) {
        onCreated(element);
    }
    if (properties) {
        Object.keys(properties).forEach((property) => element[property] = properties[property])
    }
    return element;
}

/**
 * Get a property from the userscript structure
 * @param {{[property: string]:string}[]} userscripts The userscript data structure
 * @param {string} name The name of the property
 * @param {string} defaultValue The default value when no value has been found
 * @return {string}
 */
const getProperty = (userscript, name, defaultValue) => {
    const properties = userscript.filter(([property]) => property === name);
    if (properties.length >= 0) {
        return properties[0][1];
    } else {
        return defaultValue;
    }
}

/**
 * Create a page given a userscripts structure
 * @param {{[path: string]: {[property: string]:string}[]}} userscripts 
 */
const createPage = (userscripts) => {
    createElement('title', { parent: document.head, text: 'Userscripts' });
    createElement('h1', { parent: document.body, text: 'Userscripts' });
    createElement('table', {
        parent: document.body,
        children: [
            createElement('tr', {
                children: [
                    createElement('th', { text: 'Script name' }),
                    createElement('th', { text: 'Link' }),
                    createElement('th', { text: 'version' }),
                ]
            }),
            ...Object.keys(userscripts).map((path) => createElement('tr', {
                children: [
                    createElement('td', { text: getProperty(userscripts[path], 'name', '-') }),
                    createElement('td', {
                        children: [
                            createElement('a', { text: path, properties: { href: path } })
                        ]
                    }),
                    createElement('td', { text: getProperty(userscripts[path], 'version', '-') }),
                ]
            }))
        ]
    });
}

const start = async () => {
    const userscripts = await getUserscripts();
    createPage(userscripts);
};

readyPromise.then(start);