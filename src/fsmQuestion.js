"use strict";
angular.module('fsmQuestion')
.directive('fsmQuestion', ['QuestionTypes', 'Validators', '$translate', function(QuestionTypes, Validators, $translate){
    var utils = Validators.utils;
    function dateSetup(scope){
        if(scope.question.type === QuestionTypes.date){
            scope.formatDateString = function(question){
                var value = question.answer;
                if(value && isValidDate(value)) {
                    question.setAnswer(createDate(value));
                }
            };

            scope.updateCalendarModel = function(value){
                scope.calendarModel = isValidDate(value) ? createDate(value) : scope.calendarModel;
            }
        }
    }

    function isValidDate(value){
        if(value.length === 6 || value.length === 8) {
            value = addCentury(value);
            var date = createDate(value);
            return getDigits(date.toISOString()).indexOf(value) === 0;
        }
    }

    function createDate(value){
        value = getDigits(value);
        value = addCentury(value);
        var partials = utils.getDatePartials(value);
        return utils.createDate(partials.year+'-'+partials.month+'-'+partials.day);
    }

    function addCentury(value){
        return value.length === 6 ? '20'+value : value;
    }

    function getDigits(value){
        return value ? value.toString().replace(/\D/g,'') : '';
    }

    return {
        restrict: 'E',
        scope: {
            question: '=',
            translateValues: '='
        },
        templateUrl: 'templates/fsmQuestion.tpl.html',
        link: function(scope){
            init(scope);
            scope.hasText = function(key){
                return $translate.instant(key) !== key;
            };
            dateSetup(scope);

        }
    };

    function init(scope){
        initScopeVariables(scope);
    }

    function initScopeVariables(scope){
        scope.types = QuestionTypes;
    }
}]);