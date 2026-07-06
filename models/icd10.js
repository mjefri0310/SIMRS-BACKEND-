const mongoose = require("mongoose");

const ICD10Schema = new mongoose.Schema(
{
    code:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    category:String,
    current_version:{
        type:Number,
        default:1
    },
    is_deleted:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("ICD10", ICD10Schema);