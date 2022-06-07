document
  .querySelector(".company-register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const compName = document.querySelector("#name").value;
    const compLocation = document.querySelector("#location").value;
    const compCategory = document.querySelector("#category").value;
    const compContact = document.querySelector("#contact").value;
    const userName = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    if (
      !compName ||
      !compLocation ||
      !compContact ||
      !userName ||
      !password ||
      compCategory == "0"
    ) {
      console.log("Test");
      document.querySelector("#message").style.display = "block";
      document.querySelector("#message").innerHTML = "Please Fill All Field!!";
    } else {
      try {
        const auth = {
          company_name: compName,
          company_category: compLocation,
          company_location: compCategory,
          company_contact: compContact,
          username: userName,
          password: password,
        };
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const res = await axios.post(
          `${BASE}company/companyregister`,
          auth,
          config
        );
        if (res.status === 201) {
          document.querySelector("#display-message").innerHTML = `
        <span style="text-align: center" text-success role="alert">
        ${res.data.msg}  </span>`;
          window.location.href = `${BASE}`;
        }
      } catch (error) {
        console.log(error.response.msg);
      }
    }

    // console.log(object);
  });
