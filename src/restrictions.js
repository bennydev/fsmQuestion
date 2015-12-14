"use strict";
angular.module('fsmQuestion')
.value('Restrictions', Restrictions);
function Restrictions(required, validator, min, max){
    var restrictions = this;
    restrictions.isRequired = setRestriction(required);
    restrictions.getValidator = setRestriction(validator);
    restrictions.min = setRestriction(min);
    restrictions.max = setRestriction(max);

    function setRestriction(value){
        if(value instanceof Function){
            return value;
        } else {
            return function(){return value;};
        }
    }
}
