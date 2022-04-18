import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref:'Account'
    },
    listCartDetail: {
        type:[
            {
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
            }
        ],
        default:[],
        _id: false
    }
},{timestamps: true, collection:"Cart"});

export const Cart = mongoose.model("Cart", CartSchema);
