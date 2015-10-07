import moment from 'moment';
import $ from 'jquery';
import noty from 'noty';
import angular from 'angular';
import StyleManager from 'lib/StyleManager';


let app = {
    start:function(document) {
        console.log('starting vabWebrtcClient app document:', document);

        $(document).ready(function(){
            console.log('ready');
            //$('body').append("<div> I am the the container </div>");

            function check(){
                 observer.disconnect();
                 console.log('on dom Mutation',arguments);
                 var appContainer = $('.appContainer');
                 if(appContainer == null){
                     console.error('appContainer not ready');
                 }else{
                     console.log('appContainer is ready');
                     angular.module('myApp',[]).controller('appController', ['$scope',function ($scope) {
                         $scope.data= 'hello 1323213213';
                     }]);
                     angular.bootstrap(document, ['myApp']);


                 }
            }
            var observer = new MutationObserver(check);
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
            $('body').append("<div class='appContainer' ng-controller='appController'><ng-include src='\"ng/application.html\"'></ng-include></div>");

            //angular.module('myTemplates',[])


            /*
            angular.module("template/accordion/accordion-group.html", []).run(["$templateCache", function($templateCache) {
                $templateCache.put("template/accordion/accordion-group.html",
                    "<div class=\"panel panel-default\">\n" +
                        "HALLO" +
                    "</div>\n" +
                    "");
            }]);



            angular.module('myApp',['template/accordion/accordion-group.html']).controller('appController', ['$scope',function ($scope) {
                $scope.data= 'hello';
            }]);
            */


        });




        //StyleManager.init(document);
    }
};
export default app;