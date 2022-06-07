const allowPage = () => {
  let token = localStorage.getItem("CC_Token_Company");
  if (!token) {
    window.location.href = `${BASE}`;
  }
};
allowPage();
