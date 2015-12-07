"use strict";
describe('QuestionService tests', function(){
    var QuestionService;
    beforeEach(function(){
        module('claimsApp');
        inject(function($injector){
            QuestionService = $injector.get('QuestionService');
        });
    });

    it('Dates should be the same as entered', function(){
        var date = new Date(Date.UTC(2015, 6, 15));
        var dateString = QuestionService.utils.transformDate(date);
        expect(dateString).toBe('2015-07-15');
    });

    it('Date with negative timezone offset should be the same as entered', function(){
        var date = new Date('Wed Oct 21 2015 00:00:00 UTC-0200');
        var dateString = QuestionService.utils.transformDate(date);
        expect(dateString).toBe('2015-10-21');
    });

    it('Date with positive timezone offset should be the same as entered', function(){
        var date = new Date('Wed Oct 21 2015 00:00:00 UTC+0200');
        var dateString = QuestionService.utils.transformDate(date);
        expect(dateString).toBe('2015-10-21');
    });
});