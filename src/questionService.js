"use strict";
angular.module('fsmQuestion')
.factory('QuestionService', ['QuestionBuilder', 'Question', 'Options', 'Restrictions', 'ValidationService', 'QuestionStorage', 'ErrorReporter', QuestionService]);
function QuestionService(QuestionBuilder, Question, Options, Restrictions, ValidationService, QuestionStorage, ErrorReporter){
    var service = {
        getQuestionBuilder: getQuestionBuilder,
        getQuestion: getQuestion
    };

    return service;

    function getQuestionBuilder(){
        return new QuestionBuilder(QuestionStorage, Question, Options, Restrictions, ValidationService, ErrorReporter);
    }

    //function

    function getQuestion(id){
        return QuestionStorage.getQuestion(id);
    }
}
