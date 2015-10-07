import {ChatMessage} from 'lib/ChatMessage';
export class ChatSession{
	constructor(from, to, type) {
		this.messages = [];
		this.listeners = [];
		this.widgetListener = [];
		this.from = from;
		this.to = to;
		this.type = type;
	}

	incoming(msg, sender) {
		var newMessage = new ChatMessage(this.Id, 'incoming', msg, sender);
		this.messages.push(newMessage);
		this.listeners.forEach(function(listener) {
			listener(newMessage);
		});
	}

	outgoing (msg, sender) {
		var newMessage = new ChatMessage(this.Id, 'outgoing', msg, sender);
		this.messages.push(newMessage);
		this.listeners.forEach(function(listener) {
			listener(newMessage);
		});
	}

	addOnNewMessageListener(listener) {
		if (listener != undefined)
			this.listeners.push(listener);
	}

	addWidgetListener(widgetListener) {
		if (widgetListener != undefined)
			this.widgetListener.push(widgetListener);
	}

	show() {
		this.widgetListener.forEach(function(listener) {
			listener.show();
		});
	}

	hide() {
		this.widgetListener.forEach(function(listener) {
			listener.hide();
		});
	}
}