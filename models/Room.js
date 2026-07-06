const mongoose = require("mongoose");
const schema =
new mongoose.Schema({
  code:String,
  name:String,
  room_class:String,
  capacity:Number,
  current_version:Number,
  is_deleted:Boolean
},{
 timestamps:true
});
module.exports = mongoose.model("Room", schema);