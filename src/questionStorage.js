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
            saveAnswer: saveAnswer,
            reload: reload,
            questionsHasLocalStorage: questionsHasLocalStorage,
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
                keys.forEach(function (key) {
                    localStore[key] = localStorageService.get(key);
                });
            }
            localStorageService.clearAll();
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

        /**
         * Load objects that does not belong to a Question's answer.
         * @param id
         * @returns {*}
         */
        function loadObject(id) {
            return localStore[getStorageKey(id)];
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
                    if (question.options.onChange) {
                        question.options.onChange(question);
                    }
                }

            });
        }

        function isNotNull(value) {
            return value !== undefined && value !== null && value !== '';
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
})();