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
                scope.question.calendarModel = QuestionUtils.isValidDate(value) ? QuestionUtils.createDate(value) : scope.calendarModel;
            };
        }
    }

    function phoneSetup(scope) {
        if (scope.question.type === QuestionTypes.phone) {

            scope.addZeroToPhoneNumber = function(){
                if(scope.question.answer.phoneNumber === '0' && scope.question.answer.countryCode.code !== 'SWE'){
                    scope.question.answer.phoneNumber = '';
                } else if(scope.question.answer.phoneNumber === '' && scope.question.answer.countryCode.code === 'SWE'){
                    scope.question.answer.phoneNumber = '0';
                }
            };
            scope.formatPhoneNumber = function(){
                if(scope.question.answer.countryCode.code === 'SWE'){
                    if(scope.question.answer.phoneNumber === '' || scope.question.answer.phoneNumber === '00'){
                        scope.question.answer.phoneNumber = '0';
                    }
                    if(scope.question.answer.phoneNumber.charAt(0) !== '0' ){
                        scope.question.answer.phoneNumber = '0' + scope.question.answer.phoneNumber;
                    }
                }
            };
        }
    }

    function labelSetup(scope) {
        if (scope.question.type === QuestionTypes.label) {
            scope.question.validate = function(){return true;};
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
            phoneSetup(scope);
            labelSetup(scope);
        }
    };

    function init(scope){
        initScopeVariables(scope);
    }

    function initScopeVariables(scope){
        scope.types = QuestionTypes;
    }
}]);