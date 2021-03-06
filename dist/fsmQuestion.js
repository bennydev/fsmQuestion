"use strict";
angular.module('fsmQuestion', ['fsmFileUploader', 'LocalStorageModule', 'fsmQuestion.date'])
    .constant('buttonConfig', {activeClass: 'is-active'})
    .constant('datepickerPopupConfig', {
        datepickerPopup: 'yyyy-MM-dd',
        datepickerPopupTemplateUrl: 'template/datepicker/popup.html',
        datepickerTemplateUrl: 'template/datepicker/datepicker.html',
        html5Types: {
            date: 'yyyy-MM-dd',
            'datetime-local': 'yyyy-MM-ddTHH:mm:ss.sss',
            'month': 'yyyy-MM'
        },
        currentText: 'Idag',
        clearText: 'Rensa',
        closeText: 'Stäng',
        closeOnDateSelection: true,
        appendToBody: false,
        showButtonBar: true,
        onOpenFocus: true
    })
    .value('storagePrefix', 'i84ds03');
"use strict";
angular.module('fsmQuestion').factory('DateValidator', ['QuestionUtils', function (QuestionUtils) {
    var service = {
        validate: validate,
        isPastDate: isPastDate,
        isFutureDate: isFutureDate
    };

    function validate(question) {
        var result = validateFormat(question);
        if (result.valid) {
            result = validateDate(question);
        }

        return result;
    }

    // Could put all date validations and operations in this...
    function isPastDate(date) {
        var now = getToday();
        return date < now;
    }

    function isFutureDate(date) {
        var now = getToday();
        return date > now;
    }

    function getToday() {
        var now = new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);
        return now;
    }

    function validateFormat(question) {
        var result = {};

        result.valid = QuestionUtils.isValidDateFormat(question.answer);
        if (!result.valid) {
            result.message = question.text.root + '.ERRORS.FORMAT';
        }
        return result;
    }

    function validateDate(question) {
        var result = {};
        var digits = QuestionUtils.getDigits(question.answer);
        result.valid = isValidDate(digits);
        if (!result.valid) {
            result.message = question.text.root + '.ERRORS.INVALID';
        }
        return result;
    }

    function isValidDate(digits) {
        var dateCandidate = digits;


        if (dateCandidate.length < 8) {
            return false;
        }

        if (isNaN(dateCandidate)) {
            return false;
        }
        var year = parseInt(dateCandidate.substr(0, 4));
        var month = parseInt(dateCandidate.substr(4, 2));
        var day = parseInt(dateCandidate.substr(6, 2));
        return isValidYearMonthDayCombination(year, month, day);

    }

    function isValidYearMonthDayCombination(year, month, day) {
        if (day === 0 || month === 0) {
            return false;
        }
        if (month > 12) {
            return false;
        }
        if (day > 31) {
            return false;
        }
        if (month === 2 && day === 29) {
            return isLeapYear(year);
        }
        if (month === 2 && day > 28) {
            return false;
        }
        if ((month === 4 || month === 6 || month === 9 || month === 11) && day > 30) {
            return false;
        }
        return true;
    }

    function isLeapYear(year) {
        return new Date(Date.UTC(year, 1, 29, 0, 0, 0, 0)).getMonth() === 1;
    }

    return service;

}]);
"use strict";
angular.module('fsmQuestion')
    .factory('ErrorReporter', ErrorReporter);
function ErrorReporter(){
    var errors = {};
    var messages = [];
    var service = {
        addError: addError,
        getErrors: getErrors,
        hasErrors: hasErrors,
        hasErrorFor: hasErrorFor,
        clearErrors: clearErrors,
        removeErrorFor: removeErrorFor
    };
    return service;

    function addError(id, message){
        errors[id] = message;
        messages.push(message);
    }

    function removeErrorFor(id){
        var message = errors[id];
        messages.splice(messages.indexOf(message), 1);
        delete errors[id];
    }

    function getErrors(){
        return errors;
    }

    function hasErrors(){
        return messages.length !== 0;
    }

    function hasErrorFor(id){
        return !! errors[id];
    }

    function clearErrors(){
        errors = {};
        messages = [];
    }
}


(function(angular) {
    'use strict';

    angular.module('fsmFileUploader', [])
        .directive('fsmFileUploader', fsmFileUploader);

    fsmFileUploader.$inject = ['FileUploaderService', 'QuestionStorage'];

    function fsmFileUploader(FileUploaderService, QuestionStorage) {
        return {
            restrict: 'E',
            scope: {
                group: '&',
                buttonText: '@',
                max: '='
            },
            templateUrl: 'templates/fileuploader.tpl.html',
            link: function (scope, element, attrs) {
                scope.id = 'fileUpload-' + scope.group();
                scope.group = scope.group();
                scope.files = FileUploaderService.createGroup(scope.group).files;
                scope.removeFile = function (index) {
                    FileUploaderService.removeFileInGroup(scope.group, index);
                };

                var btn = element.find('#selectFileBtn');
                var input;

                btn.bind('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    bindInput();
                    input.click();
                });

                function bindInput() {
                    if (!input) {
                        input = element.find('#' + scope.id);
                        input.bind('change', function () {
                            var file = input.files[0];
                            var reader = new FileReader();

                            reader.onload = (function() {
                                return function(e) {
                                    file.dataURL = e.target.result;
                                    QuestionStorage.saveObject('TestFile', JSON.stringify(file));
                                };
                            })(file);
                            reader.readAsDataURL(file);

                            file.path = input.value;
                            if (!file.name) {
                                file.name = input.value.substr(input.value.lastIndexOf('/'));
                            }
                            input.value = '';
                            addFile(file, scope.group);
                            scope.$apply();
                        });
                        input = input[0];
                    }
                }

                function addFile(file, group) {
                    if (scope.max == 1) {
                        scope.removeFile(0);
                    }
                    FileUploaderService.addFileToGroup(file, group);
                }

            }
        };
    }
})(angular);

(function(angular){
    "use strict";
    angular.module('fsmFileUploader')
        .factory('FileUploaderService', FileUploaderService);

    FileUploaderService.$inject =  ['$http', '$window', '$q'];

    function FileUploaderService($http, $window, $q){
        var groups = {};
        var config = {headers: {'Content-Type': undefined, transformRequest: angular.identity}};
        var filesUploaded = false;

        var uploadService = {
            getFileNames: getFileNames,
            addFileToGroup: addFileToGroup,
            uploadFiles: uploadFiles,
            isFilesUploaded: isFilesUploaded,
            removeFileInGroup: removeFileInGroup,
            createGroup: createGroup,
            fileUploadSupported: fileUploadSupported
        };


        function addFileToGroup(file, groupName){
            var group = groups[groupName];
            group.files.push(file);
        }

        function uploadFiles(url, reject){
            var promises = [];
            return $q(function(resolve){
                Object.keys(groups).forEach(function(groupName){
                    var group = groups[groupName];
                    group.files.forEach(function(file){
                        var formData = new $window.FormData();
                        formData.append('file', file, file.name);
                        var promise = $http.post(url, formData, config).then(function(response){
                            group.docIds.push(response.data.receiptId);
                        }, function(errorResponse){
                            return reject(errorResponse);
                        });
                        promises.push(promise);
                    });
                });
                return $q.all(promises).then(function(){
                    filesUploaded = true;
                    return resolve(groups);});
            });
        }

        function isFilesUploaded() {
            return filesUploaded;
        }

        function getFileNames(groupName){
            var fileNames = [];
            groups[groupName].files.forEach(function(file){
                fileNames.push(file.name);
            });
            return fileNames;
        }

        function removeFileInGroup(groupName, index){
            groups[groupName].files.splice(index, 1);
        }

        function createGroup(groupName){
            var group = groups[groupName] ? groups[groupName] : {name: groupName, files: [], docIds: []};
            groups[groupName] = group;
            return group;
        }

        function fileUploadSupported(){
            return !!$window.FileReader && !!$window.File && !!$window.FileList && !!$window.Blob;
        }


        return uploadService;

    }

})(angular);

(function(angular){
    "use strict";
    angular.module('fsmQuestion')
        .factory('localStorageLogger', LocalStorageLogger);

    LocalStorageLogger.$inject = ['localStorageService'];

    function LocalStorageLogger(localStorageService){

        var service = {
            logDebug: logDebug
        };

        function logDebug(key, message) {
            localStorageService.set(key, message);
        }

        return service;

    }

})(angular);
"use strict";
angular.module('fsmQuestion')
.directive('fsmQuestion', ['QuestionTypes', 'QuestionUtils', '$translate', function(QuestionTypes, QuestionUtils, $translate){
    function dateSetup(scope){
        if(scope.question.type === QuestionTypes.date){
            scope.formatDateString = function(question){
                var value = question.answer;
                if(value && QuestionUtils.isValidDate(value)) {
                    question.setAnswer(QuestionUtils.createDate(value));
                }
            };

            scope.updateCalendarModel = function(value){
                scope.question.calendarModel = QuestionUtils.isValidDate(value) ? QuestionUtils.createDate(value) : scope.calendarModel;
            };
        }
    }

    function phoneSetup(scope) {
        if (scope.question.type === QuestionTypes.phone) {

            scope.addZeroToPhoneNumber = function(){
                if(scope.question.answer.phoneNumber === '0' && scope.question.answer.countryCode.code !== 'SWE'){
                    scope.question.answer.phoneNumber = '';
                } else if(scope.question.answer.phoneNumber === '' && scope.question.answer.countryCode.code === 'SWE'){
                    scope.question.answer.phoneNumber = '0';
                }
            };
            scope.formatPhoneNumber = function(){
                if(scope.question.answer.countryCode.code === 'SWE'){
                    if(scope.question.answer.phoneNumber === '' || scope.question.answer.phoneNumber === '00'){
                        scope.question.answer.phoneNumber = '0';
                    }
                    if(scope.question.answer.phoneNumber.charAt(0) !== '0' ){
                        scope.question.answer.phoneNumber = '0' + scope.question.answer.phoneNumber;
                    }
                }
            };
        }
    }

    function labelSetup(scope) {
        if (scope.question.type === QuestionTypes.label) {
            scope.question.validate = function(){return true;};
        }
    }

    return {
        restrict: 'E',
        scope: {
            question: '=',
            translateValues: '='
        },
        templateUrl: 'templates/fsmQuestion.tpl.html',
        link: function(scope){
            init(scope);
            scope.hasText = function(key){
                return $translate.instant(key) !== key;
            };
            dateSetup(scope);
            phoneSetup(scope);
            labelSetup(scope);
        }
    };

    function init(scope){
        initScopeVariables(scope);
    }

    function initScopeVariables(scope){
        scope.types = QuestionTypes;
    }
}]);
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
    }]);
"use strict";
angular.module('fsmQuestion')
    .directive('numbers', ['numbersOnlyFilter', function(numbersOnlyFilter){
        return {
            restrict: 'A',
            scope: {
                question: '='
            },
            link: function(scope){
                scope.$watch('question.answer', function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        scope.question.answer = numbersOnlyFilter(newValue);
                    }
                });
            }
        };
    }]);
"use strict";
angular.module('fsmQuestion').filter('numbersOnly', function () {
    return function(input) {
        if (input) {

            // Remove trailing zeros
            var str = input.replace(/^0/, '');
            str = str.replace(/[^0-9]+/g, '');
            return str;
        }

        return input;
    };

});
(function() {
    'use strict';
    angular.module('fsmQuestion')
        .value('Options', Options);
    function Options(defaultAnswer, visible, values, placeholder, onChange, onLoadStorage) {
        var options = this;
        options.getDefaultAnswer = setOption(defaultAnswer);
        options.isVisible = setOption(visible);
        options.getValues = setOption(values);
        options.getPlaceholder = setOption(placeholder);
        options.onChange = setOption(onChange);
        options.onLoadStorage = setOption(onLoadStorage);

        function setOption(value) {
            if (value instanceof Function) {
                return value;
            } else {
                return function () {
                    return value;
                };
            }
        }
    }
})();
"use strict";
angular.module('fsmQuestion')
    .value('Question', Question);
function Question(id, type, text, options, restrictions, ValidationService, questionStorage, ErrorReporter){
    var question = this;
    question.id = id;
    question.type = type;
    question.text = text;
    question.options = options;
    question.restrictions = restrictions;
    question.isVisible = options.isVisible;
    question.isRequired = restrictions.isRequired;
    question.validate = function(){ValidationService.validate(question);};
    question.setAnswer = function(value){
        if(value instanceof Date){
            value.setUTCHours(value.getUTCHours() + Math.abs(value.getTimezoneOffset()) / 60);
            question.answer = value.toISOString().substr(0,10);
        } else {
            question.answer = value;
        }
        questionStorage.saveAnswer(question.id, question.answer);
    };
    question.hasError = function(){
        return ErrorReporter.hasErrorFor(question.id);
    };
    question.getError = function(){
      return ErrorReporter.getErrors()[question.id];
    };
    question.removeError = function(){
      ErrorReporter.removeErrorFor(question.id);
    };
    question.answer = question.options.getDefaultAnswer();
}

(function() {
    "use strict";
    angular.module('fsmQuestion')
        .value('QuestionBuilder', QuestionBuilder);

    function QuestionBuilder(questionStorage, Question, Options, Restrictions, ValidationService, ErrorReporter) {
        var builder = this;

        function init() {
            builder.id = set('id', builder);
            builder.type = set('type', builder);
            builder.text = set('text', builder);
            builder.defaultAnswer = set('defaultAnswer', builder);
            builder.values = set('values', builder);
            builder.placeholder = set('placeholder', builder);
            builder.onChange = set('onChange', builder);
            builder.onLoadStorage = set('onLoadStorage', builder);
            builder.visible = set('visible', builder);
            builder.required = set('required', builder);
            builder.validator = set('validator', builder);
            builder.min = set('min', builder);
            builder.max = set('max', builder);
            builder.numeric = set('numeric', builder);
            builder.createQuestion = function () {
                if (!questionStorage.contains(builder.id)) {
                    var question = new Question(
                        value(builder.id),
                        value(builder.type),
                        value(builder.text),
                        new Options(value(builder.defaultAnswer, ''), value(builder.visible, true), value(builder.values, []), value(builder.placeholder, ''), value(builder.onChange), value(builder.onLoadStorage)),
                        new Restrictions(value(builder.required, false), value(builder.validator), value(builder.min), value(builder.max), value(builder.numeric, false)),
                        ValidationService,
                        questionStorage,
                        ErrorReporter
                    );
                    questionStorage.addQuestion(question);
                    loadAnswer(question);
                    init();
                    return question;
                } else {
                    var id = builder.id;
                    init();
                    throw new Error('Duplicate question id: ' + id);
                }
            };
        }

        function set(name, builder) {
            var setter = function (value) {
                builder[name] = value;
                return builder;
            };
            setter.isBuilder = true;
            return setter;
        }

        function value(inputValue, defaultValue) {
            if ((inputValue && inputValue.isBuilder) || inputValue === undefined || inputValue === null) {
                return defaultValue;
            } else {
                return inputValue;
            }
        }

        function loadAnswer(question) {
            var answer = questionStorage.loadAnswer(question.id);
            if (answer) {
                question.setAnswer(answer);
                //question.options.onChange(question);
            }
        }

        init();
    }
})();

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
         * Save objects that are not related to a Question or cannot use the prefixed key.
         * @param key
         * @param value
         */
        function saveObject(key, value) {
            if (isNotNull(value)) {
                localStorageService.set(key, value);
            }
        }

        /**
         * Load objects that are not related to a Question or cannot use the prefixed key.
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
"use strict";
angular.module('fsmQuestion')
.value('QuestionTypes', new QuestionTypes());
function QuestionTypes(){
    var types = this;
    types.input = 'INPUT';
    types.inputtel = 'INPUTTEL';
    types.inputcurrency = 'INPUTCURRENCY';
    types.inputidentification = 'INPUTIDENTIFICATION';
    types.buttongroup = 'BUTTONGROUP';
    types.buttongroupBig = 'BUTTONGROUPBIG';
    types.upload = 'UPLOAD';
    types.date = 'DATE';
    types.checkbox = 'CHECKBOX';
    types.select = 'SELECT';
    types.text = 'TEXT';
    types.phone = 'PHONE';
    types.label = 'LABEL';
}

'use strict';
angular.module('fsmQuestion')
    .factory('QuestionUtils', Utils);
function Utils(){
    return {
        isPersonId: isPersonId,
        removeValidPersonIdSeparators: removeValidPersonIdSeparators,
        addCenturyToPersonId: addCenturyToPersonId,
        isValidDateFormat: isValidDateFormat,
        isPastDate: isPastDate,
        dateInMillis: dateInMillis,
        getDatePartials: getDatePartials,
        isValidDate: isValidDate,
        createDate: createDate,
        addCentury: addCentury,
        getDigits: getDigits,
        isNumeric: isNumeric,
        startsWithNumberOfChars: startsWithNumberOfChars,
        formatPersonId: formatPersonId
    };

    function isValidDate(value){
        value = getDigits(value);
        if(value.length === 6 || value.length === 8) {
            var date = createDate(value);
            value = addCentury(value);

            return date ? getDigits(date.toISOString()).indexOf(value) === 0 : false;
        }
    }

    function createDate(value){
        if(value) {
            value = getDigits(value);
            value = addCentury(value);
            var partials = getDatePartials(value);
            if (partials) {
                return createDateFromPartials(partials);
            }
        }
    }

    function getDatePartials(value){
        if(value) {
            value = getDigits(value);
            if(value.toString().length >= 8) {
                return {
                    year: value.substr(0, 4),
                    month: value.substr(4, 2),
                    day: value.substr(6, 2)
                };
            }
        }
    }

    function addCentury(value){

        if (value.length === 6 && value.indexOf(getCurrentCentury()) !== 0) {
            var currentCentury = getCurrentCentury();
            var tempDate = currentCentury + value;
            var datePartials = getDatePartials(tempDate);
            var today = new Date();
            var valueDate = createDateFromPartials(datePartials);
            if (valueDate > today) {
                // reduce century to 19...
                return (parseInt(currentCentury)) - 1 + value;
            }
            return tempDate;
        }

        return value;
    }

    function createDateFromPartials(datePartials) {
        return new Date(Date.UTC(datePartials.year, datePartials.month - 1, datePartials.day));
    }

    function getCurrentCentury(){
        return new Date().getUTCFullYear().toString().substr(0,2);
    }

    function getDigits(value){
        return value ? value.toString().replace(/\D/g,'') : '';
    }

    function isPersonId(value){
        value = removeValidPersonIdSeparators(value);
        return isNumeric(value) && (value.length === 10 || value.length === 12);
    }

    function removeValidPersonIdSeparators(value){
        return value.toString().replace(new RegExp('[\\+-]', 'gi'), '');
    }

    function addCenturyToPersonId(personId) {
        personId = personId.toString();
        if (removeValidPersonIdSeparators(personId).length === 10) {
            var currentYear = new Date().getUTCFullYear();
            var currentCentury = getCurrentCentury();
            if (personId.indexOf('+') === 6) {
                personId = currentCentury - 1 + personId;
            } else {
                personId = currentYear - parseInt(currentCentury - 1 + personId.substr(0, 2)) >= 100 ? currentCentury + personId : currentCentury - 1 + personId;
            }
        }
        return personId;
    }

    function isValidDateFormat(value){
        value = value.toString().replace(new RegExp('[-.]', 'gi'), '');
        return value && isNumeric(value) && value.length === 8;
    }

    function isNumeric(value, allowExponent){
        value = value.toString();
        if(allowExponent){
            return !isNaN(value) && isFinite(value);
        } else {
            var amountLeadingZeroes = amountLeadingChar(value, '0');
            var parsed = parseFloat(value);
            return value.length === parsed.toString().length + amountLeadingZeroes && !isNaN(parsed) && isFinite(parsed);
        }
    }

    function amountLeadingChar(string, find){
        var amount = 0;
        var found = true;
        (''+string).split('').forEach(function(char){
            if(found){
                found = find === char;
                if(found){
                    amount++;
                }
            }
        });
        return amount;
    }

    function isPastDate(value){
        if(value && isValidDate(value)) {
            var datePartials = getDatePartials(value);
            var date = createDate(datePartials.year+'-'+datePartials.month+'-'+datePartials.day);
            var now = new Date();
            return date.getTime() < now.getTime();
        }
    }

    function dateInMillis(value){
        if(value && isValidDate(value)) {
            var date = createDate(value);
            return date.getTime();
        }
    }

    function startsWithNumberOfChars(value, length){
        value = value.toString();
        return !! value.substr(0, length).match(new RegExp('[a-zA-ZåäöÅÄÖ]','gi'));
    }

    function formatPersonId(question){
        //if(!question.centuryAdded) {
            if (isPersonId(question.answer)) {
                question.answer = removeValidPersonIdSeparators(addCenturyToPersonId(question.answer));
                question.answer = question.answer.substr(0,8) +'-'+question.answer.substr(8);
                //question.centuryAdded = true;
            }
        //} else if(question.answer.toString().length === 0){
        //    question.centuryAdded = false;
        //}
    }
}
"use strict";
angular.module('fsmQuestion')
.value('Restrictions', Restrictions);
function Restrictions(required, validator, min, max, numeric){
    var restrictions = this;
    restrictions.isRequired = setRestriction(required);
    restrictions.getValidator = setRestriction(validator);
    restrictions.getMin = setRestriction(min);
    restrictions.getMax = setRestriction(max);
    restrictions.isNumeric = setRestriction(numeric);

    function setRestriction(value){
        if(value instanceof Function){
            return value;
        } else {
            return function(){return value;};
        }
    }
}

"use strict";
angular.module('fsmQuestion.date', ['pascalprecht.translate'])
    .controller('DateCtrl', ['$scope', 'datepickerPopupConfig', '$translate',
        function ($scope, datepickerPopupConfig, $translate) {
          datepickerPopupConfig.currentText = $translate.instant('DATE_PICKER.CURRENT_TEXT');
          datepickerPopupConfig.clearText = $translate.instant('DATE_PICKER.CLEAR_TEXT');
          datepickerPopupConfig.closeText = $translate.instant('DATE_PICKER.CLOSE_TEXT');
        }]);
"use strict";
angular.module('fsmQuestion')
.factory('ValidationService', ['Validators', 'QuestionTypes', 'ErrorReporter', ValidationService]);
function ValidationService(Validators, QuestionTypes, ErrorReporter){
    var service = {
        validate: validate
    };

    return service;

    function validate(question){
        if(question.isVisible()){
            if(question.isRequired()){
                validateWithValidator(Validators.getRequiredValidator(), question);
            }
            if (question.type === QuestionTypes.date  && !ErrorReporter.hasErrorFor(question.id)) {
                validateWithValidator(Validators.getDateValidator(), question);
            }
            if(question.restrictions.getMin() && !ErrorReporter.hasErrorFor(question.id)){
                validateWithValidator(Validators.getMinValidator(question), question);
            }
            if(question.restrictions.getMax() && !ErrorReporter.hasErrorFor(question.id)){
                validateWithValidator(Validators.getMaxValidator(question), question);
            }
            if(question.restrictions.getValidator() && !ErrorReporter.hasErrorFor(question.id)){
                validateWithValidator(question.restrictions.getValidator(), question);
            }
        }
    }

    function validateWithValidator(validator, question){
        var result = validator.validate(question);
        if(!result.valid){
            ErrorReporter.addError(question.id, result.message);
        }
    }
}
"use strict";
angular.module('fsmQuestion')
.factory('Validators', ['QuestionTypes', 'QuestionUtils', 'DateValidator', Validators]);
function Validators(QuestionTypes, QuestionUtils, DateValidator){
    var service = {
        getRequiredValidator: getRequiredValidator,
        getDateValidator: getDateValidator,
        getMinValidator: getMinValidator,
        getMaxValidator: getMaxValidator,
        getNumericValidator: getNumericValidator,
        getIdentificationValidator: getIdentificationValidator,
        getPastDateValidator: getPastDateValidator
    };

    return service;

    function getMinDateValidator(){
        return {
            validate: function(question){
                var answer = question.answer;
                var result = {};
                result.valid = true;
                result.valid = result.valid && QuestionUtils.dateInMillis(answer) >= question.restrictions.getMin().date.getTime();
                result.message = !result.valid && !result.message ? question.text.root + '.ERRORS.TOO_EARLY': result.message;
                return result;
            }
        };
    }

    function getMaxDateValidator(){
        return {
            validate: function(question){
                var answer = question.answer;
                var result = {};
                result.valid = true;
                result.valid = result.valid && QuestionUtils.dateInMillis(answer) <= question.restrictions.getMax().date.getTime();
                result.message = !result.valid && !result.message ? question.text.root + '.ERRORS.TOO_LATE' : result.message;
                return result;
            }
        };
    }

    function getMinValueOrLengthValidator(){
        return {
            validate: function(question){
                var result = {};
                var min = question.restrictions.getMin();
                var answer = question.answer;
                var numericAnswer = getNumericAnswer(answer);

                if(numericAnswer && question.restrictions.isNumeric()){
                    result.valid = numericAnswer >= min;
                    result.message = question.text.root + '.ERRORS.TOO_LOW';
                } else {
                    result.valid = answer.toString().length >= min;
                    result.message = question.text.root + '.ERRORS.TOO_SHORT';
                }
                return result;
            }
        };
    }

    function getMaxValueOrLengthValidator(){
        return {
            validate: function(question){
                var result = {};
                var max = question.restrictions.getMax();
                var answer = question.answer;
                var numericAnswer = getNumericAnswer(answer);

                if(numericAnswer && question.restrictions.isNumeric()){
                    result.valid = numericAnswer <= max;
                    result.message = question.text.root + '.ERRORS.TOO_HIGH';
                } else {
                    result.valid = answer.toString().length <= max;
                    result.message = question.text.root + '.ERRORS.TOO_LONG';
                }
                return result;
            }
        };
    }

    function getRequiredValidator(){
        return {
            validate: function(question){
                var answer = question.answer;
                var result = {};
                result.valid = answer !== undefined && answer !== '' && answer !== null && answer !== 'SELECT';
                result.message = question.text.root + '.ERRORS.REQUIRED';
                return result;
            }
        };
    }

    function getDateValidator(){
        return DateValidator;
    }

    function getMinValidator(question){
        var minValidator;
        if(QuestionTypes.date === question.type){
            minValidator = getMinDateValidator();
        } else {
            minValidator = getMinValueOrLengthValidator();
        }
        return minValidator;
    }

    function getMaxValidator(question){
        var maxValidator;
        if(QuestionTypes.date === question.type){
            maxValidator = getMaxDateValidator();
        } else {
            maxValidator = getMaxValueOrLengthValidator();
        }
        return maxValidator;
    }

    function getNumericValidator() {
        return {
            validate: function(question) {
                var answer = question.answer;
                var result = {valid: true};
                if(answer !== undefined && answer !== null && answer !== '') {
                    result.valid = QuestionUtils.isNumeric(answer);
                    result.message = question.text.root + '.ERRORS.INVALID';
                }
                return result;
            }
        };
    }

    function getNumericAnswer(answer){
        var numericAnswer = parseFloat(answer);
        numericAnswer = answer === numericAnswer.toString() ? numericAnswer : undefined;
        return numericAnswer;
    }

    function getIdentificationValidator(){
        return {
            validate: function(question){
                var answer = question.answer;
                if(QuestionUtils.isPersonId(answer)){
                    return validatePersonId(question);
                    //return {
                    //    valid: validatePersonId(answer),
                    //    message: question.text.root + '.ERRORS.PERSON_ID_INVALID'
                    //};
                } else if(QuestionUtils.startsWithNumberOfChars(answer, 1)){
                    return {
                        valid: validateCustomerNumber(answer),
                        message: question.text.root + '.ERRORS.CUSTOMER_NUMBER_INVALID'
                    };
                } else {
                    return {valid: false, message: question.text.root + '.ERRORS.FORMAT'};
                }
            }
        };
    }

    function getPastDateValidator(){
        return {validate: function(question){
            var answer = question.answer;
            var result = {};
            result.valid = QuestionUtils.isPastDate(answer);
            result.message = !result.valid && !result.message ? question.text.root + '.ERRORS.FUTURE' : result.message;
            return result;
        }};
    }

    function validatePersonId(question){
        var value = QuestionUtils.removeValidPersonIdSeparators(question.answer);
        value = value.length === 12 ? value.substr(2) : value;
        var result = {};

        result.valid = QuestionUtils.isValidDate(value.substr(0,6));
        if (!result.valid) {
            result.message = question.text.root + '.ERRORS.FORMAT';
            return result;
        }
        result.valid =  hasValidChecksum(value);
        if (!result.valid) {
            result.message = question.text.root + '.ERRORS.PERSON_ID_INVALID';
        }

        return result;
    }

    function hasValidChecksum(value){
        value = value.toString();
        var actual = value.charAt(value.length -1);
        var checksum = calculateChecksum(value);
        var expected = checksum === 0 ? 0 : 10 - checksum.toString().split('')[checksum.toString().length -1];
        return parseInt(actual) === parseInt(expected);
    }

    function calculateChecksum(value){
        var multiplier = 2;
        var chars = value.toString().split('');
        chars.splice(chars.length -1);
        return chars.map(function(value){
            var x = multiplier;
            multiplier = multiplier === 2 ? 1 : 2;
            return value * x;
        }).join('').split('').reduce(function(prev, curr){
            return parseInt(prev) + parseInt(curr);
        }).toString().split('').reduce(function(prev, curr){return parseInt(curr);});
    }

    function validateCustomerNumber(value){
        value = QuestionUtils.removeValidPersonIdSeparators(value);
        return QuestionUtils.startsWithNumberOfChars(value, 3) && QuestionUtils.isNumeric(value.substr(3)) && value.length === 9;
    }


}
angular.module('fsmQuestionTemplates', ['templates/buttongroup.tpl.html', 'templates/buttongroupbig.tpl.html', 'templates/checkbox.tpl.html', 'templates/date.tpl.html', 'templates/datetime.tpl.html', 'templates/fileuploader.tpl.html', 'templates/formerror.tpl.html', 'templates/fsmQuestion.tpl.html', 'templates/fsmQuestionGroup.tpl.html', 'templates/input.tpl.html', 'templates/inputcurrency.tpl.html', 'templates/inputidentification.tpl.html', 'templates/inputtel.tpl.html', 'templates/label.tpl.html', 'templates/location.tpl.html', 'templates/phone.tpl.html', 'templates/select.tpl.html', 'templates/text.tpl.html', 'templates/tooltip.tpl.html', 'templates/upload.tpl.html']);

angular.module("templates/buttongroup.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/buttongroup.tpl.html",
    "<div class=\"form-label\">\n" +
    "    <label for=\"{{question.id}}\"><span translate translate-default=\" \" translate-values=\"question.text.getTranslateValues()\">{{question.text.root+'.QUESTION'}}</span><span ng-show=\"question.isRequired()\" class=\"required\"></span></label>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div ng-include=\"'templates/tooltip.tpl.html'\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div class=\"form-row form-row--gap\">\n" +
    "            <div class=\"toggle-list\" id=\"{{question.id}}\">\n" +
    "                <button class=\"toggle-list__item\"\n" +
    "                    id=\"{{question.id + $index}}\"\n" +
    "                    name=\"{{question.id}}\"\n" +
    "                    ng-repeat=\"option in question.options.getValues() track by $index\"\n" +
    "                    ng-model=\"question.answer\"\n" +
    "                    btn-radio=\"'{{option.value}}'\"\n" +
    "                    ng-class=\"{'fsm-invalid': question.hasError(), 'fsm-valid': !question.hasError()}\"\n" +
    "                    ng-change=\"question.removeError();question.options.onChange(question);question.setAnswer(question.answer)\">{{option.label | translate}}\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/formerror.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/buttongroupbig.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/buttongroupbig.tpl.html",
    "<div class=\"u-spacing-above u-spacing-under u-inline-block\">\n" +
    "\n" +
    "    <div class=\"grid\">\n" +
    "        <div class=\"grid__item\">\n" +
    "            <div ng-include=\"'templates/tooltip.tpl.html'\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <span class=\"form-section__accept u-typography-3\" translate translate-default=\" \" translate-values=\"question.text.getTranslateValues()\">{{question.text.root+'.QUESTION'}}</span>\n" +
    "\n" +
    "    <div class=\"toggle-list toggle-list--large\">\n" +
    "        <button type=\"button\" class=\"toggle-list__item\" id=\"{{question.id + $index}}\"\n" +
    "            name=\"{{question.id}}\"\n" +
    "            ng-repeat=\"option in question.options.getValues() track by $index\"\n" +
    "            ng-model=\"question.answer\"\n" +
    "            btn-radio=\"'{{option.value}}'\"\n" +
    "            ng-class=\"{'fsm-invalid': question.hasError(), 'fsm-valid': !question.hasError()}\"\n" +
    "            ng-change=\"question.removeError();question.onChange(question);question.setAnswer(question.answer);\">{{option.label | translate}}</button>\n" +
    "    </div>\n" +
    "\n" +
    "    <input type=\"hidden\" ng-required=\"true\" name=\"agree\" ng-model=\"agree\">\n" +
    "\n" +
    "    <div class=\"form-error u-spacing-above-narrow\" role=\"alert\" ng-show=\"question.hasError()\" ng-cloak>\n" +
    "        <div>{{question.getError() | translate}}</div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/checkbox.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/checkbox.tpl.html",
    "<div class=\"form-row form-row--gap\">\n" +
    "  <div ng-repeat=\"option in question.options.getValues() track by $index\">\n" +
    "    <label class=\"custom-checkbox\">\n" +
    "      <input id=\"{{question.id}}{{$index}}\"\n" +
    "               name=\"{{question.id}}{{$index}}\"\n" +
    "               type=\"checkbox\"\n" +
    "               class=\"custom-checkbox__input\"\n" +
    "               ng-model=\"question.answer\"\n" +
    "               ng-change=\"question.removeError();question.options.onChange(question);question.setAnswer(question.answer);\"\n" +
    "               ng-class=\"{'fsm-invalid': question.hasError(), 'fsm-valid': !question.hasError()}\"\n" +
    "               ng-true-value=\"'{{question.options.getValues()[0].value}}'\"\n" +
    "               ng-false-value=\"false\">\n" +
    "        <span class=\"custom-checkbox__icon\" translate>{{question.options.getValues()[0].label}}</span>\n" +
    "    </label>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div ng-include=\"'templates/tooltip.tpl.html'\"></div>");
}]);

angular.module("templates/date.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/date.tpl.html",
    "<div class=\"form-label\" ng-if=\"!question.text.hide\">\n" +
    "    <label for=\"{{question.id}}\"><span translate translate-default=\" \" translate-values=\"question.text.getTranslateValues()\">{{question.text.root+'.QUESTION'}}</span><span ng-show=\"question.isRequired()\" class=\"required\"></span></label>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div ng-include=\"'templates/tooltip.tpl.html'\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"grid\" ng-controller=\"DateCtrl\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div class=\"form-row form-row--gap xs--two-thirds sm--two-thirds lg--one-half\">\n" +
    "\n" +
    "            <input type=\"text\"\n" +
    "                   id=\"{{question.id}}\"\n" +
    "                   name=\"{{question.id}}\"\n" +
    "                   class=\"input-text\"\n" +
    "                   placeholder=\"{{question.options.getPlaceholder()}}\"\n" +
    "                   input-touched\n" +
    "                   ng-model=\"question.answer\"\n" +
    "                   ng-class=\"{'fsm-invalid': question.hasError(), 'fsm-valid': !question.hasError()}\"\n" +
    "                   ng-change=\"question.removeError(); updateCalendarModel(question.answer);\"\n" +
    "                   ng-blur=\"formatDateString(question); updateCalendarModel(question.answer);\"\n" +
    "                   maxlength=\"{{question.restrictions.getMax().length}}\"\n" +
    "                    />\n" +
    "            <i aria-hidden=\"true\" class=\"icon icon-date\" ng-click=\"question.isOpen =! question.isOpen\"></i>\n" +
    "            <div datepicker-popup=\"yyyy-MM-dd\"\n" +
    "                 datepicker-options=\"{startingDay: 1}\"\n" +
    "                 min-date=\"question.restrictions.getMin().date\"\n" +
    "                 max-date=\"question.restrictions.getMax().date\"\n" +
    "                 ng-model=\"question.calendarModel\"\n" +
    "                 ng-class=\"{'fsm-invalid': question.hasError(), 'fsm-valid': !question.hasError()}\"\n" +
    "                 ng-change=\"question.removeError();question.setAnswer(question.calendarModel);\"\n" +
    "                 is-open=\"question.isOpen\"\n" +
    "                    style=\"margin-top:1px;\">\n" +
    "                 </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/formerror.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/datetime.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/datetime.tpl.html",
    "<div class=\"col-sm-6\">\n" +
    "    <span>\n" +
    "        <label for=\"{{question.id}}Date\"\n" +
    "               ng-class=\"{'mandatory' : question.isRequired()}\">{{question.text.root+'.QUESTION' | translate}}\n" +
    "        </label>\n" +
    "    </span>\n" +
    "</div>\n" +
    "<div class=\"col-sm-6\" ng-init=\"question.model[question.id] = {};\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-sm-8\">\n" +
    "            <input type=\"text\"\n" +
    "                   id=\"{{question.id}}Date\"\n" +
    "                   name=\"{{question.id}}Date\"\n" +
    "                   class=\"form-control\"\n" +
    "                   ng-model=\"question.model[question.id].date\"\n" +
    "                   ng-class=\"{'fsm-invalid': question.hasError(), 'fsm-valid': !question.hasError()}\"\n" +
    "                   ng-change=\"question.removeError();\"\n" +
    "                    />\n" +
    "        </div>\n" +
    "        <div class=\"clearfix visible-xs\" style=\"padding-bottom: 15px;\"></div>\n" +
    "        <div class=\"col-sm-4\">\n" +
    "            <input type=\"text\"\n" +
    "                   id=\"{{question.id}}Time\"\n" +
    "                   name=\"{{question.id}}Time\"\n" +
    "                   class=\"form-control\"\n" +
    "                   ng-model=\"question.model[question.id].time\"\n" +
    "                   ng-class=\"{'fsm-invalid': question.hasError(), 'fsm-valid': !question.hasError()}\"\n" +
    "                   ng-change=\"question.removeError();\"\n" +
    "                    />\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/fileuploader.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/fileuploader.tpl.html",
    "<div class=\"form-row form-row--gap\">\n" +
    "    <button id=\"selectFileBtn\" type=\"button\" class=\"button button--small\" ng-disabled=\"files.length >= max\"><i class=\"icon icon-doc\"></i> {{buttonText}}</button>\n" +
    "    <input id=\"{{id}}\" type=\"file\" ng-model=\"file\" style=\"visibility: hidden; position: absolute;\"/>\n" +
    "</div>\n" +
    "\n" +
    "<!-- This is how it looks after you've added an attachment -->\n" +
    "<div class=\"form-row form-row--gap\" ng-if=\"files.length > 0\">\n" +
    "    <div ng-repeat=\"selectedFile in files track by $index\">\n" +
    "        <em>{{selectedFile.name}}</em> &nbsp; <span class=\"u-nowrap\"><a href=\"javascript:;\" class=\"u-font-semibold\" ng-click=\"removeFile($index);\"><i class=\"icon icon-close\" aria-hidden=\"true\"></i> {{'GENERAL.EXTRAS.DELETE' | translate}}</a></span>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/formerror.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/formerror.tpl.html",
    "<div class=\"form-error\" role=\"alert\" ng-cloak ng-show=\"question.hasError()\">\n" +
    "    <div id=\"{{question.id +'Error'}}\">{{question.getError() | translate}}</div>\n" +
    "</div>");
}]);

angular.module("templates/fsmQuestion.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/fsmQuestion.tpl.html",
    "<div ng-show=\"question.isVisible()\" class=\"row input-block animate-show\">\n" +
    "    <div class=\"input-block__block\" ng-include=\"'templates/' + question.type.toLowerCase() + '.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/fsmQuestionGroup.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/fsmQuestionGroup.tpl.html",
    "<fieldset ng-show=\"isVisible()\">\n" +
    "    <fsm-question question=\"question\" ng-repeat=\"question in questions\"></fsm-question>\n" +
    "</fieldset>");
}]);

angular.module("templates/input.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/input.tpl.html",
    "<div class=\"form-label\" ng-if=\"!question.text.hide\" >\n" +
    "    <label for=\"{{question.id}}\"><span translate translate-default=\" \" translate-values=\"question.text.getTranslateValues()\">{{question.text.root+'.QUESTION'}}</span><span ng-show=\"question.isRequired()\" class=\"required\"></span></label>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div ng-include=\"'templates/tooltip.tpl.html'\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div class=\"form-row form-row--gap\">\n" +
    "          <input type=\"text\"\n" +
    "             id=\"{{question.id}}\"\n" +
    "             name=\"{{question.id}}\"\n" +
    "             placeholder=\"{{question.options.getPlaceholder()}}\"\n" +
    "             input-touched\n" +
    "             class=\"input-text\"\n" +
    "             ng-model=\"question.answer\"\n" +
    "             ng-change=\"question.removeError();question.options.onChange(question);question.setAnswer(question.answer);\"\n" +
    "             ng-class=\"{'fsm-invalid': question.hasError(), 'fsm-valid': !question.hasError()}\"\n" +
    "             maxlength=\"{{question.restrictions.getMax()}}\"\n" +
    "                  />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/formerror.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/inputcurrency.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/inputcurrency.tpl.html",
    "<div class=\"form-label\">\n" +
    "    <label for=\"{{question.id}}\">{{question.text.root+'.QUESTION' | translate}}<span ng-show=\"question.isRequired()\"\n" +
    "                                                                                     class=\"required\"></span></label>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div ng-include=\"'templates/tooltip.tpl.html'\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div class=\"form-row form-row--gap xs--two-thirds sm--two-thirds lg--one-half\">\n" +
    "                <input type=\"tel\"\n" +
    "                       id=\"{{question.id}}\"\n" +
    "                       name=\"{{question.id}}\"\n" +
    "                       placeholder=\"{{question.options.getPlaceholder()}}\"\n" +
    "                       input-touched\n" +
    "                       class=\"input-text input-group__input\"\n" +
    "                       ng-model=\"question.answer\"\n" +
    "                       numbers\n" +
    "                       question=\"question\"\n" +
    "                       ng-class=\"{'fsm-invalid': question.hasError(), 'fsm-valid': !question.hasError()}\"\n" +
    "                       ng-change=\"question.removeError();question.onChange(question);question.setAnswer(question.answer);\"\n" +
    "                       maxlength=\"{{question.restrictions.getMax()}}\"\n" +
    "                />\n" +
    "            <span class=\"input-inlinetext\">{{'GENERAL.EXTRAS.CURRENCY_SWEDISH' | translate}}</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/formerror.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/inputidentification.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/inputidentification.tpl.html",
    "<div class=\"form-label\">\n" +
    "    <label for=\"{{question.id}}\"><span translate translate-default=\" \" translate-values=\"question.text.getTranslateValues()\">{{question.text.root+'.QUESTION'}}</span><span ng-show=\"question.isRequired()\" class=\"required\"></span></label>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div ng-include=\"'templates/tooltip.tpl.html'\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div class=\"form-row form-row--gap\">\n" +
    "            <input type=\"text\"\n" +
    "                   id=\"{{question.id}}\"\n" +
    "                   name=\"{{question.id}}\"\n" +
    "                   placeholder=\"{{question.options.getPlaceholder()}}\"\n" +
    "                   input-touched\n" +
    "                   class=\"input-text\"\n" +
    "                   ng-model=\"question.answer\"\n" +
    "                   ng-blur=\"question.removeError();question.options.onChange(question);question.setAnswer(question.answer);\"\n" +
    "                   ng-change=\"question.removeError()\"\n" +
    "                   ng-class=\"{'fsm-invalid': question.hasError(), 'fsm-valid': !question.hasError()}\"\n" +
    "                   maxlength=\"{{question.restrictions.getMax()}}\"\n" +
    "            />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/formerror.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/inputtel.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/inputtel.tpl.html",
    "<div class=\"form-label\" ng-if=\"!question.text.hide\" >\n" +
    "    <label for=\"{{question.id}}\"><span translate translate-default=\" \" translate-values=\"question.text.getTranslateValues()\">{{question.text.root+'.QUESTION'}}</span><span ng-show=\"question.isRequired()\" class=\"required\"></span></label>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div ng-include=\"'templates/tooltip.tpl.html'\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div class=\"form-row form-row--gap\">\n" +
    "            <input type=\"tel\"\n" +
    "                   id=\"{{question.id}}\"\n" +
    "                   name=\"{{question.id}}\"\n" +
    "                   placeholder=\"{{question.options.getPlaceholder()}}\"\n" +
    "                   input-touched\n" +
    "                   class=\"input-text\"\n" +
    "                   ng-model=\"question.answer\"\n" +
    "                   ng-change=\"question.removeError();question.options.onChange(question);question.setAnswer(question.answer);\"\n" +
    "                   ng-class=\"{'fsm-invalid': question.hasError(), 'fsm-valid': !question.hasError()}\"\n" +
    "                   maxlength=\"{{question.restrictions.getMax()}}\"\n" +
    "            />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/formerror.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/label.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/label.tpl.html",
    "<div class=\"form-label\">\n" +
    "    <label for=\"{{question.options.labelFor}}\"><span translate translate-default=\" \" translate-values=\"question.text.getTranslateValues()\">{{question.text.root+'.QUESTION'}}</span><span ng-show=\"question.isRequired()\" class=\"required\"></span></label>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/location.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/location.tpl.html",
    "<div>{{question.text.root+'.QUESTION' | translate}}</div>\n" +
    "<input ng-model=\"question.model[question.id]\"\n" +
    "       ng-change=\"question.removeError();question.saveAnswer();\"\n" +
    "       ng-class=\"{'fsm-invalid': question.hasError(), 'fsm-valid': !question.hasError()}\">\n" +
    "[KARTA]");
}]);

angular.module("templates/phone.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/phone.tpl.html",
    "<div class=\"form-label\">\n" +
    "    <label for=\"{{question.id}}\">{{question.text.root+'.QUESTION' | translate}}<span ng-show=\"question.isRequired()\" class=\"required\"></span></label>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "       <div class=\"form-row form-row--gap\">\n" +
    "          <div class=\"input-group\">\n" +
    "              <div class=\"input-group__addon\">\n" +
    "\n" +
    "                  <div class=\"addon-select\">\n" +
    "                    {{ question.answer.countryCode.phoneCode }} <i class=\"icon icon-arrow-down\" aria-hidden=\"true\"></i>\n" +
    "                      <select ng-model=\"question.answer.countryCode\"\n" +
    "                              id=\"{{question.id}}CountryCode\"\n" +
    "                              name=\"{{question.id}}CountryCode\"\n" +
    "                              ng-change=\"question.removeError(); addZeroToPhoneNumber();question.setAnswer(question.answer);\"\n" +
    "                              ng-options=\"option.value for option in question.options.getValues() track by option.id\"\n" +
    "                              >\n" +
    "                      </select>\n" +
    "                  </div>\n" +
    "              </div>\n" +
    "              <input\n" +
    "                      type=\"tel\"\n" +
    "                      class=\"input-text input-group__input\"\n" +
    "                 id=\"{{question.id}}PhoneNumber\"\n" +
    "                 name=\"{{question.id}}PhoneNumber\"\n" +
    "                 input-touched\n" +
    "                 ng-model=\"question.answer.phoneNumber\"\n" +
    "                 ng-change=\"question.removeError(); formatPhoneNumber();question.setAnswer(question.answer);\"\n" +
    "                  />\n" +
    "          </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/formerror.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/select.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/select.tpl.html",
    "<div class=\"form-label\" ng-if=\"!question.text.hide\">\n" +
    "    <label for=\"{{question.id}}\">\n" +
    "        <span translate translate-default=\" \" translate-values=\"question.text.getTranslateValues()\">{{question.text.root+'.QUESTION'}}</span>\n" +
    "        <span ng-show=\"question.isRequired()\" class=\"required\"></span>\n" +
    "    </label>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div ng-include=\"'templates/tooltip.tpl.html'\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div class=\"form-row form-row--gap\">\n" +
    "            <div class=\"custom-select custom-select--full-width\">\n" +
    "                <select id=\"{{question.id}}\"\n" +
    "                        name=\"{{question.id}}\"\n" +
    "                        class=\"form-control\"\n" +
    "                        ng-model=\"question.answer\"\n" +
    "                        ng-change=\"question.removeError();question.options.onChange(question); question.setAnswer(question.answer);\"\n" +
    "                        ng-class=\"{'fsm-invalid': question.hasError(), 'fsm-valid': !question.hasError()}\"\n" +
    "                        ng-options=\"option.value as option.label | translate for option in question.options.getValues()\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/formerror.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/text.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/text.tpl.html",
    "<div class=\"form-label\" ng-if=\"!question.text.hide\" >\n" +
    "    <label for=\"{{question.id}}\"><span translate translate-default=\" \" translate-values=\"question.text.getTranslateValues()\">{{question.text.root+'.QUESTION'}}</span><span ng-show=\"question.isRequired()\" class=\"required\"></span></label>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/tooltip.tpl.html'\"></div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "\n" +
    "        <div class=\"form-row form-row--gap\">\n" +
    "            <textarea class=\"input-textarea\"\n" +
    "                      ng-trim=\"false\"\n" +
    "                      maxlength=\"{{question.restrictions.getMax()}}\"\n" +
    "                      id=\"{{question.id}}\"\n" +
    "                      name=\"{{question.id}}\"\n" +
    "                      ng-model=\"question.answer\"\n" +
    "                      placeholder=\"{{question.options.getPlaceholder()}}\"\n" +
    "                      ng-change=\"question.removeError();question.onChange(question);question.setAnswer(question.answer);\"\n" +
    "                      ng-class=\"{'fsm-invalid':question.hasError(), 'fsm-valid': !question.hasError()}\"\n" +
    "                      ></textarea>\n" +
    "        </div>\n" +
    "        <div class=\"form-charcount\" ng-cloak>{{question.answer ? question.answer.length : 0}} {{'GENERAL.EXTRAS.OF' |\n" +
    "            translate}} {{question.restrictions.getMax()}}\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/formerror.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/tooltip.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/tooltip.tpl.html",
    "<p ng-if=\"hasText(question.text.root+'.INFO')\" class=\"form-note\" translate translate-default=\" \" translate-values=\"question.text.getTranslateValues()\">{{question.text.root+'.INFO'}}</p>");
}]);

angular.module("templates/upload.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/upload.tpl.html",
    "<div class=\"form-label\">\n" +
    "    <label for=\"{{question.id}}\"\n" +
    "        ng-class=\"{'mandatory' : question.isRequired()}\" translate translate-values=\"question.text.getTranslateValues()\">{{question.text.root+'.QUESTION'}}\n" +
    "    </label>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div ng-include=\"'templates/tooltip.tpl.html'\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <fsm-file-uploader id=\"{{question.id}}\" group=\"question.id\" max=\"question.restrictions.getMax()\" button-text=\"{{question.options.getValues()[0].label | translate}}\"></fsm-file-uploader>\n" +
    "    </div>\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/formerror.tpl.html'\"></div>\n" +
    "</div>");
}]);
