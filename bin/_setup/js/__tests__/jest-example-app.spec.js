"use strict";

const sum = (a, b) => a + b;

describe('sum()', function() {
    it('should add two numbers', function() {
        expect(sum(1, 3)).toBe(4);
    });
});
