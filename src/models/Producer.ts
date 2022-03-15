import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProducerSchema = new Schema({
    name: String,
    information: String,
    address: String,
    email: String,
    phone: String,
},{timestamps:true, collection:"Producer"});

const Producer = mongoose.model("Producer", ProducerSchema);
module.exports = Producer;
