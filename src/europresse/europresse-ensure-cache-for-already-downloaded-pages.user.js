// ==UserScript==
// @version      1.0.34
// @description  europresse-ensure-cache-for-already-downloaded-pages
// ==/UserScript==

// @import{delay}
// @import{Semaphore}
// @import{exportOnWindow}
// @import{downloadZip}

exportOnWindow({ downloadZip });

const legacyRenderPdf = window.renderPdf;
const legacyOpenPdf = window.openPdf;
exportOnWindow({ legacyRenderPdf, legacyOpenPdf });


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

    const imageCount = await getImageCount(imageName);
    const cache = []
    for (let index = 0; index < imageCount; index++) {
        cache.push(await getImage(index, imageName));
    }
    imageCache[imageName] = cache;

    console.log(`ensurePageCached done for ${imageName} with ${imageCount} image(s)`);

    cacheSemaphore.release(uidName);
}
exportOnWindow({ ensurePageCached });

const ensureImageCached = async (index, imageName, size) => {
    if (!imageCache[imageName] || !imageCache[imageName][index]) {
        ensurePageCached(_docNameList.indexOf(imageName));
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

renderPdf = (n, t) => {
    for (var u = "", r = $(".viewer-move").length !== 0 ? $(".viewer-move").offset() : null, i = 0; i < n; i++) {
        ensureImageCached(i, t, n).then((n) => {
            u += "<div id='rawimagewrapper'><img id='imagePdf" + i + "' class='imagePdf' src='data:image/png;base64," + n + "' /><\/div>";
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
        })
    }
}
exportOnWindow({ renderPdf });

async function openPdf(n) {
    _animTimer = setTimeout(function () {
        showWaitingAnim()
    }, _animSpeed);
    await ensureCurrentPageCached();

    let imageCount = await ensureImageCountReady(_docIndex);

    if (imageCount > 1) {
        imageCount = 1
    }
    renderPdf(imageCount, _docNameList[_docIndex]);
    onSwipePdf();
    clearTimeout(_animTimer);
    $("#pdf").css({
        opacity: 1
    });
    $("#loading").fadeOut().remove();
    scrollImages(0, 0);
    updateNavigationState();
    selectCurrentPage(n)

}
exportOnWindow({ openPdf });

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
