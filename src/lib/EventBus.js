import Commons from 'lib/Commons';

var eventNames = [];
var uuid = Commons.utils.generateUUID();
let EventBus = {
    id: uuid,
	publish: function(event) {
        var self = this;
		console.log("%c["+self.id+"-"+ event.type + ']', "color:green; background-color:yellow");
		var eventName = event.type;
		if (eventNames[eventName] == undefined)
			return;

        try {
            var listeners = eventNames[eventName];
            if (listeners) {
                listeners.forEach(function(listener) {
                    if (listener) {
                        if (typeof listener == "function") {
                            try {
                                //console.log('before ',eventName,event);
                                listener(event);
                                //console.log('after ',eventName,event);
                            } catch (_error) {
                                console.error('ERROR while event:', event, _error);
                                throw _error;
                            }

                        } else
                            console.error('not a valid listener:', typeof listener);
                    } else
                        console.error('not a valid listener:', typeof listener);
                });
            } else
                console.error('no listeners found');
        } catch (error) {
            console.error('ERROR in EventBus while event:', event, error);
            throw error;
        }

        /*
		setTimeout(function() {



		}, 1);
		*/
	},
	register: function(eventName, _callback) {
		if (typeof _callback != "function") {
			console.error('[EventBus]  only function canbe resisterd !');
			return;
		}
		if (eventNames[eventName] == undefined) {
			eventNames[eventName] = [ _callback ];
		} else {
			eventNames[eventName].push(_callback);
		}
	}
};
export default EventBus;