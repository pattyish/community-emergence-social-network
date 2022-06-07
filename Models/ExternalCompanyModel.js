const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const externalCompanySchema = mongoose.Schema({
  company_name: {
    type: String,
  },
  company_category: {
    type: String,
  },
  company_location: {
    type: String,
  },
  company_contact: {
    type: String,
  },
  username: {
    type: String,
    required: [true, "A username must be unique."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "A password is required"],
  },
  status: {
    type: String,
    default: "inactive",
  },
});

// externalCompanySchema.methods.isPasswordCorrect = async function (
//   enteredPassword,
//   realPassword
// ) {
//   return await bcrypt.compare(enteredPassword, realPassword);
// };

/*
    The below class is a singleton class that prevent from creating to many models everytime we will require the model.
*/
class HealthCompanyModel {
  constructor(mongoose_var, schema) {
    if (!this.instance) {
      // create a model if it has not been already created
      this.instance = mongoose_var.model("ExternalCompany", schema);
    }
  }

  getModel() {
    return this.instance;
  }
}

const model = new HealthCompanyModel(mongoose, externalCompanySchema);

module.exports = model.getModel();
