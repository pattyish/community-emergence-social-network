const controller = require("../Controller/ExternalCompanyController");
const app = require("./serverTest");
const supertest = require("supertest");
const request = supertest(app);
const database = require("../Config/config");
const mockingoose = require('mockingoose');
const ExternalCompany = require("../Models/ExternalCompanyModel");
const bcrypt = require("bcryptjs");
jest.setTimeout(60000);

//APP
app.listen(6000);
app.post("/companyregister", controller.register);
//BEFORE AND AFTER

// beforeAll(async () => {
//   await database.connection();
// });
//
// afterAll(async () => {
//   await database.close();
// });

// TESTING
describe("Testing End-points", () => {
  it("What happens registering with correct information", async () => {
    mockingoose(ExternalCompany)
        .toReturn(undefined, 'findOne')
        .toReturn({
          username: "Amburance16",
          id: '0001111'
        }, 'save');

    const body = {
      company_name: "New Life company G&B 123",
      company_category: "Amburance",
      company_location: "Kigali-Muhima",
      company_contact: "0782214149",
      username: "Amburance16",
      password: "Amburance1",
    };
    const response = await request
      .post("/companyregister")
      .type("json")
      .send(body);

    expect(response.statusCode).toBe(201);
    expect(response.body.msg).toBe("Company Created successful!!");
  });
});
