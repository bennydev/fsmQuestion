'use strict';
angular.module('services').factory('QuestionService', ['ValidationService', 'localStorageService', 'ErrorAdapter', '$filter', 'ClaimService',
    function (ValidationService, localStorageService, ErrorAdapter, $filter, ClaimService) {
    var createdQuestions = [];
    function Question(id, type, textRoot, model, options, required, requiredFn, requiredValidator, minLength, maxLength, minDate, maxDate, placeholder, validator, showFn, relatedQuestionIds, onChange, defaultAnswer) {
        var question = this;
        question.id = id;
        question.type = type;
        question.textRoot = textRoot;
        question.model = model;
        question.options = options;
        question.required = required;
        question.requiredFn = requiredFn instanceof Function ? requiredFn : undefined;
        question.requiredValidator = requiredValidator;
        question.minLength = minLength;
        question.maxLength = maxLength;
        question.minDate = minDate;
        question.maxDate = maxDate;
        question.placeholder = placeholder;
        question.validator = validator;
        question.showFn = showFn instanceof Function ? showFn : undefined;
        question.relatedQuestionIds = relatedQuestionIds;
        question.onChange = onChange;
        question.defaultAnswer = defaultAnswer ? defaultAnswer : '';
        question.validate = function () {
            ValidationService.validate(question);
        };
        question.isRequired = function () {
            if (question.required) {
                return question.required;
            } else if (question.requiredFn) {
                return question.requiredFn();
            }
            return false;
        };
        question.isVisible = function () {
            if (question.showFn) {
                return question.showFn();
            }
            return true;
        };
        question.isAnswered = function () {
            return (question.type === getTypes().date && question.model[question.id].dateString) || (question.type !== getTypes().date && question.model[question.id] !== null && question.model[question.id] !== undefined && question.model[question.id] !== '');
        };
        question.setAnswer = function (answer) {
            if(question.type === getTypes().date) {
                question.model[question.id].dateString = answer;
                question.model[question.id].updateDate();
            } else {
                question.model[question.id] = answer;
            }
        };
        question.getAnswer = function () {
            return question.model[question.id];
        };
        question.loadAnswer = function(){
            var storageModel = ClaimService.loadQuestionsModel();
            if(question.type === getTypes().date) {
                question.model[question.id].dateString = storageModel[question.id];
                question.model[question.id].updateDate();
            } else {
                question.model[question.id] = storageModel[question.id] || question.defaultAnswer;
            }
            if(question.onChange){question.onChange(question);}
        };
        question.saveAnswer = function(){
            var storageModel = ClaimService.loadQuestionsModel();
            if(question.type === getTypes().date) {
                storageModel[question.id] = question.model[question.id].dateString;
            } else {
                storageModel[question.id] = question.model[question.id];
            }
            ClaimService.saveQuestionsModel(storageModel);
        };
        question.removeErrors = function () {
            ErrorAdapter.removeErrorsForQuestion(question);
        };
        question.hasErrors = function () {
            return ErrorAdapter.hasErrorForQuestion(question);
        };
        question.getErrors = function () {
            return ErrorAdapter.getErrorsForQuestion(question);
        };
        question.hasText = function (key) {
            return $filter('fsmTranslate')(question.textRoot + '.' + key) !== '';
        };

        if (question.getAnswer() === undefined) {
            question.setAnswer(question.defaultAnswer);
        }
    }

    function QuestionBuilder() {
        var obj = this;

        function initQuestionBuilder() {
            obj.id = set('id', obj);
            obj.type = set('type', obj);
            obj.textRoot = set('textRoot', obj);
            obj.model = set('model', obj);
            obj.options = set('options', obj);
            obj.validator = set('validator', obj);
            obj.required = set('required', obj);
            obj.requiredFn = set('requiredFn', obj);
            obj.requiredValidator = set('requiredValidator', obj);
            obj.minLength = set('minLength', obj);
            obj.maxLength = set('maxLength', obj);
            obj.minDate = set('minDate', obj);
            obj.maxDate = set('maxDate', obj);
            obj.placeholder = set('placeholder', obj);
            obj.showFn = set('showFn', obj);
            obj.relatedQuestionIds = set('relatedQuestionIds', obj);
            obj.onChange = set('onChange', obj);
            obj.defaultAnswer = set('defaultAnswer', obj);
            obj.createQuestion = createQuestion;
            obj.createDateModel = createDateModel;
        }

        function set(name, obj) {
            function xSet(value) {
                obj[name] = value;
                return obj;
            }

            xSet.isSetter = true;
            return xSet;
        }

        function value(data) {
            if (!(data instanceof Function)) {
                return data;
            }
        }

        function fn(data) {
            if (data instanceof Function && !data.isSetter) {
                return data;
            }
        }

        function createQuestion() {
            var question = new Question(
                value(obj.id),
                value(obj.type),
                value(obj.textRoot),
                value(obj.model),
                value(obj.options),
                value(obj.required),
                fn(obj.requiredFn),
                value(obj.requiredValidator),
                value(obj.minLength),
                value(obj.maxLength),
                value(obj.minDate),
                value(obj.maxDate),
                value(obj.placeholder),
                value(obj.validator),
                fn(obj.showFn),
                value(obj.relatedQuestionIds),
                fn(obj.onChange),
                value(obj.defaultAnswer)
            );
            initQuestionBuilder();
            registerCreatedQuestion(question);
            return question;
        }

        function createDateModel() {
            var dateModel =
            {
                dateString: undefined, date: undefined,
                updateDateString: function () {
                    if (dateModel.date) {
                        var transFormedDate =  transformDate(dateModel.date);
                        if (transFormedDate !== dateModel.dateString) {
                            dateModel.dateString = transFormedDate;
                        }
                    }
                },
                updateDate: function () {
                    if (dateModel.dateString) {
                        var newDate = createDateIfValid(dateModel.dateString);
                        dateModel.date = newDate;
                        this.updateDateString();
                    } else {
                        dateModel.date = undefined;
                    }
                }
            };

            return dateModel;
        }

        initQuestionBuilder();
    }

    function registerCreatedQuestion(question){
        createdQuestions.push(question);
    }

    function clearAllAnswers(exclude){
        exclude = exclude || [];
        createdQuestions.forEach(function(question){
            if(exclude.indexOf(question.id) < 0) {
                question.setAnswer(question.defaultAnswer);
                question.saveAnswer();
                if(question.onChange){
                    question.onChange(question);
                }
            }
        });
    }

    function QuestionServiceAPI(questions) {
        this.questions = questions;
        this.getQuestion = getQuestion;
        this.validate = validate;
        function getQuestion(id) {
            var question;
            question = questions.reduce(
                function (previous, current) {
                    return current.id === id ? current : previous;
                },
                question);
            return question;
        }

        function validate() {
            questions.forEach(function (question) {
                question.validate();
            });
        }
    }

    function getQuestionServiceAPI(questions) {
        return new QuestionServiceAPI(questions);
    }

    function getQuestionBuilder() {
        return new QuestionBuilder();
    }

    function getOptions() {
        function createOption(value) {
            return {label: 'VIEW.OPTIONS.' + value, value: value};
        }

        return {
            yes: createOption('YES'),
            no: createOption('NO'),
            dontknow: createOption('DONT_KNOW'),
            selectReceipt: createOption('SELECT_RECEIPT'),
            selectImage: createOption('SELECT_IMAGE'),
            range_lt_6_months: createOption('RANGE_LT_6_MONTHS'),
            range_6_months_to_1_year: createOption('RANGE_6_MONTHS_TO_1_YEAR'),
            range_1_to_2_years: createOption('RANGE_1_TO_2_YEARS'),
            range_2_to_3_years: createOption('RANGE_2_TO_3_YEARS'),
            range_gt_3_years: createOption('RANGE_GT_3_YEARS'),
            range_3_to_4_years: createOption('RANGE_3_TO_4_YEARS'),
            range_4_to_5_years: createOption('RANGE_4_TO_5_YEARS'),
            range_5_to_6_years: createOption('RANGE_5_TO_6_YEARS'),
            range_gt_6_years: createOption('RANGE_GT_6_YEARS'),
            dateunknown: createOption('DATE_UNKNOWN'),
            select: createOption('SELECT'),
            select_other: createOption('SELECT_OTHER'),
            not_specified: createOption('NOT_SPECIFIED'),
            robbery: createOption('ROBBERY'),
            burglary: createOption('BURGLARY'),
            pursesnatching: createOption('PURSE_SNATCHING'),
            pickpocketing: createOption('PICKPOCKETING'),
            othertheft: createOption('OTHER_THEFT'),
            lost: createOption('LOST'),
            forgot: createOption('FORGOT'),
            otherLoss: createOption('OTHER_LOSS'),
            otherLocation: createOption('OTHER_LOCATION'),
            atHome: createOption('AT_HOME'),
            inNordic: createOption('NORDIC'),
            theft: createOption('THEFT'),
            loss: createOption('LOSS'),
            damage: createOption('DAMAGE')
        };
    }

    function getOptionByValue(value) {
        var options = [].valuesToArray(getOptions());

        return options.reduce(function (previous, current) {
            return current.value === value ? current : previous;
        }, undefined);
    }

    function getTypes() {
        return {
            buttongroup: 'BUTTONGROUP',
            buttongroupBig: 'BUTTONGROUPBIG',
            input: 'INPUT',
            inputCurrency: 'INPUTCURRENCY',
            upload: 'UPLOAD',
            date: 'DATE',
            dateTime: 'DATETIME',
            select: 'SELECT',
            checkbox: 'CHECKBOX',
            location: 'LOCATION',
            text: 'TEXT',
            phone: 'PHONE'
        };
    }

    function isPersonId(value) {
        value = value.toString().removeChars(['-', '+']);
        return value.isNumeric() && (value.isLength(10) || value.isLength(12));
    }

    function isCustomerNo(value) {
        value = value.toString().removeChars(['-']);
        return value.startsWithNumberOfChars(3) && value.isLength(9);
    }

    function addCenturyToPersonId(personId) {
        personId = personId.toString();
        if (personId.removeChars(['-', '+']).isLength(10)) {
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

    function addSeparatorToPersonId(personId) {
        var pnr = addCenturyToPersonId(personId).toString();
        if (personId.indexOf('-') < 0 || personId.indexOf('+') < 0) {
            var today = new Date();
            var personYear = parseInt(pnr.substr(0, 4));
            var personMonth = parseInt(pnr.substr(4, 2)) - 1;
            var personDay = parseInt(pnr.substr(6, 2));
            var personDate = new Date(Date.UTC(personYear, personMonth, personDay));
            var separator = '-';
            if (today.getTime() - personDate.getTime() >= 1000 * 60 * 60 * 24 * 365 * 100) {
                separator = '+';
            }
            return personId.substr(0, personId.length - 4) + separator + personId.substr(personId.length - 4);
        }
        return personId;
    }

    function createDateIfValid(value) {
        var d, newDate, year, month, day;
        var data = value.replace(/\.|-|,| /g, "");
        if (data.length === 6 && data.indexOf('20') !== 0) {
            d = '20' + data;
            year = parseInt(d.substr(0, 4));
            month = parseInt(d.substr(4, 2)) - 1;
            day = parseInt(d.substr(6, 2));
            if (isValidYearMonthDayCombination(year, month, day)) {
                newDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
            }
        }
        //Om datum är 8 tecken och börjar på 20
        else if (data.length === 8 && data.indexOf('20') === 0) {
            d = data;
            year = parseInt(d.substr(0, 4));
            month = parseInt(d.substr(4, 2)) - 1;
            day = parseInt(d.substr(6, 2));
            if (isValidYearMonthDayCombination(year, month, day)) {
                newDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
            }
        }
        return newDate;
    }

    // Creating dates with month and day values larger than the "usual" creates dates in the future.
    function isValidYearMonthDayCombination(year, month, day) {
        if (month > 11) {
            return false;
        }
        if (day > 31) {
            return false;
        }

        if (month === 1 && day === 29) {
            return isLeapYear(year);
        }
        if (month === 1 && day > 28) {
            return false;
        }
        if ((month === 3 || month === 5 || month === 8 || month === 10) && day > 30) {
            return false;
        }

        return !isNaN(parseInt(year)) && !isNaN(parseInt(month)) && !isNaN(parseInt(day));
    }

    function isLeapYear(year) {
        return new Date(Date.UTC(year, 1, 29, 0, 0, 0, 0)).getMonth() === 1;
    }

    function transformDate(date) {
        if (date) {
            var offsetHours = date.getTimezoneOffset() / 60;
            if (offsetHours < 0) {
                return new Date(date.getTime() + Math.abs(offsetHours) * 60 * 60 * 1000).toISOString().substr(0, 10);
            } else {
                return new Date(date.getTime() - Math.abs(offsetHours) * 60 * 60 * 1000).toISOString().substr(0, 10);
            }
        }
    }

    var utils = {
        isPersonId: isPersonId,
        isCustomerNo: isCustomerNo,
        addCenturyToPersonId: addCenturyToPersonId,
        addSeparatorToPersonId: addSeparatorToPersonId,
        transformDate: transformDate
    };
    var validatorHelpers = {
        isPositiveNumeric: function isPositiveNumeric(value) {
            return /^([1-9])[0-9]*$/.test(value);
        },
        isNonNegativeNumeric: function isNonNegativeNumeric(value) {
            return /^([0-9])[0-9]*$/.test(value);
        },
        getTodayMaxMilliseconds: function getTodayMaxMilliseconds() {
            var date = new Date();
            date.setUTCHours(23);
            date.setUTCMinutes(59);
            date.setUTCSeconds(59);
            return date.setUTCMilliseconds(999);
        },
        dateStringAsMilliseconds: function dateStringAsMilliseconds(value) {
            // Parses a string representation of a date and returns the number of milliseconds since 1 January, 1970, 00:00:00, UTC.
            return Date.parse(value);
            //var year = parseInt(value.substr(0, 4));
            //var month = parseInt(value.substr(5, 2)) - 1;
            //var day = parseInt(value.substr(8, 2));
            //var date = new Date(Date.UTC(year, month, day));
            //return date.getTime();
        }
    };
    var validators = {
        positiveNumeric: {
            validate: function (question) {
                var result = {valid: true, cause: 'low'};
                var value = question.getAnswer();
                if (value) {
                    result.valid = validatorHelpers.isPositiveNumeric(value);
                    result.message = question.textRoot + '.ERRORS.FORMAT';
                }
                return result;
            }
        },
        nonNegativeNumeric: {
            validate: function (question) {
                var result = {valid: true, cause: 'low'};
                var value = question.getAnswer();
                if (value) {
                    result.valid = validatorHelpers.isNonNegativeNumeric(value);
                    result.message = question.textRoot + '.ERRORS.FORMAT';
                }
                return result;
            }
        },
        dateNotFutureDate: {
            validate: function (question) {
                var result = {valid: true, cause: 'futureDate'};
                var value = question.getAnswer().date.toISOString();
                if (value) {
                    var today = validatorHelpers.getTodayMaxMilliseconds();
                    var valueAsMillis = validatorHelpers.dateStringAsMilliseconds(value);
                    result.message = question.textRoot + '.ERRORS.DATE_NOT_FUTURE_DATE';
                    result.valid = valueAsMillis <= today;
                }
                return result;
            }
        },
        dateValid: {
            validate: function (question) {
                var result = {valid: true, cause: 'validDate', message: question.textRoot + '.ERRORS.FORMAT'};
                var value = question.getAnswer();
                if(value.dateString) {
                    result.valid = /^\d\d\d\d-\d\d-\d\d$/.test(value.dateString);
                    if(result.valid){
                        result.valid = !!createDateIfValid(value.dateString);
                        result.message = question.textRoot + '.ERRORS.INVALID';
                    }
                    if(result.valid){
                        result = validators.dateNotFutureDate.validate(question);
                    }
                }
                return result;
            }
        },
        requiredDateValidator: {
            validate: function(question) {
                var value = question.model[question.id].dateString;
                var result = {};
                result.valid = value !== undefined && value !== '' && value !== null && value !== 'SELECT';
                result.cause = 'required';
                result.message = question.textRoot +'.ERRORS.REQUIRED';
                return result;

            }
        },
        selectOptionNotSelected: {
            validate: function (question) {
                var result = {valid: true, cause: 'required'};
                var value = question.getAnswer();
                result.valid = value !== getOptions().select.value;
                return result;
            }
        }
    };


    return {
        getQuestionServiceAPI: getQuestionServiceAPI,
        getQuestionBuilder: getQuestionBuilder,
        getOptions: getOptions,
        getTypes: getTypes,
        getOptionByValue: getOptionByValue,
        utils: utils,
        validators: validators,
        clearAllAnswers: clearAllAnswers
    };
}]);
