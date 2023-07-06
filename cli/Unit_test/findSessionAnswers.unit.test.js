const { findSessionAnswers } = require("../cli_functions.js");

describe("findSessionAnswers", () => {
  it("should return a promise that resolves to an object with the expected properties", async () => {
    const result = await findSessionAnswers("QQ000", "S001", "json");

    expect(result).toBeDefined();
    expect(result).toHaveProperty("questionnaireID", "QQ000");
    expect(result).toHaveProperty("session", "S001");
    expect(result.answers).toBeDefined();
    expect(Array.isArray(result.answers)).toBe(true);
  });
});


