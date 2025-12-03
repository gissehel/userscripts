// ==UserScript==
// @version      1.0.0
// @description  europresse-ensure-cache-for-already-downloaded-pages
// ==/UserScript==

const legacyRenderPdf = renderPdf;

imageCache = {};
window.imageCache = imageCache;

const ensureImageCached = (imageName) => {
    if (imageCache[imageName]) {
        return Promise.resolve();
    }
    const time = (new Date).getTime();
    const url = `/Pdf/ImageBytes?imageIndex=0&id=${imageName}&cache=${time}`;
    const jqueryPromise = $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json; charset=utf-8",
        data: {}
    });
    return new Promise( (resolve, reject) => {
        jqueryPromise.done( (data) => {
            imageCache[imageName] = data;
            resolve();
        });
        jqueryPromise.fail( (err) => {
            reject(err);
        });
    } );
}

renderPdf = (n, t) => {
    for (var u = "", r = $(".viewer-move").length !== 0 ? $(".viewer-move").offset() : null, i = 0; i < n; i++) {
        ensureImageCached(t).then(() => {
            const n = imageCache[t];
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