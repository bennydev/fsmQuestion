'use strict';
angular.module('fsmQuestion').factory('ErrorReporter', ['$log', function($log){
    var errors = {messages: []};

    function addError(error){
        errors[error.id] = error;
        if(error.message) {
            errors.messages.push(error.message);
        } else {
            $log.log('MISSING ERRORMESSAGE: '+error.id+':'+error.cause);
        }
    }

    function clearErrors(){
        Object.keys(errors).forEach(function(key){
            if(key != 'messages') {
                var messageIndex = errors.messages.indexOf(errors[key].message);
                errors.messages.splice(messageIndex, 1);
                delete errors[key];
            }
        });
    }

    function removeError(id){
        var error = errors[id];
        if(error) {
            var index =  errors.messages.indexOf(error.message);
            errors.messages.splice(index, 1);
            delete errors[id];
        }
    }

    function getErrors(id) {
        return errors[id];
    }

    function removeErrors(ids){
        if(ids && ids instanceof Array) {
            ids.forEach(function (id) {
                removeError(id);
            });
        }
    }

    function hasErrors(){
        return errors.messages.length > 0;
    }

    function hasErrorsFor(id) {
        return errors[id];
    }


    return {
        errors: errors,
        addError: addError,
        clearErrors: clearErrors,
        getErrors: getErrors,
        removeError: removeError,
        removeErrors: removeErrors,
        hasErrors: hasErrors,
        hasErrorsFor: hasErrorsFor
    };
}]);
