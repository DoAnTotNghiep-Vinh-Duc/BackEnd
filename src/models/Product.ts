import mongoose from "mongoose";
const Supplier = require("./Supplier")
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    supplier: Supplier,
    name: String,
    description: String,
    typeProduct: Array,
},{timestamps:true, collection:"Product"});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
