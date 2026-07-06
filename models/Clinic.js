const mongoose = require("mongoose");
const schema =
new mongoose.Schema({
  code:String,
  name:String,
  floor:String,
  is_deleted:Boolean,
  current_version:Number
},{
 timestamps:true
});
module.exports = mongoose.model("Clinic", schema);