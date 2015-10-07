import PubSubManager from 'ectxml/pubSubManager';
import ExtensionHelper from 'lib/ExtensionHelper';
//import VabChromeExtensionClient from "ect/VabChromeExtensionClient_1.0.0";


export class ConfigurationProvider{
	constructor(eventBus){
		this.eventBus = eventBus;
		this.cometUrl = "https://webrtcgw2.ect-telecoms.de/comet-server/cometd";
		this.sipSuffix = '@bgctest.net';
	}

	createConfiguration(userName,userPassword, dialToneAudio, ringToneAudio, onReady, onError) {
		// configuration needed for the ECTPhone.
        var self = this;
		var configuration = {
			password : userPassword,
			display_name : undefined,
			uri : undefined,
			ws_servers : "wss://sipgw2.ect-telecoms.de",
			register : false,
			pcConfig : {
				'iceServers' : [ {
					'urls' : [ 'stun:sipgw2.ect-telecoms.de:3478' ]
				} ]
			},
			dialToneAudio : dialToneAudio,
			ringToneAudio : ringToneAudio,
			sip_suffix : self.sipSuffix,
			buildUri : function(cli) {
				return 'sip:' + cli + self.sipSuffix;
			}

		};
		var credentials = {
			owner: "ect",
			application: "sip-demo",
			name: userName,
			properties: {
				apiKey: "FDfhjksfsrUZUfnska"
			}
		};



		var psm = new PubSubManager(this.cometUrl);
		psm.start(credentials, function(successful, passport, error, msg) {
			if (successful) {
				console.log('on cometd connected passport:',passport);
				if (passport != null && passport.properties != null && passport.properties.cli != null) {
					var userId = passport.properties.userId;
					var uuid = passport.uuid;
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


				} else {
					onReady = null;
					if (onError)
						onError(new Error('Authentication failed for userId:'+userId));
				}
			} else {
				onReady = null;
				if (onError)
					onError(error);
			}
		});
		psm.registerConnectionListener({
			connected : function() {
                self.registerClient(psm);
				// start the main application.
				if (onReady)
					onReady(configuration, psm, credentials);
			}
		});


	}
}