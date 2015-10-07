import ngTestApp from 'apps/ngTestApp';
import background from 'apps/background';
import home from 'apps/home';
import userSettings from 'apps/userSettings';

let main = {
    start:function(appName, $window){
        if("ngTestApp" === appName){
            ngTestApp.start();
            return;
        }
        if("background" === appName){
            background.start($window);
            return;
        }
        if("home" === appName){
            home.start($window);
            return;
        }
        if("userSettings" === appName){
            userSettings.start($window);
            return;
        }
        console.error('app not found with name:', appName);
    }
};
export default main;