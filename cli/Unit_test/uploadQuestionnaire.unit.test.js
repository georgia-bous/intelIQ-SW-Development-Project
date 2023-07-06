const fs = require('fs');
const assert = require('assert');
const Questionnaire = require('../model/Questionnaire');
const {uploadQuestionnaire} = require('../cli_functions');

describe('uploadQuestionnaire', () => {
  it('should add a questionnaire to the database', async () => {
    const source = 'data/questinnaire.json';
    const json = {
        "questionnaireID": "Q1",
        "questionnaireTitle": "Sample Questionnaire",
        "keywords": ["sample", "questionnaire"],
        "questions": [
          {
          //  "question": "What is your name?",
            "type": "profile",
            "required": true,
            "qtext": "What is your name?",
            "qID": "Q1-1",
           // "answers": ["John", "Jane"]
          },
          {
           // "question": "What is your favorite color?",
            "type": "profile",
            "required": false,
            "qtext": "What is your favorite color?",
            "qID": "Q1-2",
            //"answers": ["Blue", "Red", "Green"]
          }
        ]
      };
      
    fs.writeFileSync(source, JSON.stringify(json), 'utf8');

    const result = await uploadQuestionnaire(source);

    assert.strictEqual(result, 0);

    const addedQuestionnaire = await Questionnaire.findOne({ questionnaireID: 'Q1' },{"__v":0  ,"_id":0, "questions._id": 0, "questions.options": 0},);
    const questionnaire = addedQuestionnaire.toObject();
   //delete questionnaire._id;
    //delete questionnaire.options;
    const expected = {
        "questionnaireID": "Q1",
        "questionnaireTitle": "Sample Questionnaire",
        "keywords": ["sample", "questionnaire"],
        "questions": [
          {
           //"question": "What is your name?",
            "type": "profile",
            "required": true,
            "qtext": "What is your name?",
            "qID": "Q1-1",
            //"answers": ["John", "Jane"]
          },
          {
          //  "question": "What is your favorite color?",
            "type": "profile",
            "required": false,
            "qtext": "What is your favorite color?",
            "qID": "Q1-2",
            //"answers": ["Blue", "Red", "Green"]
          }
        ]
      };
      
      assert.deepStrictEqual(questionnaire, expected);
      
    
    fs.unlinkSync(source);
  });
});
