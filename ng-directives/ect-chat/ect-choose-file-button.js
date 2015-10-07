angular.module('ect.directives.ectChooseFileButton', []).directive('ectChooseFileButton', ['$document', '$timeout', '$interval','$templateCache','$window', function ($document, $timeout, $interval, $templateCache, $window) {



    var _templateUrl = 'ect-choose-file-button.html';
    if($window.getTetemplateUrl){
        _templateUrl = $window.getTetemplateUrl('ect-choose-file-button.html');
    }
    var counter = 0;
    //console.log('templateUrl:',templateUrlMapper['ect-choose-file-button']);
    return {
        templateUrl: _templateUrl,
        //template :strVar,
        transclude: true,
        scope: {
            multiple: "@",
            'onSelect': '&onSelect'
        },
        link: function ($scope, element, attr) {
            //console.log('ectChooseFileButton multiple', attr.multiple);
            counter = counter + 1;
            $scope.id = 'ectChooseFileButton_' + counter;
            element.attr('id', $scope.id);

            $scope.multiple = '';
            if (attr.multiple == undefined)
                $scope.multiple = '';
            else {
                element.find('.sendFile').attr('multiple', 'multiple');
                element.find('.sendFile').attr('id', 'sendFile_' + counter);
                $scope.multiple = 'multiple';
            }
            var $sendFile = element.find('.sendFile');
            console.log('$sendFile:',$sendFile);
            $sendFile.bind('click', function () {
                var sendFile = $sendFile.get(0);
                sendFile.onchange = function (e) {
                    var files = [];
                    var keys = Object.keys(sendFile.files);
                    keys.forEach(function (key) {
                        var file = sendFile.files[key];
                        files.push(file);
                    });
                    $scope.onSelect({files: files, id: $scope.id});
                };
            });
            console.log('ectChooseFileButton:', $scope.id, $scope.multiple, $scope.onSelect);


            $scope.onContainerClicked = function(){
                console.log('open filebrowser 123');
                var elem = document.getElementById('sendFile_' + counter);
                console.log('elem',elem);
                if(elem && document.createEvent) {
                    var evt = document.createEvent("MouseEvents");
                    evt.initEvent("click", true, false);
                    elem.dispatchEvent(evt);
                }

            }

        }
    };
}]);