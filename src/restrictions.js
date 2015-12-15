"use strict";
angular.module('fsmQuestion')
.value('Restrictions', Restrictions);
function Restrictions(required, validator, min, max, numeric){
    var restrictions = this;
    restrictions.isRequired = setRestriction(required);
    restrictions.getValidator = setRestriction(validator);
    restrictions.getMin = setRestriction(min);
    restrictions.getMax = setRestriction(max);
    restrictions.isNumeric = setRestriction(numeric);

    function setRestriction(value){
        if(value instanceof Function){
            return value;
        } else {
            return function(){return value;};
        }
    }
}
