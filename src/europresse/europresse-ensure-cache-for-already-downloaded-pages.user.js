// ==UserScript==
// @version      1.0.3
// @description  europresse-ensure-cache-for-already-downloaded-pages
// ==/UserScript==

const legacyRenderPdf = renderPdf;
const legacyOpenPdf = openPdf;

imageCache = {};
window.imageCache = imageCache;

const ensureImageCached = (index, imageName, size) => {
    if (imageCache[imageName] && imageCache[imageName][index]) {
        return Promise.resolve(imageCache[imageName][index]);
    }
    const time = (new Date).getTime();
    const url = `/Pdf/ImageBytes?imageIndex=${index}&id=${imageName}&cache=${time}`;
    const jqueryPromise = $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json; charset=utf-8",
        data: {}
    });
    return new Promise( (resolve, reject) => {
        jqueryPromise.done( (data) => {
            if (!imageCache[imageName]) {
                imageCache[imageName] = new Array(size);
            }
            if (imageCache[imageName].length < index) {
                imageCache[imageName].length = index + 1;
            }
            imageCache[imageName][index] = data;
            resolve(data);
        });
        jqueryPromise.fail( (err) => {
            reject(err);
        });
    } );
}
window.ensureImageCached = ensureImageCached;

renderPdf = (n, t) => {
    for (var u = "", r = $(".viewer-move").length !== 0 ? $(".viewer-move").offset() : null, i = 0; i < n; i++) {
        ensureImageCached(i, t, n).then((n) => {
            u += "<div id='rawimagewrapper'><img id='imagePdf" + i + "' class='imagePdf' src='data:image/png;base64," + n + "' /><\/div>";
            $("#pdfDocument").html(u);
            _pdfViewer = new Viewer(document.getElementById("rawimagewrapper"),{
                inline: !0,
                button: !1,
                title: !1,
                toolbar: !1,
                transition: !1,
                navbar: !1,
                zoomRatio: .7,
                minZoomRatio: .25,
                maxZoomRatio: 10,
                viewed: function() {
                    _ratio !== null && _pdfViewer.zoomTo(_ratio);
                    r != null && _pdfViewer.moveTo(r.left, r.top)
                },
                zoomed: function(n) {
                    _ratio = n.detail.ratio
                }
            })
        })
    }
}

const ensureImageIndexReady = (imageName) => {
    if (imageCache[imageName]) {
        return Promise.resolve(imageCache[imageName].length);
    }
    const jqueryPromise = $.ajax({
        type: "GET",
        url: "/Pdf/ImageList?docName=" + encodeURIComponent(imageName),
        contentType: "application/json; charset=utf-8",
        dataType: "html"
    });
    return new Promise( (resolve, reject) => {
        jqueryPromise.done( (data) => {
            const index = parseInt(data);
            resolve(index);
        });
        jqueryPromise.fail( (err) => {
            reject(err);
        });
    });
}
window.ensureImageIndexReady = ensureImageIndexReady;

function openPdf(n) {
    _animTimer = setTimeout(function() {
        showWaitingAnim()
    }, _animSpeed);
    ensureImageIndexReady(_docNameList[_docIndex]).then( (t) => {
        var i = parseInt(t);
        i > 1 && (i = 1);
        renderPdf(i, _docNameList[_docIndex]);
        onSwipePdf();
        clearTimeout(_animTimer);
        $("#pdf").css({
            opacity: 1
        });
        $("#loading").fadeOut().remove();
        scrollImages(0, 0);
        updateNavigationState();
        selectCurrentPage(n)
    } );
}
window.openPdf = openPdf;