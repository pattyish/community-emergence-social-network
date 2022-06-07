socket.on("privateChatNewMsg", function (data) {
  const receiverId = document.querySelector("#user-id").value;
  if (
    (data.receiver._id === userId && data.sender._id === receiverId) ||
    (data.receiver._id === receiverId && data.sender._id === userId)
  ) {
    addOneMsg(data);
    createjs.Sound.play("msgNotification");
  }
});

const isMe = (id) => {
  const mine = localStorage.getItem("userid");
  return id === mine;
};

const leftAlign = (one_data) => {
  var additionalContent = "<div class='direct-chat-msg single-message'>";
  additionalContent +=
    "<div class='direct-chat-info clearfix'> <span class='direct-chat-name w3-left' style='text-transform: capitalize;'> &nbsp; &nbsp;<b>" +
    one_data.sender.username +
    "   ";
  if (one_data.sender.userstatus) {
    additionalContent +=
      "<span class='w3-text-" +
      one_data.sender.userstatus.color.toLowerCase() +
      "'>(" +
      one_data.sender.userstatus.status +
      ")</span>";
  }
  additionalContent += "</b></span>";
  additionalContent +=
    "<span class='direct-chat-timestamp w3-right'>" +
    one_data.date +
    "</span> </div> <img class='direct-chat-img' src='/img/citizens.jpg' alt='message user image'>";
  additionalContent +=
    "<div class='direct-chat-text'>" + one_data.content + " </div>";
  additionalContent += " </div>";
  return additionalContent;
};

const rightAlign = (one_data) => {
  var additionalContent = "<div class='direct-chat-msg right single-message'>";
  additionalContent +=
    "<div class='direct-chat-info clearfix'> <span class='direct-chat-name w3-right' style='text-transform: capitalize;'> &nbsp; &nbsp;<b>" +
    one_data.sender.username +
    "   ";
  if (one_data.sender.userstatus) {
    additionalContent +=
      "<span class='w3-text-" +
      one_data.sender.userstatus.color.toLowerCase() +
      "'>(" +
      one_data.sender.userstatus.status +
      ")</span>";
  }
  additionalContent += "</b></span>";
  additionalContent +=
    "<span class='direct-chat-timestamp w3-left'>" +
    one_data.date +
    "</span> </div> <img class='direct-chat-img' src='/img/citizens.jpg' alt='message user image'>";
  additionalContent +=
    "<div class='direct-chat-text'>" + one_data.content + " </div>";
  additionalContent += " </div>";
  return additionalContent;
};

function addOneMsg(msg) {
  if (isMe(msg.sender._id)) {
    document.getElementById("messages_container").innerHTML += rightAlign(msg);
  } else {
    document.getElementById("messages_container").innerHTML += leftAlign(msg);
  }
}

const appendMessage = (Messages) => {
  // this function loads the messages and add them to the page

  document.getElementById("messages_container").innerHTML = "";
  Messages.forEach((one_data, index) => {
    addOneMsg(one_data);
  });

  // Auto scroll to the bottom
  var obj = document.getElementById("messages_container");
  obj.scrollTop = obj.scrollHeight;
};
// I am going to select all messages from db

const selectMessages = async () => {
  const receiverId = document.querySelector("#user-id").value;
  const senderId = localStorage.getItem("userid");
  console.log("recieve", typeof receiverId);
  console.log("", typeof senderId);
  console.log(`${localStorage.getItem("userid")}`);
  try {
    const result = await axios({
      method: "GET",
      url: `${BASE}messages/private/${senderId}/${receiverId}`,
    });
    console.log(result.data);
    if (result) {
      const data = result.data.data;
      appendMessage(data);
    } else {
      console.log(result);
    }
  } catch (err) {
    console.log(err);
  }
};

selectMessages();