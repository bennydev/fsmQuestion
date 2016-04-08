(function(angular){
    "use strict";
    angular.module('fsmFileUploader')
        .factory('FileUploaderService', FileUploaderService);

    FileUploaderService.$inject =  ['$http', '$window', '$q'];

    function FileUploaderService($http, $window, $q){
        var groups = {};
        var config = {headers: {'Content-Type': undefined, transformRequest: angular.identity}};
        var filesUploaded = false;

        var uploadService = {
            getFileNames: getFileNames,
            addFileToGroup: addFileToGroup,
            uploadFiles: uploadFiles,
            isFilesUploaded: isFilesUploaded,
            removeFileInGroup: removeFileInGroup,
            createGroup: createGroup,
            fileUploadSupported: fileUploadSupported
        };


        function addFileToGroup(file, groupName){
            var group = groups[groupName];
            group.files.push(file);
        }

        function uploadFiles(url, reject){
            var promises = [];
            return $q(function(resolve){
                Object.keys(groups).forEach(function(groupname){
                    var group = groups[groupname];
                    group.files.forEach(function(file){
                        var formData = new $window.FormData();
                        formData.append('file', file, file.name);
                        var promise = $http.post(url, formData, config).then(function(response){
                            group.docIds.push(response.data.receiptId);
                        }, function(errorResponse){
                            return reject(errorResponse);
                        });
                        promises.push(promise);
                    });
                });
                return $q.all(promises).then(function(){
                    filesUploaded = true;
                    return resolve(groups);});
            });
        }

        function isFilesUploaded() {
            return filesUploaded;
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


        return uploadService;

    }

})(angular);
