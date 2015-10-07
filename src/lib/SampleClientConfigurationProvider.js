import PubSubManager from 'ectxml/pubSubManager';
import ExtensionHelper from 'lib/ExtensionHelper';
//import VabChromeExtensionClient from "ect/VabChromeExtensionClient_1.0.0";

export class SampleClientConfigurationProvider{
	constructor(eventBus){
		this.eventBus = eventBus;
		this.cometUrl = "http://se-cloud-01.ect-telecoms.de/comet-server/cometd";
		this.sipSuffix = '@192.168.255.108:5060';
	}

	createConfiguration(userInfo, dialToneAudio, ringToneAudio, onReady, onError) {
		console.log('SampleClientConfigurationProvider:createConfiguration',arguments);
		// configuration needed for the ECTPhone.
        var self = this;
		var configuration = {
			password : userInfo.password,
			display_name : userInfo.name,
			cli:userInfo.cli,
			uri : "sip:" + userInfo.cli + "@192.168.255.108:5060",
			ws_servers: "ws://192.168.255.108:8080",
			register : false,
			/*
			pcConfig : {
				'iceServers' : [ {
					'urls' : [ 'stun:sipgw2.ect-telecoms.de:3478' ]
				} ]
			},
			*/
			"debug_delay_ms": 0,                      // For Filetransfer: delays the sending of each chunk by additonally 1000 ms.
			"stun": "stun:192.168.255.212:3478", // obsolete - not used
			"iceServers": [
				{"urls": "stun:62.245.186.229?transport=tcp"},
				{"urls": "turn:62.245.186.229?transport=tcp", "username": "myturnuser", "credential": "myturnuser"}
			],
			/*
			dialToneAudio : dialToneAudio,
			ringToneAudio : ringToneAudio,
			*/
			sip_suffix : self.sipSuffix,
			buildUri : function(cli) {
				return 'sip:' + cli + self.sipSuffix;
			}

		};
		var credentials = {
			owner: "ect",
			application: "sip-demo",
			name: userInfo.name,
			properties: {
				apiKey: "FDfhjksfsrUZUfnska"
			}
		};

		/*
		if (onReady){
			onReady(configuration, self.cometUrl, credentials);
			return;
		}
		*/






		var psm = new PubSubManager(this.cometUrl);
		psm.start(credentials, function(successful, passport, error, msg) {
			if (successful) {
				console.log('on cometd connected passport:',passport);
				if (passport != null) {

					var uuid = passport.uuid;
					configuration.uuid = uuid;
					console.log('configuration',configuration);
/*
					configuration.uuid = uuid;
					// update the configuration
					configuration.cli = passport.properties.cli;
					if(passport.properties.cli.indexOf('@')>0)
						configuration.cli = passport.properties.cli.substring(0, passport.properties.cli.indexOf('@'));
					configuration.display_name = userName;
					configuration.uri = "sip:" + configuration.cli + self.sipSuffix;
					configuration.uuid = uuid;
					configuration.userId = userId;
					//_registerScopeMsgListener(psm, userId);
					//_registerServer(psm);
					//_registerClient(psm);
					*/


				} else {
					onReady = null;
					if (onError)
						onError(new Error('Authentication failed for userInfo:'+userInfo));
				}
			} else {
				onReady = null;
				if (onError)
					onError(error);
			}
		});
		psm.registerConnectionListener({
			connected : function() {
				console.log('on cometd connected', onReady);
                //self.registerClient(psm);
				// start the main application.
				if (onReady)
					onReady(configuration, self.cometUrl, credentials);
			},
			disconnected:function() {
				console.log('on cometd disconnected',arguments);
			},
			error:function() {
				console.log('on cometd error',arguments);
			}
		});


	}

}