'use strict';
angular.module('fsmQuestion').filter('fsmTranslate', ['$translate', function($translate){
    function fsmTranslate(key){
        var translation = $translate.instant(key);
        if(translation === key){
            return '';
        }
        return translation;
    }

    return fsmTranslate;
}]);