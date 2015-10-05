angular.module('ect.directives.ectChooseFileButton', []).directive('ectChooseFileButton', ['$document', '$timeout', '$interval','$templateCache', function ($document, $timeout, $interval, $templateCache) {

    var strVar="";
    strVar += "<span id={{id}}>";
    strVar += "<style>";
    strVar += "";
    strVar += "    .btn-file {";
    strVar += "        position: relative;";
    strVar += "        overflow: hidden;";
    strVar += "    }";
    strVar += "    .btn-file input[type=file] {";
    strVar += "";
    strVar += "        position: absolute;";
    strVar += "        top: 0px;";
    strVar += "        right: 0px;";
    strVar += "";
    strVar += "        min-width: 100%;";
    strVar += "        min-height: 100%;";
    strVar += "        opacity: 0;";
    strVar += "        outline: none;";
    strVar += "        cursor: inherit;";
    strVar += "        display: block;";
    strVar += "    }";
    strVar += "";
    strVar += "";
    strVar += "    \/*";
    strVar += "    #{{id}}{";
    strVar += "";
    strVar += "    }";
    strVar += "    #{{id}} button {";
    strVar += "        position: relative;";
    strVar += "        overflow: hidden;";
    strVar += "    }";
    strVar += "    #{{id}} button input[type=file] {";
    strVar += "";
    strVar += "        position: absolute;";
    strVar += "        top: 0px;";
    strVar += "        right: 0px;";
    strVar += "";
    strVar += "        min-width: 100%;";
    strVar += "        min-height: 100%;";
    strVar += "        opacity: 0;";
    strVar += "        outline: none;";
    strVar += "        cursor: inherit;";
    strVar += "        display: block;";
    strVar += "    }";
    strVar += "    *\/";
    strVar += "<\/style>";
    strVar += "    <button type=\"file\" class=\"btn btn-info btn-sm btn-file\">";
    strVar += "        <ng-transclude><\/ng-transclude>";
    strVar += "        <input class='sendFile' type=\"file\" >";
    strVar += "    <\/button>";
    strVar += "<\/span>";

    var counter = 0;
    //console.log('templateUrl:',templateUrlMapper['ect-choose-file-button']);
    return {
        //templateUrl: window.templateUrlMapper['ect-choose-file-button'],//'ect-choose-file-button.html',
        template :strVar,
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