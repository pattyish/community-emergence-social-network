const User = require("../Models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const validation = require("./../utils/helper_classes/Validations");

dotenv.config();

class UserController {
  constructor() {}
  getAllUser = (req, res) => {
    User.aggregate([
      {
        $sort: {
          username: 1,
        },
      },
      {
        $match: {
          status: "active"
        }
      }
    ])
      .exec()
      .then((usr) => {
        res.status(200).json(usr);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  };

  getAllUserProfiles = (req, res) => {
    User.aggregate([
      {
        $sort: {
          username: 1,
        },
      },
    ])
      .exec()
      .then((usr) => {
        res.status(200).json(usr);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  };

  findUserId = (req, res) => {
    const { id } = req.params;
    // Validation
    if (!validation.isIdValid(id)) {
      res.status(404).json({
        status: "fail",
        message: "The given id is not valid",
      });
    }
    User.findById(id)
      .exec()
      .then((usr) => {
        if (usr) {
          console.log({
            status: "success",
            message: "user is found",
            data: usr,
          });
          res.status(200).json({
            status: "success",
            message: "user is found",
            data: usr,
          });
        } else {
          console.log({
            status: "fail",
            message: "user is not found",
          });
          res.status(200).json({
            status: "fail",
            message: "user is not found",
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          status: "fail",
          message: "Could not find that user",
          error: err,
        });
      });
  };

  findUserToUpdate = (req, res) => {
    const { id } = req.params;
    // Validation
    if (!validation.isIdValid(id)) {
      res.status(404).json({
        status: "fail",
        message: "The given id is not valid",
      });
    }
    else
    {
      User.findById(id)
      .exec()
      .then((usr) => {
        if (usr) {
          console.log({
            status: "success",
            message: "user is found",
            data: usr,
          });
          const data = usr;
          // Render the page for updates 
          res.render("updateProfileForm", { data });
          
        } else {
          res.status(200).json({
            status: "fail",
            message: "user is not found",
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          status: "fail",
          message: "Could not find that user",
          error: err,
        });
      });
    }
  };

  deleteUser = (req, res) => {
    const { id } = req.params;
    // validation
    if (!validation.isIdValid(id)) {
      res.status(404).json({
        status: "fail",
        message: "The given id is not valid",
      });
    }
    User.deleteOne({ _id: id })
      .exec()
      .then((result) => {
        res.status(200).json({ message: "User deleted succesfully" });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  };

  UserFound = (req, res, next) => {
    const { id } = req.params;
    if (!validation.isIdValid(id)) {
      res.status(404).json({
        status: "fail",
        message: "The given id is not valid",
      });
    }
    User.findById(id)
      .exec()
      .then((usr) => {
        if (!usr)
          return res.status(404).json({
            message: "User not found",
          });
        next();
      })
      .catch((err) => {
        return res.status(404).json({
          message: "Error, Citizen not found check your id",
        });
      });
  };

  register = (req, res) => {
      // validate username
      const usernameValidationError = validation.usernameValidationError(req.body.username);
      if (usernameValidationError != null) {
        // username validation
        return res.status(200).json({
          status: "usv", 
          message: usernameValidationError,
          color: "red"
        });
      }
      // Validate password
      const passwordValidationError = validation.passwordValidationError(req.body.password);
      if (passwordValidationError != null) {
        // password validation
        return res.status(200).json({
          status: "pv", 
          message: passwordValidationError,
          color: "red"
        });
      }
    
    if (
      !validation.validate_user_data_to_register(
        req.body.username,
        req.body.password
      )
    ) {
      return res.status(404).json({
        status: "fail",
        message: "A user is missing some important details",
      });
    } else {
      var hashedPassword = bcrypt.hashSync(req.body.password, 8);
      const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
      });
      newUser
        .save()
        .then((result) => {
          var token = jwt.sign(
            {
              username: newUser.username,
              password: newUser.password,
            },
            process.env.SECRET_KEY,
            {
              expiresIn: 86400,
            }
          );
          res.status(200).send({
            status: "success",
            message: "user Registered succesfully",
            token: token,
            user_id: result._id,
            user: result
          });
          require("../index").emit("directoryNewUser", newUser);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  updateUserProfile = async (req, res) => {
    const id = req.params.id;

    if(! validation.isIdValid(id))
    {
      res.status(404).json({
        status:"fail",
        message:"The Id given is not valid"
      });
    }

    let data = {
      username: req.body.username,
      privilege: req.body.privilege,
      status: req.body.status
    }

    // validate username
    const usernameValidationError = validation.usernameValidationError(data.username);
    if (usernameValidationError != null) {
      // username validation
      return res.status(200).json({
        status: "usv", 
        message: usernameValidationError,
      });
    }

    console.log(id)
    const userProfileSelect = await User.findById(id).select('-__v').select('-password'); // Select all except __v and password
    if(userProfileSelect)
    {
      // validate if admin has given all data to be updated
      if(req.body.password)
      {
         // Validate password
        const passwordValidationError = validation.passwordValidationError(req.body.password);
        if (passwordValidationError != null) {
          // password validation
          return res.status(200).json({
            status: "pv", 
            message: passwordValidationError,
          });
        }
        // encrypt the password
        data.password= bcrypt.hashSync(req.body.password, 8);
      }
      
      if(!validation.validateUpdateProfile(data))
      {
        res.status(404).json({
          status: "fail",
          message: "Admin should give all details of the update"
        });
      }
      else
      {
        // go ahead and update him
        const updated = await User.findByIdAndUpdate(id, data);
        if(updated)
        {
          data._id = id
          // send the socket signal
          require("../index").emit("profileUpdated", {
            message: "A user profile has been updated",
            updates: data
          });

          res.status(200).json({
            status: "success",
            message: "User updated"
          });
        }
        else
        {
          res.status(404).json({
            status: "fail",
            message: "Something went wrong"
          });
        }
      }
    }
    else
    {
      res.status(404).json({
        status: "fali",
        message: "The given Id has no user"
      });
    }
  };

  login = (req, res) => {
    if (!validation.validateLogin(req.body.username, req.body.password)) {
      res.status(404).json({
        message: "username or password is not given",
      });
    } else {
      const username = req.body.username;
      const password = req.body.password;

      User.findOne({
        username: username
      })
        .exec()
        .then((usr) => {
          if (usr) {
            if(usr.status !== "active")
            {
              return res.status(404).json({
                status: "inactive",
                message:"Your account has been desactivated",
                user: usr
              });
            }
            else
            {
              bcrypt.compare(password, usr.password, function (err, result) {
                if (err) {
                  return res.json({
                    status: "fail",
                    error: err,
                  });
                }
  
                if (result) {
                  var token = jwt.sign(
                    {
                      user_id: usr._id,
                      username: usr.username,
                      password: usr.password,
                    },
                    process.env.SECRET_KEY,
                    {
                      expiresIn: 86400,
                    }
                  );
                  res.status(200).send({
                    status: "success",
                    message: "User Logged in succesfully",
                    token: token,
                    user_id: usr._id,
                    usr,
                  });
                } else {
                  res.status(500).send({
                    status: "passw",
                    message: "Invalid password",
                  });
                }
              });
            }
          } else {
            res.status(404).json({
              status: "new",
              message: "User not registered, create Account",
            });
          }
        })
        .catch((err) => {
          console.log("Checking 500 -- 2");
          res.status(500).send({
            message: "error happened",
            error: err,
          });
        });
    }
  };
}

class UserControllerSingleton {
  constructor() {
    if (!this.instance) {
      this.instance = new UserController();
    }
  }
  getInstance() {
    return this.instance;
  }
}

const controller = new UserControllerSingleton();

module.exports = controller.getInstance();
