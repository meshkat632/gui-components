angular.module('ect.directives.ectFileSender', []).directive('ectFileSender', [ '$document', '$timeout', '$interval','$window', function($document, $timeout, $interval, $window) {

	var _templateUrl = 'ect-file-sender.html';
	if($window.getTetemplateUrl){
		_templateUrl = $window.getTetemplateUrl('ect-file-sender.html');
	}
	return {
		templateUrl : _templateUrl,
		replace : true,
		scope : {
			options : "=options"
		},
		controller : function($scope) {
			console.log('ectFileSender controller');
		},
		link : function($scope, element, attr) {
			console.log('ectFileSender link');

			$sendFile = element.find('.sendFile');
			$sendFile.bind('click', function() {
				console.log('on click');
				var sendFile = $sendFile.get(0);
				sendFile.onchange = function(e) {
					console.log('onchange');
					var jsfile = sendFile.files[0];
					console.log(jsfile, typeof jsfile);
					if (jsfile) {
						$scope.readyToSend(jsfile, jsfile.name, jsfile.size);
					}
				};

			});

			$scope.readyToSend = function(file, fileName, fileSize) {
				$scope.STATE = 'FILE_SELECTED';
				$scope.file = file;
				$scope.fileName = fileName;
				$scope.fileSize = fileSize / 1000 + 'kB';
				$scope.to = $scope.options.to();
				$scope.isSending = false;
				$scope.$apply();

			};

			$scope.startSending = function() {
				$scope.progress = 0;
				$scope.isSending = true;
				var fileTransferListener = {
					onEstablished : function() {
						console.log('onEstablished');
						$scope.progress = 0;
						$scope.$apply();
						//$scope.STATE = 'CONNECTED';
						//$scope.$apply();
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
						$scope.$apply();
					},
					onSuccess : function(blob) {
						console.log('onSuccess blob:', blob);
						$scope.STATE = 'COMPLETED';
						$scope.progress = 100;
						$scope.$apply();
					}
				};
				if ($scope.options.onSendFile && $scope.file) {
					$scope.options.onSendFile($scope.file, fileTransferListener);
				}
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
		}
	};
} ]);

angular.module('ect.directives.ectFileReceiver', []).directive('ectFileReceiver', [ '$document', '$timeout', '$interval','$window', function($document, $timeout, $interval, $window) {

	var _templateUrl = 'ect-file-receiver.html';
	if($window.getTetemplateUrl){
		_templateUrl = $window.getTetemplateUrl('ect-file-receiver.html');
	}
	return {
		templateUrl : _templateUrl,
		replace : true,
		scope : {
			options : "=options"
		},
		controller : function($scope) {
			console.log('ectFileReceiver controller');
		},
		link : function($scope, element, attr) {
			console.log('ectFileReceiver link');

			var link = $document.find('#lnkDownload').get(0);

			$scope.accepted = function() {
				console.log('accepted');
				$scope.filetransferObject.filetransfer.accept();
				//$scope.onProgress();

			}

			$scope.rejected = function() {
				console.log('rejected');
				$scope.onError(new Error('user rejected incoming file request'));
				$scope.filetransferObject.filetransfer.reject();
				$scope.idle();
			}

			$scope.onProgress = function(progress) {
				$scope.state = 'on_progress';
				$scope.progress = progress;
				if ($scope.progress == 100) {
					$timeout(function() {
						$scope.progress = 0;
						$scope.onSuccess();
					}, 2000);
				}
			}
			$scope.onSuccess = function() {
				$scope.state = 'on_success';
			}

			$scope.onError = function(error) {
				$scope.state = 'on_error';
				$scope.error = error.message;
			}
			$scope.idle = function() {
				$scope.state = 'idle';

			}
			$scope.close = function() {
				$scope.state = 'close';
				element.remove();
				try {
					if ($scope.options.onClose)
						$scope.options.onClose();
				} catch (e) {

				}
			}
			$scope.cancelSending = function() {
				console.log('cancelSending receiver', $scope.filetransferObject);
				$scope.filetransferObject.filetransfer.stop();
			}
			$scope.incoming = function(filetransferObject) {
				console.log('incoming filetransferObject:', filetransferObject);
				$scope.STATE = 'WAITING';
				$scope.progress = 0;
				if (filetransferObject.filetransfer != undefined) {
					$scope.filetransferObject = filetransferObject;
					$scope.fileName = filetransferObject.filetransfer.getFilename();
					$scope.fileSize = (filetransferObject.filetransfer.getFilesize() / 1000) + 'kB';
					$scope.from = filetransferObject.name;
					var fileTransferListener = {
						onEstablished : function() {
							console.log('newFiletransfer onEstablished');
							$scope.progress = 0;
						},
						onStateChanged : function(state) {
							console.log('newFiletransfer state:', state);
							$scope.STATE = state;
							$scope.$apply();
						},
						onProgress : function(transferred_bytes, total_bytes) {
							var percentage = Math.round(transferred_bytes / total_bytes * 100);
							$scope.progress = percentage;
							$scope.$apply();
						},
						onFailure : function(reason, code) {
							console.log('onFailure reason:', reason);
							$scope.STATE = 'ERROR';
							$scope.error = reason;
							$scope.$apply();
						},
						onSuccess : function(blob) {
							console.log('newFiletransfer onSuccess blob:', blob);
							if (blob) {
								link.href = window.URL.createObjectURL(blob);
								link.target = '_blank';
								link.download = $scope.fileName;
							}

						}
					};
					filetransferObject.filetransfer.setListener(fileTransferListener);

				}

			}

			$scope.idle();
			$scope.options.setController({
				incoming : function(filetransferObject) {
					console.log('inside ', $scope.incoming(filetransferObject));

				}
			});

		}
	};
} ]);
/*
angular.module('ect.directives.ectFileReceiverDummy', []).directive('ectFileReceiverDummy', [ '$document', '$timeout', '$interval', function($document, $timeout, $interval) {
	var counter = 0;
	console.log('ectFileReceiverDummy load');
	return {
		templateUrl : 'ect-file-receiver-dummy.html',
		replace : true,
		scope : {
			options : "=options"
		},
		compile : function(tElement, tAttrs, transclude) {
			console.log('ectFileReceiverDummy compile ', tElement, tAttrs, transclude);
		},
		controller : function($scope) {
			console.log('ectFileReceiverDummy controller');
		},
		link : function($scope, element, attr) {
			counter = counter + 1;
			console.log('ectFileReceiverDummy link');
			element.append("<p class='mark'>ectFileReceiverDummy_" + counter + "</p>");
		}
	};
} ]);
*/
angular.module('ect.services.ectNotifyService', []).factory('ectNotifyService',
		[ '$window', '$document', '$rootScope', '$compile', function($window, $document, $rootScope, $compile) {
			//var container = $("<div id='_containerForEctFileReceiver' class='containerForEctFileReceiver' style='width: 400px; height: 200px;border: 5px dashed lightgray;overflow: hidden'></div>");
			var containerTemplate = $("<div id='_containerForEctFileReceiver' class='containerForEctFileReceiver'></div>");
			var fileTransferSenderCounter = 0;
			return {
				log : function(msg) {
					console.log('ectNotify:', msg);
				},
				createEctFileReceiver : function(filetransferObject, controlContainer) {
					if (!filetransferObject) {
						console.error('invalid filetransferObject ');
						return;
					}
					console.log('typeof filetransferObject.filetransfer', typeof filetransferObject.filetransfer);
					/*
					if(typeof filetransferObject.filetransfer != 'ECTFiletransfer'){
					    console.error('filetransferObject.filetransfer is not instanceof ECTFiletransfer');
					    return;
					}
					 */

					console.log('createEctFileReceiver:', filetransferObject);

					var $alertScope = $rootScope.$new(true);
					$alertScope.ectFileReceiverOptions = {
						onAccept : function() {
							console.log('onAccept');
						},
						onDeny : function() {
							console.log('onDeny');
						},
						onClose : function() {
							console.log('onClose');
							container.remove();
						},
						setController : function(controller) {
							console.log('setting controller', controller);
							controller.incoming(filetransferObject);
						}
					}

					var template = angular.element("<ect-file-receiver options='ectFileReceiverOptions'></ect-file-receiver>");
					var linkFn = $compile(template);
					var element = linkFn($alertScope);
					if (controlContainer) {
						controlContainer.append(element);
						controlContainer.empty = function() {
							element.remove();
						}
					} else {
						var container = containerTemplate.clone(true);
						container.append(element);
						$("body").append(container);
					}

				},
				createEctFileSender : function(controlContainer, to, EventBus) {
					fileTransferSenderCounter = fileTransferSenderCounter +1;
					console.log('createEctFileSender', controlContainer, to, EventBus);

					var $alertScope = $rootScope.$new(true);
					$alertScope.ectFileSenderOptions = {
						to : function() {
							return to;
						},
						onAccept : function() {
							console.log('onAccept');
						},
						onDeny : function() {
							console.log('onDeny');
						},
						onClose : function() {
							console.log('onClose');
						},
						onCancelSendFile : function() {
							var event = new Event('CMD_CANCEL_SEND_FILE');
							EventBus.publish(event);
						},
						onSendFile : function(file, fileTransferListener) {
							console.log('sending file:', file);
							console.log('to:', to);
							var event = new Event('CMD_SEND_FILE');
							event.to = to;
							event.file = file;
							event.fileTransferListener = fileTransferListener;
							EventBus.publish(event);

						}
					}

					var template = angular.element("<ect-file-sender options='ectFileSenderOptions'></ect-file-sender>");
					var linkFn = $compile(template);
					var element = linkFn($alertScope);
					controlContainer.append(element);
				},
				createEctChatWindow : function(controlContainer, chatSession) {
					console.log('createEctChatWindow', controlContainer, chatSession);
					var $alertScope = $rootScope.$new(true);
					$alertScope.chat = chatSession;

					var template = angular.element("<ect-chat data='chat'></ect-chat>");
					var linkFn = $compile(template);
					var element = linkFn($alertScope);

					$alertScope.chat.onClose = function() {
						console.log('onClose');
						element.hide();
					};

					chatSession.addOnNewMessageListener(function(chatMessage) {
						console.log(chatSession.Id + ' onChatMessage', chatMessage);
						if (chatMessage.type == 'incoming'){
							$alertScope.$apply();
							element.show();
						}

						/*
						if (element._isDetached) {
							controlContainer.append(element);
							element.show();
						} else {
							element.show();
						}
						if (chatMessage.type == 'incoming')
							$alertScope.$apply();
							*/

					});


					chatSession.addWidgetListener({
						show : function() {
							console.log('show chat window');
							element.show();
						},
						hide : function() {
							console.log('hide chat window');
							element.hide();
						},
						destroy : function() {
							console.log('destroy chat window');
							element.empty();
						}

					});


					controlContainer.append(element);
					/*
					if (controlContainer) {
						controlContainer.append(element);
						controlContainer.isChat = true;
						controlContainer.empty = function() {
							console.log('removed!');
							element._isDetached = true;
							element.hide();

						}

					} else {
						var container = containerTemplate.clone(true);
						container.append(element);
						$("body").append(container);
					}
					*/
				}
			//$window.alert(msg);
			};
		} ]);
