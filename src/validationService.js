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