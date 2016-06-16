(function(angular) {
    'use strict';

    angular.module('fsmFileUploader', [])
        .directive('fsmFileUploader', fsmFileUploader);

    fsmFileUploader.$inject = ['FileUploaderService', 'QuestionStorage'];

    function fsmFileUploader(FileUploaderService, QuestionStorage) {
        return {
            restrict: 'E',
            scope: {
                group: '&',
                buttonText: '@',
                max: '='
            },
            templateUrl: 'templates/fileuploader.tpl.html',
            link: function (scope, element, attrs) {
                scope.id = 'fileUpload-' + scope.group();
                scope.group = scope.group();
                scope.files = FileUploaderService.createGroup(scope.group).files;
                scope.removeFile = function (index) {
                    FileUploaderService.removeFileInGroup(scope.group, index);
                };

                var btn = element.find('#selectFileBtn');
                var input;

                btn.bind('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    bindInput();
                    input.click();
                });

                function bindInput() {
                    if (!input) {
                        input = element.find('#' + scope.id);
                        input.bind('change', function () {
                            var file = input.files[0];
                            var reader = new FileReader();

                            reader.onload = (function() {
                                return function(e) {
                                    file.dataURL = e.target.result;
                                    QuestionStorage.saveObject('TestFile', JSON.stringify(file));
                                };
                            })(file);
                            reader.readAsDataURL(file);

                            file.path = input.value;
                            if (!file.name) {
                                file.name = input.value.substr(input.value.lastIndexOf('/'));
                            }
                            input.value = '';
                            addFile(file, scope.group);
                            scope.$apply();
                        });
                        input = input[0];
                    }
                }

                function addFile(file, group) {
                    if (scope.max == 1) {
                        scope.removeFile(0);
                    }
                    FileUploaderService.addFileToGroup(file, group);
                }

            }
        };
    }
})(angular);
