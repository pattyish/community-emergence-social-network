const express = require("express");
const ExternalCompany = require("../Controller/ExternalCompanyController");
const auth = require("../Middlewares/auth");

const router = express();

router.post("/companyregister", ExternalCompany.register);
router.post("/companylogin", ExternalCompany.login);
// router.post("/companyProfile", ExternalCompany.updateProfile);
router.get("/activecompanies", ExternalCompany.getAllCompanies);
router.get("/inactivecompanies", ExternalCompany.adminGetAllCompanies);
router.put("/updatecompanyprofile/:id", ExternalCompany.updateProfile);
router.put("/update/status/:id", ExternalCompany.activateCompany);
router.get("/companyprofile", [auth], ExternalCompany.getCompanyProfile);

module.exports = router;
