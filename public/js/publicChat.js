socket.on("publicChatNewMsg", function (data) {
  //console.log(JSON.stringify(data));
  addOneMsg("status",data);
});

const isMe = (id) => {
  const mine = localStorage.getItem("userid");
  if (id === mine) {
    return true;
  }
  return false;
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

function addOneMsg(status, msg) {
  if(status === "inactive")
  {
    return;
  }
  if (isMe(msg.sender._id)) {
    document.getElementById("messages_container").innerHTML += rightAlign(msg);
  } else {
    document.getElementById("messages_container").innerHTML += leftAlign(msg);
  }
}

const getOneUser = async (id, one_data) =>
{
  try
  {
    const result = await axios({
      method: "GET",
      url: `${BASE}users/${id}`
    });
    if(result)
    {
      if(result.data)
      {
        const data = result.data.data
        addOneMsg(data.status, one_data);
      }
      else
      {
        return null;
      }
    }
    else
    {
      return null;
    }
  }
  catch(err)
  {
    console.log(err);
    return null;
  }
}

const appendMessage = async (Messages) => {
  // this function loads the messages and add them to the page
  
    document.getElementById("messages_container").innerHTML = "";
    Messages.forEach((one_data, index) => {
      getOneUser(one_data.sender._id, one_data);
    });
    // Auto scroll to the bottom
    var obj = document.getElementById("messages_container");
    obj.scrollTop = obj.scrollHeight;
 
};
// I am going to select all messages from db

const selectMessages = async () => {
  try {
    const result = await axios({
      method: "GET",
      url: `${BASE}messages`,
    });
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
