import mongoose from "mongoose";
const Schema = mongoose.Schema;

const FavoriteSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref:'Account'
    },
    listProductDetail: {
        type:[
            {
                productDetail:{
                    type: Schema.Types.ObjectId,
                    ref:'ProductDetail'
                },
            }
        ],
        default:[],
        _id: false
    }
},{timestamps: true, collection:"Favorite"});

export const Favorite = mongoose.model("Favorite", FavoriteSchema);
