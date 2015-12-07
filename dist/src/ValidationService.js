'use strict';
angular.module('services').factory('ValidationService', ['ErrorReporter', function(ErrorReporter){

    var validators = {};
    validators.getRequiredValidator = function() {
        return {
            validate: function (question) {
                var value = question.model[question.id];
                var result = {};
                result.valid = value !== undefined && value !== '' && value !== null && value !== 'SELECT';
                result.cause = 'required';
                result.message = question.textRoot +'.ERRORS.REQUIRED';
                return result;
            }
        };
    };
    validators.getMinLengthValidator = function(minLength){
        return {
            validate: function (question) {
                var value = question.model[question.id];
                var result = {};
                result.valid = ('' + value).length >= minLength;
                result.cause = 'minlength';
                result.message = question.textRoot +'.ERRORS.MIN_LENGTH';
                return result;
            }
        };
    };
    validators.getMaxLengthValidator = function(maxLength){
      return {
          validate: function(question){
              var value = question.model[question.id];
              var result = {};
              result.valid = ('' + value).length <= maxLength;
              result.cause = 'maxlength';
              result.message = question.textRoot +'.ERRORS.MAX_LENGTH';
              return result;
          }
      };
    };

    function validateWithValidator(validator, question) {
        var result = validator.validate(question);
        if(!result.valid){
            result.id = question.id;
            ErrorReporter.addError(result);
        }
    }

    function validate(question){
        if(question.isVisible()) {
            if (question.isRequired()) {
                if (question.requiredValidator) {
                    validateWithValidator(question.requiredValidator, question);
                } else {
                    validateWithValidator(validators.getRequiredValidator(), question);
                }
            }
            if (question.minLength && !ErrorReporter.hasErrorsFor(question.id)) {
                validateWithValidator(validators.getMinLengthValidator(question.minLength), question);
            }
            if (question.maxLength && !ErrorReporter.hasErrorsFor(question.id)) {
                validateWithValidator(validators.getMaxLengthValidator(question.maxLength), question);
            }
            if (question.validator && !ErrorReporter.hasErrorsFor(question.id)) {
                validateWithValidator(question.validator, question);
            }
        }
    }

    return {
        validate: validate
    };
}]);
