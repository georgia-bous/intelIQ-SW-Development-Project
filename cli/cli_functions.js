const mongoose=require("mongoose");
require("dotenv/config");

const MongoClient = require('mongodb').MongoClient;
//it's the url from the .env file



const url = 'mongodb+srv://admin:12345@cluster0.xz0hi4h.mongodb.net/?retryWrites=true&w=majority';
mongoose.set("strictQuery", false);

  mongoose.connect("mongodb+srv://admin:12345@cluster0.xz0hi4h.mongodb.net/test", ()=>{

});

const db = mongoose.connection;


const Questionnaire = require("./model/Questionnaire");
const Session = require("./model/Session");
const fs = require("fs");

const multer=require("multer");
const { dbm } = require("./model/Questionnaire"); // that was just "db" before
const upload=multer({dest:'uploads/'});
const json2csv = require('json2csv');
//const stringify = require('csv-stringify');

//Create our Csv - writer. We used npm install csv-writer.
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


//========================================================= CLI Functionalities ========================================================


//{baseURL}/questionnaire/:questionnaireID

// Replace the real findQuestionnaire method with mock underneath it when unit testing
//Change nothing while functional or unit testing
const findQuestionnaire = async(qq_id, opt) => {
  const projection={questionnaireID:1, questionnaireTitle:1, keywords:1, _id:0, "questions.qID":1,"questions.qtext":1, "questions.required":1, "questions.type":1};
  return new Promise((resolve, reject) => {
      Questionnaire.find({questionnaireID: qq_id},projection)
      .then(questionnaire =>{
       // console.log(typeof stringify);
       if (questionnaire.length === 0) {
        // The questionnaire with the provided ID was not found
       // reject(new Error(`Questionnaire with ID ${qq_id} not found`));
       console.log(`Questionnaire with ID ${qq_id} not found`);
        mongoose.connection.close();
        return;
      }
          if(opt == "json"){
          console.info(questionnaire[0]);
          }if (opt == "csv") {
            const questionnairesData = questionnaire;
            const header = ['questionnaireID', 'questionnaireTitle', 'keywords', 'questions.qID', 'questions.qtext', 'questions.required', 'questions.type'];
            let csvContent = '';
          
            // Build header row
            header.forEach((column) => {
              csvContent += column + ',';
            });
            csvContent += '\r\n';
          
            // Build data rows
            questionnairesData.forEach((questionnaireData) => {
              questionnaireData.questions.forEach((question) => {
                csvContent += questionnaireData.questionnaireID + ',';
                csvContent += questionnaireData.questionnaireTitle + ',';
                csvContent += questionnaireData.keywords.join('|') + ',';
                csvContent += question.qID + ',';
                csvContent += question.qtext + ',';
                csvContent += question.required + ',';
                csvContent += question.type + ',';
                csvContent += '\r\n';
              });
            });
          
            console.log(csvContent);
            resolve(0);
          }
          
          mongoose.connection.close();
          resolve(0);
      }).catch(error => {
        reject(error);
    });
  });
}

/*
const findQuestionnaire = async(qq_id, opt) => {
findQuestionnaire.findQuestionnaire = findQuestionnaireMock;

return findQuestionnaire("QQ000").then(result => {
  expect(result).toEqual(mockQuestionnaire);
  expect(findQuestionnaireMock).toHaveBeenCalledWith({ questionnaireID: "QQ000" });
});
}
*/


//{baseURL}/question/:questionnaireID/:questionID
// Change the resolve command to resolve(result) when unit testing.
//Change the resolve command to resolve(0) when functional testing.
const findQuestion = async (qq_id, q_id, opt) => {
  const projection = {
    questionnaireID: 1,
    _id: 0,
    "questions.qID": 1,
    "questions.qtext": 1,
    "questions.required": 1,
    "questions.type": 1,
    "questions.options.optID": 1,
    "questions.options.opttxt": 1,
    "questions.options.nextqID": 1
};

  return new Promise(async (resolve, reject) => {
      await Questionnaire.find({ questionnaireID: qq_id, questions: { $elemMatch: { qID: q_id } } }, projection)
          .then(res => {
              if (res.length === 0) {
                 console.log(`No questionnaire found with ID ${qq_id} and question ID ${q_id}`);
                 mongoose.connection.close();
                  return;
              }

              const questionnaire = res[0];
              const question = questionnaire.questions.find(q => q.qID === q_id);

              if (!question) {
                  reject(`Questionnaire ${qq_id} does not contain a question with ID ${q_id}`);
                  return;
              }

              const result = {
                  questionnaireID: questionnaire.questionnaireID,
                  qID: question.qID,
                  qtext: question.qtext,
                  required: question.required,
                  type: question.type,
                  options: question.options
              };

              if (opt == "json") {
                  console.info(result);
              } else if (opt == "csv")  {
                const header = ['questionnaireID', 'qID', 'qtext', 'required', 'type', 'options.optID', 'options.opttxt', 'options.nextqID'];
                let csvContent = '';
            
                // Build header row
                header.forEach((column) => {
                    csvContent += column + ',';
                });
                csvContent += '\r\n';
            
                // Build data row
                const row = [
                    result.questionnaireID,
                    result.qID,
                    result.qtext,
                    result.required,
                    result.type,
                    result.options[0].optID,
                    result.options[0].opttxt,
                    result.options[0].nextqID
                ];
            
                // Add data row to CSV content
                row.forEach((column) => {
                    csvContent += column + ',';
                });
                csvContent += '\r\n';
            
                console.log(csvContent);
                resolve(0);
              }
              mongoose.connection.close();
              resolve(result);
          }).catch(error => {
              reject(error);
          });
  });
}




//{baseURL}/getquestionanswers/:questionnaireID/:questionID
//Replace the resolve command with resolve(result) while unit testing

const findQuestionAnswers = (qq_id, q_id, opt) => {
  return new Promise(async (resolve, reject) => {
    const projection = {_id:0, session:1, ans:1}

    await Session.find({questionnaireID: qq_id, qID:q_id}, projection) 
      .then(res => {
        if (res.length === 0) {
          console.log(`No answers found for questionnaire with ID ${qq_id} and question ID ${q_id}`);
          mongoose.connection.close();
           return;
       }

        let result = {
          questionnaireID: qq_id,
          questionID: q_id,
          answers: []
        }

        res.forEach(answer => {
          result.answers.push({
            session: answer.session,
            ans: answer.ans
          })
        })

        if (opt == "json") {
          console.info(result)
        } else if (opt == "csv") {
          let csvContent = "session,ans\n"
          result.answers.forEach(answer => {
            csvContent += `${answer.session},${answer.ans}\n`
          })
          console.log(csvContent)
        }

        mongoose.connection.close();
        resolve(0);
      })
      .catch(error => {
        reject(error)
      })
  })
}




//{baseURL}/getsessionanswers/:questionnaireID/:session

//Replace the resolve command with resolve(result) while unit testing

const findSessionAnswers = async(qq_id,s_id,opt) => {
    return new Promise((resolve, reject) => {
      const projection = {_id:0, qID:1, ans:1}
  
      Session.find({questionnaireID: qq_id, session:s_id}, projection)
        .then(res => {
          if (res.length === 0) {
            console.log(`No sessions found with ID ${s_id} and questionnaires with ID ${qq_id}`);
            mongoose.connection.close();
             return;
         }
          let result={
            questionnaireID:String,
            session:String,
            answers:                   
              [{
                qID:String,
                ans:String
              }]
          };
  
          result.questionnaireID = qq_id;
          result.session = s_id;
          result.answers = res;
          if(opt == "json"){
          console.info(result);
          }else if(opt == "csv"){
            let csvContent = "questionnaireID,session,qID,ans\n";
            res.forEach((answer) => {
                csvContent += `${qq_id},${s_id},${answer.qID},${answer.ans}\n`;
            });
            console.log(csvContent);
            resolve(0);
      }
      
          mongoose.connection.close();
          resolve(0);
          // Replace the resolve(0) with the following line when running the unit test
          //resolve(result);
        }).catch(error => {
          reject(error);
      });
    });
  };


//{baseURL}/doanswer/:questionnaireID/:questionID/:session/:optionID
//Replace the resolve command while unit testing

const createAnswer = (qq_id, q_id, s_id, opt_id) => {
    return new Promise((resolve, reject) => {
      Session.create({
          "questionnaireID": qq_id,
          "session": s_id,
          "qID": q_id,
          "ans": opt_id
      })
      .then(r => {
        console.info("Answer added.");
        mongoose.connection.close();
        resolve(0);
        //resolve(r);
      })
      .catch(error => {
        reject(error);
      });
    });
  };


//{baseURL}/admin/healthcheck
// Change nothing while unit testing, it works
const healthcheck = async () => {
//  const healthcheck = async (uurl) => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
        if (err) {
           // console.log("Status failed. Error message: " + err.message);
           console.log("Connection failed");
           //if (client) client.close();
             mongoose.connection.close();
             reject(err);
        } else {
          console.log("\nConnection established successfully.\n");
          client.close();
          mongoose.connection.close();
          resolve(0);
        }
      });
    });
  };
  
  


//{baseURL}/admin/resetall
//Delete the mongoose.connection.close() when unit testing
const resetAll = async ()=>{
    try {
         await Questionnaire.deleteMany({});
         await Session.deleteMany({});

       
    } catch (error) {
       console.log(error.message)
    }
    mongoose.connection.close();
    return 0;
}


//{baseURL}/admin/resetq/:questionnaireID
//Delete return 0; when unit testing;
//Delete mongoose.connection.close() when unit testing
//Make sure there are Sessions in the database both during functional and unit testing.
const resetQuestionnaire = async (qq_id) => {

    try {
         await Session.deleteMany({questionnaireID : qq_id});

        console.log('OK');
    } catch (error) {
       // res.json({"status":"failed", "reason":error.message});
        console.log(error.message);
    }
    mongoose.connection.close();
    return 0;
}


//{baseURL}/admin/questionnaire_upd
// Delete the mongoose.connection.close() when unit testing
const uploadQuestionnaire =  (source)=>{
  return new Promise((resolve, reject) => {
    flag = 0;
    fs.readFile(source, 'utf8', async(err, data) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      const json = JSON.parse(data);
      
      //
      const projection={questionnaireID:1, questionnaireTitle:1, keywords:1, _id:0, "questions.qID":1,"questions.qtext":1, "questions.required":1, "questions.type":1};
      await Questionnaire.find({questionnaireID: json.questionnaireID},projection)
      .then(questionnaire =>{
       // console.log(typeof stringify);
       if (questionnaire.length != 0) {
        // The questionnaire with the provided ID was not found
       // reject(new Error(`Questionnaire with ID ${json.questionnaireID} not found`));
       console.log(`Questionnaire with ID ${json.questionnaireID} already exists`);
        //mongoose.connection.close();
        flag = 1;
        resolve(0);
        return;
      }else{
        flag = 0;
      }
           
      }).catch(error => {
        reject(error);
    });

      //

      if(flag === 1){
        mongoose.connection.close();
      resolve(0);
      }else{
      const result = await Questionnaire.create({
          "questionnaireID": json.questionnaireID,
          "questionnaireTitle": json.questionnaireTitle,
          "keywords": json.keywords,
          "questions": json.questions
      });
      
      console.log('Questionnaire added.');
      mongoose.connection.close();
      resolve(0);
    }
    });
  });
};



/*
const uploadQuestionnaire =  (source)=>{
    return new Promise((resolve, reject) => {
      fs.readFile(source, 'utf8', async(err, data) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }
        const json = JSON.parse(data);
        
        const result = await Questionnaire.create({
            "questionnaireID": json.questionnaireID,
            "questionnaireTitle": json.questionnaireTitle,
            "keywords": json.keywords,
            "questions": json.questions
        });
        
        console.log('Questionnaire added.');
        mongoose.connection.close();
        resolve(0);
      });
    });
  };

*/




module.exports = {
    findQuestionnaire,
    findQuestion,
    findQuestionAnswers,
    findSessionAnswers,
    createAnswer,
    resetAll,
    resetQuestionnaire,
    uploadQuestionnaire,
    healthcheck,
    
}