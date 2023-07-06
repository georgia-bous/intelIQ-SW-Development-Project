const express = require("express");
const app = express();
var cors = require('cors')
app.use(cors())
const mongoose = require("mongoose");
const path = require("path");
require("dotenv/config");


const Questionnaire = require("./SoftEng22-09/api-backend/TL_MONGO/model/Questionnaire");
const Session = require("./SoftEng22-09/api-backend/TL_MONGO/model/Session");


const fs = require("fs");
const multer = require("multer");
const { dbm } = require("./SoftEng22-09/api-backend/TL_MONGO/model/Questionnaire"); // that was just "db" before
const upload = multer({ dest: 'uploads/' });


const MongoClient = require('mongodb').MongoClient;
//it's the url from the .env file
const url = 'mongodb+srv://admin:12345@cluster0.xz0hi4h.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(url, () => {
    console.log("Server connected on port 9103");
});
const db = mongoose.connection;

/*helper for testing*/
app.get('/intelliq_api/tests_create', async (req, res) => {
    const result = await Questionnaire.create({
        "questionnaireID": "QQXXX",
        "questionnaireTitle": "TEST",
        "keywords": ["t1", "t2"],
        "questions": [{ "qID": "PXX", "qtext": "qt1", "required": false, "type": "question", "options": [{ "optID": "OOXX", "opttxt": "ot", "nextqID": "QQYYY" }] }]
    });

    //console.log(result);
    res.send(result);
});


app.get('/intelliq_api/admin/healthcheck', (req, res) => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
        if (err) {
            res.status(500).json({ "status": "failed", "dbconnection": err.message });
        } else {
            res.status(200).json({ "status": "OK", "dbconnection": "Everything is okey" });
            client.close();
        }
    });
});


//!!ΠΡΟΣΟΧΗ: οι φροντεαδες να το ονομάσουν file και να θεσουν multipart/form-data
//να το φτιαξω να μην δημιουργει folder
app.post('/intelliq_api/admin/questionnaire_upd', upload.single('file'), function (req, res) {
    fs.readFile('./uploads/' + req.file.filename, 'utf8', async (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'An error occurred while reading the file' });
            return;
        }

        let json;
        try {
            json = JSON.parse(data);
        } catch (error) {
            console.error(error);
            res.status(400).send({ error: 'The uploaded file is not a valid JSON' });
            return;
        }

        // Check if a questionnaire with the same ID already exists in the database.
        /*await Questionnaire.find({"QuestionnaireID":json.questionnaireID})
        .then(data => {
            if (data.length > 0) {
                console.log(data);
                res.status(400).send({ error: 'A questionnaire with the same ID already exists' });
                return;
            }            
        }).catch(error => {
            res.status(500).send({'status':'failed', 'message':error.message});
        });*/

        const result = await Questionnaire.create({
            "questionnaireID": json.questionnaireID,
            "questionnaireTitle": json.questionnaireTitle,
            "keywords": json.keywords,
            "questions": json.questions
        });

        /* delete the file from ./uploads after it has been proccessed */
        fs.unlink('./uploads/' + req.file.filename, (error) => {
            if (error) {
                console.error(error);
                res.status(500).send({ error: 'An error occurred while deleting the file' });
                return;
            }
        });

        //console.log(result);
        res.status(200).send(result);
    });
});

app.post('/intelliq_api/admin/resetall', async (req, res) => {
    try {
        await Questionnaire.deleteMany({});
        await Session.deleteMany({});

        res.status(200).json({ "status": "OK" });
    } catch (error) {
        res.status(500).json({ "status": "failed", "reason": error.message });
    }
});

app.post('/intelliq_api/admin/resetq/:questionnaireID', async (req, res) => {
    const qqid = req.params.questionnaireID;

    try {
        await Session.deleteMany({ questionnaireID: qqid });

        res.status(200).json({ "status": "OK" });
    } catch (error) {
        res.status(500).json({ "status": "failed", "reason": error.message });
    }
});

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
//const csv = require('csv-writer');
//npm install csv-writer

app.get('/intelliq_api/questionnaire/:questionnaireID', async (req, res) => {
    const id = req.params.questionnaireID;
    const projection = { questionnaireID: 1, questionnaireTitle: 1, keywords: 1, _id: 0, "questions.qID": 1, "questions.qtext": 1, "questions.required": 1, "questions.type": 1 };

    Questionnaire.find({ questionnaireID: id }, projection, (err, data) => {
        if (err) {
            res.status(500).json({ "status": "failed", "reason": err.message });
        } else {
            if (!data || data.length === 0) {
                res.status(402).json({ "status": "failed", "reason": "No data found" });
                return;
            }

            /* Create the csv file */
            if (req.query.format === 'csv') {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader("Content-Disposition", "attachment; filename=" + "data.csv");
                const csvWriter = createCsvWriter({
                    path: path.join(__dirname, '..', 'data.csv'),
                    header: [
                        { id: 'questionnaireID', title: 'questionnaireID' },
                        { id: 'questionnaireTitle', title: 'questionnaireTitle' },
                        { id: 'keywords', title: 'keywords' },
                        //i tried to flatten the json object questions but sth is not working
                        { id: 'questions', title: 'questions' },
                        /*
                        {id: 'questions.qID', title: 'questions.qID'},
                        {id: 'questions.qtext', title: 'questions.qtext'},
                        {id: 'questions.required', title: 'questions.required'},
                        {id: 'questions.type', title: 'questions.type'},
                        {id: 'questions.options', title: 'questions.options'},
                        */
                    ]
                });

                csvWriter.writeRecords(data)
                    .then(() => {
                        res.status(200).sendFile(path.join(__dirname, '..', 'data.csv'));
                    });
            }
            else {
                res.status(200).send(data[0]);
            }
        }
    });
});

/* Helper that returns all questionnaires */
app.get('/intelliq_api/questionnaires', async (req, res) => {
    const projection = { questionnaireID: 1, questionnaireTitle: 1, keywords: 1, _id: 0, "questions.qID": 1, "questions.qtext": 1, "questions.required": 1, "questions.type": 1 };

    Questionnaire.find({}, projection, (err, data) => {
        if (err) {
            res.status(500).json({ "status": "failed", "reason": err.message });
        } else {
            if (!data || data.length === 0) {
                res.status(402).json({ "status": "failed", "reason": "No data found" });
                return;
            }

            res.status(200).send(data);
        }
    });
});

app.get('/intelliq_api/question/:questionnaireID/:questionID', async (req, res) => {
    const id1 = req.params.questionnaireID;
    const id2 = req.params.questionID;

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

    await Questionnaire.find({ "questionnaireID": id1, questions: { $elemMatch: { qID: id2 } } }, projection)
        .then(data => {
            if (!data || data.length === 0) {
                res.status(402).json({ "status": "failed", "reason": "No data found" });
                return;
            }
            const questionnaire = data[0];
            const question = questionnaire.questions.find(q => q.qID === id2);
            /* Create the result schema and fill it with data */
            let result = {
                questionnaireID: String,
                qID: String,
                qtext: String,
                required: Boolean,
                type: {
                    type: String,
                    enum: ['profile', 'question']
                },
                options:
                    [{
                        optID: String,
                        opttxt: String,
                        nextqID: String
                    }]
            }
            result.questionnaireID = questionnaire.questionnaireID;
            result.qID = question.qID;
            result.qtext = question.qtext;
            result.required = question.required;
            result.type = question.type;
            result.options = question.options;
            //console.log(result);

            const records = [result];
            console.log(records);

            if (req.query.format === 'csv') {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader("Content-Disposition", "attachment; filename=" + "data.csv");
                const csvWriter = createCsvWriter({
                    path: path.join(__dirname, '..', 'data.csv'),
                    header: [
                        { id: 'questionnaireID', title: 'questionnaireID' },
                        { id: 'qID', title: 'qID' },
                        { id: 'qtext', title: 'qtext' },
                        { id: 'required', title: 'required' },
                        { id: 'type', title: 'type' },
                        { id: 'options', title: 'options' }
                    ]
                });


                csvWriter.writeRecords(records)
                    .then(() => {
                        res.status(200).sendFile(path.join(__dirname, '..', 'data.csv'));
                    });
            }
            else {
                res.status(200).send(result);
            }
        }).catch(error => {
            res.status(500).send({ 'status': 'failed', 'message': error.message });
        });

});

app.post('/intelliq_api/doanswer/:questionnaireID/:questionID/:session/:optionID', async (req, res) => {
    const qqid = req.params.questionnaireID;
    const qid = req.params.questionID;
    const sess = req.params.session;
    const optid = req.params.optionID;

    try {
        const result = await Session.create({
            "questionnaireID": qqid,
            "session": sess,
            "qID": qid,
            "ans": optid
        });
        res.status(200).send({ status: 'success' });
    } catch (error) {
        res.status(500).send({ status: 'failed', reason: err.message });
    }
});


app.get('/intelliq_api/getsessionanswers/:questionnaireID/:session', async (req, res) => {
    const qid = req.params.questionnaireID;
    const sess = req.params.session;

    const projection = { _id: 0, qID: 1, ans: 1 }

    Session.find({ questionnaireID: qid, session: sess }, projection, (err, data) => {
        if (err) {
            res.status(500).json({ "status": "failed", "reason": err.message });
        } else {
            if (!data || data.length === 0) {
                res.status(402).json({ "status": "failed", "reason": "No data found" });
                return;
            }
            console.log(data);

            /* Create result schema and fill it with data */
            let result = {
                questionnaireID: String,
                session: String,
                answers:
                    [{
                        qID: String,
                        ans: String
                    }]
            }

            result.questionnaireID = qid;
            result.session = sess;
            result.answers = data;

            const records = [result];
            //console.log(records);

            if (req.query.format === 'csv') {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader("Content-Disposition", "attachment; filename=" + "data.csv");
                const csvWriter = createCsvWriter({
                    path: path.join(__dirname, '..', 'data.csv'),
                    header: [
                        { id: 'questionnaireID', title: 'questionnaireID' },
                        { id: 'session', title: 'session' },
                        { id: 'answers', title: 'answers' },
                    ]
                });


                csvWriter.writeRecords(records)
                    .then(() => {
                        res.status(200).sendFile(path.join(__dirname, '..', 'data.csv'));
                    });
            }
            else {
                res.status(200).send(result);
            }
        }
    });
});


app.get('/intelliq_api/getquestionanswers/:questionnaireID/:questionID', async (req, res) => {
    const qqid = req.params.questionnaireID;
    const qid = req.params.questionID;

    const projection = { _id: 0, session: 1, ans: 1 }

    Session.find({ questionnaireID: qqid, qID: qid }, projection, (err, data) => {
        if (err) {
            res.status(500).json({ "status": "failed", "reason": err.message });
        } else {
            if (!data || data.length === 0) {
                res.status(402).json({ "status": "failed", "reason": "No data found" });
                return;
            }
            console.log(data);

            /* Create result scema and fill it with data */
            let result = {
                questionnaireID: String,
                questionID: String,
                answers:
                    [{
                        session: String,
                        ans: String
                    }]
            }

            result.questionnaireID = qqid;
            result.questionID = qid;
            result.answers = data;

            const records = [result];
            //console.log(records);

            if (req.query.format === 'csv') {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader("Content-Disposition", "attachment; filename=" + "data.csv");
                const csvWriter = createCsvWriter({
                    path: path.join(__dirname, '..', 'data.csv'),
                    header: [
                        { id: 'questionnaireID', title: 'questionnaireID' },
                        { id: 'questionID', title: 'questionID' },
                        { id: 'answers', title: 'answers' },
                    ]
                });


                csvWriter.writeRecords(records)
                    .then(() => {
                        res.status(200).sendFile(path.join(__dirname, '..', 'data.csv'));
                    });
            }
            else {
                res.status(200).send(result);
            }
        }
    });
});

app.listen(9103);