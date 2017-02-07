"use strict";

import App from '../js/riko';

function sum(a, b) {
    return a + b;
}

describe('sum()', function() {
    it('should save add two numbers', function() {
        expect(sum(1, 3)).toBe(4);
    });
});

describe('App', function () {
    it('should exists and be truthy', function () {
        expect(App).toBeTruthy();
    });
});
