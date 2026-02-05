if (window.location.pathname === '/PDF/ArchiveResult') {
    const fromField = document.querySelectorAll('#pdfSeachFrom')[0]
    const toField = document.querySelectorAll('#pdfSeachTo')[0]

    if (fromField && toField) {
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        const todayIso = today.toISOString().split('T')[0];
        const oneYearAgoIso = oneYearAgo.toISOString().split('T')[0];
        fromField.value = oneYearAgoIso;
        toField.value = todayIso;
    }
}
