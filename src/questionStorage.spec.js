"use strict";
describe('QuestiionStorage tests.', function() {
    var QuestionBuilder, QuestionStorage, QuestionTypes;
    beforeEach(module('fsmQuestion'));

    beforeEach(inject(function ($injector) {
        QuestionBuilder = $injector.get('QuestionService').getQuestionBuilder();
        QuestionTypes = $injector.get('QuestionTypes');
        QuestionStorage = $injector.get('QuestionStorage');
    }));

    it('Should have a QuestionBuilder.', function() {
        expect(QuestionBuilder).toBeTruthy();
    });
    it('Should have a QuestionTypes.', function() {
        expect(QuestionTypes).toBeTruthy();
    });
    it('Should have a QuestionStorage.', function() {
        expect(QuestionStorage).toBeTruthy();
    });
    it('Should be able to load a question from local storage.', function() {
        var id = 'inputtest';
        var inputText = 'A test that saves this text on local storage';
        var inputQuestion = createInputQuestion(id);
        inputQuestion.answer = inputText;
        inputQuestion.options.onChange(inputQuestion);
        inputQuestion.setAnswer(inputQuestion.answer);
        //inputQuestion.answer = '';
        QuestionStorage.reload();
        expect(inputQuestion.answer).toBe(inputText);
    });

    function createInputQuestion(id) {
        return QuestionBuilder
            .id(id)
            .type(QuestionTypes.input)
            .text({ root: 'TEST_INPUT' })
            .required(true)
            .createQuestion();
    }
});