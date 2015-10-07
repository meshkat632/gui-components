angular.module('ect.directives.ectFileTransfer', ['ect.directives.ectFileSender']).directive('ectFileTransfer', [ '$document','$window', function($document,$window) {
    var _templateUrl = 'ect-file-transfer.html';
    if($window.getTetemplateUrl){
        _templateUrl = $window.getTetemplateUrl('ect-file-transfer.html');
    }
	return {
		templateUrl : _templateUrl,
		replace : true,
		scope : {
			filetransfer : "=filetransfer"
		},
		link : function($scope, element, attr) {
			console.log('filetransfer:', $scope.filetransfer);
            $scope.fileName = $scope.filetransfer.file.name;
            $scope.fileSize = $scope.filetransfer.file.size+' B';
            if($scope.filetransfer.direction =='sending'){
                $scope.state='Sending file...';
            }else {
                $scope.state='Receiving file...';
            }

		}
	};
} ]);
