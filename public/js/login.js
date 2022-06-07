const showMessage = (message, color) => {
  document.getElementById("feedback").innerHTML = message;
  document.getElementById("feedback").style.color = color;
};

const showNameAndPasswordValidateMessage = (id, display, message, color) => {
  document.getElementById(id).innerHTML = message;
  document.getElementById(id).style.display = display;
  document.getElementById(id).style.color = color;
};

const checkUser = async () => {
  try {
    const id = localStorage.getItem("userid");
    if (id) {
      const result = await axios({
        method: "GET",
        url: `${BASE}users/` + id,
      });
      const status = result.data.status;
      if (status === "success") {
        window.location.href = `${BASE}home`;
      } else {
        //window.location.href="http://localhost:8080/login";
      }
    } else {
      //window.location.href="http://localhost:8080/login";
    }
  } catch (err) {
    console.log(err);
  }
};

checkUser();

const validate = (name, password) => {
  if (name.trim().length === 0 || password.trim().length === 0) {
    return false;
  }
  return true;
};

const saveToken = (token, id, user) => {
  const isAdmin = user.privilege;
  if (isAdmin === "administrator") {
    localStorage.setItem("isAdmin", true);
  }
  localStorage.setItem("token", token);
  localStorage.setItem("userid", id);
  localStorage.setItem("privilege", user.privilege);
  localStorage.setItem("user-name", user.username);
};

const createNewAccount = async (username, password) => {
  try {
    const result = await axios({
      method: "POST",
      url: `${BASE}users/register`,
      data: { username: username, password: password },
    });
    if (result.data.status === "fail") {
      showNameAndPasswordValidateMessage(
        "msg",
        "block",
        result.data.message,
        result.data.color
      );
      // alert(result.data.message);
      console.log(result);
    } else if (result.data.status === "usv" && result.data.status !== "pv") {
      showNameAndPasswordValidateMessage(
        "usr",
        "block",
        result.data.message,
        result.data.color
      );
      document.getElementById("psw").innerHTML = "";
      // alert(result.data.message);
    } else if (result.data.status === "pv" && result.data.status !== "usv") {
      showNameAndPasswordValidateMessage(
        "psw",
        "block",
        result.data.message,
        result.data.color
      );
      document.getElementById("usr").innerHTML = "";
      // alert(result.data.message);
    } else {
      // saving the token
      showMessage("New account created", "green");
      document.getElementById("psw").innerHTML = "";
      document.getElementById("usr").innerHTML = "";
      saveToken(result.data.token, result.data.user_id, result.data.user);

      window.location.href = `${BASE}welcome`;
    }
  } catch (err) {
    console.log(err);
  }
};

const sendData = async (username, password) => {
  try {
    const result = await axios({
      method: "POST",
      url: `${BASE}users/login`,
      data: { username: username, password: password },
    });
    if (result) {
      // console.log(result.data);
      if (result.data.status === "success") {
        // saving the token
        console.log(result.data.admin);
        saveToken(result.data.token, result.data.user_id, result.data.usr);
        window.location.href = `${BASE}home`;
      } else if (result.data.status === "new") {
        let confirmation = confirm("Do you want to create an account on ESN ?");
        if (confirmation) {
          createNewAccount(username, password);
        } else {
          showMessage("Thank you, see you next time", "blue");
        }
      } else if (result.data.status === "inactive") {
        showMessage(
          "Your account is no longer accessible. Contact the admin for more information",
          "tomato"
        );
        $("#submit-btn").attr("disabled", true);
      }
    }
  } catch (error) {
    if (error.response) {
      const r = error.response.data;
      if (r.status === "new") {
        //create account in case of an error
        let confirmation = confirm("Do you want to create an account on ESN ?");
        if (confirmation) {
          createNewAccount(username, password);
        } else {
          showMessage("Thank you, see you next time", "blue");
        }
      } else if (r.status === "inactive") {
        showMessage(
          "Your account is no longer accessible. Contact the admin for more information",
          "tomato"
        );
        $("#submit-btn").attr("disabled", true);
      } else {
        showMessage("Invalid login information!!", "tomato");
      }
    } else {
      alert("try again later");
    }
  }
};

document.querySelector(".login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("username").value.toLowerCase();
  const password = document.getElementById("password").value;
  if (validate(name, password)) {
    // call the server, pass login route

    // get the result
    // If result is user not found
    // ask the user to create account.
    // if the result is success
    // redirect.
    showMessage("", "red");
    sendData(name, password);
  } else {
    showMessage("Please, all fields are required", "red");
  }
});
