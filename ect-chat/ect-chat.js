angular.module('ect.directives.ectChat', []).directive('ectChat', [ '$document', function($document) {
	return {
		templateUrl : 'ect-chat.html',
		replace : true,
		scope : {
			options : "=options",
			data : "=data"
		},
		link : function(scope, element, attr) {
			//console.log('element',element, 'options:',scope.options);
			var vm = {};
			vm.id = "id_" + Math.random();
			vm.input = "";
			vm.values = [];

			/*vm.sendMsg = vm.sendMsg || vm.msgs.sendMsg;*/

			function clearInput() {

				vm.input = "some random text:"+Math.floor(Math.random() * (10000 - 1000)) + 1000;
			}

			function updateScroll() {
				/*
				setTimeout(function() {
					var objDiv = document.getElementById(vm.id);
					objDiv.scrollTop = objDiv.scrollHeight;
				}, 10);
				*/
			}

			vm.getNiceName = function(uglyName) {
				var original = '' + uglyName;
				try {
					uglyName = uglyName.replace("sip:", "");
					uglyName = uglyName.substring(0, uglyName.indexOf("@"));
					return uglyName;
				} catch (error) {
					return original;
				}

			}

			vm.close = function() {
				console.log('close');
				try {
					if (scope.data.onClose)
						scope.data.onClose();
				} catch (error) {

				}

			}

			vm.myFunct = function(keyEvent) {
				// Send message on Enter key pressed
				if (keyEvent.which === 13) {
					vm.send(vm.input);

					// Stop the propagation
					event.preventDefault();
				}
			}

			vm.send = function(msg) {
				// You are not allowed to send an empty message
				if (msg == "")
					return;

				scope.data.sendMessage(msg);
				clearInput();
				/*

				// Send the message to the destination
				// phone.send(destination, msg);

				// Add the message after it has been sent
				var item = {};
				item.msg = msg;
				item.dir = "send";
				vm.values.push(item);
				updateScroll();

				// Reset the input message


				vm.receive("echo "+msg);
				 */

			};

			vm.receive = function(msg) {
				// You are not allowed to receive an empty message
				if (msg == "")
					return;

				// Add the message
				var item = {};
				item.msg = msg;
				item.dir = "received";
				vm.values.push(item);
				updateScroll();
			};
			vm._send = function(msg) {
				// You are not allowed to receive an empty message
				if (msg == "")
					return;

				// Add the message
				var item = {};
				item.msg = msg;
				item.dir = "send";
				vm.values.push(item);
				updateScroll();
			};

			vm.id = scope.data.Id;
			vm.from = scope.data.from;
			vm.to = scope.data.to;
			scope.vm = vm;

			//console.log('data:',scope.data);
			scope.$watch('data', function(newValue, oldValue) {
				//console.log('ect-chat data changed', oldValue,newValue);
				vm.values = [];
				newValue.messages.forEach(function(message) {
					//console.log('ect-chat message:',message);
					if (message.type == "incoming")
						vm.receive(message.msg);
					else if (message.type == "outgoing")
						vm._send(message.msg);
					else{
						console.log('unknow message type', message);
					}
				});

			}, true);

		}
	};
} ]);
