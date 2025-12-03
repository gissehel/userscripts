// ==UserScript==
// @version      1.0.4
// @description  europresse-ensure-cache-for-already-downloaded-pages
// ==/UserScript==

const legacyRenderPdf = renderPdf;
const legacyOpenPdf = openPdf;

const exportOnWindow = (dict) => {
    for (const key in dict) {
        window[key] = dict[key];
    }
}

imageCache = {};
exportOnWindow({ imageCache });

const getImageCount = (imageName) => {
    return new Promise((resolve, reject) => {
        const jqueryPromise = $.ajax({
            type: "GET",
            url: "/Pdf/ImageList?docName=" + encodeURIComponent(imageName),
            contentType: "application/json; charset=utf-8",
            dataType: "html"
        });
        jqueryPromise.done((data) => {
            const index = parseInt(data);
            resolve(data);
        })
        jqueryPromise.fail((err) => {
            reject(err);
        });
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
        jqueryPromise.done((data) => {
            resolve(data);
        })
        jqueryPromise.fail((err) => {
            reject(err);
        });
    })
}
exportOnWindow({ getImage });

const ensureImageCached = async (index, imageName, size) => {
    if (!imageCache[imageName] || !imageCache[imageName][index]) {
        const data = await getImage(index, imageName);

        if (!imageCache[imageName]) {
            imageCache[imageName] = new Array(size);
        }

        if (imageCache[imageName].length < index) {
            imageCache[imageName].length = index + 1;
        }

        imageCache[imageName][index] = data;
    }
    return imageCache[imageName][index];
}
exportOnWindow({ ensureImageCached });

const ensureImageCountReady = async (imageName) => {
    if (imageCache[imageName]) {
        return Promise.resolve(imageCache[imageName].length);
    }
    return await getImageCount(imageName);
}
exportOnWindow({ ensureImageCountReady });

const ensurePageCached = async (imageIndex) => {
    if (imageIndex < 0 || imageIndex >= _docNameList.length) {
        return;
    }
    const imageCount = await ensureImageCountReady(_docNameList[imageIndex]);
    await Promise.all(new Array(imageCount)).map((_, i) => i).map(async (index) => {
        await ensureImageCached(index, _docNameList[imageIndex], imageCount);
    });
}
exportOnWindow({ ensurePageCached });

const ensureCurrentPageCached = async () => {
    await Promise.all([_docIndex - 1, _docIndex, _docIndex + 1].map(async (index) => await ensurePageCached(index)));
}
window.ensureCurrentPageCached = ensureCurrentPageCached;

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

    const imageCount = await ensureImageCountReady(_docNameList[_docIndex]);

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