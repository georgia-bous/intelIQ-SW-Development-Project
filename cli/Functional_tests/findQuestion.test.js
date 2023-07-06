/*
const {findQuestion} = require('../cli_functions.js');


describe('Find Question', () => {
    it('Finds a Question',  async() => {
        const output =  await findQuestion("QQ000", "P00");
        expect(output).toEqual(0);
    });
});
*/

const { findQuestion } = require("../cli_functions.js");
const mongoose=require("mongoose");
describe("Find Question", () => {
  afterEach(() => {
    mongoose.connection.close();
  });

  it("Finds a Question", async () => {
    const output = await findQuestion("QQ000", "P00", "json");
    expect(output).toEqual(0);
  });
});
