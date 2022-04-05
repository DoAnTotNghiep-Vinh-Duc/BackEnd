import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ColorSchema = new Schema({
    color: String,
    name: String
},{timestamps: true, collection:"Color"});

export const Color = mongoose.model("Color", ColorSchema);
