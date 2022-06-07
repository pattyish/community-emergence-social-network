/*
    This testing file is testing all API end points for the user_status controller 
*/
  const controller = require('../Controller/userStatusController');
  const app = require("./serverTest");
  const supertest = require("supertest");
  const request = supertest(app);
  const database = require('../Config/config');
  const UserStatus = require("../Models/user_status");
  const mockingoose = require("mockingoose");

jest.setTimeout(5000);

  // APP
  app.listen(4000);
  app.post('/status', controller.saveStatus);
  app.get('/status', controller.getStatus);

  //BEFORE AND AFTER
  
/*  beforeAll(async () => {
    await database.connection();
  });
  
  afterAll(async () => {
    await database.close();
  });*/
  
  // TESTING
  describe("Testing operations in user status controller", () =>{
    // Testing adding a new status to database
    /*it("Should be able to add a new status in the database", async () => {
        mockingoose(userStatus)
            .toReturn({hello: 'cad'}, 'save');

        const status1= {status: "new", color: "grey"};
        const status2 = {status: "new_changed", color: "blue", explanation: "I am testing_changed"};
        const response = await request.post("/status").type('json').send(status2);
    
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("status is saved successfully");
    });*/

    // testing getting all statuses
    it("Should be able to select all available statuses from the table", async() =>{
        mockingoose(UserStatus)
            .toReturn([{}], 'find');

        const response = await request.get("/status").type('json');

        expect(response.statusCode).toBe(200);
        expect(response._body.message).toBe("Status are successfully retrieved");
    });
  });