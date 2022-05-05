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
                type: Schema.Types.ObjectId,
                ref:'CartDetail'
            },
        ],
        default:[],
        _id: false
    }
},{timestamps: true, collection:"Cart"});

export const Cart = mongoose.model("Cart", CartSchema);
