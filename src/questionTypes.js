"use strict";
angular.module('fsmQuestion')
.value('QuestionTypes', new QuestionTypes());
function QuestionTypes(){
    var types = this;
    types.input = 'INPUT';
    types.buttongroup = 'BUTTONGROUP';
    types.buttongroupBig = 'BUTTONGROUPBIG';
    types.upload = 'UPLOAD';
}
