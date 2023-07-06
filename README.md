# intelIQ-SW-Development-Project

This is a project for the Software Development course. We develop a Software (database, backend, REST API, CLI interface and basic frontend), which will be used to manage Questionnnaires and extract information from them. 
Also documentation is included. The diagrams are drafted in Visual Paradigm (vpp folder).

To be more specific, we create a Mongo database with a) Questionnaires, which have as attributes ID, title, keywords, list of questions (each question has as attribute, among others, a list of options and according to each option the next question may differ) and b) Sessions, which have as attributes sessionID, questionnaireID, questionID and answerID (it means that during this session the user answered that way a specific question).
The user can do the following actions through two interfaces (UI/ backend and CLI):
-create a Queationnaire
-upload a Questionnaire in json format
-delete all the data from the database
-delete all the answers for a specific Questionnaire
-see all the attributes of a specific Questionnaire
-see all the attributes of a specific question of a Questionnaire
-answer the Questionnaire (POST call which will save a Session instance in DB)
-see all the answers for a specific Questionnaire and a specific session
-see all the answers and all the sessions for a specific question

(only 5, 6, 7th points are implemented in the frontend)

The REST API returns data in json (default) or csv format, spedified as a parameter in the call.

The REST API is on base URL:  https://{{host}}:9103/intelliq_api   ,where {{host}} is localhost.
The REST endpoints are on:    {baseURL}/{service}/{path-to-resource}?format={json|csv}

HOW TO USE:
In an empty folder run the commands: 
npm init -y 
npm install nodejs 
npm install express
npm install dotenv 
npm install mongoose 
npm install multer 
npm install csv-writer 
npm install --save commander 
npm install jest 
npm install json2csv 
npm i cors 
npm i nodemon 
git clone git@github.com:georgia-bous/intelIQ-SW-Development-Project.git

change package.json as: 
"preferGlobal": true, "bin": { "se2209": "./commands.js" },
"start": "nodemon app.js" add to api "main": "app.js",

For the CLI (https://www.youtube.com/watch?v=v2GKt39-LPA):
npm install --save commander
npm install jest
npm link

Run the app.js for the server to start. 
You can test the backend through POSTMAN calls (a series of tests is provided in the test folder).
