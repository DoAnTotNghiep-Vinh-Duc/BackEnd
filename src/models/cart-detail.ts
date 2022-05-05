import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CartDetailSchema = new Schema({
    cartId:{
        type: Schema.Types.ObjectId,
        ref:'Cart'
    },
    productDetail:{
        type: Schema.Types.ObjectId,
        ref:'ProductDetail'
    },
    quantity: {
        type: Number,
        default: 1
    },
    price:{
        type: Number,
    },
    priceDiscount:{
        type: Number
    },
    status:{
        type: String,
        enum : ['ACTIVE','DELETE','PAID'],
        default: 'ACTIVE'
    },
},{timestamps: true, collection:"CartDetail"});

export const CartDetail = mongoose.model("CartDetail", CartDetailSchema);
