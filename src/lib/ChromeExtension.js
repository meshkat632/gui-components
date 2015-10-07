import Commons from 'lib/Commons';
var uuid = Commons.utils.generateUUID();
let chromeExtension = {
    uuid : uuid,
    extensionType: 'CHROME',//CHROME, FIREFOX, WEB
    notifications : {},
    init: function(eventbus){
        var self= this;
        var lastUser = { };
        lastUser.id = Math.abs(Math.random()*1000);
        lastUser.old = undefined;
        chromeExtension.loadLastUser(function(user){
            console.log("loadLastUser success", user);
            lastUser.old = user;
        });

        chrome.storage.onChanged.addListener(function(changes, namespace) {
            console.log("chrome.storage.onChanged");

            chromeExtension.loadLastUser(function(user){
                console.log("chrome.storage.onChanged new user:", lastUser.old,' --> ',user);

                if(lastUser.old === undefined){
                    console.log('changed');
                    lastUser.old = user;
                    var event = new Event('USER_SETTINGS_CHANGED');
                    event.user = user;
                    if(eventbus)
                        eventbus.publish(event);
                    return;
                }
                if(lastUser.old.name === user.name && lastUser.old.password === user.password){
                    console.log('no change');
                    return;
                }else{
                    console.log('changed');
                    lastUser.old = user;
                    var event = new Event('USER_SETTINGS_CHANGED');
                    event.user = user;
                    if(eventbus)
                        eventbus.publish(event);
                    return;
                }
            });
        });


        chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex){
            //console.log("[NotificationManager]  Notification onButtonClicked notificationId:"+notificationId+" buttonIndex:"+buttonIndex);
            var notification = self.notifications[notificationId];
            if(notification){
                if(buttonIndex === 0){
                    notification.accepted();
                    notification.clear();
                }
                else if(buttonIndex === 1){
                    notification.rejected();
                    notification.clear();
                }
            }
        });

        chrome.notifications.onClosed.addListener(function (notificationId, byUser){
            //console.log("[NotificationManager]  Notification onClosed notificationId:"+notificationId+" byUser:"+byUser);
            var notification = self.notifications[notificationId];
            if(notification && byUser){
                notification.rejected();
                notification.clear();
            }
        });
    },
    disable: function(){
        console.log('disable');
        chrome.browserAction.disable();
    },
    enable: function(){
        console.log('enable');
        chrome.browserAction.enable();
    },
    setIcon: function(details, callback){
        console.log('setIcon ',details);
        chrome.browserAction.setIcon(details, callback);
    },
    loadLastUser: function(onSuccess, onError){
        console.log('loadLastUser');
        chrome.storage.sync.get({
            username : '_$none$_',
            password : '_$none$_',
            loginStatus: '_$none$_'
        }, function(items){
            items.loginStatus = items.loginStatus || false;
            if(items.username === '_$none$_' || items.password === '_$none$_'){
                if(onError){
                    onError(new Error('FAILED_TO_LOAD_USER:No user found!'));
                }
            }else{
                var user = {
                    name: items.username,
                    password: items.password,
                    loginStatus: items.loginStatus
                }
                if(onSuccess){
                    onSuccess(user);
                }
            }
        });

    },
    updateUser: function(user, onSuccess){
        console.log('updateUser', user);
        chrome.storage.sync.set({
            username : user.name,
            password : user.password
        }, function() {
            if(onSuccess)onSuccess('Data stored');
        });
    },
    updateUserLoginStatus: function(isLoggedIn, onSuccess){
        console.log('updateUserLoginStatus', isLoggedIn);
        chrome.storage.sync.set({
            loginStatus: isLoggedIn
        }, function() {
            if(onSuccess)onSuccess('Data stored');
        });
    },

    reload: function(){
        console.log('reload');
        setTimeout(function(){
            chrome.runtime.reload();
        }, 2000);
    },
    prompt: function(options){
        var self = this;
        var uuid = Commons.utils.generateUUID();
        var opt = {
            type: "progress",
            title: options.message.title,
            message: options.message.body,
            iconUrl : "../assets/virtualpbx-call-32px.png",
            priority : 2,
            progress:100,
            contextMessage : this.message,
            buttons : [ {
                title : "Accept",
                iconUrl : "../assets/yesIcon.png"
            }, {
                title : "Reject",
                iconUrl : "../assets/noIcon.png"
            } ]
        };
        var close = {
            type: "basic",
            title: options.message.title,
            message: options.message.body,
            iconUrl : "../assets/virtualpbx-call-32px.png",
            priority : 2,
            buttons : []
        };

        var window = chrome.notifications.create(uuid,opt, function(id) {
            console.log("Notification created. ID:" + id+' uuid',uuid);
            self.notifications[id] = options;
        });

        options.counter = 21;
        options.timeoutId = setInterval(function(){
            console.log("update notification. uuid:",uuid);
            options.counter = options.counter -1;
            if(options.counter == 0){
                chrome.notifications.clear(uuid, function (){
                    clearInterval(options.timeoutId);
                    //delete options;
                });
                if(options.timedOut)
                    options.timedOut();

                return;
            }

            //opt.message =  options.message.body+'['+options.counter+']';
            opt.progress = Math.round(options.counter/20*100);
            chrome.notifications.update(uuid, opt);

        },1000);
        options.clear = function(){
            clearInterval(options.timeoutId);
        };


        options.getCallObject().addFailedListener(function(code, reason, cause) {
            console.log("[callControl] oncall:Failed Cause=" + cause + "; Code: " + code);
            if(cause === 'Canceled'){
                close.title = "Call was canceled";
                //close.message = "code:"+code+" reason:"+reason+" cause:"+cause;
                chrome.notifications.update(uuid, close);
                options.clear();
                setTimeout(function(){
                    chrome.notifications.clear(uuid, function (){
                        clearInterval(options.timeoutId);
                    });
                }, 2000);
                return;
            }
            if(code == '457'){
                close.title = "Call was  rejected";
                //close.message = "code:"+code+" reason:"+reason+" cause:"+cause;
                chrome.notifications.update(uuid, close);
                options.clear();
                setTimeout(function(){
                    chrome.notifications.clear(uuid, function (){
                        clearInterval(options.timeoutId);
                    });
                }, 2000);

            }
            else if(code == '486'){
                close.title = "Callee was busy.";
                //close.message = "code:"+code+" reason:"+reason+" cause:"+cause;
                chrome.notifications.update(uuid, close);
                options.clear();
                setTimeout(function(){
                    chrome.notifications.clear(uuid, function (){
                        clearInterval(options.timeoutId);
                    });
                }, 2000);
            }
            else if(code == '480'){
                close.title = "Temporarily Unavailable.";
                //close.message = "code:"+code+" reason:"+reason+" cause:"+cause;
                chrome.notifications.update(uuid, close);
                options.clear();
                setTimeout(function(){
                    chrome.notifications.clear(uuid, function (){
                        clearInterval(options.timeoutId);
                    });
                }, 2000);
            }else{
                close.title = 'Error: code:'+code+" reason:"+reason+" cause:"+cause+".";
                //close.message = "code:"+code+" reason:"+reason+" cause:"+cause;
                chrome.notifications.update(uuid, close);
                options.clear();
                setTimeout(function(){
                    chrome.notifications.clear(uuid, function (){
                        clearInterval(options.timeoutId);
                    });
                }, 2000);
            }

        });




    },
    notify: function(message){

        var opt = {
            type: "basic",
            title: message.title,
            message: message.body,
            iconUrl: "../assets/empty.png"
        };

        console.log(opt);

        var window = chrome.notifications.create(this.notificationId, opt, function(id) {
            //console.log("Notification created. ID:" + id);
        });
    }
};

export default chromeExtension;