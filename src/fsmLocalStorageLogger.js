(function(angular){
    "use strict";
    angular.module('fsmQuestion')
        .factory('localStorageLogger', LocalStorageLogger);

    LocalStorageLogger.$inject = ['localStorageService'];

    function LocalStorageLogger(localStorageService){

        var service = {
            logDebug: logDebug
        };

        function logDebug(key, message) {
            localStorageService.set(key, message);
        }

        return service;

    }

})(angular);