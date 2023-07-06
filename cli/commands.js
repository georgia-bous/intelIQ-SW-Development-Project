#!/usr/bin/env node
const program = require('commander');

//const programName = 'restapi';

//process.argv.splice(2, 1, program.args[0].replace(programName, 'myapp'));



const { reset } = require('nodemon');
const {
    findQuestionnaire,
    findQuestion,
    findQuestionAnswers,
    findSessionAnswers,
    createAnswer,
    resetAll,
    resetQuestionnaire,
    uploadQuestionnaire,
    healthcheck,

} = require('./cli_functions');


program
    .version('1.0.0')
    .description('Questionnaire Management System')


program
    .command('questionnaire')
    .alias('f')
    .description('Find a Questionnaire')
    .option('--questionnaire_id <string>')
    .option('--format <string>')
    .action((options) =>findQuestionnaire(options.questionnaire_id,options.format));

program
    .command('question')
    .alias('q')
    .description('Find a Question')
    .option('--questionnaire_id <string>')
    .option('--question_id <string>')
    .option('--format <string>')
    .action((options) => findQuestion(options.questionnaire_id, options.question_id,options.format));


program
    .command('getquestionanswers')
    .alias('gqa')
    .description('Find the Answers to a Question')
    .option('--questionnaire_id <string>')
    .option('--question_id <string>')
    .option('--format <string>')
    .action((options) => findQuestionAnswers(options.questionnaire_id, options.question_id, options.format));

program
    .command('getsessionanswers')
    .alias('gsa')
    .description('Find the Answers to all the Questions in a given session')
    .option('--questionnaire_id <string>')
    .option('--session_id <string>')
    .option('--format <string>')
    .action((options) => findSessionAnswers(options.questionnaire_id, options.session_id, options.format)); 

program
    .command('doanswer')
    .alias('da')
    .description('Provide an answer for a question')
    .option('--questionnaire_id <string>')
    .option('--question_id <string>')
    .option('--session_id <string>')
    .option('--option_id <string>')
    .action((options) => createAnswer(options.questionnaire_id, options.question_id, options.session_id,options.option_id));


program
    .command('resetall')
    .alias('ra')
    .description('Initiliaze all the data in the system.')
    .action(()=>resetAll());

program
    .command('resetq')
    .alias('rq')
    .description('Delete all the answers in a questionnaire')
    .option('--questionnaire_id <string>')
    .action((options) => resetQuestionnaire(options.questionnaire_id)); 

program
    .command('questionnaire_upd')
    .alias('qu')
    .description('Upload a questionnaire')
    .option('--source <string>')
    .action((options)=>uploadQuestionnaire(options.source))

program
    .command('healthcheck')
    .alias('hc')
    .description('Verify the end-to-end connectivity between the user and the database')
    .action(()=>healthcheck());



console.log(process.argv[0]);
console.log(process.argv[1]);
console.log(process.argv[2]);

program.parse(process.argv);