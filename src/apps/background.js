import moment from 'moment';
import jquery from 'jquery';
import angular from 'angular';

import ExtensionProvider from 'lib/ExtensionProvider';
import MediaAccessManager from 'lib/MediaAccessManager';
import EventBus from 'lib/EventBus';


let app = {
    start:function($window){
        console.log('starting backgound app at:', moment());
        MediaAccessManager.init(document);
        ExtensionProvider.init(EventBus);

        //
        ExtensionProvider.getExtension().disable();
        setTimeout(function(){
            ExtensionProvider.getExtension().enable();
        }, 2000);

    }
};
export default app;