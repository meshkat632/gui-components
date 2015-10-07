import moment from 'moment';

var isExtension = false;
var extensionId = undefined;
try{
    if(chrome.runtime.id === undefined)
        isExtension = false;
    else{
        isExtension = true;
        extensionId = chrome.runtime.id;
    }

}catch (error){

}

/*
function _isExtension(){
    return isExtension;
}

function _getExtensionId(){
    return extensionId;
}
*/
let ExtensionHelper = {
    isExtension:function (){
        return isExtension;
    },
    getExtensionId:function (){
        return extensionId;
    }
};
export default ExtensionHelper;