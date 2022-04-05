import mongoose from "mongoose";
const Schema = mongoose.Schema;

const InformationSchema = new Schema({
    name: String,
    address: String,
    email: String,
    phone: String,
},{timestamps: true, collection:"Information"});

export const Information = mongoose.model("Information", InformationSchema);
