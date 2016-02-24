"use strict";
angular.module('fsmQuestion')
.factory('QuestionStorage', ['storagePrefix', 'localStorageService', QuestionStorage]);
function QuestionStorage(storagePrefix, localStorageService){
    var questions = {};
    var questionLocalStorageDone = false;
    var cachedLocalStorageIdentifierId = {};
    var service = {
        contains: contains,
        addQuestion: addQuestion,
        getQuestion: getQuestion,
        loadAnswer: loadAnswer,
        saveAnswer: saveAnswer,
        reload: reload,
        isLocalStorageQuestionDone: isLocalStorageQuestionDone,
        questionHasLocalStorage: questionHasLocalStorage,
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

    function questionHasLocalStorage(id, answer) {
        questionLocalStorageDone = true;
        if (answer === loadAnswer(id)) {
            // cache id and answer for the key local storage identifier,
            // since we don't know if the user will use or clear the local storage.
            cachedLocalStorageIdentifierId.id = id;
            cachedLocalStorageIdentifierId.answer = answer;
           return true;
        }
        // Clear storage to avoid someone else's info to be displayed....
        clear();
        saveAnswer(id, answer);
        return false;
    }

    function saveAnswer(id, answer){
        if (questionLocalStorageDone) {
            if (id === cachedLocalStorageIdentifierId.id) {
                cachedLocalStorageIdentifierId = {};
            }
            if (isNotNull(answer)) {
                localStorageService.set(getStorageKey(id), answer);
            }
        }
    }

    function isLocalStorageQuestionDone() {
        return questionLocalStorageDone;
    }

    function reload() {
        Object.keys(questions).forEach(function(id) {
            var question = getQuestion(id);
            var answer = loadAnswer(id);
            if (isNotNull(answer)) {
                question.answer = answer;
                question.options.onChange(question);
            }
        });
    }

    function isNotNull(value) {
        return value !== undefined || value !== null;
    }

    function clear() {
        // This does not work for some reason, should investigate.
        //Object.keys(questions).forEach(function(id) {
        //    localStorageService.remove(getStorageKey(id));
        //});

        localStorageService.clearAll();
        if (cachedLocalStorageIdentifierId.id) {
            saveAnswer(cachedLocalStorageIdentifierId.id, cachedLocalStorageIdentifierId.answer);
        }
    }
}