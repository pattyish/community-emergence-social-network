const validation = require("./../../utils/helper_classes/Validations");


describe('Checking all function needed with guidance documents', () => {
    //_____________________________________________________________________________________________
    it("Should validate empty object passed", () =>{
        let content;
        const expected = false;
        const actual = validation.validateSaveDocument(content);
    
        expect(actual).toBe(expected);
    });
    //_____________________________________________________________________________________________
    it("Should be able to identify that not all enough details are given to save a document", () =>{
        let content = {
            date: "27 March 2022", 
            description:"Here is the document description", 
            uploader: "jpaul", 
            // document_name: "jayp", 
            topic:"Title"
        };
        const expected = false;
        const actual= validation.validateSaveDocument(content);

        expect(actual).toBe(expected);
    });
    //_____________________________________________________________________________________________
    it("Should be able to identify that the uploader id is not a valid MongoDB id", ()=>{
        let content = {
            date: "27 March 2022", 
            description:"Here is the document description", 
            uploader: "jpaul", 
            document_name: "jayp", 
            topic:"Title"
        };
        const expected = false;
        const actual = validation.validateSaveDocument(content);
        
        expect(actual).toBe(expected);
    });
    //_____________________________________________________________________________________________
    // TESTING FUNCTIONS USED IN SAVING CHANGES ABOUT DOCUMENT FROM THE ADMIN
    it("Should be able to validate the content in savingChanges", ()=>{
        let content;
        const actual = validation.validateSaveDocumentChanges(content);
        const expected = false;

        expect(actual).toBe(expected);
    });
    // _____________________________________________________________________________________________
    it("Should be able to validate the content in savingChanges, see if document_id and acceptance are all given", ()=>{
        let content= {
            document_id : "1",
            reviewed: true,

        };
        const actual = validation.validateSaveDocumentChanges(content);
        const expected = true;

        expect(actual).toBe(expected);
    });
});
