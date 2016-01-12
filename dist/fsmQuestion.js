"use strict";
angular.module('fsmQuestion', ['fsmFileUploader'])
    .constant('buttonConfig', {activeClass: 'is-active'});
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
        messages.push(message)
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


'use strict';
angular.module('fsmFileUploader', [])
    .directive('fsmFileUploader', ['FileUploaderService', function(FileUploaderService){
    return {
        restrict: 'E',
        scope: {
            group: '&',
            buttonText: '@',
            max: '='
        },
        templateUrl: 'templates/fileuploader.tpl.html',
        link: function(scope, element, attrs){
            scope.id = 'fileUpload-'+scope.group();
            scope.group = scope.group();
            scope.files = FileUploaderService.createGroup(scope.group).files;
            scope.removeFile = function(index){
              FileUploaderService.removeFileInGroup(scope.group, index);
            };

            var btn = element.find('#selectFileBtn');
            var input;

            btn.bind('click', function(event){
                event.preventDefault();
                event.stopPropagation();
                bindInput();
                input.click();
            });

            function bindInput(){
                if(!input){
                    input = element.find('#'+scope.id);
                    input.bind('change', function(){
                        var file = input.files[0];
                        file.path = input.value;
                        if(!file.name) {
                            file.name = input.value.substr(input.value.lastIndexOf('/'));
                        }
                        input.value = '';
                        addFile(file, scope.group);
                        scope.$apply();
                    });
                    input = input[0];
                }
            }

            function addFile(file, group){
                if(scope.max == 1){
                    scope.removeFile(0);
                }
                FileUploaderService.addFileToGroup(file, group);
            }

        }
    };
}])
    .factory('FileUploaderService', ['$http', '$window', '$q', function($http, $window, $q){
        var groups = {};
        var config = {headers: {'Content-Type': undefined, transformRequest: angular.identity}};

        function addFileToGroup(file, groupName){
            var group = groups[groupName];
            group.files.push(file);
        }

        function uploadFiles(url, reject){
            var promises = [];
            return $q(function(resolve){
                Object.keys(groups).forEach(function(groupname){
                    var group = groups[groupname];
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
                return $q.all(promises).then(function(){return resolve(groups);});
            });
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

        return {
            getFileNames: getFileNames,
            addFileToGroup: addFileToGroup,
            uploadFiles: uploadFiles,
            removeFileInGroup: removeFileInGroup,
            createGroup: createGroup,
            fileUploadSupported: fileUploadSupported
        };
    }]);

"use strict";
angular.module('fsmQuestion')
.directive('fsmQuestion', ['QuestionTypes', '$translate', function(QuestionTypes, $translate){
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
'use strict';
angular.module('fsmQuestion')
.value('Options', Options);
function Options(defaultAnswer, visible, values, placeholder, onChange){
    var options = this;
    options.getDefaultAnswer = setOption(defaultAnswer);
    options.isVisible = setOption(visible);
    options.getValues = setOption(values);
    options.getPlaceholder = setOption(placeholder);
    options.onChange = setOption(onChange);

    function setOption(value){
        if(value instanceof Function){
            return value;
        } else {
            return function(){return value;};
        }
    }
}

"use strict";
angular.module('fsmQuestion')
    .value('Question', Question);
function Question(id, type, text, options, restrictions, ValidationService, ErrorReporter){
    var question = this;
    question.id = id;
    question.type = type;
    question.text = text;
    question.options = options;
    question.restrictions = restrictions;
    question.isVisible = options.isVisible;
    question.isRequired = restrictions.isRequired;
    question.validate = function(){ValidationService.validate(question)};
    question.setAnswer = function(value){
        if(value instanceof Date){
            value.setUTCHours(value.getUTCHours() + Math.abs(value.getTimezoneOffset()) / 60);
            question.answer = value.toISOString().substr(0,10);
        } else {
            question.answer = value;
        }
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

"use strict";
angular.module('fsmQuestion')
.value('QuestionBuilder', QuestionBuilder);
function QuestionBuilder(questionStorage, Question, Options, Restrictions, ValidationService, ErrorReporter){
    var builder = this;
    function init(){
        builder.id = set('id', builder);
        builder.type = set('type', builder);
        builder.text = set('text', builder);
        builder.defaultAnswer = set('defaultAnswer', builder);
        builder.values = set('values', builder);
        builder.placeholder = set('placeholder', builder);
        builder.onChange = set('onChange', builder);
        builder.visible = set('visible', builder);
        builder.required = set('required', builder);
        builder.validator = set('validator', builder);
        builder.min = set('min', builder);
        builder.max = set('max', builder);
        builder.numeric = set('numeric', builder);
        builder.createQuestion = function(){
            if(!questionStorage.contains(builder.id)){
                var question = new Question(
                    value(builder.id),
                    value(builder.type),
                    value(builder.text),
                    new Options(value(builder.defaultAnswer)||'', value(builder.visible)||true, value(builder.values)||[], value(builder.placeholder)||'', value(builder.onChange)),
                    new Restrictions(value(builder.required)||false, value(builder.validator), value(builder.min), value(builder.max), value(builder.numeric)||false),
                    ValidationService,
                    ErrorReporter
                );
                loadAnswer(question);
                questionStorage.addQuestion(question);
                init();
                return question;
            } else {
                var id = builder.id;
                init();
                throw new Error('Duplicate question id: '+id);
            }
        };
    }
    function set(name, builder){
        var setter = function(value){builder[name] = value; return builder;};
        setter.isBuilder = true;
        return setter;
    }

    function value(value){
        if(value && value.isBuilder){
            return undefined;
        } else {
            return value;
        }
    }

    function loadAnswer(question){
        var answer = questionStorage.loadAnswer(question.id);
        if(answer) {
            question.setAnswer(answer);
            question.options.onChange(question);
        }
    }

    init();
}

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

    function getQuestion(id){
        return QuestionStorage.getQuestion(id);
    }
}

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
"use strict";
angular.module('fsmQuestion')
.value('QuestionTypes', new QuestionTypes());
function QuestionTypes(){
    var types = this;
    types.input = 'INPUT';
    types.buttongroup = 'BUTTONGROUP';
    types.buttongroupBig = 'BUTTONGROUPBIG';
    types.upload = 'UPLOAD';
    types.date = 'DATE';
    types.checkbox = 'CHECKBOX';
    types.select = 'SELECT';
    types.text = 'TEXT';
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
            if(question.type === QuestionTypes.input && question.restrictions.getMin() && !ErrorReporter.hasErrorFor(question.id)){
                validateWithValidator(Validators.getMinValidator(question), question);
            }
            if(question.type === QuestionTypes.input && question.restrictions.getMax() && !ErrorReporter.hasErrorFor(question.id)){
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
.factory('Validators', ['QuestionTypes', Validators]);
function Validators(QuestionTypes){
    var service = {
        getRequiredValidator: getRequiredValidator,
        getMinValidator: getMinValidator,
        getMaxValidator: getMaxValidator,
        getNumericValidator: getNumericValidator,
        getIdentificationValidator: getIdentificationValidator,
        getPastDateValidator: getPastDateValidator,
        utils: {
            isPersonId: isPersonId,
            removeValidPersonIdSeparators: removeValidPersonIdSeparators,
            addCenturyToPersonId: addCenturyToPersonId,
            isValidDateFormat: isValidDateFormat,
            isValidDate: isValidDate,
            isPastDate: isPastDate
        }
    };

    return service;

    function getMinDateValidator(){
        return {
            validate: function(question){
                var answer = question.answer;
                var result = {};
                result.valid = dateInMillis(answer) >= question.restrictions.getMin().getTime();
                result.message = question.text.root + '.ERRORS.TOO_EARLY';
                return result;
            }
        };
    }

    function getMaxDateValidator(){
        return {
            validate: function(question){
                var answer = question.answer;
                var result = {};
                result.valid = dateInMillis(answer) <= question.restrictions.getMax().getTime();
                result.message = question.text.root + '.ERRORS.TOO_LATE';
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
                result.valid = answer != undefined && answer !== '' && answer !== null && answer !== 'SELECT';
                result.message = question.text.root + '.ERRORS.REQUIRED';
                return result;
            }
        };
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
                var result = {};
                result.valid = getNumericAnswer(answer) !== undefined;
                result.message = question.text.root + '.ERRORS.INVALID';
                return result;
            }
        }
    }

    function getNumericAnswer(answer){
        var numericAnswer = parseFloat(answer);
        numericAnswer = answer === numericAnswer.toString() ? numericAnswer : undefined;
        return numericAnswer;
    }

    function dateInMillis(isoDateString){
        var date = createDate(isoDateString);
        return date.getTime();
    }

    function createDate(isoDateString){
        var year = parseInt(isoDateString.substr(0,4));
        var month = parseInt(isoDateString.substr(5,2)) -1;
        var day = parseInt(isoDateString.substr(8,2));
        return new Date(Date.UTC(year, month, day));
    }

    function getIdentificationValidator(){
        return {
            validate: function(question){
                var answer = question.answer;
                if(isPersonId(answer)){
                    return {
                        valid: validatePersonId(answer),
                        message: question.text.root + '.ERRORS.PERSON_ID_INVALID'
                    };
                } else if(startsWithNumberOfChars(answer, 1)){
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
            result.valid = true;
            result.valid = result.valid && isValidDateFormat(answer);
            result.message = !result.valid && !result.message ? question.text.root + '.ERRORS.FORMAT' : result.message;
            result.valid = result.valid && isValidDate(answer);
            result.message = !result.valid && !result.message ? question.text.root + '.ERRORS.INVALID' : result.message;
            result.valid = result.valid && isPastDate(answer);
            result.message = !result.valid && !result.message ? question.text.root + '.ERRORS.FUTURE' : result.message;
            return result;
        }};
    }

    function isPersonId(value){
        value = removeValidPersonIdSeparators(value);
        return isNumeric(value) && (value.length === 10 || value.length === 12);
    }

    function validatePersonId(value){
        value = removeValidPersonIdSeparators(value);
        value = value.length === 12 ? value.substr(2) : value;
        return isValidDate(value) && hasValidChecksum(value);
    }

    function isValidDate(value){
        if(value) {
            value = value.replace(new RegExp('[-.]', 'gi'), '');
            value = value.toString().length === 8 ? value.toString() : '19' + value;
            var datePartials = getDatePartials(value);
            return new Date(Date.UTC(datePartials.year, datePartials.month -1, datePartials.day)).toISOString().replace(new RegExp('-', 'gi'), '').indexOf(value.substr(0, 6)) >= 0;
        }
    }

    function getDatePartials(value){
        if(value) {
            value = value.replace(new RegExp('[-.]', 'gi'), '');
            if(value.toString().length === 12) {
                return {
                    year: value.substr(0, 4),
                    month: value.substr(4, 2),
                    day: value.substr(6, 2)
                };
            }
        }
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

    function removeValidPersonIdSeparators(value){
        return value.toString().replace(new RegExp('[\\+-]', 'gi'), '');
    }

    function addCenturyToPersonId(personId) {
        personId = personId.toString();
        if (removeValidPersonIdSeparators(personId).length === 10) {
            var currentYear = new Date().getUTCFullYear();
            var currentCentury = currentYear.toString().substr(0, 2);
            if (personId.indexOf('+') === 6) {
                personId = currentCentury - 1 + personId;
            } else {
                personId = currentYear - parseInt(currentCentury - 1 + personId.substr(0, 2)) >= 100 ? currentCentury + personId : currentCentury - 1 + personId;
            }
        }
        return personId;
    }

    function validateCustomerNumber(value){
        value = removeValidPersonIdSeparators(value);
        return startsWithNumberOfChars(value, 3) && isNumeric(value.substr(3)) && value.length === 9;
    }

    function isNumeric(value, allowExponent){
        value = value.toString();
        if(allowExponent){
            return !isNaN(value) && isFinite(value);
        } else {
            var amountLeadingZeroes = amountLeadingChar(value, '0');
            var parsed = parseFloat(value).toString();
            return value.length === parsed.length + amountLeadingZeroes && !isNaN(parsed) && isFinite(parsed);
        }
    }

    function amountLeadingChar(string, find){
        var amount = 0;
        var found = true;
        string.split('').forEach(function(char){
            if(found){
                found = find === char;
                if(found){
                    amount++;
                }
            }
        });
        return amount;
    }

    function startsWithNumberOfChars(value, length){
        value = value.toString();
        return !! value.substr(0, length).match(new RegExp('[a-zA-ZåäöÅÄÖ]','gi'));
    }

    function isValidDateFormat(value){
        value = value.toString().replace(new RegExp('[-.]', 'gi'), '');
        return value && isNumeric(value) && value.length === 8;
    }

    function isPastDate(value){
        if(value) {
            var datePartials = getDatePartials(value);
            var date = createDate(datePartials.year+'-'+datePartials.month+'-'+datePartials.day);
            var now = new Date();
            return date.getTime() < now.getTime();
        }
    }
}
angular.module('fsmQuestionTemplates', ['templates/buttongroup.tpl.html', 'templates/buttongroupbig.tpl.html', 'templates/checkbox.tpl.html', 'templates/date.tpl.html', 'templates/datetime.tpl.html', 'templates/fileuploader.tpl.html', 'templates/formerror.tpl.html', 'templates/fsmQuestion.tpl.html', 'templates/fsmQuestionGroup.tpl.html', 'templates/input.tpl.html', 'templates/inputcurrency.tpl.html', 'templates/location.tpl.html', 'templates/phone.tpl.html', 'templates/select.tpl.html', 'templates/text.tpl.html', 'templates/tooltip.tpl.html', 'templates/upload.tpl.html']);

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
    "                    ng-change=\"question.removeError();question.options.onChange(question);question.setAnswer(question.answer)\">{{option.label | translate}}</button>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <input type=\"hidden\" ng-required=\"true\" name=\"newPhone\" ng-model=\"step1.newPhone\">\n" +
    "    </div>\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/formerror.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/buttongroupbig.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/buttongroupbig.tpl.html",
    "<div class=\"u-spacing-above u-spacing-under u-inline-block\">\n" +
    "    <span class=\"form-section__accept u-typography-3\" translate translate-default=\" \" translate-values=\"question.text.getTranslateValues()\">{{question.text.root+'.QUESTION'}}</span>\n" +
    "\n" +
    "    <div class=\"toggle-list toggle-list--large\">\n" +
    "        <button type=\"button\" class=\"toggle-list__item\" id=\"{{question.id + $index}}\"\n" +
    "            name=\"{{question.id}}\"\n" +
    "            ng-repeat=\"option in question.options.getValues() track by $index\"\n" +
    "            ng-model=\"question.model[question.id]\"\n" +
    "            btn-radio=\"'{{option.value}}'\"\n" +
    "            ng-class=\"{'fsm-invalid': question.hasError(), 'fsm-valid': !question.hasError()}\"\n" +
    "            ng-change=\"question.removeErrors();question.onChange(question);question.saveAnswer();\">{{option.label | translate}}</button>\n" +
    "    </div>\n" +
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
    "               ng-change=\"question.removeError();question.saveAnswer();\"\n" +
    "               ng-class=\"{'fsm-invalid': question.hasError(), 'fsm-valid': !question.hasError()}\"\n" +
    "               ng-true-value=\"'{{question.options.getValues()[0].value}}'\"\n" +
    "               ng-false-value=\"undefined\">\n" +
    "        <span class=\"custom-checkbox__icon\" translate>{{question.options.getValues()[0].label}}</span>\n" +
    "    </label>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div ng-include=\"'templates/tooltip.tpl.html'\"></div>\n" +
    "");
}]);

angular.module("templates/date.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/date.tpl.html",
    "<div class=\"form-label\">\n" +
    "    <label for=\"{{question.id}}\"><span translate translate-default=\" \" translate-values=\"question.text.getTranslateValues()\">{{question.text.root+'.QUESTION'}}</span><span ng-show=\"question.isRequired()\" class=\"required\"></span></label>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div class=\"form-row form-row--gap\">\n" +
    "\n" +
    "            <input type=\"text\"\n" +
    "                   id=\"{{question.id}}\"\n" +
    "                   name=\"{{question.id}}\"\n" +
    "                   class=\"input-text\"\n" +
    "                   placeholder=\"{{question.options.getPlaceholder()}}\"\n" +
    "                   input-touched\n" +
    "                   ng-model=\"question.answer\"\n" +
    "                   ng-class=\"{'fsm-invalid': question.hasErrors(), 'fsm-valid': !question.hasErrors()}\"\n" +
    "                   ng-change=\"question.removeErrors();\"\n" +
    "                   maxlength=\"{{question.restrictions.getMax().length}}\"\n" +
    "                    />\n" +
    "            <i aria-hidden=\"true\" class=\"icon icon-date\" ng-click=\"question.isOpen =! question.isOpen\"></i>\n" +
    "            <div datepicker-popup=\"yyyy-MM-dd\"\n" +
    "                 min-date=\"question.restrictions.getMin().date\"\n" +
    "                 max-date=\"question.restrictions.getMax().date\"\n" +
    "                 ng-model=\"calendarModel\"\n" +
    "                 ng-class=\"{'fsm-invalid': question.hasErrors(), 'fsm-valid': !question.hasErrors()}\"\n" +
    "                 ng-change=\"question.removeErrors();question.setAnswer(calendarModel);\"\n" +
    "                 is-open=\"question.isOpen\"\n" +
    "                    style=\"margin-top:1px;\">\n" +
    "                 </div>\n" +
    "        </div>\n" +
    "        <div ng-include=\"'templates/tooltip.tpl.html'\"></div>\n" +
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
    "                   ng-class=\"{'fsm-invalid': question.hasErrors(), 'fsm-valid': !question.hasErrors()}\"\n" +
    "                   ng-change=\"question.removeErrors();\"\n" +
    "                    />\n" +
    "        </div>\n" +
    "        <div class=\"clearfix visible-xs\" style=\"padding-bottom: 15px;\"></div>\n" +
    "        <div class=\"col-sm-4\">\n" +
    "            <input type=\"text\"\n" +
    "                   id=\"{{question.id}}Time\"\n" +
    "                   name=\"{{question.id}}Time\"\n" +
    "                   class=\"form-control\"\n" +
    "                   ng-model=\"question.model[question.id].time\"\n" +
    "                   ng-class=\"{'fsm-invalid': question.hasErrors(), 'fsm-valid': !question.hasErrors()}\"\n" +
    "                   ng-change=\"question.removeErrors();\"\n" +
    "                    />\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/fileuploader.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/fileuploader.tpl.html",
    "<div class=\"form-row form-row--gap\">\n" +
    "    <button id=\"selectFileBtn\" type=\"button\" class=\"button button--small\"><i class=\"icon icon-doc\"></i> {{buttonText}}</button>\n" +
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
    "          <input type=\"text\"\n" +
    "             id=\"{{question.id}}\"\n" +
    "             name=\"{{question.id}}\"\n" +
    "             placeholder=\"{{question.options.getPlaceholder()}}\"\n" +
    "             input-touched\n" +
    "             class=\"input-text\"\n" +
    "             ng-model=\"question.answer\"\n" +
    "             ng-change=\"question.removeErrors();question.onChange(question);question.saveAnswer();question.setAnswer(question.answer);\"\n" +
    "             ng-class=\"{'fsm-invalid': question.hasErrors(), 'fsm-valid': !question.hasErrors()}\"\n" +
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
    "    <label for=\"{{question.id}}\">{{question.text.root+'.QUESTION' | translate}}<span ng-show=\"question.isRequired()\" class=\"required\"></span></label>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div ng-include=\"'templates/tooltip.tpl.html'\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div class=\"form-row form-row--gap\">\n" +
    "            <div class=\"input-group\">\n" +
    "                <input type=\"text\"\n" +
    "                   id=\"{{question.id}}\"\n" +
    "                   name=\"{{question.id}}\"\n" +
    "                   placeholder=\"{{question.placeholder}}\"\n" +
    "                   input-touched\n" +
    "                   class=\"input-text input-group__input\"\n" +
    "                   ng-model=\"question.model[question.id]\"\n" +
    "                   ng-class=\"{'fsm-invalid': question.hasErrors(), 'fsm-valid': !question.hasErrors()}\"\n" +
    "                   ng-change=\"question.removeErrors();question.saveAnswer();\"\n" +
    "                   maxlength=\"{{question.maxLength}}\"\n" +
    "                    />\n" +
    "                <div class=\"input-group__addon\">{{'VIEW.EXTRAS.CURRENCY_SWEDISH' | translate}}</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/formerror.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/location.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/location.tpl.html",
    "<div>{{question.text.root+'.QUESTION' | translate}}</div>\n" +
    "<input ng-model=\"question.model[question.id]\"\n" +
    "       ng-change=\"question.removeErrors();question.saveAnswer();\"\n" +
    "       ng-class=\"{'fsm-invalid': question.hasErrors(), 'fsm-valid': !question.hasErrors()}\">\n" +
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
    "                    {{ question.model[question.id].countryCode.phoneCode }} <i class=\"icon icon-arrow-down\" aria-hidden=\"true\"></i>\n" +
    "                      <select ng-model=\"question.model[question.id].countryCode\"\n" +
    "                              id=\"{{question.id}}CountryCode\"\n" +
    "                              name=\"{{question.id}}CountryCode\"\n" +
    "                              ng-change=\"question.removeErrors(); addZeroToPhonenumber(); question.saveAnswer();\"\n" +
    "                              ng-init=\"question.model[question.id].countryCode = question.options[209]; question.model[question.id].phoneNumber = '0';\"\n" +
    "                              ng-options=\"option.name for option in question.options track by option.id\"\n" +
    "\n" +
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
    "                 ng-model=\"question.model[question.id].phoneNumber\"\n" +
    "                 ng-change=\"question.removeErrors(); question.onChange(question); question.saveAnswer();\"\n" +
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
    "<div class=\"form-label\" ng-if=\"question.text.root+'.QUESTION' | translate\">\n" +
    "    <label for=\"{{question.id}}\">{{question.text.root+'.QUESTION' | translate}}<span ng-show=\"question.isRequired()\" class=\"required\"></span></label>\n" +
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
    "                 <select id=\"{{question.id}}\"\n" +
    "                        name=\"{{question.id}}\"\n" +
    "                        class=\"form-control\"\n" +
    "                        ng-model=\"question.answer\"\n" +
    "                        ng-change=\"question.removeError();question.onChange(question); question.saveAnswer();\"\n" +
    "                         ng-class=\"{'fsm-invalid': question.hasError(), 'fsm-valid': !question.hasError()}\"\n" +
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
    "<div class=\"form-label\">\n" +
    "    <label>{{question.text.root+'.QUESTION' | translate}}</label>\n" +
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
    "                      maxlength=\"{{question.maxLength}}\"\n" +
    "                      id=\"{{question.id}}\"\n" +
    "                      name=\"{{question.id}}\"\n" +
    "                      ng-model=\"question.answer\"\n" +
    "                      ng-change=\"question.removeErrors();question.onChange(question);question.saveAnswer();question.setAnswer(question.answer);\"\n" +
    "                      ng-class=\"{'fsm-invalid': errors[question.id], 'fsm-valid': !errors[question.id]}\"></textarea>\n" +
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
    "<p ng-if=\"hasText(question.text.root+'.INFO')\" class=\"form-note\" translate translate-values=\"question.text.translateValues\">{{question.text.root+'.INFO'}}</p>");
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
