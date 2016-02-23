"use strict";
angular.module('fsmQuestion')
.factory('QuestionStorage', ['storagePrefix', 'localStorageService', QuestionStorage]);
function QuestionStorage(storagePrefix, localStorageService){
    var questions = {};
    var customerEntered = false;
    var cachedId = {};
    var service = {
        contains: contains,
        addQuestion: addQuestion,
        getQuestion: getQuestion,
        loadAnswer: loadAnswer,
        saveAnswer: saveAnswer,
        reload: reload,
        isReloaded: isReloaded,
        questionHasLocalStorage: questionHasLocalStorage,
        customerEnteredFirstPage: customerEnteredFirstPage,
        clear: clear
    };
    return service;

    function customerEnteredFirstPage() {
        customerEntered = true;
    }

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
        customerEntered = false;
        if (answer === loadAnswer(id)) {
            cachedId.id = id;
            cachedId.answer = answer;
           return true;
        }
        // Clear storage to avoid someone else's info to be displayed....
        clear();
        saveAnswer(id, answer);
        return false;
    }

    function saveAnswer(id, answer){
        if (!customerEntered) {
            if (id === cachedId.id) {
                cachedId = {};
            }
            localStorageService.set(getStorageKey(id), answer);
        }
    }

    function isReloaded() {
        return !customerEntered;
    }

    function reload() {
        Object.keys(questions).forEach(function(id) {
            var question = getQuestion(id);
            question.answer = loadAnswer(id);
            if (question.answer && question.answer !== question.options.getDefaultAnswer()) {
                question.options.onChange(question);
            }
        });
    }

    function clear() {
        //Object.keys(questions).forEach(function(id) {
        //    localStorageService.remove(getStorageKey(id));
        //});

        localStorageService.clearAll();
        if (cachedId.id) {
            saveAnswer(cachedId.id, cachedId.answer);
        }
    }
}