"use strict";
angular.module('fsmQuestion')
.directive('fsmQuestion', ['QuestionTypes', function(QuestionTypes){
    return {
        restrict: 'E',
        scope: {
            question: '=',
            translateValues: '='
        },
        templateUrl: 'templates/fsmQuestion.tpl.html',
        link: function(scope){
            init(scope);
        }
    };

    function init(scope){
        initScopeVariables(scope);
    }

    function initScopeVariables(scope){
        scope.types = QuestionTypes;
    }
}]);