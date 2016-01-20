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
                result.valid = answer != undefined && answer !== '' && answer !== null && answer !== 'SELECT';
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
                var result = {};
                result.valid = typeof answer === 'number' && !isNaN(answer) ? true : getNumericAnswer(answer) !== undefined;
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

    function getIdentificationValidator(){
        return {
            validate: function(question){
                var answer = question.answer;
                if(QuestionUtils.isPersonId(answer)){
                    return {
                        valid: validatePersonId(answer),
                        message: question.text.root + '.ERRORS.PERSON_ID_INVALID'
                    };
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
            result.valid = result.valid && QuestionUtils.isPastDate(answer);
            result.message = !result.valid && !result.message ? question.text.root + '.ERRORS.FUTURE' : result.message;
            return result;
        }};
    }

    function validatePersonId(value){
        value = QuestionUtils.removeValidPersonIdSeparators(value);
        value = value.length === 12 ? value.substr(2) : value;
        return QuestionUtils.isValidDate(value.substr(0,6)) && hasValidChecksum(value);
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