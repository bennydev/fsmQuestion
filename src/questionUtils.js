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
            value = addCentury(value);
            var date = createDate(value);
            return getDigits(date.toISOString()).indexOf(value) === 0;
        }
    }

    function createDate(value){
        if(value) {
            value = getDigits(value);
            value = addCentury(value);
            var partials = getDatePartials(value);
            return new Date(Date.UTC(
                parseInt(partials.year),
                parseInt(partials.month) - 1,
                parseInt(partials.day)
            ));
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
        return value.length === 6 ? getCurrentCentury()+value : value;
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
        if(value) {
            var datePartials = getDatePartials(value);
            var date = createDate(datePartials.year+'-'+datePartials.month+'-'+datePartials.day);
            var now = new Date();
            return date.getTime() < now.getTime();
        }
    }

    function dateInMillis(value){
        if(value) {
            var date = createDate(value);
            return date.getTime();
        }
    }

    function startsWithNumberOfChars(value, length){
        value = value.toString();
        return !! value.substr(0, length).match(new RegExp('[a-zA-ZåäöÅÄÖ]','gi'));
    }

    function formatPersonId(question){
        if(!question.centuryAdded) {
            if (isPersonId(question.answer)) {
                question.answer = removeValidPersonIdSeparators(addCenturyToPersonId(question.answer));
                question.answer = question.answer.substr(0,8) +'-'+question.answer.substr(8);
                question.centuryAdded = true;
            }
        } else if(question.answer.toString().length === 0){
            question.centuryAdded = false;
        }
    }
}