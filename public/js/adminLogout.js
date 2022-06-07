document.querySelector("#logout-btn").addEventListener("click", (e) => {
    const confirmation = confirm("Do you want to log-out??");
    if (confirmation) {
        localStorage.removeItem("userid");
        localStorage.removeItem("token");
        window.location.href = "/logout";
    }
});
