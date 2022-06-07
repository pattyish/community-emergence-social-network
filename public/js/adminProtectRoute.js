const allowPage = () => {
  let token = localStorage.getItem("token");
  if (!token || !localStorage.getItem("isAdmin")) {
    window.location.href = `/login`;
  }
};
allowPage();
