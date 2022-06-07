const bannedUsernamesHelper = require('./BannedUsernamesHelper');

class Validation {
  constructor() {}
  validateSaveMessage(cont1, cont2) {
    if (!cont1 || !cont2) {
      return false;
    }
    return true;
  }

  validateSaveStatus(status, color, explanation) {
    if (status && color && explanation) {
      return 1;
    } else {
      return 0;
    }
  }

  validate_user_data_to_register(username, password) {
    if (!username || !password) {
      return false;
    }
    return true;
  }

  validateLogin(username, password) {
    if (!username || !password) {
      return false;
    }
    return true;
  }

  validateHealthCompanyLogin(body) {
    if (!body.username || !body.password) {
      return false;
    }
    return true;
  }
  validateHealthCompany(body) {
    if (
      !body.company_name ||
      !body.company_location ||
      !body.company_category ||
      !body.company_contact ||
      !body.username ||
      !body.password
    ) {
      return false;
    }
    return true;
  }

  isIdValid(id) {
    const mongoose = require("mongoose");
    try {
      const valid = mongoose.Types.ObjectId(id);
      if (!valid) {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }
  
  toArray() {
    let a =
      " a, able, about, across, after, all, almost, also, am, among, an, and, any, are, as, at, be, because, been, but, by, can, cannot, could, dear, did, do, does, either, else, ever, every, for, from, get, got, had, has, have, he, her, hers, him, his, how, however, i, if, in, into, is, it, its, just, least, let, like, likely, may, me, might, most, must, my, neither, no, nor, not, of, off, often, on, only, or, other, our, own, rather, said, say, says, she, should, since, so, some, than, that, the, their, them, then, there, these, they, this, tis, to, too, twas, us, wants, was, we, were, what, when, where, which, while, who, whom, why, will, with, would, yet, you, your";
    let arr = a.split(",");
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].trim();
    }
    return arr;
  }

  validateSaveDocument(object)
  {
    if(object)
    {
      if(object.document_name && object.topic && object.uploader && object.date && object.description)
      {
        if(!this.isIdValid(object.uploader))
        {
          return false; 
        }
        return true;
      }
      else
      {
        return false;
      }
    }
    else
    {
      return false;
    }
  }

  validateSaveDocumentChanges(content)
  {
    if(!content)
    {
      return false;
    }
    else
    {
      if(content.document_id && content.reviewed)
      {
        return true;
      }
      else
      {
        return false;
      }
    }
  }

  validateUpdateProfile(data)
  {
    if(data.username && data.status && data.privilege){
      return true;
    }else{
      return false;
    }
  }

  usernameValidationError(username) {
    if (username.length < 3) {
      return "Username should be at least 3 characters";
    } else if(bannedUsernamesHelper.isUsernameBanned(username)) {
      return "Username is not allowed";
    }
    return null;
  }

  passwordValidationError(password) {
    if (password.length < 4) {
      return "Password should be at least 4 characters";
    }
    return null;

  }

}

class ExportValidation {
  constructor() {
    if (!this.instance) {
      this.instance = new Validation();
    }
  }
  getInstance() {
    return this.instance;
  }
}
const exp = new ExportValidation();
module.exports = exp.getInstance();
