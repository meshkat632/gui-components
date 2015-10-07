import ECTPhoneFactory from 'lib/ECTPhoneFactory';
import {CommunicationListener} from 'lib/CommunicationListener';
import {ChatSession} from 'lib/ChatSession';

export class ReactivePhone {
    constructor(eventBus) {
        this.EventBus = eventBus;
        var self = this;
        eventBus.register('CMD_LOGIN', function (event) {
            ECTPhoneFactory.init(eventBus);
            var communicationListener = new CommunicationListener(eventBus);
            //var userName = event.userName;
            var userInfo = event.userInfo;

            ECTPhoneFactory.createPhone(userInfo, 'assets/dialTone.wav', 'assets/ringTone.wav', communicationListener, function (_phone) {
                console.log('phoen is created', _phone.meta);
                self.enhancePhone(_phone);
                communicationListener.init(_phone);
                communicationListener.selfuri = _phone.meta.userUri;
                //self.psm = _phone.meta.psm;
                var event = new Event('STATE_LOGGED_IN');
                event.phone = _phone;
                event.userName = userInfo.name;
                event.userUri = _phone.meta.userUri;
                event.user = {
                    name : _phone.meta.userName,
                    uri: _phone.meta.userUri,
                    id: _phone.meta.userId,
                    uuid: _phone.meta.uuid,
                    cli:_phone.meta.cli,
                    phone:_phone
                }
                console.log('phoen is created', event);
                eventBus.publish(event);

            }, function (error) {
                console.error('phone failed to start!', error);
                var event = new Event('STATE_LOGGED_IN_FAILED');
                event.error = error;
                event.userName = userInfo.name;
                eventBus.publish(event);
            });

        });
    }


    startChat(to, from, msg) {
        var newChatSession = new ChatSession(from, to, 'outgoing');
        newChatSession.outgoing(msg, from);
        this.chatSessions.set(to, newChatSession);

        var event = new Event('PHONE_NEW_CHAT_SESSION');
        event.chatSession = newChatSession;
        this.EventBus.publish(event);

        return newChatSession;
    }

    setClientCapabilities(options) {
        this.phone.setClientCapabilities(options);
    }

    setLastFileTransfer(lastFileTransfer) {
        this.lastFileTransfer = lastFileTransfer;
    }

    getLastFileTransfer() {
        return this.lastFileTransfer;
    }

    enhancePhone(phone) {


        phone.getUserSettings = function (successCallBack, errorCallBack) {
            console.log("getUserSettings ", phone.meta.psm.getStatus());
            if (phone.meta.psm === undefined) {
                errorCallBack(new Error('pubSubManager is not defined'));
                return;
            }
            if (phone.meta.psm.getStatus() !== 'connected') {
                errorCallBack(new Error('pubSubManager is connected'));
                return;
            }
            var psReq = new PubSubRequestResponse(phone.meta.psm, '/service/ect/vab/vabUser/1', 2000);
            psReq.sendRequest({
                method: "getUserSettings",
                _class: "com.ect.cometd.msg.Request",
                data: {
                    "criteria": {}
                }
            }, {
                timeout: function () {
                    // separate timeout handler
                    console.log("timeout");
                    errorCallBack("timeout");
                },
                response: function (res) {
                    console.log("response", res);
                    if (res.type == 'SUCCESS') {
                        successCallBack(res.data.result);
                    }
                    else if (res.type == 'ERROR') {
                        console.error("Recieved error response", res);
                        errorCallBack("Recieved error response", res);

                    }
                }
            });
        };

        phone.updateUserSettings = function (newUserSettings, successCallBack, errorCallBack) {
            if (newUserSettings === undefined) {
                errorCallBack(new Error('invalid data: UserSettings can not be undefined!'));
                return;
            }
            if (phone.meta.psm === undefined) {
                errorCallBack(new Error('pubSubManager is not defined'));
                return;
            }
            if (phone.meta.psm.getStatus() !== 'connected') {
                errorCallBack(new Error('pubSubManager is connected'));
                return;
            }


            var psReq = new PubSubRequestResponse(phone.meta.psm, '/service/ect/vab/vabUser/1', 2000);
            psReq.sendRequest({
                method: "updateUserSettings",
                _class: "com.ect.cometd.msg.Request",
                data: {
                    "criteria": {
                        "call_screening": newUserSettings.call_screening, // true|false for the call screening flag
                        "available": newUserSettings.available // true|false for the available flag
                    }
                }
            }, {
                timeout: function () {
                    // separate timeout handler
                    console.log("timeout");
                    errorCallBack("timeout");
                },
                response: function (res) {
                    console.log("response", res);
                    if (res.type == 'SUCCESS') {
                        successCallBack(res.data);
                    }
                    else if (res.type == 'ERROR') {
                        console.error("Recieved error response", res);
                        errorCallBack("Recieved error response", res);

                    }
                }
            });
        };

    }
}