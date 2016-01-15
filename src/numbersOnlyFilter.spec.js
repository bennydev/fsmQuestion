"use strict";
describe('Numbers only filter tests.', function () {

    beforeEach(module('fsmQuestion'));

    it('should replace non-numeric chars with empty values.', inject(function (numbersOnlyFilter) {
        var test = 'e';
        var result = numbersOnlyFilter(test);
        expect(result).toBe('');
    }));
    it('should not replace numeric char.', inject(function (numbersOnlyFilter) {
        var test = '1';
        var result = numbersOnlyFilter(test);
        expect(result).toBe('1');
    }));
    it('should not replace numeric char, but remove a non-numeric.', inject(function (numbersOnlyFilter) {
        var test = '1e';
        var result = numbersOnlyFilter(test);
        expect(result).toBe('1');
    }));
    it('should not replace trailing zeros, but remove a non-numeric.', inject(function (numbersOnlyFilter) {
        var test = '1e0';
        var result = numbersOnlyFilter(test);
        expect(result).toBe('10');
        result = numbersOnlyFilter(result);
        expect(result).toBe('10');
    }));
    it('should not replace numeric chars, but remove all non-numeric.', inject(function (numbersOnlyFilter) {
        var test = '1e2Ö-3>4" 5';
        var result = numbersOnlyFilter(test);
        expect(result).toBe('12345');
    }));
    it('should remove leading zero and not replace numeric chars, but remove all non-numeric.', inject(function (numbersOnlyFilter) {
        var test = '01e2Ö-3>4" 5';
        var result = numbersOnlyFilter(test);
        expect(result).toBe('12345');
    }));
});