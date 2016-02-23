"use strict";
angular.module('fsmQuestion')
.factory('QuestionStorage', ['storagePrefix', 'localStorageService', QuestionStorage]);
function QuestionStorage(storagePrefix, localStorageService){
    var questions = {};
    var reloaded = false;
    var service = {
        contains: contains,
        addQuestion: addQuestion,
        getQuestion: getQuestion,
        loadAnswer: loadAnswer,
        saveAnswer: saveAnswer,
        reload: reload,
        isReloaded: isReloaded,
        clear: clear
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
        if (isReloaded()) {
            localStorageService.set(getStorageKey(id), answer);
        }
    }

    function isReloaded() {
        return reloaded;
    }

    function reload() {
        Object.keys(questions).forEach(function(id) {
            var question = getQuestion(id);
            question.answer = loadAnswer(id);
            if (question.answer && question.answer !== question.options.getDefaultAnswer()) {
                question.options.onChange(question);
            }
        });
        reloaded = true;
    }

    function clear() {
        //Object.keys(questions).forEach(function(id) {
        //    localStorageService.remove(getStorageKey(id));
        //});

        localStorageService.clearAll();
    }
}