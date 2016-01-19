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

        if (dateCandidate.length === 6 && dateCandidate.indexOf('20') !== 0) {
            dateCandidate = '20' + digits;
        }
        if (isNaN(dateCandidate)) {
            return false;
        }
        var year = parseInt(d.substr(0, 4));
        var month = parseInt(d.substr(4, 2)) - 1;
        var day = parseInt(d.substr(6, 2));
        return isValidYearMonthDayCombination(year, month, day);

    }

    function isValidYearMonthDayCombination(year, month, day) {
        if (day === 0) {
            return false;
        }
        if (month > 11) {
            return false;
        }
        if (day > 31) {
            return false;
        }

        if (month === 1 && day > 28) {
            return false;
        }
        if ((month === 3 || month === 5 || month === 8 || month === 10) && day > 30) {
            return false;
        }
        if (month === 1 && day === 29) {
            return isLeapYear(year);
        }
        return true;
    }

    function isLeapYear(year) {
        return new Date(Date.UTC(year, 1, 29, 0, 0, 0, 0)).getMonth() === 1;
    }

    return service;

}]);