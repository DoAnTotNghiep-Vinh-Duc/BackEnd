import mongoose from "mongoose";
const Schema = mongoose.Schema;

const RateSchema = new Schema({
    product:{
        type: Schema.Types.ObjectId,
        ref: "Product",
    },
    account:{
        type: Schema.Types.ObjectId,
        ref: "Account",
    },
    point:{
        type: Number,
        required: true
    },
    content:{
        type: String,
        required: false
    },
    image:{
        type: String,
        required: false
    }
},{timestamps: true, collection:"Rate"});

export const Rate = mongoose.model("Rate", RateSchema);
