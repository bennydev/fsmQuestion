"use strict";
angular.module('fsmQuestion.date', ['pascalprecht.translate'])
    .controller('DateCtrl', ['$scope', 'datepickerPopupConfig', '$translate',
        function ($scope, datepickerPopupConfig, $translate) {
          datepickerPopupConfig.currentText = $translate.instant('DATE_PICKER.CURRENT_TEXT');
          datepickerPopupConfig.clearText = $translate.instant('DATE_PICKER.CLEAR_TEXT');
          datepickerPopupConfig.closeText = $translate.instant('DATE_PICKER.CLOSE_TEXT');
        }]);