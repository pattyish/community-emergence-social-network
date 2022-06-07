document.querySelector("#logout-btn-company").addEventListener("click", (e) => {
  localStorage.removeItem("CC_Token_Company");
  window.location.href = `${BASE}loginCompany`;
});
