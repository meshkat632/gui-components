import $ from 'jquery';

var document = undefined;
let StyleManager = {
    init: function (document) {
        document = document;
        console.log('stylesheets',$('link[rel=stylesheet]'));


        var styleSheetList = document.styleSheets;
        console.log('styleSheetList',styleSheetList);
        /*
        styleSheetList.forEach(function(styleSheet){
            console.log('styleSheet',styleSheet);
        });
        */

        Object.getOwnPropertyNames(styleSheetList).forEach(function(key) {
            var styleSheet = styleSheetList[key];
            styleSheet.isManaged = false;
            try{
                styleSheet.isManaged = styleSheet.ownerNode.dataset.managed || false;
            }catch (error){

            }
            var cssRules = styleSheet.cssRules;
            console.log('cssRules:', cssRules, styleSheet.isManaged);
            if(styleSheet.isManaged){
                Object.keys(cssRules).forEach(function(key) {
                    var cssRule = cssRules[key];
                    console.log('cssRule:', cssRule.selectorText, cssRule.type, cssRule);
                });
            }
            /*
            if(styleSheet.isManaged == true){
                var cssRules = styleSheet.cssRules;
                console.log('cssRules:', cssRules);
                Object.keys(cssRules).forEach(function(key) {
                    var cssRule = cssRules[key];
                    console.log('cssRule:', cssRule);
                });
            }
            */
            console.log('styleSheet.isManaged:', styleSheet.isManaged);
            console.log(key, styleSheet);
        });


        /*
        Array.prototype.forEach.call(document.querySelectorAll('style,[rel="stylesheet"],[type="text/css"]'), function(element){
            try{
                console.log('element:',element);
                element.parentNode.removeChild(element)
            }catch(err){}
        });
        */
    }
};


export default StyleManager;