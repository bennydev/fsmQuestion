"use strict";
describe('QuestionBuilder tests.', function () {
    var QuestionBuilder, QuestionTypes, question;
    beforeEach(module('fsmQuestion'));

    beforeEach(inject(function ($injector) {
        QuestionBuilder = $injector.get('QuestionService').getQuestionBuilder();
        QuestionTypes = $injector.get('QuestionTypes');
    }));
    it('Should have a QuestionBuilder', function() {
        expect(QuestionBuilder).toBeTruthy();
    });
    it('Should have a QuestionTypes', function() {
        expect(QuestionTypes).toBeTruthy();
    });

    it('Should create buttongroup question.', function() {
        question = createButtonGroupQuestion();
        expect(question).toBeTruthy();
        expect(question.id).toBe('test1');
        expect(question.isRequired()).toBeTruthy();
        expect(question.type).toBe('BUTTONGROUP');
    });
    it('Should be able to set value on answer.', function() {
        expect(question).toBeTruthy();
        question.setAnswer('YES');
        expect(question.answer).toBe('YES');
    });


    function createButtonGroupQuestion() {
        return QuestionBuilder
            .id('test1')
            .type(QuestionTypes.buttongroup)
            .text({ root: 'TEST_BUTTON_GROUP' })
            .values([{label: 'OPTIONS.YES', value: 'YES'}, {label: 'OPTIONS.NO', value: 'NO'}])
            .required(true)
            .createQuestion();
    }
    function createInputQuestion() {
        return QuestionBuilder
            .id('test1')
            .type(QuestionTypes.input)
            .text({ root: 'TEST_INPUT' })
            .required(true)
            .createQuestion();
    }
});