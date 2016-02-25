"use strict";
angular.module('fsmQuestion')
    .factory('QuestionStorage', ['storagePrefix', 'localStorageService', QuestionStorage]);
function QuestionStorage(storagePrefix, localStorageService) {
    var questions = {};
    var questionLocalStorageDone = false;
    var localStore;
    var service = {
        contains: contains,
        addQuestion: addQuestion,
        getQuestion: getQuestion,
        loadAnswer: loadAnswer,
        saveAnswer: saveAnswer,
        reload: reload,
        questionHasLocalStorage: questionHasLocalStorage,
        clear: clear
    };
    loadLocalStore();
    return service;
    function contains(id) {
        return !!questions[id];
    }

    function loadLocalStore() {
        localStore = localStorageService.get(storagePrefix) || {};
    }

    function addQuestion(question) {
        questions[question.id] = question;
    }

    function getQuestion(id) {
        return questions[id];
    }

    function getStorageKey(id) {
        return storagePrefix + '.questions.' + id;
    }

    function loadAnswer(id) {
        return localStore['questions.' + id];
    }

    function questionHasLocalStorage(id, answer) {
        if (!questionLocalStorageDone) {
            questionLocalStorageDone = true;
            if (answer === loadAnswer(id)) {
                return true;
            }
            // Clear storage to avoid someone else's info to be displayed....
            clear();
            saveAnswer(id, answer);
        }
        return false;
    }

    function saveAnswer(id, answer) {
        if (isNotNull(answer)) {
            localStorageService.set(getStorageKey(id), answer);
        }
    }

    function reload() {
        Object.keys(questions).forEach(function (id) {
            var question = getQuestion(id);
            var answer = loadAnswer(id);
            if (isNotNull(answer)) {
                question.answer = answer;
                if (question.options.onChange) {
                    question.options.onChange(question);
                }
            }
        });
    }

    function isNotNull(value) {
        return value !== undefined && value !== null;
    }

    function clear() {
        // This does not work for some reason, should investigate.
        //Object.keys(questions).forEach(function(id) {
        //    localStorageService.remove(getStorageKey(id));
        //});
        localStore = {};
        localStorageService.clearAll();
    }
}