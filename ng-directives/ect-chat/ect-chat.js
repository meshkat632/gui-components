angular.module('ect.directives.ectChat', ['ect.directives.ectMessage','ect.directives.ectChooseFileButton']).directive('ectChat', [ '$document','$window', function($document, $window) {
    var _templateUrl = 'ect-chat-new.html';
    if($window.getTetemplateUrl){
        _templateUrl = $window.getTetemplateUrl('ect-chat-new.html');
    }
    return {
		templateUrl : _templateUrl,
		replace : true,
		scope : {
			messages : "=messages",
			'onSendMessage': '&onSendMessage',
            'onSendFile': '&onSendFile'
		},
		link : function($scope, element, attr) {
			console.log('element',element);
			var messageContainer= element.find('.mypage-body');

			var btnInput= element.find('#btn-input');
			btnInput.focus();
			btnInput.bind
			$scope.sendMessage = function(textInput){
				if(textInput==undefined || textInput =='' ) return;
				$scope.onSendMessage({message: {from:'Bob', msg:{ type:'CHAT', text:textInput} }});
				$scope.textInput = '';
				btnInput.focus();
				setTimeout(function(){
					var maxScrollHeight = messageContainer[0].scrollHeight;
					console.log(messageContainer.height(), maxScrollHeight);
					messageContainer.scrollTop(maxScrollHeight);
				},10);

			};
			$scope.onKeyPress = function(keyEvent) {
				if (keyEvent.which === 13){
					$scope.sendMessage($scope.textInput);
				}
			}

			$scope.fileSelected = function(files){
				console.log('fileSelected files',files);
				files.forEach(function(jsfile){
					console.log('jsfile', jsfile,jsfile.name, jsfile.size);
					$scope.onSendMessage({message: {from:'Bob', msg:{ type:'FILE', filetransfer:{file:jsfile, direction:'sending', fileSender:$scope.onSendFile}, text:'sending file '+jsfile.name+' size:'+jsfile.size } }});
                    setTimeout(function(){
                        btnInput.focus();
                        var maxScrollHeight = messageContainer[0].scrollHeight;
                        console.log(messageContainer.height(), maxScrollHeight);
                        messageContainer.scrollTop(maxScrollHeight);
                    },10);
				});

                $scope.$apply();
			};

		}
	};
} ]);
