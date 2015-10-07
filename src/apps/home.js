import moment from 'moment';
import jquery from 'jquery';
import angular from 'angular';

import ExtensionProvider from 'lib/ExtensionProvider';
import MediaAccessManager from 'lib/MediaAccessManager';
import EventBus from 'lib/EventBus';


let app = {
    start:function($window){

        console.log('starting homepage at:', moment());
        angular.module('myApp',[]).controller('homeController', ['$scope', '$interval','$window','$location','$timeout',function ($scope, $interval, $window,$location,$timeout) {
            $scope.data= 'hello from angular';
        }]);
        angular.bootstrap(document, ['myApp']);
    }
};
export default app;