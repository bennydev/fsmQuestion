"use strict";
angular.module('fsmQuestion', ['fsmFileUploader', 'LocalStorageModule'])
    .constant('buttonConfig', {activeClass: 'is-active'})
    .constant('datepickerPopupConfig', {
        datepickerPopup: 'yyyy-MM-dd',
        datepickerPopupTemplateUrl: 'template/datepicker/popup.html',
        datepickerTemplateUrl: 'template/datepicker/datepicker.html',
        html5Types: {
            date: 'yyyy-MM-dd',
            'datetime-local': 'yyyy-MM-ddTHH:mm:ss.sss',
            'month': 'yyyy-MM'
        },
        currentText: 'Idag',
        clearText: 'Rensa',
        closeText: 'Stäng',
        closeOnDateSelection: true,
        appendToBody: false,
        showButtonBar: true,
        onOpenFocus: true
    })
    .value('storagePrefix', 'i84ds03');