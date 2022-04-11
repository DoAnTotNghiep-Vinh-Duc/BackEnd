import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref:'Account'
    },
    total: {
        type: Number,
        default:0
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
                price: {
                    type: Number,
                }
            }
        ],
        default:[]
    }
},{timestamps: true, collection:"Cart"});

export const Cart = mongoose.model("Cart", CartSchema);
