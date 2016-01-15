"use strict";
angular.module('fsmQuestion').filter('numbersOnly', function () {
    return function(input) {
        if (input) {
            console.log('Input: ' + input);
            var str = input.replace(/^0/, '');
            console.log('After first: ' + str);
            str = str.replace(/[^0-9]+/g, '');
            console.log('Completed: ' + str);
            return str;
        }

        return input;
    }

});