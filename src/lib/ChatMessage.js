export class ChatMessage{
    constructor(sessionId, type, msg, sender) {
        this.sessionId = sessionId;
        this.type = type;
        this.msg = msg;
        this.sender = sender;
    }
}
