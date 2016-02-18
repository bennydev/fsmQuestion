"use strict";
describe('Date validator unit tests.', function() {

    var QuestionBuilder, QuestionTypes;
    beforeEach(module('fsmQuestion'));
    beforeEach(inject(function ($injector) {
        QuestionBuilder = $injector.get('QuestionService').getQuestionBuilder();
        QuestionTypes = $injector.get('QuestionTypes');
    }));

    it('Should be able to validate that date is not a leap year.', inject(function(DateValidator) {
        var date = '2015-02-29';
        var question = initQuestionWith(date);
        var result = DateValidator.validate(question);
        expect(result.valid).toBeFalsy();
    }));

    it('Should be able to validate that date is a leap year.', inject(function(DateValidator) {
        var date = '2016-02-29';
        var question = initQuestionWith(date);
        var result = DateValidator.validate(question);
        expect(result.valid).toBeTruthy();
    }));

    it('Should be able to validate that date month is wrong.', inject(function(DateValidator) {
        var date = '2016-00-29';
        var question = initQuestionWith(date);
        var result = DateValidator.validate(question);
        expect(result.valid).toBeFalsy();
    }));

    it('Should be able to validate that date day is wrong.', inject(function(DateValidator) {
        var date = '2016-04-31';
        var question = initQuestionWith(date);
        var result = DateValidator.validate(question);
        expect(result.valid).toBeFalsy();
    }));

    it('Should be able to validate that date is future date.', inject(function(DateValidator) {
        var future = getToday();
        future.setMonth(future.getMonth() + 1);
        var result = DateValidator.isFutureDate(future);
        expect(result).toBeTruthy();
    }));
    it('Should be able to validate that date is past date.', inject(function(DateValidator) {
        var past = getToday();
        past.setMonth(past.getMonth() - 1);
        var result = DateValidator.isPastDate(past);
        expect(result).toBeTruthy();
    }));

    function initQuestionWith(date) {
        var question = createDateQuestion();
        question.answer = date;
        return question;
    }

    function createDateQuestion() {
        return QuestionBuilder.id('test')
            .type(QuestionTypes.date)
            .visible(true)
            .text({ root: 'TEST.TEST'})
            .createQuestion();
    }

    function getToday() {
        var now = new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);
        return now;
    }

    function zeroFill(value) {
        return value.toString().length === 1 ? '0' + value : '' + value;
    }


});