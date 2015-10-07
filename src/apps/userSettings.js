import moment from 'moment';
import jquery from 'jquery';
import angular from 'angular';
//import ectChat from 'ectChat';
import ExtensionProvider from 'lib/ExtensionProvider';
import MediaAccessManager from 'lib/MediaAccessManager';


navigator.getUserMedia = ( navigator.getUserMedia ||
navigator.webkitGetUserMedia ||
navigator.mozGetUserMedia ||
navigator.msGetUserMedia);



MediaAccessManager.init(document);
MediaAccessManager.ask(function(){console.log('on suceess');}, function(){console.log('on error');});

let app = {
    start:function(){
        console.log('starting userSettings app');
        //console.log('ectChat 134:', ectChat);
        angular.module('myApp',[]).controller('myController', ['$scope', '$interval', function ($scope, $interval) {


            $scope.data = " I  am the user setting page";

            $scope.user = undefined;
            $scope.save = function () {
                console.log('save', $scope.user.name, $scope.user.password);
                ExtensionProvider.getExtension().updateUser({
                    name: $scope.user.name,
                    password: $scope.user.password
                }, function () {
                    console.log('usersettings updated');
                }, function (error) {
                    console.log(error);
                });
            };
            /*
             $interval(function(){
             var currentTimeStr = moment().format('MMMM Do YYYY, h:mm:ss a');
             console.log('time:', currentTimeStr);
             $scope.data = currentTimeStr;
             },1000);
             */


            ExtensionProvider.getExtension().loadLastUser(function (user) {
                console.log('user loaded', user);
                $scope.user = user;
                $scope.$apply();
            }, function (error) {
                console.log(error);
            });

        }]);

        angular.bootstrap(document, ['myApp']);
    }
};
export default app;

