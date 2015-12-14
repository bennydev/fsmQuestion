"use strict";
angular.module('fsmQuestion')
    .factory('ErrorReporter', ErrorReporter);
function ErrorReporter(){
    var errors = {};
    var messages = [];
    var service = {
        addError: addError,
        getErrors: getErrors,
        hasErrorFor: hasErrorFor,
        clearErrors: clearErrors
    };
    return service;

    function addError(id, message){
        errors[id] = message;
        messages.push(message)
    }

    function getErrors(){
        return errors;
    }

    function hasErrorFor(id){
        return !! errors[id];
    }

    function clearErrors(){
        errors = {};
        messages = [];
    }
}

