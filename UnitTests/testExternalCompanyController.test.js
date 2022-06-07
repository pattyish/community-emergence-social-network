const validation = require("./../utils/helper_classes/Validations");

test("Validate login input", () => {
  const expected = true;
  const body = {
    username: "Amburance1",
    password: "Amburance1",
  };
  const actual = validation.validateHealthCompanyLogin(body);

  expect(actual).toBe(expected);
});

test("Try to loggin without Password", () => {
  const expected = false;
  const body = {
    username: "Amburance1",
  };
  const actual = validation.validateHealthCompanyLogin(body);

  expect(actual).toBe(expected);
});

test("Try to login with no password and username", () => {
  const expected = false;
  const body = {};
  const actual = validation.validateHealthCompanyLogin(body);

  expect(actual).toBe(expected);
});

test("All information needed provide", () => {
  const expected = true;
  const body = {
    company_name: "Amburance Company Kigali",
    company_location: "Kigali-Muhima",
    company_category: "Amburance",
    company_contact: "0782214140",
    username: "Amburance1",
    password: "Amburance1",
  };
  const actual = validation.validateHealthCompany(body);
  expect(actual).toBe(expected);
});

test("Information provided without Password", () => {
  const expected = false;
  const body = {
    company_name: "Amburance Company Kigali",
    company_location: "Kigali-Muhima",
    company_category: "Amburance",
    company_contact: "0782214140",
    username: "Amburance1",
  };
  const actual = validation.validateHealthCompany(body);
  expect(actual).toBe(expected);
});

test("Missing category and contact for company", () => {
  const expected = false;
  const body = {
    company_name: "Amburance Company Kigali",
    company_location: "Kigali-Muhima",
    username: "Amburance1",
    password: "Amburance1",
  };
  const actual = validation.validateHealthCompany(body);
  expect(actual).toBe(expected);
});
// Testing Object Id
test("Test company object Id is valid", () => {
  const expected = false;
  let id = "6242270089829d67666c8d5";
  const actual = validation.isIdValid(id);

  expect(actual).toBe(expected);
});

test("Test company object Id is valid", () => {
  const expected = true;
  let id = "6242270089829d67666c8d51";
  const actual = validation.isIdValid(id);

  expect(actual).toBe(expected);
});
