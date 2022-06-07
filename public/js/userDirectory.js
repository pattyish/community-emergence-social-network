socket.on("directoryNewUser", (data) => getAllUsers());

socket.on("statusUpdate", (data) => {
  console.log("Status updated user", data.updates._id);
  let status = data.updates.userstatus.status;
  let color = data.updates.userstatus.color;
  let value =
    "<small class='w3-text-" +
    color.toLowerCase() +
    "'><b> (" +
    status +
    ") </b> <small>";
  document.getElementById("" + data.updates._id).innerHTML = "" + value;
  // a = document.getElementById(''+data.updates._id).innerHTML;
  // getAllUsers();
});

const oneUserHTML = (user) => {
  let content = "";

  content += `<a href= '/chat-private/${user.username}/${user._id}' style='text-decoration: none;'><div class='col user-link'>`;
  content += "    <div class='card h-100' style='background-color: #f5f7f7'>";
  if (user.isOnline)
    content +=
      "  <span class='position-absolute top-0 start-100 translate-middle p-2 bg-success border border-light rounded-circle'><span class='visually-hidden'>New alerts</span></span>";
  content += "        <img src='images/user.png' class='card-img-top p-4'>";
  content += "            <div class='card-body text-center'>";
  content +=
    "                <h5 class='card-title' style='text-transform: capitalize;'>" +
    user.username +
    "</h5>";
  if (user.userstatus) {
    try {
      content +=
        "<span id=" +
        user._id +
        "><small class='w3-text-" +
        user.userstatus.color.toLowerCase() +
        "'><br><b class='user-status' style='font-size: medium'>" +
        user.userstatus.status.toLowerCase() +
        "</b> </small></span>";
    } catch (e) {
      content +=
        "<span id=" +
        user._id +
        "><small><br><b class='user-status'></b></small></span>";
    }
  }
  else
  {
    content +=
    "<span id=" +
    user._id +
    "><small><br><b class='user-status'>no_status</b> </small></span>";
  }
  
  content += "            </div>";
  content += "    </div>";
  content += "</div> </a>";

  return content;
};

function getAllUsers() {
  document.getElementById("userCards").innerHTML =
    "<div class='text-center'><div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div></div>";
  fetch(`${BASE}users`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((res) => {
      socket.emit("getOnlineUsersMap", {});
      socket.on("onlineUsersMap", (onlineUsers) => {
        console.log("online users: " + JSON.stringify(onlineUsers));
        let userContainer = document.getElementById("userCards");
        userContainer.innerHTML = "";
        res.forEach((user) => {
          user.isOnline = onlineUsers.indexOf(user._id) > -1;
          if (user.isOnline) userContainer.innerHTML += oneUserHTML(user);
        });
        res.forEach((user) => {
          if (!user.isOnline) userContainer.innerHTML += oneUserHTML(user);
        });
      });
    })
    .catch((err) => console.log(err));
}

function filterCards() {
  // Find all user cards and make them visible
  $(".card").parent().parent().show();

  // extract search term
  var filter = $("#search").val().toLowerCase();

  let selectedOption = $("#searchOption").find(":selected").text();

  // Hide all cards that do not have search term
  if (selectedOption === "All") {
    // perform search by username and status then perform and intersection to hide only cards not in both
    $(
      $("#userCards")
        .find(".card-title:not(:contains(" + filter + "))")
        .parent()
        .parent()
        .parent()
        .parent()
    )
      .filter(
        $("#userCards")
          .find(".user-status:not(:contains('" + filter + "'))")
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
      )
      .css("display", "none");
  } else if (selectedOption === "Username") {
    $("#userCards")
      .find(".card-title:not(:contains(" + filter + "))")
      .parent()
      .parent()
      .parent()
      .parent()
      .css("display", "none");
  } else if (selectedOption === "Status") {
    $("#userCards")
      .find(".user-status:not(:contains('" + filter + "'))")
      .parent()
      .parent()
      .parent()
      .parent()
      .parent()
      .parent()
      .css("display", "none");
  }
}

// filter cards based on search input
$("#search").on("input", filterCards);

getAllUsers();
