//Does the function correctly call the Mongoose find() method with the right arguments?

const { findQuestion } = require("../cli_functions.js");
const Questionnaire = require("../model/Questionnaire.js");
describe("Find Question - call find method", () => {
  it("Calls find method on Questionnaire model", () => {
    const qq_id = "QQ000";
    const q_id = "P00";
    const spy = jest.spyOn(Questionnaire, "find");
    findQuestion(qq_id, q_id, "json");
    expect(spy).toHaveBeenCalled();
  });
});