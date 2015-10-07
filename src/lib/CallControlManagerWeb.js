import moment from 'moment';
import jquery from 'jquery';
import angular from 'angular';
import ectChat from 'ng/ectChat';
import ectCallControl from 'ng/ectCallControl';
import ExtensionHelper from 'lib/ExtensionHelper';
import ExtensionProvider from 'lib/ExtensionProvider';

var callObjects = [];
var lastWindowId = undefined;
var eventBus = undefined;
var callControlContainer = undefined;

/*
angular.module('myApp',[]).controller('callController', ['$scope', '$interval','$window','$location','$timeout', function ($scope, $interval, $window,$location,$timeout) {
    $scope.data ='gelllo';
}]);
angular.bootstrap(document, ['myApp']);
*/

let CallControlManagerWeb = {
    init:function(_eventBus, document){
        eventBus = _eventBus;
        angular.module('myApp',['ect.directives.ectChat','ect.services.ectCallControlManager']).controller('callController', ['$scope', '$interval','$window','$location','$timeout','ectCallControlManager', function ($scope, $interval, $window,$location,$timeout, ectCallControlManager) {
            $scope.data ='gelllo';
            var callControlContainer= jquery('.call-control-container');
            CallControlManagerWeb.createCallControl = function(newCallSession,isAlreadyAccepted){
                var uuid = generateUUID();
                console.log("on createCallControl callSession:",newCallSession);
                ectCallControlManager.createCallControl(newCallSession, isAlreadyAccepted|| false, callControlContainer, {
                    onClose: function(){
                    console.log('close the window');
                    }
                 });
            }
        }]);
        angular.bootstrap(document, ['myApp']);

        /*
        callControlContainer= jquery('.call-control-container-container');
        var element = document.getElementsByClassName('call-control-container-container')[0];

        setTimeout(function(){
            console.log('callControlContainer',element);

        }, 5000);
        */
        /*
        angular.module('myApp',[]).controller('callController', ['$scope', '$interval','$window','$location','$timeout', function ($scope, $interval, $window,$location,$timeout) {
            $scope.data ='gelllo';
        }]);
        angular.bootstrap(document, ['myApp']);
        */




        /*
        eventBus.register('CALL-CONTROL-VIEW-LOADED', function(_event){
            console.log("CALL-CONTROL-VIEW-LOADED:",_event);
            var event =new Event('CALL-CONTROL-VIEW-START');
            event.callSession = callObjects[lastWindowId].callSession;
            event.isAlreadyAccepted = true;
            _eventBus.publish(event);

        });
        */
    },
    _createCallControl:function(newCallSession){
        var uuid = generateUUID();
        console.log("on createCallControl callSession:",newCallSession);
        /*
        ectCallControlManager.createCallControl(newCallSession, event.isAlreadyAccepted, callControlContainer, {
            onClose: function(){
                console.log('close the window');
            }
        });
        */
    }

};

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};


export default CallControlManagerWeb;