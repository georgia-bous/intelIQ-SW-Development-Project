const {findSessionAnswers} = require('../cli_functions.js');
const mongoose=require("mongoose");



describe('healthheck', () => {
    afterEach(() => {
        mongoose.connection.close();
      });
    it('Checks if the connection is established successfully.', async () => {
        const output = await findSessionAnswers("QQ000", "S00", "json");
        expect(output).toEqual(0);
    });
});




