import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductDetailSizehema = new Schema({
    productDetail: {
        type: Schema.Types.ObjectId,
        ref: "ProductDetail",
    },
    size:{
        type: String,
        enum:["XS","S","M","L","XL","XXL"],
        default:"L"
    },
    quantity:{
        type:Number,
        default:0
    }
},{timestamps:true, collection:"ProductDetailSize"});

export const ProductDetailSize = mongoose.model("ProductDetailSize", ProductDetailSizehema);
