angular.module('ect.directives.ectMessage', ['ect.directives.ectFileTransfer']).directive('ectMessage', [ '$document','$window', function($document, $window) {

	var _templateUrl = 'ect-message.html';
	if($window.getTetemplateUrl){
		_templateUrl = $window.getTetemplateUrl('ect-message.html');
	}
	return {
		templateUrl : _templateUrl,//'ect-message.html',
		replace : true,
		scope : {
			message : "=message"
		},
		link : function($scope, element, attr) {
		}
	};
} ]);

