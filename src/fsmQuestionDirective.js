'use strict';

angular.module('fsmQuestion')
    .directive('fsmQuestion',['QuestionService', 'ErrorReporter', 'FileUploaderService', function(QuestionService, ErrorReporter, FileUploaderService){
        function init(scope){
            initScopeVariables(scope);
            initQuestionModel(scope);
            if(!scope.question.isAnswered() || scope.question.getAnswer() === QuestionService.getOptions().select.value) {
                scope.question.loadAnswer();
            }
        }

        function initScopeVariables(scope){
            scope.types = QuestionService.getTypes();
            scope.errors = ErrorReporter.errors;
        }

        function initQuestionModel(scope){
            var question = scope.question;
            if(question.type === scope.types.select){
                if(!question.getAnswer()){
                    question.model[question.id] = question.options[0].value;
                }
            }
        }

        return {
            restrict: 'E',
            scope: {
                question: '=',
                translateValues: '='

            },
            templateUrl: 'templates/question.tpl.html',
            link: function(scope, element, attributes){
                init(scope);
                //UPLOAD
                if(scope.question.type === QuestionService.getTypes().upload){
                    var isVisible = scope.question.isVisible;
                    scope.question.isVisible = function(){return FileUploaderService.fileUploadSupported() && isVisible();};
                }

                //PHONE
                if(scope.question.type === QuestionService.getTypes().phone){
                    var onChange = scope.question.onChange ? scope.question.onChange : function(){};
                    scope.question.onChange = function(question){
                        if(question.model[question.id].countryCode.code === 'SWE') {
                            if (question.model[question.id].phoneNumber === '') {
                                question.model[question.id].phoneNumber = '0';
                            }

                            if(question.getAnswer().phoneNumber.toString().length >= 2 && question.getAnswer().phoneNumber.toString().substr(0,2) === '00'){
                                question.model[question.id].phoneNumber = '0'+question.getAnswer().phoneNumber.toString().substr(2);
                            }
                        }
                        onChange(question);
                    };
                    scope.addZeroToPhonenumber = function(){
                        if(scope.question.model[scope.question.id].phoneNumber === '0' && scope.question.model[scope.question.id].countryCode.code !== 'SWE'){
                            scope.question.model[scope.question.id].phoneNumber = '';
                        } else if(scope.question.model[scope.question.id].phoneNumber === '' && scope.question.model[scope.question.id].countryCode.code === 'SWE'){
                            scope.question.model[scope.question.id].phoneNumber = '0';
                        }
                    };
                }
            }
        };
    }]);
