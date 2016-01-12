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
            value = value.toString().length >= 8 ? value.toString() : '19' + value;
            var datePartials = getDatePartials(value);
            return new Date(Date.UTC(datePartials.year, datePartials.month -1, datePartials.day)).toISOString().replace(new RegExp('-', 'gi'), '').indexOf(value.substr(0, 6)) >= 0;
        }
    }

    function getDatePartials(value){
        if(value) {
            value = value.replace(new RegExp('[-.]', 'gi'), '');
            if(value.toString().length === 8) {
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