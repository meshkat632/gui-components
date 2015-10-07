
import moment from 'moment';
import angular from 'angular';

angular.module('ect.directives.ectCallControl', []).directive('ectCallControl',
	[ '$document', '$timeout', '$interval', '$window', function($document, $timeout, $interval, $window) {

		// var chatWaitingSound = new Audio('../assets/chat-sound.mp3');
		// var phoneRingingSound = new Audio('../assets/chat-sound.mp3');

		return {

			// templateUrl: 'ect-call-controlonly.html',
			templateUrl : 'ng/ectCallControl.html',
			replace : true,
			scope : {
				options : "=options"
			},
			controller : function($scope) {
				// console.log('ectCallControl controller');
			},
			link : function($scope, element, attr) {

				/*
				 * var localStreamTarget =
				 * element.find(".localView").get(0); var remoteStreamTarget =
				 * element.find(".remoteView").get(0);
				 */

				var localStreamTarget = element.find(".localView").get(0);
				var remoteStreamTarget = element.find(".remoteView").get(0);
				//$('.bootstrap-switch-checkbox').bootstrapSwitch();

				console.log('localStreamTarget', localStreamTarget);
				console.log('remoteStreamTarget', remoteStreamTarget);

				var _startRinging = function() {
					/*
					 * console.log('startRinging');
					 * phoneRingingSound.onended = function(){
					 * //console.log('phoneRingingSound onended');
					 * phoneRingingSound.play(); }; var duration =
					 * phoneRingingSound.duration;
					 * //console.log('phoneRingingSound duration:',
					 * duration); phoneRingingSound.play();
					 */
				}
				var _stopRinging = function() {
					/*
					 * console.log('stopRinging');
					 * phoneRingingSound.pause();
					 */
				}

				var _attachMediaStreams = function(call) {

					var localStream = call.getLocalMediaStream();
					if (localStream && localStreamTarget) {
						localStreamTarget.src = window.URL.createObjectURL(localStream);
						localStreamTarget.volume = 0;
					}
					var remoteStream = call.getRemoteMediaStream();
					if (remoteStream != null && remoteStreamTarget) {
						remoteStreamTarget.src = window.URL.createObjectURL(remoteStream);
					}
				};

				var _detachMediaStreams = function(call) {

					var localStream = call.getLocalMediaStream();
					if (localStreamTarget && localStreamTarget.src) {
						if (localStream && localStream.stop) {
							localStream.stop();
							localStream = null;
						}
						window.URL.revokeObjectURL(localStreamTarget.src);
						localStreamTarget.src = "";
					}
					var remoteStream = call.getRemoteMediaStream();
					if (remoteStreamTarget && remoteStreamTarget.src) {
						window.URL.revokeObjectURL(remoteStreamTarget.src);
						remoteStreamTarget.src = "";
					}
				};

				$scope.onProgress = function() {
					$scope.state = 'on_progress';
					$timeout(function() {
						$scope.progress = $scope.progress;
					}, 2000);
				}

				$scope.connected = function() {
					$scope.state = 'connected';
				}
				$scope.disconnect = function() {
					$scope.state = 'disconnected';

					$timeout(function(){
						$scope.close();
					}, 2000);

					$scope.call.callObject.disconnect();

				}
				$scope.transfer = function() {
					$scope.state = 'transferred';
					$scope.call.callObject.transfer();
				}

				$scope.hold = function() {
					$scope.state = 'hold';
					$scope.call.callObject.hold();
				}
				$scope.unhold = function() {
					$scope.state = 'unhold';
					$scope.call.callObject.unhold();
					$timeout(function() {
						$scope.state = 'connected';
					}, 1000);

				}


				$scope.onError = function(error) {
					$scope.state = 'on_error';
					$scope.error = error.message;

					$timeout(function(){
						$scope.close();
					}, 2000);

				}
				$scope.idle = function(msg) {
					$scope.state = 'idle';
					$scope.msg = msg;


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
				$scope.newCall = function(callControlObject, isAlreadyAccepted) {
					console.log('newCall callControlObject:', callControlObject);
					$scope.state = 'newcall';
					$scope.call = {};
					$scope.call.connected = false;
					$scope.call.type = callControlObject.type;
					$scope.call.name = callControlObject.name;
					$scope.call.uri = callControlObject.uri;
					$scope.call.callObject = callControlObject.call;
					$scope.call.duration = '00:00:00';
					if (callControlObject.type == 'REMOTE') {
						_startRinging();
						$scope.call.accepted = function() {
							console.log('accepted');
							_stopRinging();
							try {
								callControlObject.call.connect(false);
							} catch (error) {
								console.log('error while rejection', error);
							}
							$scope.idle('Call was accepted');
						}
					} else {
						$scope.call.otherPartyStatus = 'Trying';
						_stopRinging();
					}

					$scope.call.rejected = function() {
						console.log('rejected', callControlObject.call);
						_stopRinging();
						$scope.idle('Call was rejected');
						try {
							console.log('callControlObject.call:', callControlObject.call);
							var options = { status_code: 457, reason_phrase: "Callee rejected the call" };
							callControlObject.call.disconnect(options);
						} catch (error) {
							console.log('error while rejection', error);
						}
					}

					// console.log("[PhoneManager] newCall type:"+type+'
					// name:'+name+' uri:'+uri);
					callControlObject.call.addProgressListener(function(code, reason) {
						console.log("[callControl] onProgressListener Code: " + code + '; Reason: ' + JSON.stringify(reason));
						$timeout(function() {
							if (reason) {
								if (reason == 'Ringing') {
									$scope.call.otherPartyStatus = 'Ringing';
									_startRinging();
								}
							}
							$scope.call.otherPartyStatus = reason;
						});

						/*
						 * var callProgressEvent = new
						 * Event('SIP-CALL-PROGRESS');
						 * callProgressEvent.state = reason;
						 * EventBus.publish(callProgressEvent);
						 */

					});
					callControlObject.call.addConnectedListener(function(videoCall) {
						console.log("[callControl] oncall:onConnectedListener started (" + (videoCall === true ? "video" : "audio") + ")");

						$timeout(function() {

							_stopRinging();
							$scope.call.otherPartyStatus = 'connected';
							$scope.connected();
							$scope.call.connected = true;
							$scope.call.videoCall = videoCall;
							var started = moment();
							$scope.call.started = started;
							console.log('started:', $scope.call.started);
							$scope.call.startedStr = '' + $scope.call.started.format('MMMM Do YYYY, h:mm:ss a');
							console.log('started:', $scope.call.startedStr);
							// $scope.call.duration =
							// ''+$scope.call.started.duration(0,
							// 'minutes');
							$scope.call.durationInterval = $interval(function() {
								var now = moment();
								var duration = moment.duration(now.diff(started));
								var hours = duration.hours();
								var minutes = duration.minutes();
								var seconds = duration.seconds();

								var hoursStr = hours < 10 ? '0' + hours : hours;
								var minutesStr = minutes < 10 ? '0' + minutes : minutes;
								var secondsStr = seconds < 10 ? '0' + seconds : seconds;

								var durationStr = hoursStr + ':' + minutesStr + ':' + secondsStr;
								$scope.call.duration = durationStr;
								//console.log('duration:', durationStr);
							}, 999);

							// callControlObject.phone.attachMediaStreams(callControlObject.call);
							_attachMediaStreams(callControlObject.call);

						});
					});

					callControlObject.call.addFailedListener(function(code, reason, cause) {
						console.log("[callControl] oncall:Failed Cause=" + cause + "; Code: " + code);
						// EventBus.publish(new Event('SIP-CALL-FAILED'));
						$timeout(function() {

							if(code == '457'){
								$scope.onError({
									message : code+": Call was  rejected."
								});
							}
							else if(code == '486'){
								$scope.onError({
									message : code+": Callee was busy."
								});
							}
							else if(code == '480'){
								$scope.onError({
									message : code+": Temporarily Unavailable."
								});
							}else{
								$scope.onError({
									message : 'Error: code:'+code+" reason:"+reason+" cause:"+cause+"."
								});
							}

							/*
							 * $scope.call.otherPartyStatus= 'disconnected';
							 * $scope.state = 'disconnected'; $scope.msg =
							 * 'Failed Cause=' + cause + ' Code: '+ code+'
							 * call duration:['+$scope.call.duration+']';
							 * $interval.cancel($scope.call.durationInterval);
							 * $scope.call.durationInterval = undefined;
							 *
							 * if(!callControlObject.call.isDisconnected()){
							 * callControlObject.call.disconnect(); }
							 * _detachMediaStreams(callControlObject.call);
							 */

						});
					});
					callControlObject.call.addDisconnectedListener(function(code, reason, cause) {
						console.log("[callControl] oncall:Disconnected Cause=" + cause + "; Code: " + code, 'isDisconnected', callControlObject.call.isDisconnected());
						$timeout(function() {
							$scope.call.otherPartyStatus = 'disconnected';
							$scope.state = 'disconnected';
							$scope.msg = 'call duration:[' + $scope.call.duration + ']';
							$interval.cancel($scope.call.durationInterval);
							$scope.call.durationInterval = undefined;

							if (!callControlObject.call.isDisconnected()) {
								callControlObject.call.disconnect();
							}
							_detachMediaStreams(callControlObject.call);

							$timeout(function(){
								$scope.close();
							}, 2000);

						});
						// callControlObject.phone.detachMediaStreams();
						/*
						 * $scope.call.connected = false;
						 * $scope.call.videoCall = undefined;
						 * $scope.call.remoteMediaStream = undefined;
						 * $scope.call.selfMediaStream = undefined;
						 * $scope.disconnect(); $scope.$apply();
						 */
					});

					if (isAlreadyAccepted) {
                        $scope.call.accepted();
                    }

				}

				$scope.idle();
				$scope.options.setController({
					newCall : function(callControlObject, isAlreadyAccepted) {
                        console.log('inside ', $scope.newCall(callControlObject, isAlreadyAccepted));
                    }
				});

			}
		};
	} ]);


angular.module('ect.services.ectCallControlManager', ['ect.directives.ectCallControl']).factory('ectCallControlManager',
    [ '$window', '$document', '$rootScope', '$compile', '$timeout', '$interval', function($window, $document, $rootScope, $compile, $timeout, $interval) {
        // var containerTemplate = $("<div id='_containerForEctCallControl'
        // style='width: 400px; height: 500px;border: 2px dashed
        // lightgray;overflow: hidden'></div>");
        var containerTemplate = $("<div id='_containerForEctCallControl' class='containerForEctCallControl'></div>");

        return {
            log : function(msg) {
                console.log('ectCallControlManager:', msg);
            },
            createCallControl : function(callControlObject, isAlreadyAccepted, controlContainer, callback) {
                //controlContainer.append('<div>helllllllllllllllllo</div>');

                if (!callControlObject) {
                    console.error('invalid callControlObject ');
                    return;
                }

                callControlObject.direction = "incoming";

                if (controlContainer == undefined) {
                    console.log('createCallControl:', callControlObject);
                    var container = containerTemplate.clone(true);
                }

                var $alertScope = $rootScope.$new(true);
                $alertScope.ectFileReceiverOptions = {
                    onAccept : function() {
                        console.log('onAccept');
                    },
                    onDeny : function() {
                        console.log('onDeny');
                    },
                    onClose : function() {
                        console.log('onClose callback:', callback);
                        if(callback){
                            callback.onClose();
                        }
                        container.remove();
                    },
                    setController : function(controller) {
                        console.log('setting controller', controller);
                        controller.newCall(callControlObject, isAlreadyAccepted);
                        /*
                        var isAlreadyAccepted = isAlreadyAccepted || false;

                        */
                    }
                }

                var template = angular.element("<ect-call-control options='ectFileReceiverOptions'></ect-call-control>");
                var linkFn = $compile(template);
                var element = linkFn($alertScope);
                controlContainer.append(element);

            }
            // $window.alert(msg);
        };
    } ]);