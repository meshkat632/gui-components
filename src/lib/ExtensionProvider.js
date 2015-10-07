import moment from 'moment';
import ExtensionHelper from 'lib/ExtensionHelper';
import Commons from 'lib/Commons';
import webExtension from 'lib/WebExtension';
import chromeExtension from 'lib/ChromeExtension';

var extension = undefined;
let ExtensionProvider = {
    init: function(_eventbus){

        if(ExtensionHelper.isExtension()){
            extension = chromeExtension;
            extension.init(_eventbus);

        }else {
            extension = webExtension;
            extension.init(_eventbus);
        }
    },
    getExtension:function(){
        if(ExtensionHelper.isExtension()){
            return chromeExtension;
        }
        else
        {
            return extension;
        }
    }
};
export default ExtensionProvider;

