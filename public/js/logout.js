
document.querySelector(".logout-btn").addEventListener("click", (e) => {
  const confirmation = confirm("Do you want to log-out??");
  if (confirmation) {
    localStorage.clear();
    window.location.href = "/login";
  }
});
