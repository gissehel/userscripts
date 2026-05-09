// @import{realWindow}
// @import{delay}
// @import{Semaphore}
// @import{SemaphoreNavigatorLocks}
// @import{SemaphoreProxy}
// @import{exportOnWindow}
// @import{createElementExtended}
// @import{monkeyGetSetValue}
// @import{monkeySetValue}
// @import{registerMenuCommand}
// @import{HookableValue}

/**
 * Gets the activation value of a flag, and registers menu commands to toggle it.
 * The menu command will be "Enable {flagName}" if the flag is currently disabled, 
 * and "Disable {flagName}" if the flag is currently enabled. When the menu command is selected, 
 * the flag value will be toggled, and the `onFlagChange` callback will be called with the new value.
 *
 * @param {String} flagName The name of the flag (used for menu command and storage)
 * @param {Boolean} defaultValue The default value of the flag
 * @param {((newValue: Boolean) => Promise<void>|undefined)} onFlagChange A callback function that is called when the flag value changes
 * @returns {Promise<HookableValue<boolean>>} The hookable value for the flag
 */
const getFlagActivationValue = (() => {
    const menuCommandUnregisterFunctions = {};
    /**
     * @type {{[flagName: string]: HookableValue<boolean>}}
     */
    const hookableValueFlags = {};

    /**
     * Register activation deactivation menu command for a flag, and update the menu command when the flag value changes
     * @param {string} flagName 
     * @param {HookableValue<boolean>} hookableValue 
     * @returns {Promise<HookableValue<boolean>>}
     */
    async function registerActivation(flagName, hookableValue) {
        if (menuCommandUnregisterFunctions[flagName]) {
            await menuCommandUnregisterFunctions[flagName]();
            delete menuCommandUnregisterFunctions[flagName];
        }
        const value = hookableValue.value;
        const label = value ? `Disable ${flagName}` : `Enable ${flagName}`;
        menuCommandUnregisterFunctions[flagName] = await registerMenuCommand(label, async () => {
            await hookableValue.setValue(!value);
        });
        return hookableValueFlags[flagName];
    }

    /**
     * Gets the activation value of a flag, and registers menu commands to toggle it.
     * The menu command will be "Enable {flagName}" if the flag is currently disabled, 
     * and "Disable {flagName}" if the flag is currently enabled. When the menu command is selected, 
     * the flag value will be toggled, and the `onFlagChange` callback will be called with the new value.
     *
     * @param {String} flagName The name of the flag (used for menu command and storage)
     * @param {Boolean} defaultValue The default value of the flag
     * @param {((newValue: Boolean) => Promise<void>|undefined)} onFlagChange A callback function that is called when the flag value changes
     * @returns {Promise<HookableValue<boolean>>} The hookable value for the flag
     */
    const getFlagActivationValue = async (flagName, defaultValue, onFlagChange) => {
        if (!hookableValueFlags[flagName]) {
            const value = await monkeyGetSetValue(flagName, defaultValue);
            hookableValueFlags[flagName] = new HookableValue(value);
            const hookableValue = hookableValueFlags[flagName];
            await onFlagChange?.(value);
            hookableValue.register(async (newValue) => {
                await monkeySetValue(flagName, newValue);
                if (onFlagChange !== undefined) {
                    if (onFlagChange) {
                        await onFlagChange(newValue);
                    }
                } else {
                    if (newValue) {
                        alert(`[${flagName}] has been enabled. Please reload the page for the change to take effect.`);
                    } else {
                        alert(`[${flagName}] has been disabled. Please reload the page for the change to take effect.`);
                    }
                }
                await registerActivation(flagName, hookableValue);
                console.log(`Flag [${flagName}] is set to ${hookableValue.value}`);
            });
            await registerActivation(flagName, hookableValue);
        }

        return hookableValue;
    }
    exportOnWindow({ getFlagActivationValue, hookableValueFlags });
    return getFlagActivationValue;
})();


const main = async () => {
    const useNavigatorLocksSemaphore = await monkeyGetSetValue('useNavigatorLocksSemaphore', true);
    const useProxySemaphore = await monkeyGetSetValue('useProxySemaphore', false);

    exportOnWindow({ createElementExtended, delay, Semaphore, SemaphoreNavigatorLocks, SemaphoreProxy });

    // #region Waiting screen management
    const createWaitingScreen = () => {
        const waitingScreen = createElementExtended('div', {
            id: 'waiting-screen',
            style: {
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                backgroundColor: 'rgba(0, 0, 0)',
                color: 'white',
                display: 'none',
                opacity: '0.7',
            },
            parent: document.body,
            children: [
                createElementExtended('div', {
                    style: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '30px',
                        fontWeight: 'bold',
                    },
                    text: 'Loading, please wait...'
                })
            ]
        });
        return waitingScreen;
    }
    exportOnWindow({ createWaitingScreen });

    const waitingScreenSemaphore = new Semaphore('waitingScreenSemaphore', 1);
    exportOnWindow({ waitingScreenSemaphore });

    let waitingTasksCount = 0;
    let waitingScreenSemaphoreIndex = 0;

    const showWaitingScreen = async () => {
        const uid = `showWaitingScreen-${++waitingScreenSemaphoreIndex}`;
        await waitingScreenSemaphore.acquire(uid);
        if (waitingTasksCount === 0 && realWindow.waitingScreen) {
            realWindow.waitingScreen.style.display = 'block';
        }
        waitingTasksCount++;
        waitingScreenSemaphore.release(uid);
    }
    exportOnWindow({ showWaitingScreen });

    const hideWaitingScreen = async () => {
        const uid = `hideWaitingScreen-${++waitingScreenSemaphoreIndex}`;
        await waitingScreenSemaphore.acquire(uid);
        waitingTasksCount--;
        if (waitingTasksCount === 0 && realWindow.waitingScreen) {
            realWindow.waitingScreen.style.display = 'none';
        }
        waitingScreenSemaphore.release(uid);
    }
    exportOnWindow({ hideWaitingScreen });
    // #endregion

    // #region progressBar
    let progressBarItems = {}
    let progressBarItemsByIndex = []
    exportOnWindow({ progressBarItems, progressBarItemsByIndex });
    const progressBarColors = {
        DEFAULT: '#ffffff',
        LOADING: '#ffff00',
        LOADED: '#bbbb00',
        CURRENTDEFAULT: '#ffdddd',
        CURRENTLOADING: '#ff8888',
        CURRENT: '#ff0000',
    }

    const createProgressBar = () => {
        const height = '3px';
        const progressBarContainer = createElementExtended('div', {
            id: 'progress-bar-container',
            style: {
                position: 'fixed',
                bottom: '0px',
                left: '0px',
                right: '0px',
                height,
                backgroundColor: '#ffffff',
                zIndex: '1000',
            },
            parent: document.body,
            children: [
                realWindow._docNameList.map((docName, index) => {
                    const progressBarItem = createElementExtended('div', {
                        id: `progress-bar-item-${index}`,
                        style: {
                            height,
                            backgroundColor: progressBarColors.DEFAULT,
                            left: `${(index * 100) / realWindow._docNameList.length}%`,
                            right: `${100 - ((index + 1) * 100) / realWindow._docNameList.length}%`,
                            opacity: '1',
                            transition: 'background-color 0.3s ease',
                            position: 'absolute',
                        },
                        onCreated: (el) => {
                            const progressBarItem = {
                                element: el,
                                color: progressBarColors.DEFAULT,
                            }
                            progressBarItemsByIndex[index] = progressBarItem;
                            progressBarItems[docName] = progressBarItem;
                        }
                    });
                    return progressBarItem;
                })
            ]
        });
        return progressBarContainer;
    };
    exportOnWindow({ createProgressBar });

    let lastCurrent = null;
    const progressBarUpdateCurrent = (pageName) => {
        if (lastCurrent) {
            switch (lastCurrent.color) {
                case progressBarColors.CURRENT:
                    lastCurrent.color = progressBarColors.LOADED;
                    break;
                case progressBarColors.CURRENTLOADING:
                    lastCurrent.color = progressBarColors.LOADING;
                    break;
                case progressBarColors.CURRENTDEFAULT:
                    lastCurrent.color = progressBarColors.DEFAULT;
                    break;
                default:
                    break;
            }
            lastCurrent.element.style.backgroundColor = lastCurrent.color;
        }
        const current = progressBarItems[pageName];
        if (current) {
            switch (current.color) {
                case progressBarColors.LOADED:
                    current.color = progressBarColors.CURRENT;
                    break;
                case progressBarColors.LOADING:
                    current.color = progressBarColors.CURRENTLOADING;
                    break;
                case progressBarColors.DEFAULT:
                    current.color = progressBarColors.CURRENTDEFAULT;
                    break;
                default:
                    break;
            }
            current.element.style.backgroundColor = current.color;
        }
        lastCurrent = current;
    }
    exportOnWindow({ progressBarUpdateCurrent });
    const progressBarStartLoading = (pageName) => {
        const item = progressBarItems[pageName];
        if (item) {
            switch (item.color) {
                case progressBarColors.DEFAULT:
                    item.color = progressBarColors.LOADING;
                    break;
                case progressBarColors.CURRENTDEFAULT:
                    item.color = progressBarColors.CURRENTLOADING;
                    break;
                default:
                    break;
            }
            item.element.style.backgroundColor = item.color;
        }
    }
    exportOnWindow({ progressBarStartLoading });
    const progressBarFinishLoading = (pageName) => {
        const item = progressBarItems[pageName];
        if (item) {
            switch (item.color) {
                case progressBarColors.LOADING:
                    item.color = progressBarColors.LOADED;
                    break;
                case progressBarColors.CURRENTLOADING:
                    item.color = progressBarColors.CURRENT;
                    break;
                default:
                    break;
            }
            item.element.style.backgroundColor = item.color;
        }
    }
    exportOnWindow({ progressBarFinishLoading });
    // #endregion

    // #region preserve legacy functions
    const legacyRenderPdf = realWindow.renderPdf;
    const legacyOpenPdf = realWindow.openPdf;
    exportOnWindow({ legacyRenderPdf, legacyOpenPdf });
    // #endregion

    // #region cache management
    const imageCache = {};
    exportOnWindow({ imageCache });

    const getImageCount = (imageName) => {
        return new Promise((resolve, reject) => {
            const jqueryPromise = $.ajax({
                type: "GET",
                url: `/Pdf/ImageList?docName=${encodeURIComponent(imageName)}`,
                contentType: "application/json; charset=utf-8",
                dataType: "html"
            });
            jqueryPromise.done((data) => {
                const index = parseInt(data);
                resolve(data);
            })
            jqueryPromise.fail((err) => reject(err));
        })
    }
    exportOnWindow({ getImageCount });

    const getImage = (index, imageName) => {
        return new Promise((resolve, reject) => {
            const time = (new Date).getTime();
            const url = `/Pdf/ImageBytes?imageIndex=${index}&id=${imageName}&cache=${time}`;
            const jqueryPromise = $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf-8",
                data: {}
            });
            jqueryPromise.done((data) => resolve(data));
            jqueryPromise.fail((err) => reject(err));
        })
    }
    exportOnWindow({ getImage });

    const getCacheSemaphoreClass = () => {
        if (useNavigatorLocksSemaphore) {
            return SemaphoreNavigatorLocks
        } else {
            return Semaphore
        }
    }

    const getCacheSemaphore = () => {
        if (useProxySemaphore) {
            return new SemaphoreProxy(getCacheSemaphoreClass(), 'europresse_cache', 1);
        } else {
            return new (getCacheSemaphoreClass())('europresse_cache', 1);
        }
    }

    let cacheSemaphore = getCacheSemaphore();
    exportOnWindow({ cacheSemaphore });

    const allPagesCachedHookableValue = new HookableValue(false);
    let uidcache = 0;
    let currnentUrgentPage = null;
    const ensurePageCached = async (imageIndex, urgent) => {
        if (imageIndex < 0 || imageIndex >= realWindow._docNameList.length) {
            return [""];
        }
        const imageName = realWindow._docNameList[imageIndex];
        if (imageCache[imageName]) {
            return imageCache[imageName];
        }

        if (urgent) {
            currnentUrgentPage = imageName;
        }

        if (!urgent && currnentUrgentPage) {
            await delay(1000);
        }

        const uidName = `${imageName}-${++uidcache}`;
        await cacheSemaphore.acquire(uidName);

        if (imageCache[imageName]) {
            await cacheSemaphore.release(uidName);
            return imageCache[imageName];
        }

        if (urgent && currnentUrgentPage !== imageName) {
            await cacheSemaphore.release(uidName);
            return [""];
        }

        progressBarStartLoading(imageName);
        const imageCount = await getImageCount(imageName);
        const cache = []
        for (let index = 0; index < imageCount; index++) {
            cache.push(await getImage(index, imageName));
        }
        imageCache[imageName] = cache;
        progressBarFinishLoading(imageName);

        await allPagesCachedHookableValue.setValue(Object.values(_docNameList).every(name => imageCache[name] !== undefined));

        if (urgent && currnentUrgentPage === imageName) {
            currnentUrgentPage = null;
        }

        console.log(`ensurePageCached done for ${imageName} with ${imageCount} image(s)`);

        await delay(200);

        await cacheSemaphore.release(uidName);
        return imageCache[imageName];
    }
    exportOnWindow({ ensurePageCached });

    const getImageCached = async (index, imageName, size) => {
        if (!imageCache[imageName] || !imageCache[imageName][index]) {
            return "";
        }
        return imageCache[imageName][index];
    }
    exportOnWindow({ getImageCached });


    const getImageCountReady = async (imageIndex) => {
        const imageName = realWindow._docNameList[imageIndex];
        if (!imageCache[imageName]) {
            return 0
        }
        return imageCache[imageName].length;
    }
    exportOnWindow({ getImageCountReady });

    const ensureCurrentPageCached = async () => {
        const result = await ensurePageCached(realWindow._docIndex, true);
        if (result[0].length > 0) {
            ensurePageCached(realWindow._docIndex + 1);
            ensurePageCached(realWindow._docIndex - 1);
        }
        return result;
    }
    exportOnWindow({ ensureCurrentPageCached });
    // #endregion

    // #region original functions overrides
    const renderPdf = async (imageCount, imageName, asSubCall) => {
        await showWaitingScreen();
        for (var htmlContent = "", viewerOffset = $(".viewer-move").length !== 0 ? $(".viewer-move").offset() : null, imageIndex = 0; imageIndex < imageCount; imageIndex++) {
            progressBarUpdateCurrent(imageName)
            if (!asSubCall) {
                await ensurePageCached(realWindow._docIndex, true);
            }
            const data = await getImageCached(imageIndex, imageName, imageCount)
            htmlContent += "<div id='rawimagewrapper'><img id='imagePdf" + imageIndex + "' class='imagePdf' src='data:image/png;base64," + data + "' /><\/div>";
            $("#pdfDocument").html(htmlContent);
            _pdfViewer = new Viewer(document.getElementById("rawimagewrapper"), {
                inline: !0,
                button: !1,
                title: !1,
                toolbar: !1,
                transition: !1,
                navbar: !1,
                zoomRatio: .7,
                minZoomRatio: .25,
                maxZoomRatio: 10,
                viewed: function () {
                    _ratio !== null && _pdfViewer.zoomTo(_ratio);
                    viewerOffset != null && _pdfViewer.moveTo(viewerOffset.left, viewerOffset.top)
                },
                zoomed: function (n) {
                    _ratio = n.detail.ratio
                }
            })
        }
        await hideWaitingScreen();
    }
    exportOnWindow({ renderPdf });

    const openPdf = async (n) => {
        progressBarUpdateCurrent(realWindow._docNameList[realWindow._docIndex])
        await showWaitingScreen();
        await ensureCurrentPageCached();

        let imageCount = await getImageCountReady(realWindow._docIndex);

        if (imageCount > 1) {
            imageCount = 1
        }
        await renderPdf(imageCount, realWindow._docNameList[realWindow._docIndex], true);
        onSwipePdf();
        await hideWaitingScreen();
        $("#pdf").css({
            opacity: 1
        });
        $("#loading").fadeOut().remove();
        scrollImages(0, 0);
        updateNavigationState();
        selectCurrentPage(n)
    }
    exportOnWindow({ openPdf });
    // #endregion

    // #region auto-cache all pages
    const loadAllPages = async () => {
        if (realWindow['_docNameList']) {
            for (let index = 0; index < realWindow._docNameList.length; index++) {
                await ensurePageCached(index);
                // await delay(1000);
            }
        }
    }
    exportOnWindow({ loadAllPages });
    // #endregion

    // #region inspect image type
    const getMagic2 = (data) => {
        let result = '';
        for (let i = 0; i < 2; i++) {
            const hex = data.charCodeAt(i).toString(16);
            result += (hex.length === 2 ? hex : '0' + hex);
        }
        return result
    }
    exportOnWindow({ getMagic2 });

    const identifyImageMimeType = (data) => {
        const magic2 = getMagic2(data);
        switch (magic2) {
            case '8950': return 'image/png';
            case 'ffd8': return 'image/jpeg';
            case '4749': return 'image/gif';
            default:
                return 'application/octet-stream';
        }
    }
    exportOnWindow({ identifyImageMimeType });
    // #endregion

    if (realWindow._docNameList) {
        createProgressBar();

        /** @type{Promise<void>} */
        const allLoaded = new Promise((resolve) => {
            if (allPagesCachedHookableValue.value) {
                resolve();
            } else {
                allPagesCachedHookableValue.register(async (newValue) => {
                    if (newValue) {
                        resolve();
                    }
                });
            }
        });

        /** @type{Promise<void>|null} */
        let allLoadedAutoloadFunctionResult = null;
        const autoLoadAllPages = await getFlagActivationValue('autoLoadAllPages', false, async (newValue) => {
            if (newValue && !allLoadedAutoloadFunctionResult) {
                allLoadedAutoloadFunctionResult = loadAllPages();
            }
        });

        exportOnWindow({ allLoaded, allLoadedAutoloadFunctionResult });

        const waitingScreen = createWaitingScreen();
        exportOnWindow({ waitingScreen });

        const enumerateCachedPages = async function* () {
            await allLoaded;
            for (let docIndex = 0; docIndex < realWindow._docNameList.length; docIndex++) {
                const imageName = realWindow._docNameList[docIndex];
                const imageCount = imageCache[imageName].length;
                for (let imageIndex = 0; imageIndex < imageCount; imageIndex++) {
                    const base64Data = imageCache[imageName][imageIndex];
                    const imgData = atob(base64Data);
                    const imgArray = new Uint8Array(imgData.length);
                    for (let i = 0; i < imgData.length; i++) {
                        imgArray[i] = imgData.charCodeAt(i);
                    }
                    const mimeType = identifyImageMimeType(imgData);
                    yield {
                        mimeType,
                        docIndex,
                        imageIndex,
                        imageName,
                        imgArray,
                    };
                }
            }
        }
        exportOnWindow({ enumerateCachedPages });
    }
}

main();