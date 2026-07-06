const mongoose = require("mongoose");
const schema =
new mongoose.Schema({
  code:String,
  name:String,
  unit:String,
  stock:Number,
  purchase_price:Number,
  selling_price:Number,
  current_version:Number,
  is_deleted:Boolean
},{
 timestamps:true
});
module.exports = mongoose.model("Medicine", schema);