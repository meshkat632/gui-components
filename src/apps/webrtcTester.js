import moment from 'moment';
import jquery from 'jquery';
import configuration from 'apps/configuration';
import ECTPhone from 'phone/ECTPhone_1.0.2';
import PubSubManager from "ectxml/pubSubManager";
import MediaAccessManager from "lib/MediaAccessManager";
import PopupCtrlClientApi from "app/PopupCtrlClient_1.0.0";

/*
require([ "app/PopupCtrlClient_1.0.0"], function(PopupCtrlClientApi) {
    var api = new PopupCtrlClientApi({psm: psmState.psm, timeout: 5000}, events);
    api.open(!!$window.RTCPeerConnection || !!$window.webkitRTCPeerConnection || !!$window.mozRTCPeerConnection);
    deferred.resolve({api: api, passport: psmState.passport});
});
*/



let webrtcTester = {
    start: function ($window) {
        console.log('starting webrtcTester app', moment());
        console.log('$window:', $window);
        jquery('body').append('jquery is ready');

        navigator.getUserMedia = ( navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);



        MediaAccessManager.init(document);
        //MediaAccessManager.ask(function(){console.log('on suceess');}, function(){console.log('on error');});

        //MediaAccessManager.init(document);

        var config = configuration.build('vab', {name: 'test1', cli: 'test1', password: 'test1'});
        console.log('config', config);
        var communicationListener = {
            started: function (state) {
                console.log('started');
            },
            stopped: function (code, reason) {
                console.log('stopped');
            },
            failed: function (reason) {
                console.log('failed');
            },
            registered: function (code, reason) {
                console.log('registered');
            },
            unregistered: function (code, reason, cause) {
                console.log('unregistered');
            }
        };
        console.log('config.cometd', config.cometd);
        var psm = new PubSubManager(config.cometd.url);
        psm.start(config.cometd.credentials, function(successful, passport, error, msg) {
            if (successful) {
                console.log('on cometd connected passport:',passport);
            } else {
                console.error('on cometd failed to connect! error:',error);
            }
        });
        psm.registerConnectionListener({
            connected : function() {
                console.log('psm started:', config.sip);
                var api = new PopupCtrlClientApi({psm: psm, timeout: 5000}, {});
                api.htmlPage(sender, 17, 1002330, html, weekTest);

                ////////////////////////
                var phone = new ECTPhone(config.sip, communicationListener, config.cometd.url, config.cometd.credentials);
                phone.start();
                setTimeout(function () {
                    phone.register();
                    MediaAccessManager.ask(function(mediaStream){
                        console.log('success mediaStream',mediaStream);
                        setTimeout(function () {
                            phone.call("vab", false, null, mediaStream);
                        }, 3000);
                    }, function(){
                        console.log('error',arguments);
                    });
                    /*
                    setTimeout(function () {
                        phone.call("vab", false, null, null);
                    }, 3000);
                    */
                }, 3000);

                /*
                display_name: "eid5p2bf.y919k9"
                extraMessageHeaders: Array[1]
                pcConfig: Object
                register: false
                uri: "sip:eid5p2bf.y919k9@sipgw2.ect-telecoms.de"
                ws_servers: "wss://sipgw2.ect-telecoms.de"
                __proto__: Object
                */

            }
        });


        /*
        application: "vab"
        name: "_POPUP_"
        owner: "ect"
        properties: Object
        role: "USER"
        __proto__: Object
        */
        /*
        var phone = new ECTPhone(config.sip, communicationListener, config.cometd.url, config.cometd.credentials);
        phone.start();
        setTimeout(function () {
            phone.register();
            setTimeout(function () {
                phone.call("vab", false, null, null);
            }, 3000);
        }, 3000);
        */

    }
};
export default webrtcTester;

