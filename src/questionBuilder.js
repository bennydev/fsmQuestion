"use strict";
angular.module('fsmQuestion')
.value('QuestionBuilder', QuestionBuilder);
function QuestionBuilder(questionStorage, Question, Options, Restrictions, ValidationService, ErrorReporter){
    var builder = this;
    function init(){
        builder.id = set('id', builder);
        builder.type = set('type', builder);
        builder.text = set('text', builder);
        builder.defaultAnswer = set('defaultAnswer', builder);
        builder.values = set('values', builder);
        builder.placeholder = set('placeholder', builder);
        builder.onChange = set('onChange', builder);
        builder.visible = set('visible', builder);
        builder.required = set('required', builder);
        builder.validator = set('validator', builder);
        builder.min = set('min', builder);
        builder.max = set('max', builder);
        builder.numeric = set('numeric', builder);
        builder.createQuestion = function(){
            if(!questionStorage.contains(builder.id)){
                var question = new Question(
                    value(builder.id),
                    value(builder.type),
                    value(builder.text),
                    new Options(value(builder.defaultAnswer, ''), value(builder.visible ,true), value(builder.values, []), value(builder.placeholder, ''), value(builder.onChange)),
                    new Restrictions(value(builder.required, false), value(builder.validator), value(builder.min), value(builder.max), value(builder.numeric, false)),
                    ValidationService,
                    ErrorReporter
                );
                loadAnswer(question);
                questionStorage.addQuestion(question);
                init();
                return question;
            } else {
                var id = builder.id;
                init();
                throw new Error('Duplicate question id: '+id);
            }
        };
    }
    function set(name, builder){
        var setter = function(value){builder[name] = value; return builder;};
        setter.isBuilder = true;
        return setter;
    }

    function value(inputValue, defaultValue){
        if((inputValue && inputValue.isBuilder) || inputValue === undefined || inputValue === null){
            return defaultValue;
        } else {
            return inputValue;
        }
    }

    function loadAnswer(question){
        var answer = questionStorage.loadAnswer(question.id);
        if(answer) {
            question.setAnswer(answer);
            question.options.onChange(question);
        }
    }

    init();
}
