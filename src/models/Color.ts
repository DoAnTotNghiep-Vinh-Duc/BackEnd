import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ColorSchema = new Schema({
    color: String,
    name: String
},{timestamps: true, collection:"Color"});

const color = mongoose.model("Color", ColorSchema);
module.exports = color;
