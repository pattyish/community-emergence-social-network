/*
  This testing file is just for testing the operations for dealing with a help document on ESN
*/

const controller = require('./../../Controller/learn-and-support-controllers/helpDocumentController');
const app = require("./../serverTest");
const supertest = require("supertest");
const request = supertest(app);
const database = require('../../Config/config');
jest.setTimeout(50000);

//APP
app.listen(5000);
app.post('/documents', controller.saveDocument);
app.get('/documents', controller.getDocuments);
app.patch('/documents/accept', controller.saveDocumentChanges);
app.get('/documents/:id', controller.getOneDocument);

//BEFORE AND AFTER

beforeAll(async () => {
  await database.connection();
});

afterAll(async () => {
  await database.close();
});

 // TESTING
 describe("Testing operations in document controller", () =>{
    // Testing saving a new request for guidance document
    //________________________________________________________________________________________
    it("Should be able to validate saving input, that they are incorrect", async () => {
        const content= {
            date: "27 March 2022", 
            description:"Here is the document description", 
            uploader: "jpaul", 
            document_name: "jayp", 
            topic:"Title"
        };
      const response = await request.post("/documents").type('json').send(content);

      expect(response.statusCode).toBe(404);
      expect(response._body.message).toBe("All details have to be provided");
  });
  //_____________________________________________________________________________________________
  it("Should be able to tell the uploader might be invalid", async()=>{
    let content = {
        date: "27 March 2022", 
        description:"Here is the document description", 
        uploader: "622c5f4ee4f27c11c3e094a8", 
        document_name: "document_name.pdf", 
        topic:"health_topics"
    };

    const response = await request.post('/documents').type('json').send(content);
    expect(response.statusCode).toBe(404);
    // expect(response._body.message).toBe("the uploader given is not valid");
  });
  //_____________________________________________________________________________________________
  // it("Should be able to save a new document as long as all data are given", async()=>{
  //   let content = {
  //       date: "27 March 2022", 
  //       description:"Here is the document description", 
  //       uploader: "623dfc3699241895509aa3e3", 
  //       document_name: "document_name.pdf", 
  //       topic:"health_topics"
  //   };

  //   const response = await request.post('/documents').type('json').send(content);
  //   expect(response.statusCode).toBe(200);
  //   expect(response._body.message).toBe("Document saved");
  // });
  //_____________________________________________________________________________________________

  // TESTING THE GET DOCUMENTS FEATURE
   //_____________________________________________________________________________________________
   it("Should be able select all documents to be shown to the user", async()=>{
    const response = await request.get('/documents').type('json');
    expect(response.statusCode).toBe(200);
    expect(response._body.message).toBe("Documents are selected successfully");
  });
  //_____________________________________________________________________________________________

  // TESTING THE SAVE CHANGES (APPROVED BY ADMIN)
   //_____________________________________________________________________________________________
   it("Should be able disallow partial data input", async()=>{
    let content = {
      document_id: "1",
     //  acceptance: true
    };

   const response = await request.patch('/documents/accept').type('json').send(content);
   expect(response.statusCode).toBe(404);
   expect(response._body.message).toBe("To accept or reject a document: document_id and acceptance/rejects are needed");
 });
 //__________________________________________________________________________________________________
   it("Should be able to reject the request id the bad document_id is given", async() => {
     let content = {
       document_id: "1",
       acceptance: true,
       reviewed: true
     };
  
    const response = await request.patch('/documents/accept').type('json').send(content);
     expect(response.statusCode).toBe(404);
     expect(response._body.message).toBe("document Id given is not a valid id");
   });
   //__________________________________________________________________________________________________
     it("Should be able to updated the full packaged document.", async() => {
       let content = {
         document_id: "62416de7a37c04fb2b0b6997",
         reviewed: true,
         acceptance: true
       };
    
      const response = await request.patch('/documents/accept').type('json').send(content);
      expect(response.statusCode).toBe(200);
      expect(response._body.message).toBe("The changes are save successfully");
     });
    //__________________________________________________________________________________________________
     // TESTING SELECTING A ONE DOCUMENT HAVING ITS ID
     it("Should test that the ID given is invalid", async () =>{
        const response = await request.get('/documents/3434').type('json');
        expect(response.statusCode).toBe(404);
        expect(response._body.message).toBe("The document id is invalid");
     });
    //__________________________________________________________________________________________________
    it("Should be able to select a document once a ID is properly given", async () =>{
      const response = await request.get('/documents/62416de7a37c04fb2b0b6997').type('json');
        expect(response.statusCode).toBe(200);
        expect(response._body.error).toBe("The document is successfully selected");
    });
});
