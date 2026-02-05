let realWindow = null;
try {
    realWindow = unsafeWindow;
    console.log('Using unsafeWindow as realWindow');
} catch (e) {
    realWindow = window;
    console.log('Using window as realWindow');
}