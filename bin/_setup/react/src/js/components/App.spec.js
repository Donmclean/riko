"use strict";

import React from 'react';

function sum(a, b) {
    return a + b;
}

describe('sum()2', () => {
    it('should save add two numbers', () => {
        expect(sum(1, 3)).toBe(4);
    });
});

describe('DOM Essentials', () => {
    it('window is available', () => {
        expect(window).toBeTruthy();
    });
    it('document is available', () => {
        expect(document).toBeTruthy();
    });
});