angular.module('ect.directives.ectChooseFileButton', []).directive('ectChooseFileButton', ['$document', '$timeout', '$interval', function ($document, $timeout, $interval) {
    var counter = 0;
    return {
        templateUrl: 'ect-choose-file-button.html',
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
        }
    };
}]);