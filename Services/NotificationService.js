class NotificationService {
    constructor() {
    }

    sendPanicButtonHelpRequest(data) {
        require("../index").emit("panicButtonRequest", data);
    }

    sendMessage(name, data) {
        require("../index").emit(name, data);
    }
}

module.exports = new NotificationService();