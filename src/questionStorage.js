(function() {
    "use strict";
    angular.module('fsmQuestion')
        .factory('QuestionStorage', QuestionStorage);
    QuestionStorage.$inject = ['storagePrefix', 'localStorageService'];
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
            loadObject: loadObject,
            saveObject: saveObject,
            saveAnswer: saveAnswer,
            reload: reload,
            questionsHasLocalStorage: questionsHasLocalStorage,
            clear: clearAll
        };
        loadLocalStore();
        return service;
        function contains(id) {
            return !!questions[id];
        }

        function loadLocalStore() {
            var keys = localStorageService.keys();
            if (keys) {
                keys.forEach(function (key) {
                    localStore[key] = localStorageService.get(key);
                });
            }
            clearOwnedKeys();
        }

        function addQuestion(question) {
            questions[question.id] = question;
        }

        function getQuestion(id) {
            return questions[id];
        }

        function getStorageKey(id) {
            if (typeof storagePrefix === 'object') {
                return storagePrefix.value + '.questions.' + id;
            }
            return storagePrefix + '.questions.' + id;
        }

        function loadAnswer(id) {
            if (loadStoredAnswers) {
                return localStore[getStorageKey(id)];
            }
            return undefined;
        }

        /**
         * Save objects that do not belong to a Question's answer.
         * @param key
         * @param value
         */
        function saveObject(key, value) {
            if (isNotNull(value)) {
                localStorageService.set(key, value);
            }
        }

        /**
         * Load objects that does not belong to a Question's answer.
         * @param id
         * @returns {*}
         */
        function loadObject(id) {
            return localStore[id];
        }

        function questionsHasLocalStorage(questions) {
            if (!questionLocalStorageDone) {
                questionLocalStorageDone = true;
                for (var i = 0; i < questions.length; i++) {
                    if (!compareValues(questions[i].answer, localStore[getStorageKey(questions[i].id)])) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }

        function compareValues(answer, storedValue) {
            if (!answer && !storedValue) {
                return true;
            }
            return answer === storedValue;
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
                //console.log(id + '===' + answer);
                if (isNotNull(answer)) {
                    question.answer = answer;
                    if (question.options.onLoadStorage) {
                        question.options.onLoadStorage(question);
                    }
                    saveAnswer(question.id, answer);
                }

            });
        }

        function isNotNull(value) {
            return value !== undefined && value !== null && value !== '';
        }

        function clearOwnedKeys() {
            Object.keys(questions).forEach(function(id) {
               localStorageService.remove(getStorageKey(id));
            });
        }
        function clearAll() {
            Object.keys(questions).forEach(function(id) {
               localStorageService.remove(getStorageKey(id));
            });
            localStore = {};
        }
    }
})();