import mongoose from "mongoose";
const Schema = mongoose.Schema;

const FavoriteSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref:'Account'
    },
    listProduct: {
        type:[
            {
                product:{
                    type: Schema.Types.ObjectId,
                    ref:'Product'
                },
            }
        ],
        default:[],
        _id: false
    }
},{timestamps: true, collection:"Favorite"});

export const Favorite = mongoose.model("Favorite", FavoriteSchema);
