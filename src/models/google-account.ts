import mongoose from "mongoose";
const Schema = mongoose.Schema;

const GoogleSchema = new Schema({
    idGoogle: String,
    password: String,
    nameDisplay: String,
    isVerifyPhone: Boolean,
    avatar: String,
    typeAccount: {
        type: String,
        default: "google"
    },
    information:{
        type: Schema.Types.ObjectId,
        ref: "Information",
    }
},{timestamps: true, collection:"GoogleAccount"});

export const GoogleAccount = mongoose.model("GoogleAccount", GoogleSchema);
