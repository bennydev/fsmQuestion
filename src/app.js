"use strict";
angular.module('fsmQuestion', ['fsmFileUploader', 'LocalStorageModule'])
    .constant('buttonConfig', {activeClass: 'is-active'})
    .value('storagePrefix', 'i84ds03');