document
  .querySelector(".company-login-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const userName = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    if (!userName || !password) {
      document.querySelector("#message").style.display = "block";
      document.querySelector("#message").innerHTML = "Please Fill All Field!!";
    } else {
      try {
        const auth = {
          username: userName,
          password: password,
        };
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const res = await axios.post(
          `${BASE}company/companylogin`,
          auth,
          config
        );
        if (res.status === 200) {
          localStorage.removeItem("token");
          localStorage.setItem("CC_Token_Company", res.data.token);
          window.location.href = `${BASE}companyProfile`;
        }
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }

    // console.log(object);
  });
