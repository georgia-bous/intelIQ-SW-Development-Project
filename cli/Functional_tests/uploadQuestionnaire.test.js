beforeEach(() => {
    jest.resetModules();
  });
const mongoose=require("mongoose");


describe('uploadQuestionnaire', () => {
    afterEach(() => {
        mongoose.connection.close();
      });
    it('Uploads a new Questionnaire to the database.', async () => {
        const {uploadQuestionnaire} = require('../cli_functions.js');

        const output = await uploadQuestionnaire("../../data/questionnaire.json");
        expect(output).toEqual(0);
    });
});


