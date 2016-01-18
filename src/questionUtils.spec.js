describe('utils-test', function(){
    beforeEach(module('fsmQuestion'));

      it('QuestionUtils.isPersonId', inject(function(QuestionUtils){
            expect(QuestionUtils.isPersonId('8304083911')).toBeTruthy();
            expect(QuestionUtils.isPersonId('83-04-08-3911')).toBeTruthy();
            expect(QuestionUtils.isPersonId('198304083911')).toBeTruthy();
            expect(QuestionUtils.isPersonId('1983-04-08-3911')).toBeTruthy();
            expect(QuestionUtils.isPersonId('1983-04-08-')).toBeFalsy();
            expect(QuestionUtils.isPersonId('1983-04-08-36958')).toBeFalsy();
    }));

     it('QuestionUtils.removeValidPersonIdSeparators', inject(function(QuestionUtils){
        expect(QuestionUtils.removeValidPersonIdSeparators('830408-3911')).toBe('8304083911');
        expect(QuestionUtils.removeValidPersonIdSeparators('830408+3911')).toBe('8304083911');
    }));

    it('QuestionUtils.addCenturyToPersonId', inject(function(QuestionUtils){
        expect(QuestionUtils.addCenturyToPersonId('8304083911')).toBe('198304083911');
        expect(QuestionUtils.addCenturyToPersonId('830408-3911')).toBe('19830408-3911');
        expect(QuestionUtils.addCenturyToPersonId('160408-3911')).toBe('20160408-3911');
        expect(QuestionUtils.addCenturyToPersonId('160408+3911')).toBe('19160408+3911');
    }));

    it('QuestionUtils.isValidDateFormat', inject(function(QuestionUtils){
        expect(QuestionUtils.isValidDateFormat('20150505')).toBeTruthy();
        expect(QuestionUtils.isValidDateFormat('2015.05.05')).toBeTruthy();
        expect(QuestionUtils.isValidDateFormat('2015-05-05')).toBeTruthy();
        expect(QuestionUtils.isValidDateFormat('2015.05-05')).toBeTruthy();
        expect(QuestionUtils.isValidDateFormat('2015a05-05')).toBeFalsy();
        expect(QuestionUtils.isValidDateFormat('15-05-05')).toBeFalsy();
    }));

    it('QuestionUtils.isValidDate', inject(function(QuestionUtils){
        expect(QuestionUtils.isValidDate('20150505')).toBeTruthy();
        expect(QuestionUtils.isValidDate('2015.05.05')).toBeTruthy();
        expect(QuestionUtils.isValidDate('2015-05-05')).toBeTruthy();
        expect(QuestionUtils.isValidDate('2015.05-05')).toBeTruthy();
        expect(QuestionUtils.isValidDate('2015a05-05')).toBeTruthy(); //diff
        expect(QuestionUtils.isValidDate('15-05-05')).toBeTruthy();
        expect(QuestionUtils.isValidDate('15-05-35')).toBeFalsy();
    }));

    it('QuestionUtils.isPastDate', inject(function(QuestionUtils){
        expect(QuestionUtils.isPastDate()).toBeFalsy();
        expect(QuestionUtils.isPastDate('2015-05-05')).toBeTruthy();
        expect(QuestionUtils.isPastDate('2215-05-05')).toBeFalsy();
    }));

     it('QuestionUtils.dateInMillis', inject(function(QuestionUtils){
        expect(QuestionUtils.dateInMillis()).toBeFalsy(); //diff
        expect(QuestionUtils.dateInMillis('2015-05-05')).toBeTruthy();
    }));

    it('QuestionUtils.getDatePartials', inject(function(QuestionUtils){
        expect(QuestionUtils.getDatePartials()).toBeFalsy();
        expect(QuestionUtils.getDatePartials('2015-02-02')).toEqual({year:'2015', month:'02', day:'02'});
    }));

    it('QuestionUtils.createDate', inject(function(QuestionUtils){
        expect(QuestionUtils.createDate()).toBeFalsy(); //diff
        expect(QuestionUtils.createDate('2015-05-05')).toEqual(new Date(Date.UTC(2015, 4, 5)));
    }));
});