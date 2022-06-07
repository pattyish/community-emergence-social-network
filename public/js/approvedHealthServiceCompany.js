const getAllactiveHealthServices = async () => {
  let i = 0;
  let tbody = document.querySelector("#health-service-companies-list");
  let tbodyRows = "";
  try {
    const InactiveCampanies = await axios({
      method: "GET",
      url: `${BASE}company/inactivecompanies`,
    });
    console.log(InactiveCampanies.data.companies.length);
    if (InactiveCampanies.data.status == 200) {
      if (InactiveCampanies.data.companies.length == 0) {
        tbodyRows = `<tr> <td colspan = 6 style="text-align: center;">There is <b> ${InactiveCampanies.data.companies.length} </b> health service need to be activated so far</td> </tr>`;
      } else {
        InactiveCampanies.data.companies.forEach((company) => {
          console.log(company);
          i = i + 1;
          tbodyRows += `<tr>
        <th scope="row">${i}</th>
        <td>${company.company_name}</td>
        <td>${company.company_category}</td>
        <td>${company.company_location}</td>
        <td>${company.company_contact}</td>
        <td><a class="btn btn-success btn-sm" onclick=changeStatus('${company._id}') style="color: FFFFFF">Activate</a></td>
        </tr>`;
        });
      }
      tbody.innerHTML = tbodyRows;
    }
  } catch (error) {
    console.log("error", error);
  }
};

getAllactiveHealthServices();

const changeStatus = async (id) => {
  try {
    const res = await axios.put(`${BASE}company/update/status/${id}`);
    location.reload();
    console.log(res);
  } catch (error) {
    console.log("error", error.response.data);
  }
};
