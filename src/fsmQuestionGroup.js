"use strict";
angular.module('fsmQuestion')
    .directive('fsmQuestionGroup', [function(){
        return {
            restrict: 'E',
            scope: {
                questions: '='
            },
            replace: true,
            templateUrl: 'templates/fsmQuestionGroup.tpl.html',
            link: function(scope){
                scope.isVisible = function(){
                  var show = false;
                    scope.questions.forEach(function(question){
                        show = question.isVisible() ? true : show;
                    });
                    return show;
                };
            }
        };
    }])
    .factory('QuestionGroupService', [function(){
        var service = {

        };
        return service;
    }]);