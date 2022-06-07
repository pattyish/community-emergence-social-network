function showMessage(message, color)
{
  document.querySelector("#message").innerHTML = "";
  document.querySelector("#message").style.display = "block";
  document.querySelector("#message").innerHTML = message;
  document.querySelector("#message").style.color = color;
}

function validate(id, username, privilege, status)
{
  if(id && username && privilege && status)
  {
    return true;
  }
  return false;
}

const updateUser = async(userdata, id) =>
{
  try
  {
    const result = await axios({
      method: "PATCH",
      url: `${BASE}users/${id}`,
      data: userdata
    });
    if(result)
    {
      if(result.data.status === "success")
      {
        showMessage("User profile is successfully updated", "green");
      }
      else if(result.data.status === "pv")
      {
        showMessage("The password should follow the rules!!", "red");
      }
      else if(result.data.status === "usv")
      {
        showMessage("The username should follow the rules!!", "red");
      }
      
      $("#submit-btn").attr('disabled', false);
    }
  }catch(error) {
    console.log(error);
  }
}

document.querySelector('#CheckBox').addEventListener('click', e =>
{
  const passwordChecked = document.querySelector("#CheckBox");
  if(passwordChecked.checked === true)
  {
    document.getElementById("password_area").style.display ="block";
  }
  else
  {
    document.getElementById("password_area").style.display ="none";
  }
})

document.querySelector(".update-profile-form").addEventListener("submit", (e) => {
    e.preventDefault();
    $("#submit-btn").attr('disabled', true);
    const id = document.querySelector("#userId").value;
    const username = document.querySelector("#username").value;
    const privilege = document.querySelector("#privilege").value;
    const status = document.querySelector("#status").value;
    const password = document.querySelector("#password").value;
    const passwordChecked = document.querySelector("#CheckBox");
    if(validate(id, username, privilege, status))
    {
      let userdata;
      if(passwordChecked.checked === true)
      {
        if(password)
        {
          userdata = {
            username: username,
            privilege: privilege,
            status: status,
            password: password,
          };
        }
        else
        {
          showMessage("A new password is required!!", "red"); 
          userdata = null;
        }
      }
      else
      {
        userdata = {
          username: username,
          privilege: privilege,
          status: status
        };
      }   
      
      if(userdata != null)
      {
        updateUser(userdata, id);
      }
    }
    else
    {
      alert("Fill all fields");
    }
});