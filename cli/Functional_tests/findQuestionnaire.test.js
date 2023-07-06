const {findQuestionnaire} = require('../cli_functions.js');
const mongoose=require("mongoose");


describe('Find Questionnaire', () => {
    afterEach(() => {
        mongoose.connection.close();
      });
    it('Finds a Questionnaire.',  async() => {
        const output =  await findQuestionnaire("QQ000", "json");
        expect(output).toEqual(0);
    });
});


