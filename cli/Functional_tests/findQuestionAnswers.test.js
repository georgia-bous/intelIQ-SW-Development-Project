const {findQuestionAnswers} = require('../cli_functions.js');
const mongoose=require("mongoose");



describe('findQuestionAnswers', () => {
    afterEach(() => {
        mongoose.connection.close();
      });
    it('Checks if the connection is established successfully.', async () => {
        const output = await findQuestionAnswers("QQ000", "P00", "json");
        expect(output).toEqual(0);
    });
});




