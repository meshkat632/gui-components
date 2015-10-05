angular.module('ect.directives.ectChat', []).directive('ectChat', [ '$document', function($document) {
	return {
		templateUrl : 'ect-chat.html',
		replace : true,
		scope : {
			messages : "=messages",
			'onSendMessage': '&onSendMessage'
		},
		link : function($scope, element, attr) {
			console.log('element',element);
			$scope.sendMessage = function(textInput){
				$scope.onSendMessage({message: {from:'Bob', msg:{ type:'CHAT', text:textInput} }});
			};
			$scope.fileSelected = function(files){
				console.log('fileSelected files',files);
				files.forEach(function(jsfile){
					console.log('jsfile', jsfile,jsfile.name, jsfile.size);
					$scope.onSendMessage({message: {from:'Bob', msg:{ type:'FILE', filetransfer:{file:jsfile}, text:'sending file '+jsfile.name+' size:'+jsfile.size } }});
				});
                $scope.$apply();
			};
		}
	};
} ]);
