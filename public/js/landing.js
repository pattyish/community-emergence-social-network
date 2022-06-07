// I am gon have a filter pattern to only show me all those document that are reviewed
class Filter {
  constructor(documents) {
    this.documents = documents;
  }
  filter() {
    return [];
  }
}

class FilterUnProvedDocuments extends Filter {
  constructor(documents) {
    super(documents);
  }
  filter() {
    const docs = this.documents;
    let filtered = [];
    docs.forEach((element) => {
      if (!element.reviewed) {
        filtered.push(element);
      }
    });
    return filtered.length;
  }
}

const allowPage = () => {
  let token = localStorage.getItem("token");
  let id = localStorage.getItem("userid");
  if (!token || !id) {
    alert("Please, login again!!");
    window.location.href = `${BASE}login`;
  }
};

const checkAndSetAdmin = async () => {
  try {
    const id = localStorage.getItem("userid");
    const result = await axios({
      method: "GET",
      url: `${BASE}users/${id}`,
    });
    if (result) {
      if (result.data) {
        const user_data = result.data.data;
        console.log(user_data);
        if (user_data.privilege === "administrator") {
          localStorage.setItem("admin", true);
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const getUnapproved = async () => {
  try {
    const result = await axios({
      method: "GET",
      url: `${BASE}documents/`,
    });
    if (result) {
      if (result.data) {
        if (result.data.data) {
          const user_data = result.data.data;
          let filter = new FilterUnProvedDocuments(user_data);
          const number = filter.filter();
          document.getElementById("number-requests").innerHTML = number;
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const onlyAdmin = () => {
  allowPage();
  const admin = localStorage.getItem("admin");
  if(admin)
  {
    document.querySelector('#admin-views').style.display="block";
    document.querySelector('#update-profile').style.display="block";
    getUnapproved();
  }
};

const learnIndexedDb = () => {
  const request = indexedDB.open("learn");

  request.onupgradeneeded = (e) => {
    alert("Create the db");
  };

  request.onsuccess = (e) => {
    alert("Successful");
  };

  request.onerror = (e) => {
    alert("error");
  };
};

checkAndSetAdmin();
// learnIndexedDb();

setInterval(function () {
  allowPage();
  onlyAdmin();
  getUnapproved();
}, 1000);
