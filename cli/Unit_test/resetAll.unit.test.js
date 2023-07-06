const mongoose = require("mongoose");
const Questionnaire = require("../model/Questionnaire");
const Session = require("../model/Session");
const {resetAll} = require('../cli_functions.js');

describe("resetAll", () => {
    /*
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterEach(async () => {
    await Questionnaire.deleteMany({});
    await Session.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
  */

  afterEach(function() {
    // Close the connection
    mongoose.connection.close();
  });

  it("should delete all Questionnaires and Sessions", async () => {
    //const questionnaire = new Questionnaire({});
   // const session = new Session({});

   // await questionnaire.save();
    //await session.save();

    await resetAll();

    const questionnaires = await Questionnaire.find({});
    const sessions = await Session.find({});

    expect(questionnaires.length).toBe(0);
    expect(sessions.length).toBe(0);
  });

 
});
