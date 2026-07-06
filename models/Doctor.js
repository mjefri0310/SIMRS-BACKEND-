const mongoose = require("mongoose");
const schema =
new mongoose.Schema({
  code:String,
  name:String,
  specialization:String,
  sip_number:String,
  phone:String,
  current_version:Number,
  is_deleted:Boolean
},{
 timestamps:true
});
module.exports = mongoose.model("Doctor", schema);