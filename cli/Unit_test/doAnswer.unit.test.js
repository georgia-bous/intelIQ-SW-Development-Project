const Session = require('../model/Session');
const { createAnswer } = require("../cli_functions.js");

jest.mock('../model/Session', () => {
  return {
    create: jest.fn().mockResolvedValue({})
  };
});

describe('createAnswer', () => {
  it('should call the create method on the Session model', async () => {
    const qq_id = 'test_qq_id';
    const q_id = 'test_q_id';
    const s_id = 'test_s_id';
    const opt_id = 'test_opt_id';
    await createAnswer(qq_id, q_id, s_id, opt_id);
    expect(Session.create).toHaveBeenCalledWith({
      questionnaireID: qq_id,
      session: s_id,
      qID: q_id,
      ans: opt_id
    });
  });

  it('should resolve with the result of the create method', async () => {
    const result = { some: 'data' };
    Session.create.mockResolvedValue(result);
    const res = await createAnswer('', '', '', '');
    expect(res).toEqual(result);
  });
});


/*
This test mocks the Session module and uses Jest's .mockResolvedValue method to simulate a successful call to the .create method, 
which returns a resolved promise with a specified value. The test then verifies that the .create method was called with the correct 
parameters, and that the resolved value is returned by the createAnswer function.
*/
