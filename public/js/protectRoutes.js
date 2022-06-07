const allowPage = () => {
  let token = localStorage.getItem("token");
  if (!token) {
    alert("Please, login!!");
    window.location.href = `/logout`;
  }
};
allowPage();
