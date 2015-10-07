import moment from 'moment';
import ExtensionHelper from 'lib/ExtensionHelper';

var windows = [];
var lastWindowId = undefined;
var windowIds = [];

if (ExtensionHelper.isExtension()) {
    chrome.windows.onRemoved.addListener(function (_closedWindowId) {
        console.log(' window is closed', _closedWindowId);
        if(_closedWindowId == lastWindowId){
         lastWindowId = undefined;
         //EventBus.publish(new Event('CALL-CONTROL-VIEW-CLOSED'));
         }


    });
}

let WindowManager = {
    createWindow: function (url, uuid, onReady) {
        console.log('createWindow url:', url);
        if (ExtensionHelper.isExtension()) {
            console.log('createWindow when chrome extenstion: lastWindowId:', lastWindowId);
            try {

                /*
                var w = 600;
                var h = 450;
                var left = Math.floor((screen.width / 2) - (w / 2));
                var top = Math.floor((screen.height / 2) - (h / 2));

                chrome.windows.create({
                    'url': url,
                    'type': 'popup',
                    'width': w,
                    'height': h,
                    'left': left,
                    'top': top
                }, function (window) {
                    console.log('Window created: ' + JSON.stringify(window));
                    console.log('window.name:' + window._myname);
                    lastWindowId = window.id;
                    windows.push[window];
                    if (onReady)
                        onReady(true, window);
                });
                */



                if (lastWindowId) {
                    //console.log('Re-Opening last Window id:', lastWindowId);
                    chrome.windows.update(lastWindowId, {drawAttention: true, focused: true}, function (window) {
                        //callback(window);
                        //console.log('last Window:', window);
                        lastWindowId = window.id;
                        if (onReady){
                            onReady(false,window);
                        }
                    });

                } else {
                    chrome.windows.getAll(function (_windows){
                        _windows.forEach(function(_window){
                            console.log('_window:',_window);
                            windowIds.forEach(function(_id){
                                if(_id === _window.id)
                                    chrome.windows.remove(_window.id);
                            });

                        });
                    });

                    var w = 650;
                    var h = 550;
                    var left = Math.floor((screen.width / 2) - (w / 2));
                    var top = Math.floor((screen.height / 2) - (h / 2));

                    chrome.windows.create({
                        'url': url,
                        'type': 'popup',
                        'width': w,
                        'height': h,
                        'left': left,
                        'top': top
                    }, function (window) {
                        console.log('Window created: ' + JSON.stringify(window));
                        console.log('window.name:' + window._myname);
                        lastWindowId = window.id;
                        windowIds.push(window.id);
                        windows.push[window];
                        if (onReady)
                            onReady(true, window);
                    });

                }




            } catch (error) {
                console.log('createWindow:', error);
            }
        }
        else {
            console.error('createWindow when not chrome extenstion:');
        }
    }

};

export default WindowManager;