const axios = require("axios");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const socketManagement = async (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      const payload = jwt.verify(token, process.env.SECRET_KEY);
      socket.user_id = payload.user_id;
      next();
    } catch (error) {
      console.log("This is not working!!!");
      console.log(error);
    }
  });
  io.on("connection", (socket) => {
    console.log("Socket connected successful!!!!");
    socket.on("chatroomPost", async (messageContent) => {
      console.log("Getting inside socket!!!!");
      const message = {
        content: messageContent.content,
        sender: socket.user_id,
        public: true,
      };
      console.log(message);
      const auth = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const saveMessage = await axios.post(
        `http://${socket.handshake.headers.host}/messages`,
        message,
        auth
      );
      if (saveMessage.status === 200) {
        console.log("Saved successfull!!!!!!!");
      } else {
        console.log("The is error somewhere in code");
      }
      console.log(messageContent);
      io.emit("chatPublic", messageContent);
    });
  });
};

module.exports = socketManagement;
