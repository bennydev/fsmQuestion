'use strict';
angular.module('fsmQuestion')
.value('Options', Options);
function Options(defaultAnswer, visible, values, placeholder, onChange){
    var options = this;
    options.getDefaultAnswer = setOption(defaultAnswer);
    options.isVisible = setOption(visible);
    options.getValues = setOption(values);
    options.getPlaceholder = setOption(placeholder);
    options.onChange = setOption(onChange);

    function setOption(value){
        if(value instanceof Function){
            return value;
        } else {
            return function(){return value;};
        }
    }
}
