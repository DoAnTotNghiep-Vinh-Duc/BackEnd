import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ColorImageSchema = new Schema({
    color: {
        type: mongoose.Types.ObjectId,
        ref: "Color"
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref:"Product"
    },
    imageUrl: {
        type: String,
        required: true
    }
},{timestamps: true, collection:"ColorImage"});

export const ColorImage = mongoose.model("ColorImage", ColorImageSchema);
