"use strict";
angular.module('fsmQuestion')
    .directive('numbers', ['numbersOnlyFilter', function(numbersOnlyFilter){
        return {
            restrict: 'A',
            scope: {
                question: '='
            },
            link: function(scope){
                scope.$watch('question.answer', function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        scope.question.answer = numbersOnlyFilter(newValue);
                    }
                });
            }
        };
    }]);