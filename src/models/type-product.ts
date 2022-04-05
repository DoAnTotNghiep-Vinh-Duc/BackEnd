import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TypeProductSchema = new Schema({
    name: String,
},{timestamps: true, collection:"TypeProduct"});

export const TypeProduct = mongoose.model("TypeProduct", TypeProductSchema);
