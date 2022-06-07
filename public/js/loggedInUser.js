const loggedInUser = () => {
  if (localStorage.getItem("user-name") != null)
    document.querySelector(
      "#user-loggedin"
    ).innerHTML = `| ${localStorage.getItem("user-name")}`;
  console.log(localStorage.getItem("user-name"));
};

loggedInUser();
