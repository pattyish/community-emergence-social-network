const allowSend = () => {
  let token = localStorage.getItem("token");
  let userId = localStorage.getItem("userid");
  if (!token || !userId) {
    alert("You need to first login");
    window.location.href = `${BASE}`;
    return false;
  }
  return true;
};

const validate = (message) => {
  if (message.trim().length === 0) {
    return false;
  }
  return true;
};

const formatTime = (date) => {
  const t = date.toString().split(" ");
  const ti = t[4].split(":");
  const tim = [ti[0], ti[1]].join(":").toString();
  const timm = [t[0], t[1], t[2], t[3]].join(" ").toString();
  const time = timm + " " + tim;

  return time;
};

// Function to send the message
const sendPrivateMessage = async (message, id) => {
  const receiverId = document.querySelector("#user-id").value;
  console.log({ message, id });
  try {
    console.log("Reach hear");
    const result = await axios({
      method: "POST",
      url: `${BASE}messages/private/${receiverId}`,
      data: {
        content: message,
        sender: id,
        date: formatTime(new Date()),
      },
    });
    console.log(result);
    if (result) {
      const data = result.data;
      if (data.status === "OK") {
        document.getElementById("message").value = "";
        console.log("Message sent!!!");

        // Auto scroll to the bottom
        var obj = document.getElementById("messages_container");
        obj.scrollTop = obj.scrollHeight;
      }
    }
  } catch (err) {
    console.log(err.message);
  }
};

document.querySelector(".send-message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let message = document.getElementById("message").value;
  if (!allowSend) {
    return;
  }
  if (validate(message)) {
    const userId = localStorage.getItem("userid");
    sendPrivateMessage(message, userId);

    // Auto scroll to the bottom
    var obj = document.getElementById("messages_container");
    obj.scrollTop = obj.scrollHeight;
  } else {
    alert("Can't send empty message");
  }
});

// Auto scroll to the bottom
var obj = document.getElementById("messages_container");
obj.scrollTop = obj.scrollHeight;