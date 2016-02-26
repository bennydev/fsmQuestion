"use strict";
angular.module('fsmQuestion')
    .factory('QuestionStorage', ['storagePrefix', 'localStorageService', QuestionStorage]);
function QuestionStorage(storagePrefix, localStorageService) {
    var questions = {};
    var questionLocalStorageDone = false;
    var loadStoredAnswers = false;
    var localStore = {};
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
        var keys = localStorageService.keys();
        if (keys) {
            keys.forEach(function(key) {localStore[key] = localStorageService.get(key);});
        }
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
        if (loadStoredAnswers) {
            return localStore[getStorageKey(id)];
        }
        return undefined;
    }

    function questionHasLocalStorage(id, answer) {
        if (!questionLocalStorageDone) {
            questionLocalStorageDone = true;
            return answer === localStore[getStorageKey(id)];
        }
        return false;
    }

    function saveAnswer(id, answer) {
        if (isNotNull(answer)) {
            localStorageService.set(getStorageKey(id), answer);
        }
    }

    function reload() {
        loadStoredAnswers = true;
        Object.keys(questions).forEach(function (id) {
            var question = getQuestion(id);
            var answer = loadAnswer(id);
            console.log(id + '===' + answer);
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