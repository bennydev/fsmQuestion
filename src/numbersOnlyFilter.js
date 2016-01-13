"use strict";
angular.module('fsmQuestion').filter('numbersOnly', function () {
    return function(input) {
        if (input) {
            var str = input.replace(/[^1-9]/, '');
           return str.replace(/[^0-9]+/g, '');
        }

        return input;
    }

});