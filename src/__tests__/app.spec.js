describe('Ensure DOM Essentials are available', function () {
    it('window is available', function () {
        expect(window).toBeTruthy();
    });
    it('document is available', function () {
        expect(document).toBeTruthy();
    });
});