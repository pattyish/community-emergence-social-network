const getAllActiveHealthServices = async () => {
  let listCompanyDiv = document.querySelector("#approved-health-service");
  let companiesList = "";
  try {
    const ActiveCampanies = await axios({
      method: "GET",
      url: `${BASE}company/activecompanies`,
    });
    console.log(ActiveCampanies.data.companies.length);
    if (ActiveCampanies.data.status == 200) {
      if (ActiveCampanies.data.companies.length == 0) {
        companiesList = `<div>There is <b> ${ActiveCampanies.data.companies.length} </b> health service need to be activated so far</div>`;
      } else {
        ActiveCampanies.data.companies.forEach((company) => {
          companiesList += `<div class="card m-1">
    <div class="row g-0">
    <div class="col-3 text-center">
     <img src=/images/megaphone.png class="img-fluid rounded-start p-2" style='max-height: 80px;'>
       </div>
        <div class="col-9">
             <div class="card-body">
                  <span class=""><strong class="announcement-username">
                  <span style='text-transform: capitalize;'> ${company.company_name}</span></strong> &nbsp;
                  <span style='text-transform: capitalize;'> ${company.company_category}</span></strong> <br>
                  <span style='text-transform: capitalize;'> ${company.company_location}</span></strong> <br>
                  <span style='text-transform: capitalize;'> Contact Us On: <strong> ${company.company_contact} </strong></span></strong>
                  </span>
                  </div>
           </div>
         </div>
       </div>`;
        });
      }
      listCompanyDiv.innerHTML = `${companiesList}`;
    }
  } catch (error) {
    console.log("error", error.response.data);
  }
};

getAllActiveHealthServices();
