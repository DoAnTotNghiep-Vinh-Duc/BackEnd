import mongoose from "mongoose";
const Schema = mongoose.Schema;

const FavoriteSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref:'Account'
    },
    listProductDetail: {
        type: Array,
    }
},{timestamps: true, collection:"Favorite"});

export const Favorite = mongoose.model("Favorite", FavoriteSchema);
