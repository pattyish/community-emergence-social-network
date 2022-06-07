// import validation
const Validation = require("./../utils/helper_classes/Validations");

test("Save status input validation 1", () => {
  const expected = 1;
  let status = "new";
  let color = "grey";
  let explanation = "This is great";
  const actual = Validation.validateSaveStatus(status, color, explanation);

  expect(actual).toBe(expected);
});

test("Save status input validation 2", () => {
  const expected = 0;
  let status = "OK";
  let color;
  let explanation = "This is great";
  const actual = Validation.validateSaveStatus(status, color, explanation);

  expect(actual).toBe(expected);
});

test("Save status input validation 3", () => {
  const expected = 0;
  let status = "OK";
  let color = "Green";
  let explanation;
  const actual = Validation.validateSaveStatus(status, color, explanation);

  expect(actual).toBe(expected);
});

test("Save status input validation 4", () => {
  const expected = 1;
  let status = "OK";
  let color = "Green";
  let explanation = "This is great";
  const actual = Validation.validateSaveStatus(status, color, explanation);

  expect(actual).toBe(expected);
});

test("Save status input validation 5", () => {
  const expected = 0;
  let status;
  let color;
  let explanation;
  const actual = Validation.validateSaveStatus(status, color, explanation);

  expect(actual).toBe(expected);
});
