import moment from 'moment';
import {ConfigurationProvider} from 'lib/ConfigurationProvider';
import {SampleClientConfigurationProvider} from 'lib/SampleClientConfigurationProvider';
import ECTPhone from 'phone/ECTPhone_1.0.2';
import {CommunicationListener} from 'lib/CommunicationListener';

var ConfigurationProviderTypes = ['SampleClient','Vab', 'Proximus'];
let ECTPhoneFactory = {
	init:function(eventBus, configurationProviderType){
		this.eventBus = eventBus;

        this.configurationProvider = new SampleClientConfigurationProvider(eventBus);
        return;

        if( configurationProviderType =='SampleClient'){
            this.configurationProvider = new SampleClientConfigurationProvider(eventBus);
            return;
        }else{
            this.configurationProvider = new ConfigurationProvider(eventBus);
            return;
        }
    },
    config : function(configurationProvider) {
        console.warn('config should not be called');
        this.configurationProvider = configurationProvider;
    },
    createPhone:function(userInfo, dialToneAudio, ringToneAudio, communicationListener, onStarted, onError) {
        this.configurationProvider.createConfiguration(userInfo, dialToneAudio, ringToneAudio, function(configuration, psm, credentials) {
        console.log('creating the phone instance',configuration, communicationListener, psm, credentials);
        console.log('configuration',configuration);
        console.log('communicationListener',communicationListener);
        console.log('psm',psm);
        console.log('credentials:',credentials);
        var phone = new ECTPhone(configuration, communicationListener, psm, credentials);
        if (onStarted) {
            phone.meta = {
                configuration : configuration,
                psm : psm,
                credentials : credentials,
                userUri : configuration.uri,
                userName : configuration.display_name,
                buildUri : configuration.buildUri,
                uuid: configuration.uuid,
                userId: configuration.userId,
                cli: configuration.cli
            }
            console.log('phone.meta:',phone.meta);
            onStarted(phone);
        }
        }, function(error) {
            if (onError) {
                onError(error);
            }
        });
    }
};
export default ECTPhoneFactory;