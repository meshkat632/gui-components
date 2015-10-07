import moment from 'moment';
import jquery from 'jquery';
//import angular from 'angular';

var def = {
    name: 'def',
    sip: {
        "display_name": undefined,
        "uri": undefined,
        "register": false,
        "password": undefined,
        "ws_servers": "ws://192.168.255.108:8080",
        "debug_delay_ms": 0,                      // For Filetransfer: delays the sending of each chunk by additonally 1000 ms.
        "stun": "stun:192.168.255.212:3478", // obsolete - not used
        "iceServers": [
            {"urls": "stun:62.245.186.229?transport=tcp"},
            {"urls": "turn:62.245.186.229?transport=tcp", "username": "myturnuser", "credential": "myturnuser"}
        ]

    },
    cometd: {
        "url": "http://se-cloud-01.ect-telecoms.de/comet-server/cometd",
        "credentials": {
            owner: "ect",
            application: "sip-demo",
            name: undefined,
            properties: {
                apiKey: "FDfhjksfsrUZUfnska"
            }
        }
    }
};
/*

var _configuration = {
    display_name: from,
    uri: "sip:" + from + "@" + server,
    ws_servers: "wss://sipgw2.ect-telecoms.de",
    register: false,
    extraMessageHeaders: ["ECT-Replaces: ECT_LB=" + (Math.floor(moduleSessionID/100000)) + ";ECT_Session=DD" + moduleSessionID],
    pcConfig: {
        'iceServers': [
            { 'urls': [stun] }
        ]
    }
};
*/
var from = (Math.random() * new Date().getTime()).toString(36);
var vab = {
    name: 'vab',
    sip: {
        "display_name": from,
        uri: "sip:" + from + "@sipgw2.ect-telecoms.de",
        "register": false,
        ws_servers : "wss://sipgw2.ect-telecoms.de",
        pcConfig : {
            'iceServers' : [ {
                'urls' : [ 'stun:sipgw2.ect-telecoms.de:3478' ]
            } ]
        },
        sip_suffix : "@sipgw2.ect-telecoms.de",
        buildUri : function(cli) {
            return 'sip:' + cli + "@sipgw2.ect-telecoms.de";
        }

    },
    cometd: {
        //"url": "http://se-cloud-01.ect-telecoms.de/comet-server/cometd",
        "url": "https://webrtcgw2.ect-telecoms.de/comet-server/cometd",
        "credentials": {
            owner: "ect",
            application: "vab",
            name: "_POPUP",
            role:"USER",
            properties: {
                apiKey: "FGQmrzjbc4dM",
                to:"0891234666"
            }
        }
    }
};

let builder = {
    build: function (nameOfConfig, userInfo) {
        if (nameOfConfig == 'def') {
            //var ret = angular.copy(def);
            var ret = def;
            ret.cometd.credentials.name = userInfo.name;
            ret.sip.uri = "sip:" + userInfo.cli + "@192.168.255.108:5060";
            ret.sip.password = userInfo.password;
            return ret;
        }
        if (nameOfConfig == 'vab') {
            //var ret = angular.copy(def);
            var ret = vab;

            //extraMessageHeaders: ["ECT-Replaces: ECT_LB=" + (Math.floor(moduleSessionID/100000)) + ";ECT_Session=DD" + moduleSessionID],

            //ret.cometd.credentials.name = userInfo.name;
            //ret.sip.display_name = '1tpdz09e.1znz5mi';
            //ret.sip.uri = "sip:1tpdz09e.1znz5mi@sipgw2.ect-telecoms.de";
            //ret.sip.password = userInfo.password;

            return ret;
        }
    }
};
export default builder;