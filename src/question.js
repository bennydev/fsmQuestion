"use strict";
angular.module('fsmQuestion')
    .value('Question', Question);
function Question(id, type, text, options, restrictions, ValidationService, ErrorReporter){
    var question = this;
    question.id = id;
    question.type = type;
    question.text = text;
    question.options = options;
    question.restrictions = restrictions;
    question.isVisible = options.isVisible;
    question.isRequired = restrictions.isRequired;
    question.validate = function(){ValidationService.validate(question);};
    question.setAnswer = function(value){
        if(value instanceof Date){
            value.setUTCHours(value.getUTCHours() + Math.abs(value.getTimezoneOffset()) / 60);
            question.answer = value.toISOString().substr(0,10);
        } else {
            question.answer = value;
        }
    };
    question.hasError = function(){
        return ErrorReporter.hasErrorFor(question.id);
    };
    question.getError = function(){
      return ErrorReporter.getErrors()[question.id];
    };
    question.removeError = function(){
      ErrorReporter.removeErrorFor(question.id);
    };
    question.answer = question.options.getDefaultAnswer();
}
