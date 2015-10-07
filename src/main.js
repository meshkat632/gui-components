import ngTestApp from 'apps/ngTestApp';
import sampleClient from 'apps/sampleClient';
import vabWebrtcClient from 'apps/vabWebrtcClient';
import webrtcTester from 'apps/webrtcTester';

/*
import callControl from 'apps/callControl';




//import background from 'apps/background';

/*

import userSettings from 'app/userSettings';
import vabUserSettings from 'app/vabUserSettings';



/*
console.log('userSettings', userSettings);
console.log('background', background);
*/

let main = {
    start:function(appName, $window){
        console.log('123456768910  start appName', appName);
        if("ngTestApp" === appName){
            ngTestApp.start();
            return;
        }
        if("sampleClient" === appName){
            sampleClient.start($window);
            return;
        }
        if("vabWebrtcClient" == appName){
            vabWebrtcClient.start($window);
            return;
        }
        if("webrtcTester" == appName){
            webrtcTester.start($window);
            return;
        }


        /*
        if("callControl" === appName){
            callControl.start($window);
            return;
        }
        if("webrtcTester" === appName){
            webrtcTester.start($window);
            return;
        }
        /*
        if("background" === appName){
            background.start($window);
            return;
        }
               if("sampleClient" === appName){
            sampleClient.start($window);
            return;
        }
        */
        console.error('app not found with name:', appName);
    }
};
export default main;