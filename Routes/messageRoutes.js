const express = require("express");
const {
    getAllMessages,
    saveMessage,
    sendPrivateMessage,
    getPrivateMessage,
} = require("../Controller/messageController");

const router = express.Router();

router.route("/").get(getAllMessages);

router.route("/").post(saveMessage);

router.route("/private/:senderId/:receiverId").get(getPrivateMessage);

router.route("/private/:receiverId").post(sendPrivateMessage);

module.exports = router;
