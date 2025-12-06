// ==UserScript==
// @version      1.0.38
// @description  europresse-ensure-cache-for-already-downloaded-pages
// ==/UserScript==

// @import{delay}
// @import{Semaphore}
// @import{exportOnWindow}
// @import{downloadZip}
// @import{createElementExtended}

exportOnWindow({ downloadZip, createElementExtended, delay, Semaphore });

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

const waitingScreen = createWaitingScreen();
const waitingScreenSemaphore = new Semaphore(1);
exportOnWindow({ waitingScreen, waitingScreenSemaphore });

let waitingTasksCount = 0;
let waitingScreenSemaphoreIndex = 0;

const showWaitingScreen = async () => {
    const uid = `showWaitingScreen-${++waitingScreenSemaphoreIndex}`;
    await waitingScreenSemaphore.acquire(uid);
    if (waitingTasksCount === 0) {
        waitingScreen.style.display = 'block';
    }
    waitingTasksCount++;
    waitingScreenSemaphore.release(uid);
}
exportOnWindow({ showWaitingScreen });

const hideWaitingScreen = async () => {
    const uid = `hideWaitingScreen-${++waitingScreenSemaphoreIndex}`;
    await waitingScreenSemaphore.acquire(uid);
    waitingTasksCount--;
    if (waitingTasksCount === 0) {
        waitingScreen.style.display = 'none';
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
            _docNameList.map((docName, index) => {
                const progressBarItem = createElementExtended('div', {
                    id: `progress-bar-item-${index}`,
                    style: {
                        height,
                        backgroundColor: progressBarColors.DEFAULT,
                        left: `${(index * 100) / _docNameList.length}%`,
                        right: `${100 - ((index+1) * 100) / _docNameList.length}%`,
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
createProgressBar();
// #endregion

// #region preserve legacy functions
const legacyRenderPdf = window.renderPdf;
const legacyOpenPdf = window.openPdf;
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


let cacheSemaphore = new Semaphore(1);
exportOnWindow({ cacheSemaphore });

let uidcache = 0;
const ensurePageCached = async (imageIndex) => {
    if (imageIndex < 0 || imageIndex >= _docNameList.length) {
        return;
    }
    const imageName = _docNameList[imageIndex];
    if (imageCache[imageName]) {
        return;
    }

    const uidName = `${imageName}-${++uidcache}`;
    await cacheSemaphore.acquire(uidName);

    if (imageCache[imageName]) {
        cacheSemaphore.release(uidName);
        return;
    }

    progressBarStartLoading(imageName);
    const imageCount = await getImageCount(imageName);
    const cache = []
    for (let index = 0; index < imageCount; index++) {
        cache.push(await getImage(index, imageName));
    }
    imageCache[imageName] = cache;
    progressBarFinishLoading(imageName);

    console.log(`ensurePageCached done for ${imageName} with ${imageCount} image(s)`);

    cacheSemaphore.release(uidName);
}
exportOnWindow({ ensurePageCached });

const ensureImageCached = async (index, imageName, size) => {
    if (!imageCache[imageName] || !imageCache[imageName][index]) {
        await ensurePageCached(_docNameList.indexOf(imageName));
    }
    return imageCache[imageName][index];
}
exportOnWindow({ ensureImageCached });


const ensureImageCountReady = async (imageIndex) => {
    const imageName = _docNameList[imageIndex];
    if (!imageCache[imageName]) {
        await ensurePageCached(imageIndex)
    }
    return imageCache[imageName].length;
}
exportOnWindow({ ensureImageCountReady });

const ensureCurrentPageCached = async () => {
    await ensurePageCached(_docIndex);
    ensurePageCached(_docIndex + 1);
    ensurePageCached(_docIndex - 1);
}
exportOnWindow({ ensureCurrentPageCached });
// #endregion

// #region original functions overrides
const renderPdf = async (n, t) => {
    await showWaitingScreen();
    for (var u = "", r = $(".viewer-move").length !== 0 ? $(".viewer-move").offset() : null, i = 0; i < n; i++) {
        progressBarUpdateCurrent(t)
        const data = await ensureImageCached(i, t, n)
        u += "<div id='rawimagewrapper'><img id='imagePdf" + i + "' class='imagePdf' src='data:image/png;base64," + data + "' /><\/div>";
        $("#pdfDocument").html(u);
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
                r != null && _pdfViewer.moveTo(r.left, r.top)
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
    progressBarUpdateCurrent(_docNameList[_docIndex])
    await showWaitingScreen();
    await ensureCurrentPageCached();

    let imageCount = await ensureImageCountReady(_docIndex);

    if (imageCount > 1) {
        imageCount = 1
    }
    renderPdf(imageCount, _docNameList[_docIndex]);
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
    if (window['_docNameList']) {
        for (let index = 0; index < _docNameList.length; index++) {
            await ensurePageCached(index);
            // await delay(1000);
        }
    }
}
exportOnWindow({ loadAllPages });

const allLoaded = loadAllPages();
exportOnWindow({ allLoaded });
// #endregion

// #region download CBZ
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
        case '8950':
            return 'image/png';
        case 'ffd8':
            return 'image/jpeg';
        case '4749':
            return 'image/gif';
        default:
            return 'application/octet-stream';
    }
}
exportOnWindow({ identifyImageMimeType });

const extensionByMimeType = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/gif': 'gif',
    'application/octet-stream': 'raw'
};
exportOnWindow({ extensionByMimeType })

const pageProvider = async function* () {
    await allLoaded;
    for (let docIndex = 0; docIndex < _docNameList.length; docIndex++) {
        const imageName = _docNameList[docIndex];
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
                path: `${String(docIndex + 1).padStart(3, '0')}-${String(imageIndex + 1).padStart(3, '0')}-${imageName.replaceAll('·', '-')}.${extensionByMimeType[mimeType]}`,
                data: imgArray
            };
        }
    }
};
exportOnWindow({ pageProvider });

const downloadCBZofAllPages = async () => {
    const name = document.querySelectorAll('.pdf-source-name')[0].textContent.replaceAll(',', '').replaceAll(' ', '_');
    const zipFileName = `europresse-${name}.cbz`;
    await downloadZip(zipFileName, pageProvider);
}
exportOnWindow({ downloadCBZofAllPages });
// #endregion