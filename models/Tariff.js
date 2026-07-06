const mongoose = require("mongoose");
const schema =
new mongoose.Schema({
  code:String,
  name:String,
  service_type_id:{
    type:
    mongoose.Schema.Types.ObjectId,
    ref:"ServiceType"
  },
  amount:Number,
  current_version:Number,
  is_deleted:Boolean
},{
 timestamps:true
});
module.exports = mongoose.model("Tariff", schema);