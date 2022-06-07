let token = localStorage.getItem("token");
let userId = localStorage.getItem("userid");

const socket = io();

createjs.Sound.registerSound("/audio/notification.mp3", "msgNotification");

socket.on("connect", function () {
  socket.emit("onlineNotification", {
    userId: userId,
    socketId: socket.id,
  });
  socket.on("privateChatNewMsg", function (data) {
    if (data.receiver._id === userId) {
      createjs.Sound.play("msgNotification");
      if (!window.location.href.includes("chat-private")) {
        setTimeout(function () {
          alert("New message from: " + data.senderName);
        }, 1000);
      }
    }
  });
});

function logout()
{
    localStorage.clear();
    window.location.href = `${BASE}login`;
}
socket.on("profileUpdated", function(data){
  if(data.updates)
  {
    const new_data = data.updates;
    const logged_id = localStorage.getItem('userid');
    if(new_data._id === logged_id)
    {
      localStorage.setItem("privilege",new_data.privilege);
      if(localStorage.getItem("privilege").includes("dmin"))
      {
        localStorage.setItem("admin", true)
      }
      else
      {
        localStorage.removeItem("admin");
      }
      if(new_data.status === "inactive")
      {
        alert("Your account has been desactivated");
        logout();
      }
    }
  }
});