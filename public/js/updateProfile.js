const updateProfile = async () => {
  try {
    const compProfile = await axios.get(`${BASE}company/companyprofile`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("CC_Token_Company")}`,
      },
    });
    if (compProfile.status === 200) {
      document.querySelector("#name").value =
        compProfile.data.isCompanyExist.company_name;
      document.querySelector("#location").value =
        compProfile.data.isCompanyExist.company_location;
      document.querySelector(
        "#category"
      ).innerHTML += `<option selected value = '${compProfile.data.isCompanyExist.company_category}'>
      ${compProfile.data.isCompanyExist.company_category}</option>
      `;
      document.querySelector("#contact").value =
        compProfile.data.isCompanyExist.company_contact;
      document.querySelector("#company-id").value =
        compProfile.data.isCompanyExist._id;
    }
    console.log(compProfile);
  } catch (error) {
    console.log(error);
  }
};
updateProfile();

document
  .querySelector(".company-profile-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const compName = document.querySelector("#name").value;
    const compLocation = document.querySelector("#location").value;
    const compCategory = document.querySelector("#category").value;
    const compContact = document.querySelector("#contact").value;
    const comp_id = document.querySelector("#company-id").value;
    console.log(comp_id);

    if (!compName || !compLocation || !compContact || compCategory == "0") {
      document.querySelector("#message").style.display = "block";
      document.querySelector("#message").innerHTML = "Please Fill All Field!!";
    } else {
      try {
        const auth = {
          company_name: compName,
          company_category: compLocation,
          company_location: compCategory,
          company_contact: compContact,
        };
        console.log(auth);
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const res = await axios.put(
          `${BASE}company/updatecompanyprofile/${comp_id}`,
          auth,
          config
        );

        console.log(res);
        if (res.status === 201) {
          document.querySelector("#display-message").innerHTML = `
        <span style="text-align: center" text-success role="alert">
        ${res.data.msg}  </span>`;
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  });
