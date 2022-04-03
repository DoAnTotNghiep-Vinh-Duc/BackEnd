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
    imageUrl:String,
    status:{
        type: String,
        enum : ['ACTIVE','DELETE'],
        default: 'ACTIVE'
    }
},{timestamps:true, collection:"ProductDetail"});

export const ProductDetail = mongoose.model("ProductDetail", ProductDetailSchema);
