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
    var id = 'inputtest';
    var inputText = 'A test that saves this text on local storage';
    it('Should be able to store a question to local storage.', function() {
        var inputQuestion = storeQuestion(id, inputText);
    });

    it ('Should be able to read data from laocal storage', function() {
        var inputQuestion = createInputQuestion(id);
        inputQuestion.answer = '';
        QuestionStorage.reload();
        expect(inputQuestion.answer).toBe(inputText);

    });
    var ids = ['inputtest', 'inputtest2', 'inputtest3', 'inputtest4', 'inputtest5' ];

    it ('Should be able to store several questions in local storage.', function() {
        ids.forEach(function(id) {
            var inputQuestion = storeQuestion(id, inputText + '.' + id);
        });
    });

    it('Should be able to load several questions from local storage.', function() {
        var inputQuestions = [];
        ids.forEach(function(id) {
            inputQuestions.push(createInputQuestion(id));
        });
        QuestionStorage.reload();
        inputQuestions.forEach(function(question) {
            expect(question.answer).toBe( inputText + '.' + question.id);
        });
    });

    function storeQuestion(id, input) {
        var inputQuestion = createInputQuestion(id);
        inputQuestion.setAnswer(input);
        return inputQuestion;
    }

    function createInputQuestion(id) {
        return QuestionBuilder
            .id(id)
            .type(QuestionTypes.input)
            .text({ root: 'TEST_INPUT' })
            .required(true)
            .createQuestion();
    }
});