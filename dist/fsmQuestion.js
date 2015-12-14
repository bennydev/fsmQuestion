angular.module('fsmQuestionTemplates', ['templates/buttongroup.tpl.html', 'templates/buttongroupbig.tpl.html', 'templates/checkbox.tpl.html', 'templates/date.tpl.html', 'templates/datetime.tpl.html', 'templates/formerror.tpl.html', 'templates/input.tpl.html', 'templates/inputcurrency.tpl.html', 'templates/location.tpl.html', 'templates/phone.tpl.html', 'templates/question.tpl.html', 'templates/select.tpl.html', 'templates/text.tpl.html', 'templates/tooltip.tpl.html', 'templates/upload.tpl.html']);

angular.module("templates/buttongroup.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/buttongroup.tpl.html",
    "<div class=\"form-label\">\n" +
    "    <label for=\"{{question.id}}\"><span translate translate-default=\"''\" translate-values=\"translateValues\">{{question.textRoot+'.QUESTION'}}</span><span ng-show=\"question.isRequired()\" class=\"required\"></span></label>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div ng-include=\"'templates/tooltip.tpl.html'\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <div class=\"form-row form-row--gap\">\n" +
    "            <div class=\"toggle-list\">\n" +
    "                <button class=\"toggle-list__item\"\n" +
    "                    id=\"{{question.id + $index}}\"\n" +
    "                    name=\"{{question.id}}\"\n" +
    "                    ng-repeat=\"option in question.options track by $index\"\n" +
    "                    ng-model=\"question.model[question.id]\"\n" +
    "                    btn-radio=\"'{{option.value}}'\"\n" +
    "                    ng-class=\"{'fsm-invalid': question.hasErrors(), 'fsm-valid': !question.hasErrors()}\"\n" +
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
    "    <span class=\"form-section__accept u-typography-3\" translate translate-default=\"''\" translate-values=\"translateValues\">{{question.textRoot+'.QUESTION'}}</span>\n" +
    "\n" +
    "    <div class=\"toggle-list toggle-list--large\">\n" +
    "        <button type=\"button\" class=\"toggle-list__item\" id=\"{{question.id + $index}}\"\n" +
    "            name=\"{{question.id}}\"\n" +
    "            ng-repeat=\"option in question.options track by $index\"\n" +
    "            ng-model=\"question.model[question.id]\"\n" +
    "            btn-radio=\"'{{option.value}}'\"\n" +
    "            ng-class=\"{'fsm-invalid': question.hasErrors(), 'fsm-valid': !question.hasErrors()}\"\n" +
    "            ng-change=\"question.removeErrors();question.onChange(question);question.saveAnswer();\">{{option.label | translate}}</button>\n" +
    "    </div>\n" +
    "    <input type=\"hidden\" ng-required=\"true\" name=\"agree\" ng-model=\"agree\">\n" +
    "\n" +
    "    <div class=\"form-error u-spacing-above-narrow\" role=\"alert\" ng-show=\"question.hasErrors()\" ng-cloak>\n" +
    "        <div>{{question.getErrors().message | translate}}</div>\n" +
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
    "    <label for=\"{{question.id}}\">{{question.textRoot+'.QUESTION' | fsmTranslate}}<span ng-show=\"question.isRequired()\"\n" +
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
    "               ng-class=\"{'mandatory' : question.isRequired()}\">{{question.textRoot+'.QUESTION' | fsmTranslate}}\n" +
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

angular.module("templates/input.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/input.tpl.html",
    "<div class=\"form-label\">\n" +
    "    <label for=\"{{question.id}}\">{{question.textRoot+'.QUESTION' | fsmTranslate}}<span ng-show=\"question.isRequired()\" class=\"required\"></span></label>\n" +
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
    "    <label for=\"{{question.id}}\">{{question.textRoot+'.QUESTION' | fsmTranslate}}<span ng-show=\"question.isRequired()\" class=\"required\"></span></label>\n" +
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
    "                <div class=\"input-group__addon\">{{'VIEW.EXTRAS.CURRENCY_SWEDISH' | fsmTranslate}}</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/formerror.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/location.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/location.tpl.html",
    "<div>{{question.textRoot+'.QUESTION' | fsmTranslate}}</div>\n" +
    "<input ng-model=\"question.model[question.id]\"\n" +
    "       ng-change=\"question.removeErrors();question.saveAnswer();\"\n" +
    "       ng-class=\"{'fsm-invalid': question.hasErrors(), 'fsm-valid': !question.hasErrors()}\">\n" +
    "[KARTA]");
}]);

angular.module("templates/phone.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/phone.tpl.html",
    "<div class=\"form-label\">\n" +
    "    <label for=\"{{question.id}}\">{{question.textRoot+'.QUESTION' | fsmTranslate}}<span ng-show=\"question.isRequired()\" class=\"required\"></span></label>\n" +
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

angular.module("templates/question.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/question.tpl.html",
    "<div ng-show=\"question.isVisible()\"\n" +
    "     class=\"row input-block animate-show\">\n" +
    "    <div class=\"input-block__block\" ng-include=\"'templates/' + question.type.toLowerCase() + '.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/select.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/select.tpl.html",
    "<div class=\"form-label\" ng-if=\"question.textRoot+'.QUESTION' | fsmTranslate\">\n" +
    "    <label for=\"{{question.id}}\">{{question.textRoot+'.QUESTION' | fsmTranslate}}<span ng-show=\"question.isRequired()\" class=\"required\"></span></label>\n" +
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
    "    <label>{{question.textRoot+'.QUESTION' | fsmTranslate}}</label>\n" +
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
    "        <div class=\"form-charcount\" ng-cloak>{{question.model[question.id].length}} {{'VIEW.EXTRAS.OF' | fsmTranslate}} {{question.maxLength}}</div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"grid__item sm--six-twelfths\" ng-include=\"'templates/formerror.tpl.html'\"></div>\n" +
    "</div>");
}]);

angular.module("templates/tooltip.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/tooltip.tpl.html",
    "<p ng-if=\"question.textRoot+'.INFO' | fsmTranslate\" class=\"form-note\" translate>{{question.textRoot+'.INFO'}}</p>");
}]);

angular.module("templates/upload.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/upload.tpl.html",
    "<div class=\"form-label\">\n" +
    "    <label for=\"{{question.id}}\"\n" +
    "        ng-class=\"{'mandatory' : question.isRequired()}\">{{question.textRoot+'.QUESTION' | fsmTranslate}}\n" +
    "    </label>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"grid\">\n" +
    "    <div class=\"grid__item sm--six-twelfths\">\n" +
    "        <fsm-file-uploader id=\"{{question.id}}\" group=\"question.options[0].value\" button-text=\"{{question.options[0].label | fsmTranslate}}\"></fsm-file-uploader>\n" +
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
        templateUrl: 'templates/question.tpl.html',
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
function Question(id, type, textRoot, options, restrictions, ValidationService, ErrorReporter){
    var question = this;
    question.id = id;
    question.type = type;
    question.textRoot = textRoot;
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
        builder.textRoot = set('textRoot', builder);
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
                    value(builder.textRoot),
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
        getMaxValidator: getMaxValidator
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
}