import angular from 'angular';

angular.module('ect.directives.ectChat', []).directive('ectChat', [ '$document', function($document) {
	return {
		//template : '<div>i am ectChat</div>',
		templateUrl : 'ng/ectChat.html',
		replace : true,
		scope : {
		},
		link : function(scope, element, attr) {
			console.log('I am link of ect-chat');
			scope.data = 'hi';
		}
	};
}]);