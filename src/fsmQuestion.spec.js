//"use strict";
//describe('FsmQuestion tests.', function() {
//
//    var scope, compile, rootScope, QuestionBuilder, QuestionTypes, Hejhej;
//
//    beforeEach(module('fsmQuestion'));
//
//    beforeEach(inject(function($injector, _$rootScope_) {
//        QuestionBuilder = $injector.get('QuestionBuilder');
//        QuestionBuilder = new QuestionBuilder($injector.get('QuestionStorage'), $injector.get('Question'), $injector.get('Options'), $injector.get('Restrictions'), $injector.get('ValidationService'), $injector.get('ErrorReporter'));
//        console.log(QuestionBuilder);
//        QuestionTypes = $injector.get('QuestionTypes');
//    }));
//
//    beforeEach(inject(function(_$compile_, _$rootScope_) {
//        rootScope = _$rootScope_;
//        compile = _$compile_;
//        scope = rootScope.$new();
//    }));
//
//    // inject() is used to inject arguments of all given functions
//
//
//   it('bla', function() {
//        var quest = createPhoneQuestion('testPhone');
//        scope.question = quest;
//
//        var element = compile('<fsm-question question="question"></fsm-question>')(scope);
//       element.templateUrl = undefined;
//       rootScope.$digest();
//       console.log(element);
//       quest.answer.countryCode = '0046';
//        quest.answer.phoneNumber = '123456';
//       console.log(scope);
//        scope.formatPhoneNumber();
//    });
//    function createPhoneQuestion(id){
//        return QuestionBuilder
//            .id(id)
//            .type(QuestionTypes.phone)
//            .max(35)
//            .required(false)
//            .defaultAnswer({phoneNumber: '0', countryCode: '0046'})
//            .values([{phoneCode:"0046",name:"SWEDEN",id:0,code:"SWE"}])
//            .createQuestion();
//    }
//
//});