import {ChatMessage} from 'lib/ChatMessage';
import {ChatSession} from 'lib/ChatSession';

export class CommunicationListener {
    constructor(eventBus) {
        this.EventBus = eventBus;
        this.chatSessions = {};
    }

    init(phone) {
        var self = this;
        this.phone = phone;
        var getPhone = function () {
            return self.phone;
        };
        var EventBus = self.EventBus;
        EventBus.register('CMD_STOP_PHONE', function (event) {
            getPhone().stop();
        });
        EventBus.register('CMD_REGISTER_PHONE', function (event) {
            getPhone().setClientCapabilities(event.capabilities);
            getPhone().register(event.audio);
        });
        EventBus.register('CMD_UNREGISTER_PHONE', function (event) {
            getPhone().unregister();
        });
        EventBus.register('CMD_SEND_FILE', function (event) {
            var filetransfer = getPhone().sendFile(event.to, event.file, event.file.name, event.fileTransferListener);
            self.setLastFileTransfer(filetransfer);
            var event = new Event('FILE_SENDING_STARTED');
            event.filetransfer = filetransfer;
            EventBus.publish(event);
        });
        EventBus.register('CMD_CANCEL_SEND_FILE', function (event) {
            var fileTransferObject = self.getLastFileTransfer(fileTransferObject);
            if (fileTransferObject) {
                fileTransferObject.stop();
            }
        });
        EventBus.register('CMD_CALL', function (event) {
            if (self.lastCall) {
                console.log('lastCall isConnected:', self.lastCall.isConnected(), ' state:', self.lastCall.getState());
                var state = self.lastCall.getState();
                if (state === 'INITIALIZING' || state === 'CONNECTED') {
                    var event = new Event('NOTIFY');
                    event.type = "error";
                    event.text = 'Multiple call is not enabled';
                    EventBus.publish(event);
                    return;
                }
            }
            getPhone().call(event.to, event.audioOnly, null, self.getStream());
        });
        EventBus.register('CMD_CHANGE_CAPABILITIES', function (event) {
            var capabilities = event.capabilities;
            getPhone().setClientCapabilities(capabilities);
        });

        EventBus.register('CMD_LOAD_SUBSCRIPTIONS', function (event) {
            getPhone().getSubscriptions().then(function (value) {
                var event = new Event('PHONE_SUBSCRIPTIONS_LOADED');
                event.subscriptions = value.subscriptions;
                EventBus.publish(event);
            }, function (value) {
                console.log("CMD_LOAD_SUBSCRIPTIONS Failed", value);
            });
        });

        EventBus.register('CMD_START_CHAT', function (event) {
            var aChatSession = self.getChatSession(event.to);
            if (aChatSession == undefined) {
                aChatSession = self.newOutGoingChatSession(event.to, event.from, '');
                var event = new Event('PHONE_NEW_CHAT_SESSION');
                event.chatSession = aChatSession;
                event.chatSession.sendMessage = function (msg) {
                    event.chatSession.outgoing(msg, event.chatSession.to);
                    getPhone().send(event.chatSession.to, msg);
                };
                EventBus.publish(event);
            } else {
                aChatSession.show();
            }
        });
    }

    setPhone(phone) {
        this.phone = phone;
    }

    getPhone(phone) {
        return this.phone;
    }

    setStream(stream) {
        this.stream = stream;
    }

    getStream() {
        return this.stream;
    }

    setHeaders(headers) {
        this.headers = headers;
    }

    getHeaders() {
        return this.headers;
    }

    connected() {
        var event = new Event('PHONE_CONNECTED');
        this.EventBus.publish(event);
    }

    disconnected(code, reason) {
        var event = new Event('PHONE_DISCONNECTED');
        this.EventBus.publish(event);
        var event = new Event('NOTIFY');
        event.type = "error";
        event.text = 'PHONE_DISCONNECTED';
        EventBus.publish(event);
    }

    registered(status_code, reason_phrase) {
        var event = new Event('PHONE_REGISTERED');
        this.EventBus.publish(event);
    }

    unregistered(status_code, reason_phrase, cause) {
        var event = new Event('PHONE_UNREGISTERED');
        event.status_code = status_code;
        event.reason_phrase = reason_phrase;
        event.cause = cause;
        this.EventBus.publish(event);
    }

    registrationFailed(status_code, reason_phrase, cause) {
        var event = new Event('PHONE_REGISTRATION_FAILED');
        this.EventBus.publish(event);
    }

    newCall(type, name, uri, call) {
        var self = this;
        console.log('lastCall:', self.lastCall, 'phone:', this.phone);


        call.transfer = function () {
            try {
                var chromeheader = JSON.parse(self.lastCall._sip_headers.Ectchromeheader[0].raw);
                var event = new Event('CMD_CALL_CTRL');
                event.sessionId = chromeheader.sessionId;
                event.userID = self.phone.meta.userId;
                event.moduleNo = chromeheader.moduleNo;
                event.command = "TRANSFER";
                event.message = '{command:"TRANSFER"}';
                EventBus.publish(event);

            } catch (error) {
                console.log('call.transfer', chromeheader, typeof chromeheader);
            }
        };
        call.hold = function () {
            try {
                var chromeheader = JSON.parse(self.lastCall._sip_headers.Ectchromeheader[0].raw);
                var event = new Event('CMD_CALL_CTRL');
                event.sessionId = chromeheader.sessionId;
                event.userID = self.phone.meta.userId;
                event.moduleNo = chromeheader.moduleNo;
                event.command = "HOLD";
                event.message = '{command:"HOLD"}';
                EventBus.publish(event);

            } catch (error) {
                console.log('call.transfer', chromeheader, typeof chromeheader);
            }
        };
        call.unhold = function () {
            try {
                var chromeheader = JSON.parse(self.lastCall._sip_headers.Ectchromeheader[0].raw);
                var event = new Event('CMD_CALL_CTRL');
                event.sessionId = chromeheader.sessionId;
                event.userID = self.phone.meta.userId;
                event.moduleNo = chromeheader.moduleNo;
                event.command = "UNHOLD";
                event.message = '{command:"UNHOLD"}';
                EventBus.publish(event);

            } catch (error) {
                console.log('call.transfer', chromeheader, typeof chromeheader);
            }
        };


        if (self.lastCall) {
            if(self.lastCall.isConnected()){
                var options = {status_code: 486, reason_phrase: "Busy Here"};
                call.disconnect(options);
                return;
            }else{

            }
            /*
            console.log('lastCall isConnected:', self.lastCall.isConnected(), ' state:', self.lastCall.getState());
            var state = self.lastCall.getState();
            if (state === 'INITIALIZING' || state === 'CONNECTED') {
                var options = {status_code: 486, reason_phrase: "Busy Here"};
                call.disconnect(options);
                return;
            }
            */
        }


        self.lastCall = call;
        var ectPhone = self.getPhone();
        var event = new Event('PHONE_NEW_CALL');
        event.callSession = {
            audio: call.isVideoCall(),
            type: type,
            name: name,
            uri: uri,
            call: call,
            phone: ectPhone
        };
        this.EventBus.publish(event);
    }

    onNewRTCSession(rtcSession) {
        var event = new Event('PHONE_NEW_RTC_SESSION');
        this.EventBus.publish(event);
    }

    newMessage(display_name, uri_to, body) {
        var self = this;
        var ectPhone = self.getPhone();
        var aChatSession = self.getChatSession(uri_to);
        console.log("aChatSession", aChatSession);
        if (aChatSession == undefined) {
            var event = new Event('PHONE_NEW_CHAT_SESSION');
            event.chatSession = self.newIncomingChatSession(uri_to, body);
            event.chatSession.sendMessage = function (msg) {
                console.log('onSendMessage:', event.chatSession, msg);
                event.chatSession.outgoing(msg, event.chatSession.from);
                ectPhone.send(event.chatSession.to + '', msg);
            };
            this.EventBus.publish(event);
        } else {
            aChatSession.incoming(body, uri_to);
        }

    }

    sendSuccess() {
        var event = new Event('PHONE_MESSAGE_SEND');
        this.EventBus.publish(event);
    }

    sendFailed() {
        var event = new Event('PHONE_MESSAGE_SEND_FAILED');
        this.EventBus.publish(event);
    }

    newFiletransfer(type, name, uri, filetransfer) {
        var event = new Event('PHONE_NEW_FILE_TRANSFER');
        event.filetransferObject = {
            type: type,
            name: name,
            uri: uri,
            filetransfer: filetransfer
        };
        this.EventBus.publish(event);
    }

    newSystemMessag(message) {
        var event = new Event('PHONE_NEW_SYSTEM_MESSAGE');
        this.EventBus.publish(event);
    }

    newIncomingChatSession(from, msg) {
        var newChatSession = new ChatSession(this.selfuri, from, 'incoming');
        newChatSession.incoming(msg, from);
        //this.chatSessions.set(from, newChatSession);
        this.chatSessions[from] = newChatSession;
        return newChatSession;
    }

    newOutGoingChatSession(to, from, msg) {
        var newChatSession = new ChatSession(from, to, 'outgoing');
        //this.chatSessions.set(to, newChatSession);
        this.chatSessions[to] = newChatSession;
        return newChatSession;
    }

    getChatSession(to) {
        //return this.chatSessions.get(to);
        return this.chatSessions[to];
    }


    addedSubscriptions(message) {
        var event = new Event('PHONE_SUBSCRIPTION_ADDED');
        event.subscriptions = [];
        for (var propt in message) {
            var subscription = message[propt];
            event.subscriptions.push(subscription);
        }
        this.EventBus.publish(event);
    }

    removedSubscriptions(message) {
        var event = new Event('PHONE_SUBSCRIPTION_REMOVED');
        event.subscriptions = [];
        for (var propt in message) {
            var subscription = message[propt];
            event.subscriptions.push(subscription);
        }
        this.EventBus.publish(event);
    }

    forceLogout(reasonCode) {
        console.log('forceLogout');
        var event = new Event('PHONE_FORCED_LOGOUT');
        this.EventBus.publish(event);

    }

    setLastFileTransfer(lastFileTransfer) {
        this.lastFileTransfer = lastFileTransfer;
    }

    getLastFileTransfer() {
        return this.lastFileTransfer;
    }
}

