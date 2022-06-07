const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const ExternalCompany = require("../Models/ExternalCompanyModel");
const validation = require("./../utils/helper_classes/Validations");
const jwt = require("jsonwebtoken");

dotenv.config();
class ExternalCompanyController {
  // Registering External Company which is Health service company
  static register = async (req, res) => {
    if (!validation.validateHealthCompany(req.body)) {
      return res.status(404).json({
        status: 404,
        message: "A user is missing some important details",
      });
    }
    const isCompanyExist = await ExternalCompany.findOne({
      username: req.body.username,
    });

    if (isCompanyExist) {
      return res.status(404).json({
        status: 404,
        msg: `Company already registered on ${req.body.username} `,
      });
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const HealthCompany = new ExternalCompany({
      company_name: req.body.company_name,
      company_category: req.body.company_location,
      company_location: req.body.company_category,
      company_contact: req.body.company_contact,
      username: req.body.username,
      password: hashedPassword,
    });

    const HealthCompany_ = await HealthCompany.save();
    if (!HealthCompany_) {
      return res.status(500).json({
        status: 500,
        msg: "Server Error!!",
      });
    }
    const token = jwt.sign(
      {
        username: HealthCompany_.username,
        id: HealthCompany_._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: 86400,
      }
    );
    res.status(201).json({
      status: 201,
      msg: "Company Created successful!!",
      HealthCompany_: HealthCompany_,
      token,
    });
  };
  // Login External Company which is Health service company
  static login = async (req, res) => {
    if (!validation.validateHealthCompanyLogin(req.body)) {
      return res.status(404).json({
        status: 404,
        message: "Username and Password should be provided!",
      });
    }
    const isCompanyExist = await ExternalCompany.findOne({
      username: req.body.username,
    });

    if (!isCompanyExist) {
      return res.status(404).json({
        status: 404,
        msg: `User with ${req.body.username} doesn't exist!! password doesn't match!!`,
      });
    }

    const passwordMatch = bcrypt.compareSync(
      req.body.password,
      isCompanyExist.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        status: 401,
        message: "Username and password doesn't match!!!!",
      });
    }
    const token = jwt.sign(
      {
        username: isCompanyExist.username,
        id: isCompanyExist._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: 86400,
      }
    );

    res.status(200).json({
      status: 200,
      msg: "Logged in successful!!!",
      token,
    });
  };
  // Update information External Company which is Health service company
  static updateProfile = async (req, res) => {
    if (!validation.isIdValid(req.params.id)) {
      return res.status(404).json({
        status: 404,
        message: "You have to provide valid mongodb Id",
      });
    }
    const isCompanyExist = await ExternalCompany.findById(req.params.id);

    if (!isCompanyExist) {
      return res.status(404).json({
        status: 404,
        msg: `No company registered on ${req.params.id} `,
      });
    }
    const updatecompanyprofile = await ExternalCompany.findByIdAndUpdate(
      req.params.id,
      {
        company_name: req.body.company_name || isCompanyExist.company_name,
        company_category:
          req.body.company_location || isCompanyExist.company_location,
        company_location:
          req.body.company_category || isCompanyExist.company_category,
        company_contact:
          req.body.company_contact || isCompanyExist.company_contact,
      },
      { new: true }
    );
    if (!updatecompanyprofile) {
      return res.status(500).json({
        status: 500,
        message: "Profile Not Updated!!",
      });
    }
    res.status(201).json({
      status: 201,
      msg: "Profile Updated Successful!!",
      updatecompanyprofile,
    });
  };
  // Getting All External Company which is Health service company for Admin
  static adminGetAllCompanies = async (req, res) => {
    const AllCompanies = await ExternalCompany.find({
      status: "inactive",
    }).select(["-__v", "-password"]);
    if (!AllCompanies) {
      return res.status(404).json({
        status: 404,
        msg: "There is no Company so far!!",
      });
    }
    res.status(200).json({
      status: 200,
      msg: "All companies regstred!!",
      companies: AllCompanies,
    });
  };

  // Getting All External Company which is Health service company for citizen
  static getAllCompanies = async (req, res) => {
    const AllCompanies = await ExternalCompany.find({
      status: "active",
    }).select(["-__v", "-password"]);
    if (!AllCompanies) {
      return res.status(404).json({
        status: 404,
        msg: "There is no Company so far!!",
      });
    }
    res.status(200).json({
      status: 200,
      msg: "All companies regstred!!",
      companies: AllCompanies,
    });
  };
  // Activating Health service company
  static activateCompany = async (req, res) => {
    if (!validation.isIdValid(req.params.id)) {
      return res.status(404).json({
        status: 404,
        message: "You have to provide valid mongodb Id",
      });
    }
    const isCompanyExist = await ExternalCompany.findById(req.params.id);

    if (!isCompanyExist) {
      return res.status(404).json({
        status: 404,
        msg: `No company registered on ${req.params.id} `,
      });
    }
    const updateStatus = await ExternalCompany.findByIdAndUpdate(
      req.params.id,
      {
        status: "active",
      },
      { new: true }
    );
    if (!updateStatus) {
      return res.status(500).json({
        status: 500,
        message: "Profile Not Updated!!",
      });
    }
    res.status(201).json({
      status: 201,
      msg: "Status Updated Successful!!",
      updateStatus,
    });
  };
  // Get company profile
  static getCompanyProfile = async (req, res) => {
    const comp_id = req.payload.id;
    if (!validation.isIdValid(comp_id)) {
      return res.status(404).json({
        status: 404,
        message: "You have to provide valid mongodb Id",
      });
    }
    const isCompanyExist = await ExternalCompany.findById(comp_id).select([
      "-__v",
      "-password",
    ]);

    if (!isCompanyExist) {
      return res.status(404).json({
        status: 404,
        msg: `No company registered on ${req.params.id} `,
      });
    }
    res.status(200).json({
      status: 200,
      msg: "Company profile!!",
      isCompanyExist,
    });
  };
}

module.exports = ExternalCompanyController;
