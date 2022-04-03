import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductDetailSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
    },
    color: {
        type:Schema.Types.ObjectId,
        ref:"Color"
    },
    size:{
        type: String,
        enum:["XS","S","M","L","XL","XXL"],
        default:"L"
    },
    imageUrl:String,
    status:{
        type: String,
        enum : ['ACTIVE','DELETE'],
        default: 'ACTIVE'
    },
    quantity:{
        type:Number,
        default:0
    }
},{timestamps:true, collection:"ProductDetail"});

export const ProductDetail = mongoose.model("ProductDetail", ProductDetailSchema);
