'use strict';
angular.module('fsmFileUploader', [])
    .directive('fsmFileUploader', ['FileUploaderService', function(FileUploaderService){
    return {
        restrict: 'E',
        scope: {
            group: '&',
            buttonText: '@',
            max: '='
        },
        templateUrl: 'templates/fileuploader.tpl.html',
        link: function(scope, element, attrs){
            scope.id = 'fileUpload-'+scope.group();
            scope.group = scope.group();
            scope.files = FileUploaderService.createGroup(scope.group).files;
            scope.removeFile = function(index){
              FileUploaderService.removeFileInGroup(scope.group, index);
            };

            var btn = element.find('#selectFileBtn');
            var input;

            btn.bind('click', function(event){
                event.preventDefault();
                event.stopPropagation();
                bindInput();
                input.click();
            });

            function bindInput(){
                if(!input){
                    input = element.find('#'+scope.id);
                    input.bind('change', function(){
                        var file = input.files[0];
                        file.path = input.value;
                        if(!file.name) {
                            file.name = input.value.substr(input.value.lastIndexOf('/'));
                        }
                        input.value = '';
                        addFile(file, scope.group);
                        scope.$apply();
                    });
                    input = input[0];
                }
            }

            function addFile(file, group){
                if(scope.max == 1){
                    scope.removeFile(0);
                }
                FileUploaderService.addFileToGroup(file, group);
            }

        }
    };
}])
    .factory('FileUploaderService', ['$http', '$window', '$q', function($http, $window, $q){
        var groups = {};
        var config = {headers: {'Content-Type': undefined, transformRequest: angular.identity}};

        function addFileToGroup(file, groupName){
            var group = groups[groupName];
            group.files.push(file);
        }

        function uploadFiles(url, reject){
            var promises = [];
            return $q(function(resolve){
                Object.keys(groups).forEach(function(group){
                    group.files.forEach(function(file){
                        var formData = new $window.FormData();
                        formData.append('file', file, file.name);
                        var promise = $http.post(url, formData, config).then(function(response){
                            group.docIds.push(response.data.receiptid);
                        }, function(errorResponse){
                            return reject(errorResponse);
                        });
                        promises.push(promise);
                    });
                });
                return $q.all(promises).then(function(){return resolve(groups);});
            });
        }

        function getFileNames(groupName){
            var fileNames = [];
            groups[groupName].files.forEach(function(file){
                fileNames.push(file.name);
            });
            return fileNames;
        }

        function removeFileInGroup(groupName, index){
            groups[groupName].files.splice(index, 1);
        }

        function createGroup(groupName){
            var group = groups[groupName] ? groups[groupName] : {name: groupName, files: [], docIds: []};
            groups[groupName] = group;
            return group;
        }

        function fileUploadSupported(){
            return !!$window.FileReader && !!$window.File && !!$window.FileList && !!$window.Blob;
        }

        return {
            getFileNames: getFileNames,
            addFileToGroup: addFileToGroup,
            uploadFiles: uploadFiles,
            removeFileInGroup: removeFileInGroup,
            createGroup: createGroup,
            fileUploadSupported: fileUploadSupported
        };
    }]);
