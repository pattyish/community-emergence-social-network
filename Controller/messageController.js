const Message = require('../Models/message');
const User = require('../Models/user');
const validation = require('./../utils/helper_classes/Validations');

exports.getAllMessages = async (req, res) => {
  try {
    /*
        This function retrieves all messages from the database
    */
    const messages = await Message.find({"public": true}).select("-__v");
    if (messages) {
      res.status(200).json({
        status: "success",
        message: "messages retrieved",
        data: messages,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Messaged could not be retrieved",
      error: err,
    });
  }
};

exports.saveMessage = async (req, res) => {
  try {
    // Checking if the message package is full to be saved
    if (!validation.validateSaveMessage(req.body.content, req.body.sender)) {
      return res.status(404).json({
        status: "Fail",
        message: "You should give a full message package: Message_Content and the Sender",
      });
    }

    /*
        I am going to use a full reference to save who sent the message.
        I use this method because it will simplify the queries. In addition, a message is only sent by one user.
        Which means that using full reference is not a memory wastage, but ease the querying when I will need to know who
        really sent the message.
    */

    // I am going to select the sender information
    const sender_id = req.body.sender;
    const isIdValid = validation.isIdValid(sender_id); // using an external util function to validate an id as ObjectId() id
    
    // Validating and see if the sender is a valid user id
    if (!isIdValid) {
      return res.status(404).json({
        status: "Fail",
        message: "Invalid Sender Id. Please try again",
      });
    }

    // Now, The id of a sender is valid
    // I am gon validate if the user does exist
    let senderInfo = await User.findById(sender_id)
      .select("-__v")
      .select("-password");
    if (!senderInfo) {
      return res.status(404).json({
        status: "Fail",
        message: "Sender is not valid",
      });
    }

    // Up to here it is fine, almost everything is correct.
    // Now I am gon save the message and give it a sender as an object
    const messageToSend = {
      content: req.body.content,
      sender: senderInfo,
      date: req.body.date,
    }; // THIS IS THE MESSAGE TO SEND

    const saveMessage = await Message.create(messageToSend); // SAVING THE MESSAGE

    res.status(200).json({
      status: "OK",
      message: "Message is sent successfully",
      messageSent: saveMessage,
    });

    require("../index").emit("publicChatNewMsg", saveMessage);

  } catch (err) {
      return res.status(404).json({
        status: "Fail",
        message: "Sending message is not working",
        error: err,
      });
  }
};

exports.sendPrivateMessage = async (req, res) => {
  let sender_id = req.body.sender;
  let receiver_id = req.params.receiverId;
  let senderInfo = await User.findById(sender_id)
    .select("-__v")
    .select("-password");
  if (!senderInfo) {
    return res.status(404).json({
      status: "Fail",
      message: "Sender is not valid",
    });
  }

  let receiverInfo = await User.findById(receiver_id)
    .select("-__v")
    .select("-password");
  if (!senderInfo) {
    return res.status(404).json({
      status: "Fail",
      message: "Receiver is not valid",
    });
  }

  const message = {
    content: req.body.content,
    sender: senderInfo,
    receiver: receiverInfo,
    date: req.body.date,
    public: false
  };

  let savePrivateMessage = await Message.create(message); // SAVING THE MESSAGE

  res.status(200).json({
    status: "OK",
    message: "Message is sent successfully",
    messageSent: savePrivateMessage,
  });

  savePrivateMessage = savePrivateMessage.toObject();
  savePrivateMessage.senderName = senderInfo.username;
  savePrivateMessage.receiverName = receiverInfo.username;

  require("../index").emit("privateChatNewMsg", savePrivateMessage);
};

exports.getPrivateMessage = async (req, res) => {
  let receiverId = req.params.receiverId;
  let senderId = req.params.senderId;

  let senderInfo = await User.findById(senderId)
    .select("-__v")
    .select("-password");
  if (!senderInfo) {
    return res.status(404).json({
      status: "Fail",
      message: "Sender is not valid",
    });
  }

  let receiverInfo = await User.findById(receiverId)
    .select("-__v")
    .select("-password");
  if (!receiverInfo) {
    return res.status(404).json({
      status: "Fail",
      message: "Receiver is not valid",
    });
  }
  try {
    /*
        This function retrieves all messages from the database where sender = sender and receiver = receiverid
    */
    const messages = await Message.find({
      public: false,
    }).or([
      {
        'sender._id': senderInfo._id,
        'receiver._id': receiverInfo._id,
      },
      {
        'sender._id': receiverInfo._id,
        'receiver._id': senderInfo._id,
      }
    ]).select("-__v");
    console.log(messages);
    if (messages) {
      res.status(200).json({
        status: "success",
        message: "messages retrieved",
        data: messages,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Messaged could not be retrieved",
      error: err,
    });
  }
};