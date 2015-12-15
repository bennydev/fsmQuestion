angular.module('fsmQuestionTemplates', ['templates/buttongroup.tpl.html', 'templates/buttongroupbig.tpl.html', 'templates/checkbox.tpl.html', 'templates/date.tpl.html', 'templates/datetime.tpl.html', 'templates/formerror.tpl.html', 'templates/fsmQuestion.tpl.html', 'templates/fsmQuestionGroup.tpl.html', 'templates/input.tpl.html', 'templates/inputcurrency.tpl.html', 'templates/location.tpl.html', 'templates/phone.tpl.html', 'templates/select.tpl.html', 'templates/text.tpl.html', 'templates/tooltip.tpl.html', 'templates/upload.tpl.html']);

angular.module("templates/buttongroup.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/buttongroup.tpl.html",
    "<div class=\"form-label\">\n" +
    "    <label for=\"{{question.id}}\"><span translate translate-default=\" \" translate-values=\"question.text.translateValues\">{{question.text.root+'.QUESTION'}}</span><span ng-show=\"question.isRequired()\" class=\"required\"></span></label>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div ng-include=\"'templates/tooltip.tpl.html'\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div class=\"form-row form-row--gap\">\n" +
    "            <div class=\"toggle-list\" id=\"{{question.id}}\">\n" +
    "                <button class=\"toggle-list__item\"\n" +
    "                    id=\"{{question.id + $index}}\"\n" +
    "                    name=\"{{question.id}}\"\n" +
    "                    ng-repeat=\"option in question.options.getValues() track by $index\"\n" +
    "                    ng-model=\"question.model[question.id]\"\n" +
    "                    btn-radio=\"'{{option.value}}'\"\n" +
    "                    ng-class=\"{'fsm-invalid': question.hasError(), 'fsm-valid': !question.hasError()}\"\n" +
    "                    ng-change=\"question.removeErrors();question.onChange(question);question.saveAnswer();\">{{option.label | translate}}</button>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <input type=\"hidden\" ng-required=\"true\" name=\"newPhone\" ng-model=\"step1.newPhone\">\n" +
    "    </div>\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/formerror.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/buttongroupbig.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/buttongroupbig.tpl.html",
    "<div class=\"u-spacing-above u-spacing-under u-inline-block\">\n" +
    "    <span class=\"form-section__accept u-typography-3\" translate translate-default=\" \" translate-values=\"question.text.translateValues\">{{question.text.root+'.QUESTION'}}</span>\n" +
    "\n" +
    "    <div class=\"toggle-list toggle-list--large\">\n" +
    "        <button type=\"button\" class=\"toggle-list__item\" id=\"{{question.id + $index}}\"\n" +
    "            name=\"{{question.id}}\"\n" +
    "            ng-repeat=\"option in question.options.getValues() track by $index\"\n" +
    "            ng-model=\"question.model[question.id]\"\n" +
    "            btn-radio=\"'{{option.value}}'\"\n" +
    "            ng-class=\"{'fsm-invalid': question.hasError(), 'fsm-valid': !question.hasError()}\"\n" +
    "            ng-change=\"question.removeErrors();question.onChange(question);question.saveAnswer();\">{{option.label | translate}}</button>\n" +
    "    </div>\n" +
    "    <input type=\"hidden\" ng-required=\"true\" name=\"agree\" ng-model=\"agree\">\n" +
    "\n" +
    "    <div class=\"form-error u-spacing-above-narrow\" role=\"alert\" ng-show=\"question.hasError()\" ng-cloak>\n" +
    "        <div>{{question.getError() | translate}}</div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/checkbox.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/checkbox.tpl.html",
    "<div class=\"form-row form-row--gap\">\n" +
    "  <div ng-repeat=\"option in question.options track by $index\">\n" +
    "    <label class=\"custom-checkbox\">\n" +
    "      <input id=\"{{question.id}}{{$index}}\"\n" +
    "               name=\"{{question.id}}{{$index}}\"\n" +
    "               type=\"checkbox\"\n" +
    "               class=\"custom-checkbox__input\"\n" +
    "               ng-model=\"question.model[question.id]\"\n" +
    "               ng-change=\"question.removeErrors();question.saveAnswer();\"\n" +
    "               ng-class=\"{'fsm-invalid': question.hasErrors(), 'fsm-valid': !question.hasErrors()}\"\n" +
    "               ng-true-value=\"'{{option.value}}'\"\n" +
    "               ng-false-value=\"undefined\">\n" +
    "        <span class=\"custom-checkbox__icon\">Jag vet inte exakt datum</span>\n" +
    "    </label>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div ng-include=\"'templates/tooltip.tpl.html'\"></div>\n" +
    "");
}]);

angular.module("templates/date.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/date.tpl.html",
    "<div class=\"form-label\">\n" +
    "    <label for=\"{{question.id}}\">{{question.textRoot+'.QUESTION' | translate}}<span ng-show=\"question.isRequired()\"\n" +
    "                                                                                       class=\"required\"></span></label>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div class=\"form-row form-row--gap\">\n" +
    "\n" +
    "            <input type=\"text\"\n" +
    "                   id=\"{{question.id}}\"\n" +
    "                   name=\"{{question.id}}\"\n" +
    "                   class=\"input-text\"\n" +
    "                   placeholder=\"ÅÅÅÅ-MM-DD\"\n" +
    "                   input-touched\n" +
    "                   ng-model=\"question.model[question.id].dateString\"\n" +
    "                   ng-class=\"{'fsm-invalid': question.hasErrors(), 'fsm-valid': !question.hasErrors()}\"\n" +
    "                   ng-change=\"question.removeErrors();question.model[question.id].updateDate();question.saveAnswer();\"\n" +
    "                    />\n" +
    "            <i aria-hidden=\"true\" class=\"icon icon-date\" ng-click=\"question.isOpen =! question.isOpen\"></i>\n" +
    "            <div datepicker-popup=\"yyyy-MM-dd\"\n" +
    "                 min-date=\"question.minDate\"\n" +
    "                 max-date=\"question.maxDate\"\n" +
    "                 ng-model=\"question.model[question.id].date\"\n" +
    "                 ng-class=\"{'fsm-invalid': question.hasErrors(), 'fsm-valid': !question.hasErrors()}\"\n" +
    "                 ng-change=\"question.removeErrors();question.model[question.id].updateDateString();question.saveAnswer();\"\n" +
    "                 is-open=\"question.isOpen\"\n" +
    "                    style=\"margin-top:1px;\">\n" +
    "                 </div>\n" +
    "        </div>\n" +
    "        <div ng-include=\"'templates/tooltip.tpl.html'\"></div>\n" +
    "    </div>\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/formerror.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/datetime.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/datetime.tpl.html",
    "<div class=\"col-sm-6\">\n" +
    "    <span>\n" +
    "        <label for=\"{{question.id}}Date\"\n" +
    "               ng-class=\"{'mandatory' : question.isRequired()}\">{{question.textRoot+'.QUESTION' | translate}}\n" +
    "        </label>\n" +
    "    </span>\n" +
    "</div>\n" +
    "<div class=\"col-sm-6\" ng-init=\"question.model[question.id] = {};\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-sm-8\">\n" +
    "            <input type=\"text\"\n" +
    "                   id=\"{{question.id}}Date\"\n" +
    "                   name=\"{{question.id}}Date\"\n" +
    "                   class=\"form-control\"\n" +
    "                   ng-model=\"question.model[question.id].date\"\n" +
    "                   ng-class=\"{'fsm-invalid': question.hasErrors(), 'fsm-valid': !question.hasErrors()}\"\n" +
    "                   ng-change=\"question.removeErrors();\"\n" +
    "                    />\n" +
    "        </div>\n" +
    "        <div class=\"clearfix visible-xs\" style=\"padding-bottom: 15px;\"></div>\n" +
    "        <div class=\"col-sm-4\">\n" +
    "            <input type=\"text\"\n" +
    "                   id=\"{{question.id}}Time\"\n" +
    "                   name=\"{{question.id}}Time\"\n" +
    "                   class=\"form-control\"\n" +
    "                   ng-model=\"question.model[question.id].time\"\n" +
    "                   ng-class=\"{'fsm-invalid': question.hasErrors(), 'fsm-valid': !question.hasErrors()}\"\n" +
    "                   ng-change=\"question.removeErrors();\"\n" +
    "                    />\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/formerror.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/formerror.tpl.html",
    "<div class=\"form-error\" role=\"alert\" ng-cloak ng-show=\"question.hasError()\">\n" +
    "    <div>{{question.getError() | translate}}</div>\n" +
    "</div>");
}]);

angular.module("templates/fsmQuestion.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/fsmQuestion.tpl.html",
    "<div ng-show=\"question.isVisible()\" class=\"row input-block animate-show\">\n" +
    "    <div class=\"input-block__block\" ng-include=\"'templates/' + question.type.toLowerCase() + '.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/fsmQuestionGroup.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/fsmQuestionGroup.tpl.html",
    "<fieldset ng-show=\"isVisible()\">\n" +
    "    <fsm-question question=\"question\" ng-repeat=\"question in group.questions\"></fsm-question>\n" +
    "</fieldset>");
}]);

angular.module("templates/input.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/input.tpl.html",
    "<div class=\"form-label\">\n" +
    "    <label for=\"{{question.id}}\">{{question.textRoot+'.QUESTION' | translate}}<span ng-show=\"question.isRequired()\" class=\"required\"></span></label>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div ng-include=\"'templates/tooltip.tpl.html'\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div class=\"form-row form-row--gap\">\n" +
    "          <input type=\"text\"\n" +
    "             id=\"{{question.id}}\"\n" +
    "             name=\"{{question.id}}\"\n" +
    "             placeholder=\"{{question.placeholder}}\"\n" +
    "             input-touched\n" +
    "             class=\"input-text\"\n" +
    "             ng-model=\"question.model[question.id]\"\n" +
    "             ng-change=\"question.removeErrors();question.onChange(question);question.saveAnswer();\"\n" +
    "             ng-class=\"{'fsm-invalid': question.hasErrors(), 'fsm-valid': !question.hasErrors()}\"\n" +
    "             maxlength=\"{{question.maxLength}}\"\n" +
    "                  />\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/formerror.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/inputcurrency.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/inputcurrency.tpl.html",
    "<div class=\"form-label\">\n" +
    "    <label for=\"{{question.id}}\">{{question.textRoot+'.QUESTION' | translate}}<span ng-show=\"question.isRequired()\" class=\"required\"></span></label>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div ng-include=\"'templates/tooltip.tpl.html'\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div class=\"form-row form-row--gap\">\n" +
    "            <div class=\"input-group\">\n" +
    "                <input type=\"text\"\n" +
    "                   id=\"{{question.id}}\"\n" +
    "                   name=\"{{question.id}}\"\n" +
    "                   placeholder=\"{{question.placeholder}}\"\n" +
    "                   input-touched\n" +
    "                   class=\"input-text input-group__input\"\n" +
    "                   ng-model=\"question.model[question.id]\"\n" +
    "                   ng-class=\"{'fsm-invalid': question.hasErrors(), 'fsm-valid': !question.hasErrors()}\"\n" +
    "                   ng-change=\"question.removeErrors();question.saveAnswer();\"\n" +
    "                   maxlength=\"{{question.maxLength}}\"\n" +
    "                    />\n" +
    "                <div class=\"input-group__addon\">{{'VIEW.EXTRAS.CURRENCY_SWEDISH' | translate}}</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/formerror.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/location.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/location.tpl.html",
    "<div>{{question.textRoot+'.QUESTION' | translate}}</div>\n" +
    "<input ng-model=\"question.model[question.id]\"\n" +
    "       ng-change=\"question.removeErrors();question.saveAnswer();\"\n" +
    "       ng-class=\"{'fsm-invalid': question.hasErrors(), 'fsm-valid': !question.hasErrors()}\">\n" +
    "[KARTA]");
}]);

angular.module("templates/phone.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/phone.tpl.html",
    "<div class=\"form-label\">\n" +
    "    <label for=\"{{question.id}}\">{{question.textRoot+'.QUESTION' | translate}}<span ng-show=\"question.isRequired()\" class=\"required\"></span></label>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "       <div class=\"form-row form-row--gap\">\n" +
    "          <div class=\"input-group\">\n" +
    "              <div class=\"input-group__addon\">\n" +
    "\n" +
    "                  <div class=\"addon-select\">\n" +
    "                    {{ question.model[question.id].countryCode.phoneCode }} <i class=\"icon icon-arrow-down\" aria-hidden=\"true\"></i>\n" +
    "                      <select ng-model=\"question.model[question.id].countryCode\"\n" +
    "                              id=\"{{question.id}}CountryCode\"\n" +
    "                              name=\"{{question.id}}CountryCode\"\n" +
    "                              ng-change=\"question.removeErrors(); addZeroToPhonenumber(); question.saveAnswer();\"\n" +
    "                              ng-init=\"question.model[question.id].countryCode = question.options[209]; question.model[question.id].phoneNumber = '0';\"\n" +
    "                              ng-options=\"option.name for option in question.options track by option.id\"\n" +
    "\n" +
    "                              >\n" +
    "                      </select>\n" +
    "                  </div>\n" +
    "              </div>\n" +
    "              <input\n" +
    "                      type=\"tel\"\n" +
    "                      class=\"input-text input-group__input\"\n" +
    "                 id=\"{{question.id}}PhoneNumber\"\n" +
    "                 name=\"{{question.id}}PhoneNumber\"\n" +
    "                 input-touched\n" +
    "                 ng-model=\"question.model[question.id].phoneNumber\"\n" +
    "                 ng-change=\"question.removeErrors(); question.onChange(question); question.saveAnswer();\"\n" +
    "                  />\n" +
    "          </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/formerror.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/select.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/select.tpl.html",
    "<div class=\"form-label\" ng-if=\"question.textRoot+'.QUESTION' | translate\">\n" +
    "    <label for=\"{{question.id}}\">{{question.textRoot+'.QUESTION' | translate}}<span ng-show=\"question.isRequired()\" class=\"required\"></span></label>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div ng-include=\"'templates/tooltip.tpl.html'\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div class=\"form-row form-row--gap\">\n" +
    "            <div class=\"custom-select custom-select--full-width\">\n" +
    "                 <select id=\"{{question.id}}\"\n" +
    "                        name=\"{{question.id}}\"\n" +
    "                        class=\"form-control\"\n" +
    "                        ng-model=\"question.model[question.id]\"\n" +
    "                        ng-change=\"question.removeErrors();question.onChange(question); question.saveAnswer();\"\n" +
    "                        ng-class=\"{'fsm-invalid': errors[question.id], 'fsm-valid': !errors[question.id]}\"\n" +
    "                        ng-options=\"option.value as option.label | translate for option in question.options\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/formerror.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/text.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/text.tpl.html",
    "<div class=\"form-label\">\n" +
    "    <label>{{question.textRoot+'.QUESTION' | translate}}</label>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"grid\">\n" +
    "  <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/tooltip.tpl.html'\"></div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "\n" +
    "        <div class=\"form-row form-row--gap\">\n" +
    "            <textarea class=\"input-textarea\"\n" +
    "              ng-trim=\"false\"\n" +
    "              maxlength=\"{{question.maxLength}}\"\n" +
    "              id=\"{{question.id}}\"\n" +
    "              name=\"{{question.id}}\"\n" +
    "              ng-model=\"question.model[question.id]\"\n" +
    "              ng-change=\"question.removeErrors(); question.saveAnswer();\"\n" +
    "              ng-class=\"{'fsm-invalid': errors[question.id], 'fsm-valid': !errors[question.id]}\"></textarea>\n" +
    "        </div>\n" +
    "        <div class=\"form-charcount\" ng-cloak>{{question.model[question.id].length}} {{'VIEW.EXTRAS.OF' | translate}} {{question.maxLength}}</div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/formerror.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/tooltip.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/tooltip.tpl.html",
    "<p ng-if=\"{{(question.text.root+'.INFO' | translate) !== question.text.root+'.INFO'}}\" class=\"form-note\" translate translate-values=\"question.text.translateValues\">{{question.text.root+'.INFO'}}</p>");
}]);

angular.module("templates/upload.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/upload.tpl.html",
    "<div class=\"form-label\">\n" +
    "    <label for=\"{{question.id}}\"\n" +
    "        ng-class=\"{'mandatory' : question.isRequired()}\">{{question.textRoot+'.QUESTION' | translate}}\n" +
    "    </label>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <fsm-file-uploader id=\"{{question.id}}\" group=\"question.options[0].value\" button-text=\"{{question.options[0].label | translate}}\"></fsm-file-uploader>\n" +
    "    </div>\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/formerror.tpl.html'\"></div>\n" +
    "</div>");
}]);

"use strict";
angular.module('fsmQuestion', []);
"use strict";
angular.module('fsmQuestion')
    .factory('ErrorReporter', ErrorReporter);
function ErrorReporter(){
    var errors = {};
    var messages = [];
    var service = {
        addError: addError,
        getErrors: getErrors,
        hasErrorFor: hasErrorFor,
        clearErrors: clearErrors
    };
    return service;

    function addError(id, message){
        errors[id] = message;
        messages.push(message)
    }

    function getErrors(){
        return errors;
    }

    function hasErrorFor(id){
        return !! errors[id];
    }

    function clearErrors(){
        errors = {};
        messages = [];
    }
}


"use strict";
angular.module('fsmQuestion')
.directive('fsmQuestion', ['QuestionTypes', function(QuestionTypes){
    return {
        restrict: 'E',
        scope: {
            question: '=',
            translateValues: '='
        },
        templateUrl: 'templates/fsmQuestion.tpl.html',
        link: function(scope){
            init(scope);
        }
    };

    function init(scope){
        initScopeVariables(scope);
    }

    function initScopeVariables(scope){
        scope.types = QuestionTypes;
    }
}]);
"use strict";
angular.module('fsmQuestion')
    .directive('fsmQuestionGroup', [function(){
        return {
            restrict: 'E',
            scope: {
                questions: '='
            },
            replace: true,
            templateUrl: 'templates/fsmQuestionGroup.tpl.html',
            link: function(scope){
                scope.isVisible = function(){
                  var show = false;
                    scope.questions.forEach(function(question){
                        show = question.isVisible() ? true : show;
                    });
                    return show;
                };
            }
        };
    }])
    .factory('QuestionGroupService', [function(){
        var service = {

        };
        return service;
    }]);
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

"use strict";
angular.module('fsmQuestion')
    .value('Question', Question);
function Question(id, type, text, options, restrictions, ValidationService, ErrorReporter){
    var question = this;
    question.id = id;
    question.type = type;
    question.text = text;
    question.options = options;
    question.restrictions = restrictions;
    question.isVisible = options.isVisible;
    question.isRequired = restrictions.isRequired;
    question.validate = function(){ValidationService.validate(question)};
    question.setAnswer = function(value){
        if(value instanceof Date){
            question.answer = value.toISOString().substr(0,10);
        } else {
            question.answer = value;
        }
    };
    question.hasError = function(){
        return ErrorReporter.hasErrorFor(question.id);
    };
    question.getError = function(){
      return ErrorReporter.getErrors()[question.id];
    };
    question.answer = question.options.getDefaultAnswer();
}

"use strict";
angular.module('fsmQuestion')
.value('QuestionBuilder', QuestionBuilder);
function QuestionBuilder(questionStorage, Question, Options, Restrictions, ValidationService, ErrorReporter){
    var builder = this;
    function init(){
        builder.id = set('id', builder);
        builder.type = set('type', builder);
        builder.text = set('text', builder);
        builder.defaultAnswer = set('defaultAnswer', builder);
        builder.values = set('values', builder);
        builder.placeholder = set('placeholder', builder);
        builder.onChange = set('onChange', builder);
        builder.visible = set('visible', builder);
        builder.required = set('required', builder);
        builder.validator = set('validator', builder);
        builder.min = set('min', builder);
        builder.max = set('max', builder);
        builder.createQuestion = function(){
            if(!questionStorage.contains(builder.id)){
                var question = new Question(
                    value(builder.id),
                    value(builder.type),
                    value(builder.text),
                    new Options(value(builder.defaultAnswer)||'', value(builder.visible)||true, value(builder.values)||[], value(builder.placeholder)||'', value(builder.onChange)),
                    new Restrictions(value(builder.required)||false, value(builder.validator), value(builder.min), value(builder.max)),
                    ValidationService,
                    ErrorReporter
                );
                loadAnswer(question);
                questionStorage.addQuestion(question);
                init();
                return question;
            } else {
                var id = builder.id;
                init();
                throw new Error('Duplicate question id: '+id);
            }
        };
    }
    function set(name, builder){
        var setter = function(value){builder[name] = value; return builder;};
        setter.isBuilder = true;
        return setter;
    }

    function value(value){
        if(value && value.isBuilder){
            return undefined;
        } else {
            return value;
        }
    }

    function loadAnswer(question){
        var answer = questionStorage.loadAnswer(question.id);
        question.setAnswer(answer);
        question.options.onChange();
    }

    init();
}

"use strict";
angular.module('fsmQuestion')
.factory('QuestionService', ['QuestionBuilder', 'Question', 'Options', 'Restrictions', 'ValidationService', 'QuestionStorage', 'ErrorReporter', QuestionService]);
function QuestionService(QuestionBuilder, Question, Options, Restrictions, ValidationService, QuestionStorage, ErrorReporter){
    var service = {
        getQuestionBuilder: getQuestionBuilder,
        getQuestion: getQuestion
    };

    return service;

    function getQuestionBuilder(){
        return new QuestionBuilder(QuestionStorage, Question, Options, Restrictions, ValidationService, ErrorReporter);
    }

    function getQuestion(id){
        return QuestionStorage.getQuestion(id);
    }
}

"use strict";
angular.module('fsmQuestion')
.factory('QuestionStorage', ['storagePrefix', 'localStorageService', QuestionStorage]);
function QuestionStorage(storagePrefix, localStorageService){
    var questions = {};
    var service = {
        contains: contains,
        addQuestion: addQuestion,
        getQuestion: getQuestion,
        loadAnswer: loadAnswer
    };
    return service;

    function contains(id){
        return !!questions[id];
    }

    function addQuestion(question){
        questions[question.id] = question;
    }

    function getQuestion(id){
        return questions[id];
    }

    function getStorageKey(id){
        return storagePrefix+'.questions.'+id;
    }

    function loadAnswer(id){
        return localStorageService.get(getStorageKey(id));
    }

    function saveAnswer(id, answer){
        localStorageService.set(getStorageKey(id), answer);
    }
}
"use strict";
angular.module('fsmQuestion')
.value('QuestionTypes', new QuestionTypes());
function QuestionTypes(){
    var types = this;
    types.input = 'INPUT';
    types.buttongroup = 'BUTTONGROUP';
    types.buttongroupBig = 'BUTTONGROUPBIG';
}

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

"use strict";
angular.module('fsmQuestion')
.factory('ValidationService', ['Validators', 'ErrorReporter', ValidationService]);
function ValidationService(Validators, ErrorReporter){
    var service = {
        validate: validate
    };

    return service;

    function validate(question){
        if(question.isVisible()){
            if(question.isRequired()){
                validateWithValidator(Validators.getRequiredValidator(), question);
            }
            if(question.restrictions.min() && !ErrorReporter.hasErrorsFor(question.id)){
                validateWithValidator(Validators.getMinValidator(question), question); //minLength (string), minValue (number), minDate (date)
            }
            if(question.restrictions.max() && !ErrorReporter.hasErrorsFor(question.id)){
                validateWithValidator(Validators.getMaxValidator(question), question); //maxLength (string), maxValue (number), maxDate (date)
            }
            if(question.restrictions.getValidator() && !ErrorReporter.hasErrorsFor(question.id)){
                validateWithValidator(question.restrictions.getValidator(), question);
            }
        }
    }

    function validateWithValidator(validator, question){
        var result = validator.validate(question);
        if(!result.valid){
            ErrorReporter.addError(question.id, result.message);
        }
    }
}
"use strict";
angular.module('fsmQuestion')
.factory('Validators', ['QuestionTypes', Validators]);
function Validators(QuestionTypes){
    var service = {
        getRequiredValidator: getRequiredValidator,
        getMinValidator: getMinValidator,
        getMaxValidator: getMaxValidator,
        getIdentificationValidator: getIdentificationValidator
    };

    return service;

    function getMinDateValidator(){
        return {
            validate: function(question){
                var answer = question.answer;
                var result = {};
                result.valid = dateInMillis(answer) >= question.restrictions.getMin().getTime();
                result.message = question.textRoot + '.ERRORS.TOO_EARLY';
                return result;
            }
        };
    }

    function getMaxDateValidator(){
        return {
            validate: function(question){
                var answer = question.answer;
                var result = {};
                result.valid = dateInMillis(answer) <= question.restrictions.getMax().getTime();
                result.message = question.textRoot + '.ERRORS.TOO_LATE';
                return result;
            }
        };
    }

    function getMinValueOrLengthValidator(){
        return {
            validate: function(question){
                var result = {};
                var min = question.restrictions.getMin();
                var answer = question.answer;
                var numericAnswer = getNumericAnswer(answer);

                if(numericAnswer){
                    result.valid = numericAnswer >= min;
                    result.message = question.textRoot + '.ERRORS.TOO_LOW';
                } else {
                    result.valid = answer.toString().length >= min;
                    result.message = question.textRoot + '.ERRORS.TOO_SHORT';
                }
                return result;
            }
        };
    }

    function getMaxValueOrLengthValidator(){
        return {
            validate: function(question){
                var result = {};
                var max = question.restrictions.getMax();
                var answer = question.answer;
                var numericAnswer = getNumericAnswer(answer);

                if(numericAnswer){
                    result.valid = numericAnswer <= max;
                    result.message = question.textRoot + '.ERRORS.TOO_HIGH';
                } else {
                    result.valid = answer.toString().length <= max;
                    result.message = question.textRoot + '.ERRORS.TOO_LONG';
                }
                return result;
            }
        };
    }

    function getRequiredValidator(){
        return {
            validate: function(question){
                var answer = question.answer;
                var result = {};
                result.valid = answer != undefined && answer !== '' && answer !== null && answer !== 'SELECT';
                result.message = question.textRoot + '.ERRORS.REQUIRED';
                return result;
            }
        };
    }

    function getMinValidator(question){
        var minValidator;
        if(QuestionTypes.date === question.type){
            minValidator = getMinDateValidator();
        } else {
            minValidator = getMinValueOrLengthValidator();
        }
        return minValidator;
    }

    function getMaxValidator(question){
        var maxValidator;
        if(QuestionTypes.date === question.type){
            maxValidator = getMaxDateValidator();
        } else {
            maxValidator = getMaxValueOrLengthValidator();
        }
        return maxValidator;
    }

    function getNumericAnswer(answer){
        var numericAnswer = parseFloat(answer);
        numericAnswer = answer === numericAnswer.toString() ? numericAnswer : undefined;
        return numericAnswer;
    }

    function dateInMillis(isoDateString){
        var date = createDate(isoDateString);
        return date.getTime();
    }

    function createDate(isoDateString){
        var year = parseInt(isoDateString.substr(0,4));
        var month = parseInt(isoDateString.substr(5,2)) -1;
        var day = parseInt(isoDateString.substr(8,2));
        return new Date(Date.UTC(year, month, day));
    }

    function getIdentificationValidator(){
        return {
            validate: function(question){
                var answer = question.answer;
                if(isPersonId(answer)){
                    return {
                        valid: validatePersonId(answer),
                        message: question.text.root + '.ERRORS.PERSON_ID_INVALID'
                    };
                } else if(startsWithNumberOfChars(answer, 2)){
                    return {
                        valid: validateCustomerNumber(answer),
                        message: question.text.root + '.ERRORS.CUSTOMER_NUMBER_INVALID'
                    };
                } else {
                    return {valid: false, message: question.text.root + '.ERRORS.FORMAT'};
                }
            }
        };
    }

    function isPersonId(value){
        value = removeValidPersonIdSeparators(value);
        return isNumeric(value) && (value.length === 10 || value.length === 12);
    }

    function validatePersonId(value){
        value = removeValidPersonIdSeparators(value);
        value = value.length === 12 ? value.substr(2) : value;
        return isValidDate(value) && hasValidChecksum(value);
    }

    function isValidDate(value){
        var year = '19'+value.substr(0,2);
        var month = value.substr(2,2) -1;
        var day = value.substr(4,2);
        return new Date(Date.UTC(year, month, day)).toISOString().removeChars(['-']).indexOf(value.substr(0,6)) === 2;
    }

    function hasValidChecksum(value){
        value = value.toString();
        var actual = value.charAt(value.length -1);
        var checksum = calculateChecksum(value);
        var expected = checksum === 0 ? 0 : 10 - checksum.toString().split('')[checksum.toString().length -1];
        return parseInt(actual) === parseInt(expected);
    }

    function calculateChecksum(value){
        var multiplier = 2;
        var chars = value.toString().split('');
        chars.splice(chars.length -1);
        return chars.map(function(value){
            var x = multiplier;
            multiplier = multiplier === 2 ? 1 : 2;
            return value * x;
        }).join('').split('').reduce(function(prev, curr){
            return parseInt(prev) + parseInt(curr);
        }).toString().split('').reduce(function(prev, curr){return parseInt(curr);});
    }

    function removeValidPersonIdSeparators(value){
        return value.toString().replace(new RegExp('\\+', 'gi'), '').replace(new RegExp('-', 'gi'), '');
    }

    function validateCustomerNumber(value){
        value = removeValidPersonIdSeparators(value);
        return startsWithNumberOfChars(value, 3) && value.substr(3).isNumeric() && value.length === 9;
    }

    function isNumeric(value, allowExponent){
        value = value.toString();
        if(allowExponent){
            return !isNaN(value) && isFinite(value);
        } else {
            var amountLeadingZeroes = amountLeadingChar(value, '0');
            var parsed = parseFloat(value).toString();
            return value.length === parsed.length + amountLeadingZeroes && !isNaN(parsed) && isFinite(parsed);
        }
    }

    function amountLeadingChar(string, find){
        var amount = 0;
        var found = true;
        string.split('').forEach(function(char){
            if(found){
                found = find === char;
                if(found){
                    amount++;
                }
            }
        });
        return amount;
    }

    function startsWithNumberOfChars(value, length){
        value = value.toString();
        return !! value.substr(0, length).match(new RegExp('[a-zA-ZåäöÅÄÖ]','gi'));
    }
}