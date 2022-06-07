const validation = require("./../utils/helper_classes/Validations");

describe("Tests regarding user controller", () => {
  test("Validate login input", () => {
    const expected = true;
    let username = "paul";
    let password = "Green";
    const actual = validation.validateLogin(username, password);

    expect(actual).toBe(expected);
  });

  test("Username should be provided", () => {
    const expected = false;
    let username = "";
    let password = "Green";
    const actual = validation.validateLogin(username, password);

    expect(actual).toBe(expected);
  });

  test("Passowrd should be provided", () => {
    const expected = false;
    let username = "paul";
    let password = "";
    const actual = validation.validateLogin(username, password);

    expect(actual).toBe(expected);
  });

  test("Username and password should be provided", () => {
    const expected = false;
    let username = "";
    let password = "";
    const actual = validation.validateLogin(username, password);

    expect(actual).toBe(expected);
  });

  test("A user id given should be valid MongoID", () => {
    const expected = true;
    let id = "621d1d548243c3b504d2444f";
    const actual = validation.isIdValid(id);

    expect(actual).toBe(expected);
  });

  test("User ID id is not valid", () => {
    const expected = false;
    let id = "621d1d548243c3b504d2444";
    const actual = validation.isIdValid(id);

    expect(actual).toBe(expected);
  });

  test("User ID should not be empty", () => {
    const expected = false;
    let id = "";
    const actual = validation.isIdValid(id);

    expect(actual).toBe(expected);
  });

  test("In time for registering, a user might give the full details", () => {
    const expected = true;
    let firstname = "Paul";
    let lastname = "Brighton";
    let username = "Patrick";
    let password = "Marius Tyson";
    const actual = validation.validate_user_data_to_register(
      firstname,
      lastname,
      username,
      password
    );

    expect(actual).toBe(expected);
  });

  test("if the admin has given full details to update the user profile", () => {
    const expected = true;
    const data = {
      username: "tyson",
      privilege: "coordinator",
      status: "active",
      password: "123",
    };
    const actual = validation.validateUpdateProfile(data);

    expect(actual).toBe(expected);
  });
});
