const {resetAll} = require('../cli_functions.js');



describe('resetAll', () => {
    it('Resets the entire databse.', async () => {
        const output = await resetAll();
        expect(output).toEqual(0);
    });
});



