const mongoose=require("mongoose");

const session=mongoose.Schema({
    questionnaireID:{
        type: String,
        required: true
    },
    session:{
        type:String,
        required:true
    },
    qID:{
        type:String,
        required: true
    },
    ans:{
        type: String,
        required:false,
    },
    anstxt:{
        type: String,
        required:false
    }
});

module.exports=mongoose.model("Session", session);