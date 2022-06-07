const checkIsAdmin = () => {
  // let token = localStorage.getItem("token");
  // if (!token) {
  //   window.location.href = "/login";
  // }
  if (localStorage.getItem("isAdmin")) {
    document.querySelector("#activate-company").style.display = "block";
  }
};
checkIsAdmin();
