"use strict";
angular.module('fsmQuestion')
.factory('QuestionStorage', ['storagePrefix', 'localStorageService', QuestionStorage]);
function QuestionStorage(storagePrefix, localStorageService){
    var questions = {};
    var service = {
        contains: contains,
        addQuestion: addQuestion,
        getQuestion: getQuestion,
        loadAnswer: loadAnswer
    };
    return service;

    function contains(id){
        return !!questions[id];
    }

    function addQuestion(question){
        questions[question.id] = question;
    }

    function getQuestion(id){
        return questions[id];
    }

    function getStorageKey(id){
        return storagePrefix+'.questions.'+id;
    }

    function loadAnswer(id){
        return localStorageService.get(getStorageKey(id));
    }

    function saveAnswer(id, answer){
        localStorageService.set(getStorageKey(id), answer);
    }
}