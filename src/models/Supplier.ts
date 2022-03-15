import mongoose from "mongoose";
const Schema = mongoose.Schema;

const SupplierSchema = new Schema({
    name: String,
    information: String,
    address: String,
    email: String,
    phone: String,
},{timestamps: true, collection:"Supplier"});

const Supplier = mongoose.model("Supplier", SupplierSchema);
module.exports = Supplier;
