const mongoose=require('mongoose');
const PSchema=new mongoose.Schema({
    tenSP : String,
    giaSP : Number,
    soLuong: Number,
    anhSP : Array,
    moTa : String
},{collection:"Products"});
const Product=mongoose.model("Products",PSchema);
module.exports = Product;