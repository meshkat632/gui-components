export class EventBus{
	constructor(){
		this.eventNames = [];
	}
	publish(event) {
		console.log("%c[" + event.type + ']', "color:green; background-color:yellow");
		var eventName = event.type;
		if (this.eventNames[eventName] == undefined)
			return;

		var self = this;
		setTimeout(function() {

			try {
				var listeners = self.eventNames[eventName];
				if (listeners) {
					listeners.forEach(function(listener) {
						if (listener) {
							if (typeof listener == "function") {
								try {
									listener(event);
								} catch (_error) {
									console.error('ERROR while event:', event, _error);
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
			}
		}, 1);
	}
	register(eventName, _callback) {
		if (typeof _callback != "function") {
			console.error('[EventBus]  only function canbe resisterd !');
			return;
		}
		if (this.eventNames[eventName] == undefined) {
			this.eventNames[eventName] = [ _callback ];
		} else {
			this.eventNames[eventName].push(_callback);
		}
	}
}