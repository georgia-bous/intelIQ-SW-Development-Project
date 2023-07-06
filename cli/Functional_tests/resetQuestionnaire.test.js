const {resetQuestionnaire} = require('../cli_functions.js');



describe('resetQuestionnaire', () => {
    it('Resets a questionnaire', async () => {
        const output = await resetQuestionnaire("QQ000");
        expect(output).toEqual(0);
    });
});


