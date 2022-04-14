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
    image:{
        type: String,
    },
    size:{
        type: String,
        enum:["XS","S","M","L","XL","XXL"],
        default:"L"
    },
    quantity:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum : ['ACTIVE','DELETE'],
        default: 'ACTIVE'
    }
},{timestamps:true, collection:"ProductDetail"});

export const ProductDetail = mongoose.model("ProductDetail", ProductDetailSchema);
