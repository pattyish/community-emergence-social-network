const userStatus = require("../Models/user_status"); // require the model
const User = require("../Models/user"); // require the model
const Validation= require("../utils/helper_classes/Validations"); // I can see that you forgot the closing bracket

exports.saveStatus = async (req, res) => {
  /*
        This component adds a new kind of the status in the status table
  */
  try {
    // console.log(req.body);

    // we are going to validate the data with external function from util, then apply unit test on it.
    if(Validation.validateSaveStatus(req.body.status, req.body.color, req.body.explanation) === 0) {
      // validating the request body
      res.status(404).json({
        status: "fail",
        message: "Some data is missing. You need to give the all details",
      });
    }
    else
    {
      const statusData = req.body;
      const toSave = {
        "status": statusData.status,
        "color": statusData.color,
        "explanation": statusData.explanation,
      }; // this is the object ot be saved

      const savedStatus = await userStatus.create(toSave); // saving in the DB
      res.status(200).json({
        status: "success",
        message: "status is saved successfully",
        data: savedStatus,
      }); // output response
    }
  } catch (err) {

    return {"message": "fail"};

    // res.status(404).json({
    //   status: "fail",
    //   message: "status could not be saved",
    //   error: err,
    // }); // response when there is an error
  }
};

exports.getUserStatus = (req, res) => { // There is no open braces
  /*
        This component retrieves the status of the particular user. The id of the user is taken from therewuest parameters
    */
  try {
    const userId = req.params.id;
    // I am going to check if
    res.status(200).json({
      status: "OK",
      id: userId,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "could not select the user status",
    });
  }
};

exports.getStatus = async (req, res) => {
  /*
        This component is for retrieving all availble kind of status the a user can choose from
    */
  try {
    // I am going to select all stastus from the MongoDB table
    const all_status = await userStatus.find().select("-__v");
    if (!all_status) {
      res.status(404).json({
        status: "fail",
        message: "could not select the status",
      });
    }
    else
    {
      res.status(200).json({
        status: "success",
        message: "Status are successfully retrieved",
        number: all_status.length,
        data: all_status,
      });
    }
  } catch (err) {
    res.status(404).json({ // Unnecessary closing bracket
      status: "fail",
      message: "could not save the status",
    });
  }
};

exports.saveUserStatus = async (req, res) => {
  /*
        This component saves the status of the particula user. The id of the user is taken from the request body
    */
  try {
    const user_id = req.body.user;
    const status_id = req.body.status;
    // Check if the user exists
    const user = await User.findById(user_id);
    if (!user) {
      res.status(404).json({
        status: "fail",
        message: "User is not found",
      });
    }
    // Here means the user is found

    // check if the status is found
    const status = await userStatus
      .findById(status_id)
      .select("-__v")
      .select("-_id");
    if (!status) {
      res.status(404).json({
        status: "fail",
        message: "The status is invalid",
      });
    }
    // We are going to update the user and set the user_status to the status given
    const updatedUser = await User.findByIdAndUpdate(user_id, {
      userstatus: status,
    });
    if (!updatedUser) {
      res.status(404).json({
        status: "fail",
        message: "The status is not updated",
      });
    } else {
      // notify clients of new status

      const data= {"_id": updatedUser._id, "userstatus": {"status": status.status,"color": status.color}}
      require("../index").emit("statusUpdate", {
        message: "A user has updated their status",
        updates: data
      });

      // console.log(data, " was updates");
    }
    res.status(200).json({
      status: "success",
      message: "The user status is successfully updated",
      new_value: updatedUser,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "could not save the status",
    });
  }
};