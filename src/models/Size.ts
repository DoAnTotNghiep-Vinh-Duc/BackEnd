import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SizeSchema = new Schema({
    size: String,
},{timestamps: true, collection:"Size"});

const size = mongoose.model("Size", SizeSchema);
module.exports = size;
