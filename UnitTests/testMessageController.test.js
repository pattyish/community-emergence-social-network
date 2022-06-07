const Validation = require("./../utils/helper_classes/Validations");

test("Input validation with correct details", () =>{
    let content;
    const sender="Brighton";
    const expected = false;
    const actual = Validation.validateSaveMessage(content, sender);

    expect(actual).toBe(expected);
});

test("User Id Validation", () =>{
    const expected = true;
    const actual = Validation.isIdValid("621200c48e5692c8ddbb1d8f");

    expect(actual).toBe(expected);
});