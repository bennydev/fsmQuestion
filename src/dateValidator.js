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