const mongoose=require("mongoose");

const questionnaire=mongoose.Schema({
    questionnaireID : {
        type:String,
        required: true,
    },
    questionnaireTitle : {
        type: String,
        required: true,
    },
    keywords : [{type: String}],
    //questions:[]
    
    questions : {
        type:
        [{
        qID:{
            type: String,
            required:true,
        },
        qtext:{
            type: String,
            required: true,
        },
        required:{
            type: Boolean,
            required: true,
        },
        type:{
            type: String,
            enum: ['profile', 'question'],
            required: true,
        },
        options:{
            type:
            [{
            optID:{
                type: String,
                required: true,
            },
            opttxt:{
                type: String,
                required: true,
            },
            nextqID : String
            }],
            required:true
       }
     }],
       required:true
    }
    
    
});
 
module.exports=mongoose.model("Questionnaire", questionnaire);