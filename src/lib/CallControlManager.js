import moment from 'moment';
import ExtensionHelper from 'lib/ExtensionHelper';
import WindowManager from 'lib/WindowManager';


var callObjects = [];
var lastWindowId = undefined;
var eventBus = undefined;
let CallControlManager = {
    init:function(_eventBus){
        eventBus = _eventBus;
        eventBus.register('CALL-CONTROL-VIEW-LOADED', function(_event){
            console.log("CALL-CONTROL-VIEW-LOADED:",_event);
            var event =new Event('CALL-CONTROL-VIEW-START');
            event.callSession = callObjects[lastWindowId].callSession;
            event.isAlreadyAccepted = true;
            _eventBus.publish(event);

        });
    },
    createCallControl:function(callSession){
        var uuid = generateUUID();
        console.log("on createCallControl callSession:",callSession);
        if(ExtensionHelper.isExtension()){
            console.log('CallControl when chrome extension');
            WindowManager.createWindow('callControl.html',uuid, function(isNew,window){
                console.log('callControl window is ready isNew:',isNew,' window:', window);
                lastWindowId = window.id;
                callObjects[lastWindowId] = {
                    callSession: callSession,
                    window: window
                };

                if(!isNew){
                    var event =new Event('CALL-CONTROL-VIEW-RESTART');
                    eventBus.publish(event);
                }
            });
        }
        else
        {
            console.error('CallControl when not chrome extension');
        }
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


export default CallControlManager;