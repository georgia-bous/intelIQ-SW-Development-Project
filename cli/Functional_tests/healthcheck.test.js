const {healthcheck} = require('../cli_functions.js');
const mongoose=require("mongoose");



describe('healthheck', () => {
    afterEach(() => {
        mongoose.connection.close();
      });
    
    it('Checks if the connection is established successfully.', async() => {
        const output = await healthcheck();
        expect(output).toEqual(0);
    });
});




