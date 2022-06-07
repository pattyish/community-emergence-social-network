/*
  This testing file is just for testing the operations for user collection
*/
const mockingoose = require('mockingoose');
const User = require('../Models/user');
const controller = require("./../Controller/userController");
const app = require("./serverTest");
const supertest = require("supertest");
const request = supertest(app);
const database = require("../Config/config");
const bcrypt = require("bcryptjs");
jest.setTimeout(80000);

//APP
app.listen(3000);
app.post("/users/login", controller.login);
app.post("/users/register", controller.register);

//BEFORE AND AFTER

// beforeAll(async () => {
//   await database.connection();
// });
//
// afterAll(async () => {
//   await database.close();
// });

// TESTING
describe("Testing operations in user controller Login, and get all users", () => {
  // Testing logging in the system
  //________________________________________________________________________________________
  it("Should be able to validate user input data", async () => {
    const user1 = { username: "jayp", password: "123" };
    const user2 = {};
    const response = await request
      .post("/users/login")
      .type("json")
      .send(user2);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("username or password is not given");
  });
  //________________________________________________________________________________________

  it("Should be able to tell that given credentials are not in the system", async () => {
    // mockingoose(User).toReturn(
    //     {
    //       status: "active"
    //     }, 'findOne');

    const user1 = { username: "jayp_wrong", password: "123" };
    const response = await request
      .post("/users/login")
      .type("json")
      .send(user1);

    expect(response.statusCode).toBe(404);
    expect(response._body.message).toBe("User not registered, create Account");
  });
  //________________________________________________________________________________________
  // TESTING REGISTER
  it("Should be able reject bad input", async () => {
    const user1 = { username: "jayps", password: "12" }; // it should be "password"
    const response = await request
      .post("/users/register")
      .type("json")
      .send(user1);

    expect(response.statusCode).toBe(200);
    expect(response._body.message).toBe(
      "Password should be at least 4 characters"
    );
  });

  it("Should be able to successfully log in the right user", async () => {
    mockingoose(User).toReturn(
      {
        username: "jayp",
        password: bcrypt.hashSync("123", 8),
      }, 'findOne');

    const user1 = { username: "jayp", password: "123" };
    const response = await request
      .post("/users/login")
      .type("json")
      .send(user1);

    expect(response.statusCode).toBe(200);
    expect(response._body.message).toBe("User Logged in succesfully");
  });
  //________________________________________________________________________________________
});
