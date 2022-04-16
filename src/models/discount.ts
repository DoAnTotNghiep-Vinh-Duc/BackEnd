import mongoose from "mongoose";
const Schema = mongoose.Schema;

const DiscountSchema = new Schema({
    nameDiscount: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: false,
    },
    startDate:{
        type: Date,
        required: true
    },
    endDate:{
        type: Date,
        required: true
    },
    percentDiscount:{
        type: Number,
        required: true
    }
},{timestamps: true, collection:"Discount"});

export const Discount = mongoose.model("Discount", DiscountSchema);
