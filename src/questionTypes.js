"use strict";
angular.module('fsmQuestion')
.value('QuestionTypes', new QuestionTypes());
function QuestionTypes(){
    var types = this;
    types.input = 'INPUT';
    types.inputtel = 'INPUTTEL';
    types.inputcurrency = 'INPUTCURRENCY';
    types.inputidentification = 'INPUTIDENTIFICATION';
    types.buttongroup = 'BUTTONGROUP';
    types.buttongroupBig = 'BUTTONGROUPBIG';
    types.upload = 'UPLOAD';
    types.date = 'DATE';
    types.checkbox = 'CHECKBOX';
    types.select = 'SELECT';
    types.text = 'TEXT';
    types.phone = 'PHONE';
    types.label = 'LABEL';
}
