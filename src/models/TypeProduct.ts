import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TypeProductSchema = new Schema({
    name: String,
},{timestamps: true, collection:"TypeProduct"});

const TypeProduct = mongoose.model("TypeProduct", TypeProductSchema);
module.exports = TypeProduct;
