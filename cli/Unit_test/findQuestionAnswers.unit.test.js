const Session = require('../model/Session');
const { findQuestionAnswers } = require("../cli_functions.js");

jest.mock('../model/Session.js', () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve([
      { session: 'session1', ans: 'answer1' },
      { session: 'session2', ans: 'answer2' },
    ]))
  };
});

describe('findQuestionAnswers', () => {
  it('should return the answers for a given questionnaire and question', async () => {
    const result = await findQuestionAnswers('questionnaire1', 'question1', "json");
    expect(Session.find).toHaveBeenCalledWith({ questionnaireID: 'questionnaire1', qID: 'question1' }, { _id: 0, session: 1, ans: 1 });
    expect(result).toEqual({
      questionnaireID: 'questionnaire1',
      questionID: 'question1',
      answers: [
        { session: 'session1', ans: 'answer1' },
        { session: 'session2', ans: 'answer2' },
      ]
    });
  });
});
