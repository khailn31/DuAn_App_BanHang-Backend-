const mongoose = require('mongoose');
const BillSchema =new mongoose.Schema({
    email : String,
    tenSP : String,
    soLuong :Number,
    ngay:String,
    tongTien:Number
},{collection:"Bills"});
const Bill=mongoose.model("Bills",BillSchema);
module.exports=Bill;