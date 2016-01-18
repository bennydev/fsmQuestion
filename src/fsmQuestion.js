"use strict";
angular.module('fsmQuestion')
.directive('fsmQuestion', ['QuestionTypes', 'QuestionUtils', '$translate', function(QuestionTypes, QuestionUtils, $translate){
    function dateSetup(scope){
        if(scope.question.type === QuestionTypes.date){
            scope.formatDateString = function(question){
                var value = question.answer;
                if(value && QuestionUtils.isValidDate(value)) {
                    question.setAnswer(QuestionUtils.createDate(value));
                }
            };

            scope.updateCalendarModel = function(value){
                scope.calendarModel = QuestionUtils.isValidDate(value) ? QuestionUtils.createDate(value) : scope.calendarModel;
            }
        }
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