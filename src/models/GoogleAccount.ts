import mongoose from "mongoose";
const Schema = mongoose.Schema;

const GoogleSchema = new Schema({
    idGoogle: String,
    password: String,
    name: String,
    isVerifyPhone: Boolean,
    avatar: String,
    typeAccount: {
        type: String,
        default: "google"
    },
},{timestamps: true, collection:"GoogleAccount"});

const account = mongoose.model("GoogleAccount", GoogleSchema);
module.exports = account;
