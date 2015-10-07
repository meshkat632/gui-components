import moment from 'moment';
import jquery from 'jquery';
import noty from 'noty';
import angular from 'angular';

//import ectChat from 'ectChat';
//import appState from 'appState';
import ExtensionHelper from 'lib/ExtensionHelper';
import ExtensionProvider from 'lib/ExtensionProvider';
import ECTPhoneFactory from 'lib/ECTPhoneFactory';
import EventBus from 'lib/EventBus';
import CallControlManager from 'lib/CallControlManager';
import CallControlManagerWeb from 'lib/CallControlManagerWeb';

import MediaAccessManager from 'lib/MediaAccessManager';


import {CommunicationListener} from 'lib/CommunicationListener';
import {ReactivePhone} from 'lib/ReactivePhone';

let app = {
    start:function($window){




        console.log('starting sampleClient app');
        var dialToneAudio = 'assets/dialTone.wav';
        var ringToneAudio = 'assets/ringTone.wav';
        var userName = 'Bob';



        console.log('calling set EventBus:',EventBus);
        $window.setEventBus(EventBus);
        $window.setCurrentUser = function(user){
            window.currentUser = user;
        }
        $window.getCurrentUser = function(){
            return window.currentUser;
        }

        MediaAccessManager.init(document);
        ExtensionProvider.init(EventBus);
        CallControlManager.init(EventBus);
        CallControlManagerWeb.init(EventBus, document);
        var reactivePhone = new ReactivePhone(EventBus);



        ExtensionProvider.getExtension().disable();

        EventBus.register('USER_SETTINGS_CHANGED', function (_event) {
            ExtensionProvider.getExtension().disable();
            ExtensionProvider.getExtension().reload();
        });
        EventBus.register('STATE_LOGGED_IN', function (event) {

            console.log('on STATE_LOGGED_IN:',event);
            $window.setCurrentUser(event.user);

            ExtensionProvider.getExtension().updateUserLoginStatus(true);
            ExtensionProvider.getExtension().notify({title:'Login success.', body:'logged in as '+event.userName+' with uri:'+event.userUri+'.'});
            //event.phone = _phone;
            var phoneOptions = {
                audio:true,
                video:true,
                chat: true,
                filetransfer: true
            };

            var event =new Event('CMD_REGISTER_PHONE');
            event.capabilities = phoneOptions;
            event.audioOnly = false;
            EventBus.publish(event);

        });
        EventBus.register('PHONE_REGISTERED', function (event) {
            console.log('on PHONE_REGISTERED:', event);
            ExtensionProvider.getExtension().notify({title: 'PHONE_REGISTERED.', body: 'sip registration completed.'});

            ExtensionProvider.getExtension().enable();
            ExtensionProvider.getExtension().setIcon({
                path: 'assets/icon_enabled.png'
            }, function () {
                console.log('sip registration completed');
            });
        });

        EventBus.register('PHONE_UNREGISTERED', function (event) {
            console.log('on PHONE_UNREGISTERED:', event);
            ExtensionProvider.getExtension().updateUserLoginStatus(false);
            ExtensionProvider.getExtension().disable();
            ExtensionProvider.getExtension().notify({title: 'PHONE_UNREGISTERED.', body: 'your phone is unregistered.'});
            ExtensionProvider.getExtension().setIcon({
                path: 'assets/icon_disabled.png'
            }, function () {
                console.log('sip phone unregistered');
            });
        });



        EventBus.register('STATE_LOGGED_IN_FAILED', function (event) {
            console.log('on STATE_LOGGED_IN_FAILED:',event);
            ExtensionProvider.getExtension().updateUserLoginStatus(false);
            ExtensionProvider.getExtension().disable();
            ExtensionProvider.getExtension().notify({title:'Login failed', body: "failed to log in as "+event.userName+" detail:"+event.error+"."});

        });

        EventBus.register('PHONE_NEW_CALL', function(event){
            var newCallSession = event.callSession;
            console.log('onNewCallSession:',newCallSession);
            if(!ExtensionHelper.isExtension()){
                CallControlManagerWeb.createCallControl(newCallSession, false);
                return;
            }



                var opt = {
                message:{
                    title: 'Incoming call',
                    body: 'from '+newCallSession.uri
                },
                accepted: function(){
                    console.log('accepted', newCallSession);
                    CallControlManager.createCallControl(newCallSession);
                },
                rejected:function(){
                    console.log('rejected', newCallSession);
                    newCallSession.call.disconnect();
                },
                timedOut :function(){
                    console.log('timedOut', newCallSession);
                    newCallSession.call.disconnect();
                },
                getCallObject: function(){
                    return newCallSession.call;
                }

            };
            ExtensionProvider.getExtension().prompt(opt);

        });


        ExtensionProvider.getExtension().loadLastUser(function (user) {
            console.log('login as user: ', user);
            var event = new Event('CMD_LOGIN');
            //event.userName = user.name;
            event.userInfo = {
                name: user.name,
                password: user.password,
                cli:user.name
            };
            EventBus.publish(event);
        }, function (error) {
            console.log(error);
        });



        if($window){
            $window._p = function(_title,_body,_timeout){
                var opt = {
                  message:{
                      title: _title,
                      body: _body
                  },
                  accepted: function(){
                      console.log('accepted');
                  },
                  rejected:function(){
                      console.log('rejected');
                  },
                  timedOut :function(){
                      console.log('timedOut');
                  }
                };
                ExtensionProvider.getExtension().prompt(opt);
            };

            $window._loadUserSettings = function(){

                var user = $window.getCurrentUser();
                if(user){
                    var event =new Event('CMD_LOAD_USERSETTINGS');
                    event.userId = user.id;
                    EventBus.publish(event);
                }else{
                    console.error('CurrentUser not found');
                }
            };

            $window._updateUserSettings = function(available, callScreening){
                var user = $window.getCurrentUser();
                if(user){
                    var event =new Event('CMD_UPDATE_USERSETTINGS');
                    event.userId = user.id;
                    event.userSettings = {
                        callScreening: callScreening,
                        available: available
                    };
                    EventBus.publish(event);
                }else{
                    console.error('CurrentUser not found');
                }
            };
            $window._getCapabilities = function(){
                var user = $window.getCurrentUser();
                if(user){
                    var phone = user.phone;
                    console.log('phone.clientCapabilities:', phone.getClientCapabilities());
                }else{
                    console.error('CurrentUser not found');
                }
            };
            $window._setCapabilities = function(capabilities){
                var capabilities = capabilities || {audio: true, video: false, chat: true, filetransfer: true};
                console.log(capabilities);
                var user = $window.getCurrentUser();
                if(user){
                    var phone = user.phone;
                    phone.setClientCapabilities(capabilities);
                    console.log('phone.clientCapabilities:', phone.getClientCapabilities());
                }else{
                    console.error('CurrentUser not found');
                }
            }

        }

    }
};
export default app;