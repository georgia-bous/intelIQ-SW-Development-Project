const {createAnswer} = require('../cli_functions.js');
const mongoose=require("mongoose");



describe('createAnswer', () => {
    afterEach(() => {
        mongoose.connection.close();
      });
    it('Creates an answer.', async () => {
        const output = await createAnswer("QQ000", "P00", "S002", "1");
        expect(output).toEqual(0);
    });
});


