"use strict";
angular.module('fsmQuestion').filter('numbersOnly', function () {
    return function(input) {
        if (input) {

            // Remove trailing zeros
            var str = input.replace(/^0/, '');
            str = str.replace(/[^0-9]+/g, '');
            return str;
        }

        return input;
    };

});