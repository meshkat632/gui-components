angular.module('ect.directives.ectFileSender', []).directive('ectFileSender', [ '$document', '$timeout', '$interval','$window', function($document, $timeout, $interval, $window) {

	var _templateUrl = 'ect-file-sender.html';
	if($window.getTetemplateUrl){
		_templateUrl = $window.getTetemplateUrl('ect-file-sender.html');
	}
	return {
		templateUrl : _templateUrl,
		replace : true,
		scope : {
			filetransfer : "=filetransfer"
		},
		controller : function($scope) {
			console.log('ectFileSender controller');
		},
		link : function($scope, element, attr) {
			console.log('ectFileSender link',$scope.filetransfer, $scope.filetransfer.file);


			$scope.readyToSend = function(file, fileName, fileSize) {
				console.log('readyToSend');
				$scope.STATE = 'FILE_SELECTED';
				$scope.file = file;
				$scope.fileName = fileName;
				$scope.fileSize = fileSize / 1000 + 'kB';
				//$scope.to = $scope.options.to();
				$scope.isSending = false;
				//$scope.$apply();

			};
			$scope.startSending = function() {
				$scope.progress = 0;
				$scope.isSending = true;
				var fileTransferListener = {
					onEstablished : function() {
						console.log('onEstablished');
						$scope.progress = 0;
						//$scope.$apply();
						$scope.STATE = 'CONNECTED';
						$scope.$apply();
					},
					onStateChanged : function(state) {
						console.log('-------onStateChanged state:', state, $scope.progress);
						if ($scope.progress == 100) {
							return;
						}
						$scope.STATE = state;

						if (state === 'REJECTED') {
							$scope.onError(new Error('fileTransfer was rejected'));
						}
						if (state === 'STOPPED') {
							$scope.onError(new Error('fileTransfer was stopped' + $scope.progress));
						}

						$scope.$apply();
					},
					onProgress : function(transferred_bytes, total_bytes) {
						var percentage = Math.round(transferred_bytes / total_bytes * 100);
						$scope.progress = percentage;
						$scope.$apply();

					},
					onFailure : function(reason) {
						if ($scope.progress == 100) {
							return;
						}
						console.log('onFailure reason:', reason);
						$scope.STATE = 'ERROR';
						$scope.error = reason;
						//$scope.$apply();
					},
					onSuccess : function(blob) {
						console.log('onSuccess blob:', blob);
						$scope.STATE = 'COMPLETED';
						$scope.progress = 100;
						//$scope.$apply();
					}
				};

				$scope.filetransfer.fileSender({file:$scope.file, fileTransferListener:fileTransferListener });

				/*
				if ($scope.options.onSendFile && $scope.file) {
					$scope.options.onSendFile($scope.file, fileTransferListener);
				}
				*/
			};

			$scope.cancelSending = function() {
				console.log('cancelSending', $scope.isSending);
				if ($scope.isSending)
					if ($scope.options.onCancelSendFile) {
						$scope.options.onCancelSendFile();
					}
				$scope.idle();
			}

			$scope.onSuccess = function() {
				$scope.state = 'on_success';
			}

			$scope.onError = function(error) {
				$scope.state = 'ERROR';
				$scope.error = error.message;

			}
			$scope.idle = function(msg) {
				$scope.STATE = 'IDLE';
				$scope.msg = msg;
			}
			$scope.close = function() {
				console.log('close', element);
				element.remove();
				/*
				try {
					if ($scope.options.onClose)
						$scope.options.onClose();
				} catch (e) {

				}
				*/
			}

			$scope.idle();


			var jsfile = $scope.filetransfer.file;

			if (jsfile) {
				$scope.readyToSend(jsfile, jsfile.name, jsfile.size);
				$scope.startSending();
			}
			return;


		}
	};
} ]);